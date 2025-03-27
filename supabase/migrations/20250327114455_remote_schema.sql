drop trigger if exists "brevo_new_user_deleted" on "public"."profile";

alter table "public"."profile_deleted" drop constraint "profile_deleted_deleted_by_fkey";

alter table "public"."xpert_notes" drop constraint "xpert_notes_created_by_fkey";

alter table "public"."profile_deleted" add column "role" profile_roles;

alter table "public"."xpert_notes" add constraint "xpert_notes_created_by_fkey" FOREIGN KEY (created_by) REFERENCES profile(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."xpert_notes" validate constraint "xpert_notes_created_by_fkey";

CREATE TRIGGER brevo_new_user_deleted AFTER INSERT ON public.profile_deleted FOR EACH ROW EXECUTE FUNCTION supabase_functions.http_request('https://wxjnrjakjwjhvsiwhelt.supabase.co/functions/v1/brevo-management', 'POST', '{"Content-type":"application/json"}', '{"type":"new_user_deleted"}', '5000');


