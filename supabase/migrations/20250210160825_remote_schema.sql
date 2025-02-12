set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.notify_mission_state()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$DECLARE
    receiver_id UUID;
    number_mission TEXT;
BEGIN
    -- Récupérer le mission_number pour éviter la duplication
    WITH mission_info AS (
        SELECT mission_number 
        FROM mission 
        WHERE id = NEW.id
    ),
    mission_receivers AS (
        SELECT DISTINCT p.id 
        FROM mission m
        JOIN profile p ON p.id IN (
            m.affected_referent_id, 
            m.created_by, 
            m.xpert_associated_id
        )
        WHERE m.id = NEW.id
        AND p.allow_documents_notifications = true
    )
    -- Insérer les notifications pour les destinataires
    
    INSERT INTO notification (
        user_id,
        link,
        message,
        subject,
        status,
        is_global,
        category,
        created_at
    )
    SELECT 
        id,
        'mission/fiche/' || REPLACE(mission_info.mission_number, ' ', '-'),  -- Utilisation de mission_info.mission_number
        'La mission ' || mission_info.mission_number || 
        ' est passée de l''état ' || OLD.state || ' à l''état ' || NEW.state,
        'Mission',
        'info'::notification_status,
        false,
        null,
        NOW()
    FROM mission_receivers, mission_info;  -- Joindre mission_info p

    RETURN NEW;
END;$function$
;


