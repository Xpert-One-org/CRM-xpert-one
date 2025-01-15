create type "public"."notification_status" as enum ('urgent', 'info', 'standard');

alter table "public"."notification" drop constraint "notification_chat_id_fkey";

alter table "public"."notification" drop constraint "notifications_pkey";

drop index if exists "public"."notifications_pkey";

alter table "public"."notification" drop column "chat_id";

alter table "public"."notification" drop column "read_by";

alter table "public"."notification" drop column "type";

alter table "public"."notification" add column "link" text;

alter table "public"."notification" add column "message" text not null;

alter table "public"."notification" add column "status" notification_status not null default 'standard'::notification_status;

alter table "public"."notification" add column "subject" text;

alter table "public"."notification" add column "user_id" uuid not null;

alter table "public"."notification" enable row level security;

alter table "public"."tasks" alter column "created_by" drop not null;

CREATE UNIQUE INDEX notifications_pkey1 ON public.notification USING btree (id);

alter table "public"."notification" add constraint "notifications_pkey1" PRIMARY KEY using index "notifications_pkey1";

alter table "public"."notification" add constraint "notifications_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profile(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."notification" validate constraint "notifications_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_notification(user_id uuid, link text, message text, subject text, status notification_status)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
    INSERT INTO notification (
        user_id,
        link,
        message,
        subject,
        status,
        created_at
    ) VALUES (
        user_id,
        link,
        message,
        subject,
        status,
        NOW()  
    );
END;$function$
;

CREATE OR REPLACE FUNCTION public.notify_new_task()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
    PERFORM create_notification(
        NEW.assigned_to,
        'dashboard/todo'::text,
        NEW.details,
        'Nouvelle tâche créée:'::text,
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
            '',
            'La tâche n°' || NEW.id || ' a été traitée'::text,
            'info'::notification_status 
        );
    END IF;
    RETURN NEW;
END;$function$
;

create type "public"."referent_type" as ("id" uuid, "firstname" text, "lastname" text);

create policy "Seule l'application peut créer des notifications"
on "public"."notification"
as permissive
for insert
to public
with check ((auth.role() = 'service_role'::text));


create policy "Utilisateurs peuvent mettre à jour leurs notifications"
on "public"."notification"
as permissive
for update
to public
using ((auth.uid() = user_id));


create policy "Utilisateurs peuvent supprimer leurs notifications"
on "public"."notification"
as permissive
for delete
to public
using ((auth.uid() = user_id));


create policy "Utilisateurs peuvent voir leurs notifications"
on "public"."notification"
as permissive
for select
to public
using ((auth.uid() = user_id));


CREATE TRIGGER task_insert_trigger AFTER INSERT ON public.tasks FOR EACH ROW EXECUTE FUNCTION notify_new_task();

CREATE TRIGGER task_status_update_notify AFTER UPDATE ON public.tasks FOR EACH ROW WHEN (((new.status = 'done'::task_status) AND (old.status <> 'done'::task_status))) EXECUTE FUNCTION notify_task_done();


