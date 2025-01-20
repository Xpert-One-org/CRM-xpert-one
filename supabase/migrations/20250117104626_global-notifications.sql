drop trigger if exists "notify_new_message_trigger" on "public"."message";

drop function if exists "public"."create_notification"(user_id uuid, link text, message text, subject text, status notification_status);

alter table "public"."notification" add column "category" text;

alter table "public"."notification" add column "is_global" boolean default false;

alter table "public"."notification" alter column "user_id" drop not null;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_notification(user_id uuid, link text, message text, subject text, status notification_status DEFAULT 'standard'::notification_status, is_global boolean DEFAULT false, category text DEFAULT ''::text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
    INSERT INTO notification (
        user_id,
        link,
        message,
        subject,
        status,
        is_global,
        category,
        created_at
    ) VALUES (
        user_id,
        link,
        message,
        subject,
        status,
        is_global,
        category,
        NOW()
    );
END;
$function$
;

CREATE OR REPLACE FUNCTION public.notify_new_echo_message()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$DECLARE
    sender_info RECORD;
    alert_status BOOLEAN;
    chat_type TEXT;
    notification_receiver_id UUID; 
    display_name TEXT;
BEGIN
    SELECT c.type INTO chat_type
    FROM chat c
    WHERE c.id = NEW.chat_id;

    IF chat_type <> 'echo_community' THEN
        RETURN NEW;
    END IF;

    WITH sender_data AS (
        SELECT 
            c.id AS chat_id,
            c.created_by,
            c.title,
            c.receiver_id,
            p.firstname,
            p.lastname,
            p.generated_id,
            p.role
        FROM chat c
        JOIN profile p ON p.id = NEW.send_by 
        WHERE c.id = NEW.chat_id 
    )
    SELECT * INTO sender_info FROM sender_data;

    IF sender_info IS NULL THEN
        RAISE EXCEPTION 'No sender data found for chat_id = %', NEW.chat_id;
    END IF;

    IF NEW.send_by = sender_info.created_by THEN
        notification_receiver_id := sender_info.receiver_id;
    ELSE
        notification_receiver_id := sender_info.created_by;
    END IF;

    IF sender_info.role IN ('xpert', 'company') THEN
        display_name := 'L''utilisateur ' || sender_info.firstname || ' ' || sender_info.lastname || 
                       ' (' || sender_info.generated_id || ')';
    ELSE
        display_name := 'Xpert One';
    END IF;

    PERFORM create_notification(
        notification_receiver_id,
        'communaute/echo-de-la-communaute',
        display_name || ' a envoyé un message',
        'Echo de la communauté : '||sender_info.title,
        'info'::notification_status,
        true
    );
    
    RETURN NEW;
END;$function$
;

CREATE OR REPLACE FUNCTION public.notify_new_forum_message()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$DECLARE
    sender_info RECORD;
    alert_status BOOLEAN;
    chat_type TEXT;
    notification_receiver_id UUID; 
    display_name TEXT;
BEGIN
    SELECT c.type INTO chat_type
    FROM chat c
    WHERE c.id = NEW.chat_id;

    IF chat_type <> 'forum' THEN
        RETURN NEW;
    END IF;

    WITH sender_data AS (
        SELECT 
            c.id AS chat_id,
            c.created_by,
            c.title,
            c.receiver_id,
            c.category,
            p.firstname,
            p.lastname,
            p.generated_id,
            p.role
        FROM chat c
        JOIN profile p ON p.id = NEW.send_by 
        WHERE c.id = NEW.chat_id 
    )
    SELECT * INTO sender_info FROM sender_data;

    IF sender_info IS NULL THEN
        RAISE EXCEPTION 'No sender data found for chat_id = %', NEW.chat_id;
    END IF;

    IF NEW.send_by = sender_info.created_by THEN
        notification_receiver_id := sender_info.receiver_id;
    ELSE
        notification_receiver_id := sender_info.created_by;
    END IF;

    IF sender_info.role IN ('xpert', 'company') THEN
        display_name := 'L''utilisateur ' || sender_info.firstname || ' ' || sender_info.lastname || 
                       ' (' || sender_info.generated_id || ')';
    ELSE
        display_name := 'Xpert One';
    END IF;

    PERFORM create_notification(
        notification_receiver_id,
        'communaute/forum',
        display_name || ' a envoyé un message',
        'Forum : '||sender_info.title,
        'info'::notification_status,
        true,
        sender_info.category
    );
    
    RETURN NEW;
END;$function$
;

CREATE OR REPLACE FUNCTION public.notify_new_conversation()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$DECLARE
    sender_info RECORD;
    alert_status BOOLEAN;
    display_name TEXT;
BEGIN
    IF NEW.type <> 'chat' THEN
        RETURN NEW; 
    END IF;

    SELECT new_message_alert INTO alert_status
    FROM user_alerts
    WHERE user_id = NEW.receiver_id;

    IF alert_status IS NOT TRUE THEN
        RETURN NEW;
    END IF;

    WITH sender_data AS (
        SELECT 
            c.id AS chat_id,
            p.firstname,
            p.lastname,
            p.generated_id
        FROM chat c
        JOIN profile p ON p.id = c.created_by
        WHERE c.created_by = NEW.created_by
    )
    SELECT * INTO sender_info FROM sender_data;

    IF sender_info IS NULL THEN
        RAISE EXCEPTION 'No sender data found for created_by = %', NEW.created_by;
    END IF;

    IF sender_info.role IN ('xpert', 'company') THEN
        display_name := 'L''utilisateur ' || sender_info.firstname || ' ' || sender_info.lastname || 
                       ' (' || sender_info.generated_id || ')';
    ELSE
        display_name := 'Xpert One';
    END IF;

    -- Création de la notification
    PERFORM create_notification(
        NEW.receiver_id,
        'messagerie',
        display_name || ' a démarré une nouvelle conversation avec vous',
        'Messagerie',
        'info'::notification_status
    );
    
    RETURN NEW;
END;$function$
;

CREATE OR REPLACE FUNCTION public.notify_new_message()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$DECLARE
    sender_info RECORD;
    alert_status BOOLEAN;
    chat_type TEXT;
    notification_receiver_id UUID; 
    display_name TEXT;

BEGIN
    SELECT c.type INTO chat_type
    FROM chat c
    WHERE c.id = NEW.chat_id;

    IF chat_type <> 'chat' THEN
        RETURN NEW;
    END IF;

   
    WITH sender_data AS (
        SELECT 
            c.id AS chat_id,
            c.created_by,
            c.receiver_id,
            p.firstname,
            p.lastname,
            p.generated_id,
            p.role

        FROM chat c
        JOIN profile p ON p.id = NEW.send_by 
        WHERE c.id = NEW.chat_id 
    )
    SELECT * INTO sender_info FROM sender_data;

    IF sender_info IS NULL THEN
        RAISE EXCEPTION 'No sender data found for chat_id = %', NEW.chat_id;
    END IF;

    IF NEW.send_by = sender_info.created_by THEN
       
        notification_receiver_id := sender_info.receiver_id;
    ELSE
       
        notification_receiver_id := sender_info.created_by;
    END IF;

    SELECT new_message_alert INTO alert_status
    FROM user_alerts
    WHERE user_id = notification_receiver_id;

    IF alert_status IS NOT TRUE THEN
        RETURN NEW;
    END IF;

    IF sender_info.role IN ('xpert', 'company') THEN
        display_name := 'L''utilisateur ' || sender_info.firstname || ' ' || sender_info.lastname || 
                       ' (' || sender_info.generated_id || ')';
    ELSE
        display_name := 'Xpert One';
    END IF;

    PERFORM create_notification(
        notification_receiver_id,
        'messagerie',
        display_name || ' vous a envoyé un message',
        'Messagerie'
        'info'::notification_status
    );
    
    RETURN NEW;
END;$function$
;

CREATE OR REPLACE FUNCTION public.notify_new_task()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
    PERFORM create_notification(
        NEW.assigned_to,
        'dashboard/todo'::text,
        'Nouvelle tâche créée : '::text || NEW.details::text,
        'Todolist'::text,
        CASE 
            WHEN NEW.status = 'urgent' THEN 'urgent'::notification_status
            ELSE 'standard'::notification_status
        END
    );
    RETURN NEW;
END;$function$
;

CREATE OR REPLACE FUNCTION public.notify_task_done()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
    IF NEW.status = 'done' AND OLD.status != 'done' THEN
        PERFORM create_notification(
            NEW.assigned_to, 
            'dashboard/todo'::text,
            'La tâche n°' || NEW.id || ' a été traitée'::text,
            'Todolist'
            'info'::notification_status 
        );
    END IF;
    RETURN NEW;
END;$function$
;

CREATE TRIGGER notify_new_echo_message_trigger AFTER INSERT ON public.message FOR EACH ROW EXECUTE FUNCTION notify_new_echo_message();

CREATE TRIGGER notify_new_forum_message_trigger AFTER INSERT ON public.message FOR EACH ROW EXECUTE FUNCTION notify_new_forum_message();


