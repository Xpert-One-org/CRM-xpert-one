alter table "public"."tasks" enable row level security;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.check_mission_checkpoints()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Vérification J-10 FOURNISSEUR
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
        'mission'::task_subject_type,
        'Point à J-10 à effectuer avec le fournisseur ' || p.generated_id || ' pour la mission ' || m.mission_number,
        m.id,
        'pending'::task_status,
        NOW()
    FROM mission m
    JOIN mission_checkpoints mc ON mc.mission_id = m.id
    JOIN profile p ON p.id = m.affected_referent_id
    WHERE
        m.start_date - INTERVAL '10 days' <= CURRENT_DATE
        AND m.state IN ('open', 'open_all', 'in_progress', 'finished')
        AND NOT mc.point_j_moins_10_f
        AND NOT EXISTS (
            SELECT 1 FROM tasks t
            WHERE t.mission_id = m.id
            AND t.details LIKE 'Point à J-10%'
        );

    -- Vérification J-10 XPERT
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
        'mission'::task_subject_type,
        'Point à J-10 à effectuer avec l''xpert ' || p.generated_id || ' pour la mission ' || m.mission_number,
        m.id,
        'pending'::task_status,
        NOW()
    FROM mission m
    JOIN mission_checkpoints mc ON mc.mission_id = m.id
    JOIN profile p ON p.id = m.affected_referent_id
    WHERE
        m.start_date - INTERVAL '10 days' <= CURRENT_DATE
        AND m.state IN ('open', 'open_all', 'in_progress', 'finished')
        AND NOT mc.point_j_moins_10_x
        AND NOT EXISTS (
            SELECT 1 FROM tasks t
            WHERE t.mission_id = m.id
            AND t.details LIKE 'Point à J-10%'
        );

    -- Vérification J+10 XPERT
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
        'mission'::task_subject_type,
        'Point à J+10 à effectuer avec l''xpert ' || p.generated_id || ' pour la mission ' || m.mission_number,    
        m.id,
        'pending'::task_status,
        NOW()
    FROM mission m
    JOIN mission_checkpoints mc ON mc.mission_id = m.id
    JOIN profile p ON p.id = m.affected_referent_id
    WHERE
        m.start_date + INTERVAL '10 days' <= CURRENT_DATE
        AND m.state IN ('open', 'open_all', 'in_progress', 'finished')
        AND NOT mc.point_j_plus_10_x
        AND NOT EXISTS (
            SELECT 1 FROM tasks t
            WHERE t.mission_id = m.id
            AND t.details LIKE 'Point à J+10%'
        );
END;
$function$
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
            'Todolist',
            'info'::notification_status 
        );
    END IF;
    RETURN NEW;
END;$function$
;

create policy "Allow ALL for ALL"
on "public"."tasks"
as permissive
for all
to public
using (true)
with check (true);



