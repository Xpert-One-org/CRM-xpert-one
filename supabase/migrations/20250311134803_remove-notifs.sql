drop trigger if exists "notify_new_chat_trigger" on "public"."chat";

drop trigger if exists "forum_message_notification_trigger" on "public"."message";

drop trigger if exists "notify_new_echo_message_trigger" on "public"."message";

drop trigger if exists "notify_new_forum_message_trigger" on "public"."message";

drop trigger if exists "create_checkpoints_after_mission_insert" on "public"."mission";

drop trigger if exists "invoice_payment_notification_trigger" on "public"."mission";

drop trigger if exists "mission_notification_trigger" on "public"."mission";

drop trigger if exists "mission_state_change_trigger" on "public"."mission";

drop trigger if exists "payment_notification_trigger" on "public"."mission";

drop trigger if exists "salary_payment_notification_trigger" on "public"."mission";

drop trigger if exists "trigger_notify_new_mission_application" on "public"."mission_application";

drop trigger if exists "notify_welcome_call_trigger" on "public"."profile";

drop trigger if exists "profile_deleted_trigger" on "public"."profile_deleted";

drop trigger if exists "task_insert_trigger" on "public"."tasks";

drop trigger if exists "task_status_update_notify" on "public"."tasks";

CREATE TRIGGER notify_new_chat_trigger AFTER INSERT ON public.chat FOR EACH ROW WHEN ((new.type = 'chat'::chat_type)) EXECUTE FUNCTION notify_new_conversation();
ALTER TABLE "public"."chat" DISABLE TRIGGER "notify_new_chat_trigger";

CREATE TRIGGER forum_message_notification_trigger AFTER INSERT ON public.message FOR EACH ROW EXECUTE FUNCTION notify_forum_message();
ALTER TABLE "public"."message" DISABLE TRIGGER "forum_message_notification_trigger";

CREATE TRIGGER notify_new_echo_message_trigger AFTER INSERT ON public.message FOR EACH ROW EXECUTE FUNCTION notify_new_echo_message();
ALTER TABLE "public"."message" DISABLE TRIGGER "notify_new_echo_message_trigger";

CREATE TRIGGER notify_new_forum_message_trigger AFTER INSERT ON public.message FOR EACH ROW EXECUTE FUNCTION notify_new_forum_message();
ALTER TABLE "public"."message" DISABLE TRIGGER "notify_new_forum_message_trigger";

CREATE TRIGGER create_checkpoints_after_mission_insert AFTER INSERT ON public.mission FOR EACH ROW EXECUTE FUNCTION create_mission_checkpoints();
ALTER TABLE "public"."mission" DISABLE TRIGGER "create_checkpoints_after_mission_insert";

CREATE TRIGGER invoice_payment_notification_trigger AFTER UPDATE OF facturation_invoice_paid ON public.mission FOR EACH ROW EXECUTE FUNCTION notify_new_invoice_payment();
ALTER TABLE "public"."mission" DISABLE TRIGGER "invoice_payment_notification_trigger";

CREATE TRIGGER mission_notification_trigger AFTER UPDATE ON public.mission FOR EACH ROW EXECUTE FUNCTION create_mission_notifications();
ALTER TABLE "public"."mission" DISABLE TRIGGER "mission_notification_trigger";

CREATE TRIGGER mission_state_change_trigger AFTER UPDATE OF state ON public.mission FOR EACH ROW WHEN ((old.state IS DISTINCT FROM new.state)) EXECUTE FUNCTION notify_mission_state();
ALTER TABLE "public"."mission" DISABLE TRIGGER "mission_state_change_trigger";

CREATE TRIGGER payment_notification_trigger AFTER UPDATE OF facturation_fournisseur_payment ON public.mission FOR EACH ROW EXECUTE FUNCTION notify_new_payment();
ALTER TABLE "public"."mission" DISABLE TRIGGER "payment_notification_trigger";

CREATE TRIGGER salary_payment_notification_trigger AFTER UPDATE OF facturation_salary_payment ON public.mission FOR EACH ROW EXECUTE FUNCTION notify_new_salary_payment();
ALTER TABLE "public"."mission" DISABLE TRIGGER "salary_payment_notification_trigger";

CREATE TRIGGER trigger_notify_new_mission_application AFTER INSERT ON public.mission_application FOR EACH ROW EXECUTE FUNCTION notify_new_application();
ALTER TABLE "public"."mission_application" DISABLE TRIGGER "trigger_notify_new_mission_application";

CREATE TRIGGER notify_welcome_call_trigger AFTER UPDATE OF get_welcome_call ON public.profile FOR EACH ROW WHEN (((new.get_welcome_call = true) AND (old.get_welcome_call IS DISTINCT FROM true))) EXECUTE FUNCTION notify_welcome_call_done();
ALTER TABLE "public"."profile" DISABLE TRIGGER "notify_welcome_call_trigger";

CREATE TRIGGER profile_deleted_trigger AFTER INSERT ON public.profile_deleted FOR EACH ROW EXECUTE FUNCTION notify_profile_deletion();
ALTER TABLE "public"."profile_deleted" DISABLE TRIGGER "profile_deleted_trigger";

CREATE TRIGGER task_insert_trigger AFTER INSERT ON public.tasks FOR EACH ROW EXECUTE FUNCTION notify_new_task();
ALTER TABLE "public"."tasks" DISABLE TRIGGER "task_insert_trigger";

CREATE TRIGGER task_status_update_notify AFTER UPDATE ON public.tasks FOR EACH ROW WHEN (((new.status = 'done'::task_status) AND (old.status <> 'done'::task_status))) EXECUTE FUNCTION notify_task_done();
ALTER TABLE "public"."tasks" DISABLE TRIGGER "task_status_update_notify";


