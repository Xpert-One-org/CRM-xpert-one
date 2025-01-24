set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_mission_notifications()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
    IF NEW.xpert_associated_id IS NOT NULL AND 
       NEW.xpert_associated_id IS DISTINCT FROM OLD.xpert_associated_id THEN
        
        -- Notification pour le affected_referent_id
        IF NEW.affected_referent_id IS NOT NULL THEN
            PERFORM create_notification(
                NEW.affected_referent_id,
                'mission/fiche/' || REPLACE(NEW.mission_number, ' ', '-'),
                'Une nouvelle mission vous a été affectée',
                'Nouvelle mission',
                'info'
            );
        END IF;

        -- Notification pour le xpert_associated_id
        PERFORM create_notification(
            NEW.xpert_associated_id,
            'mission/' || REPLACE(NEW.mission_number, ' ', '-'),  -- Corrigé de mission_id à mission_number
            'Une nouvelle mission est associée',
            'Mission affectée',
            'info'
          
        );

        -- Notification pour le created_by
        IF NEW.created_by IS NOT NULL THEN
            PERFORM create_notification(
                NEW.created_by,
                'mission/' || REPLACE(NEW.mission_number, ' ', '-'),  -- Corrigé de /mission/id à mission_number
                'Une de vos missions a été affectée à un xpert',
                'Mission affectée',
                'info' -- Changé de 'unread' à 'info' pourcohérence
             
            );
        END IF;
    END IF;

    RETURN NEW;
END;$function$
;

CREATE TRIGGER mission_notification_trigger AFTER UPDATE ON public.mission FOR EACH ROW EXECUTE FUNCTION create_mission_notifications();


