set check_function_bodies = off;

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
        'Messagerie',
        'info'
    );
    
    
    RETURN NEW;
END;$function$
;

CREATE TRIGGER notify_new_message_trigger AFTER INSERT ON public.message FOR EACH ROW EXECUTE FUNCTION notify_new_message();


