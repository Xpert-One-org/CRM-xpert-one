alter table "public"."chat" disable row level security;

alter table "public"."profile" add column "evaluation_score" smallint;

alter table "public"."profile" add column "self_evaluation_score" smallint;

alter table "public"."profile" add constraint "profile_evaluation_score_check" CHECK (((evaluation_score >= 1) AND (evaluation_score <= 10))) not valid;

alter table "public"."profile" validate constraint "profile_evaluation_score_check";

alter table "public"."profile" add constraint "profile_self_evaluation_score_check" CHECK (((self_evaluation_score >= 1) AND (self_evaluation_score <= 10))) not valid;

alter table "public"."profile" validate constraint "profile_self_evaluation_score_check";

CREATE TRIGGER brevo_new_echo_chat AFTER INSERT ON public.chat FOR EACH ROW EXECUTE FUNCTION supabase_functions.http_request('https://wxjnrjakjwjhvsiwhelt.supabase.co/functions/v1/brevo-management', 'POST', '{"Content-type":"application/json"}', '{"type":"new_echo_chat"}', '5000');

CREATE TRIGGER brevo_new_xpert_to_xpert_chat AFTER INSERT ON public.chat FOR EACH ROW EXECUTE FUNCTION supabase_functions.http_request('https://wxjnrjakjwjhvsiwhelt.supabase.co/functions/v1/brevo-management', 'POST', '{"Content-type":"application/json"}', '{"type":"new_xpert_to_xpert_chat"}', '5000');

CREATE TRIGGER brevo_new_message AFTER INSERT ON public.message FOR EACH ROW EXECUTE FUNCTION supabase_functions.http_request('https://wxjnrjakjwjhvsiwhelt.supabase.co/functions/v1/brevo-management', 'POST', '{"Content-type":"application/json"}', '{"type":"new_message"}', '5000');

CREATE TRIGGER brevo_new_mission_application AFTER INSERT ON public.mission_application FOR EACH ROW EXECUTE FUNCTION supabase_functions.http_request('https://wxjnrjakjwjhvsiwhelt.supabase.co/functions/v1/brevo-management', 'POST', '{"Content-type":"application/json"}', '{"type":"new_mission_application"}', '5000');

CREATE TRIGGER brevo_new_user_deleted AFTER DELETE ON public.profile FOR EACH ROW EXECUTE FUNCTION supabase_functions.http_request('https://wxjnrjakjwjhvsiwhelt.supabase.co/functions/v1/brevo-management', 'POST', '{"Content-type":"application/json"}', '{"type":"new_user_deleted"}', '5000');


