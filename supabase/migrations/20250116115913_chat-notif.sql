SET check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.notify_new_conversation()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$DECLARE
    sender_info RECORD;
    alert_status BOOLEAN;
BEGIN
    IF NEW.type <> 'chat' THEN
        RETURN NEW; 
    END IF;

    SELECT new_message_alert INTO alert_status
    FROM user_alert
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

    -- Création de la notification
    PERFORM create_notification(
        NEW.receiver_id,
        'messagerie',
        '',
        'L''utilisateur ' || sender_info.firstname || ' ' || sender_info.lastname || 
        ' (' || sender_info.generated_id || ') a démarré une nouvelle conversation avec vous',
        'info'::notification_status
    );
    
    RETURN NEW;
END;$function$
;

CREATE OR REPLACE TRIGGER notify_new_chat_trigger
AFTER INSERT ON public.chat
FOR EACH ROW
WHEN (NEW.type = 'chat') 
EXECUTE FUNCTION notify_new_conversation();
