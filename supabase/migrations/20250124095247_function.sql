set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.check_and_create_mission_tasks()
 RETURNS void
 LANGUAGE plpgsql
AS $function$BEGIN
    -- Insérer les tâches manquantes pour les missions à J-30
    INSERT INTO tasks (
        assigned_to,
        subject_type,
        details,
        mission_id,
        status,
        created_at
    )
    SELECT 
        m.affected_referent_id,
        'mission',
        'Il reste moins de 30J avant la fin de remise de candidature pour la mission ' || m.mission_number,
        m.id,
        'urgent',
        CURRENT_TIMESTAMP
    FROM mission m
    WHERE 
        m.deadline_application - INTERVAL '30 days' <= CURRENT_DATE
        AND NOT EXISTS (
            SELECT 1 
            FROM tasks t 
            WHERE 
                t.mission_id = m.id AND 
                t.details LIKE 'Il reste moins de 30J avant la fin de remise de candidature pour la mission ' || m.mission_number
                
        );
END;$function$
;


