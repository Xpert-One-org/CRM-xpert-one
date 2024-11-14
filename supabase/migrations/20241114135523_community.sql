drop trigger if exists "slugify_title_unique" on "public"."article";

drop trigger if exists "update_chat_updated_at" on "public"."message";

drop trigger if exists "update_totale_progression_column_trigger" on "public"."profile";

drop policy "Allow read for all" on "public"."article";

drop policy "CRUD FOR AUTH" on "public"."chat";

drop policy "Enable insert for authenticated users only" on "public"."company_roles";

drop policy "Enable read access for all users" on "public"."company_roles";

drop policy "Enable update for auth" on "public"."company_roles";

drop policy "Enable insert for authenticated users only" on "public"."contact_xpert_demands";

drop policy "Enable read access for all users" on "public"."contact_xpert_demands";

drop policy "Enable insert for authenticated users only" on "public"."diplomas";

drop policy "Enable read access for all users" on "public"."diplomas";

drop policy "Enable update for auths" on "public"."diplomas";

drop policy "Enable insert for authenticated users only" on "public"."expertises";

drop policy "Enable read access for all users" on "public"."expertises";

drop policy "Enable update for auths" on "public"."expertises";

drop policy "Enable insert for authenticated users only" on "public"."habilitations";

drop policy "Enable read access for all users" on "public"."habilitations";

drop policy "Enable update for auths" on "public"."habilitations";

drop policy "Enable insert for authenticated users only" on "public"."infrastructures";

drop policy "Enable read access for all users" on "public"."infrastructures";

drop policy "Enable update for auths" on "public"."infrastructures";

drop policy "Enable insert for authenticated users only" on "public"."job_titles";

drop policy "Enable read access for all users" on "public"."job_titles";

drop policy "Enable update for auths" on "public"."job_titles";

drop policy "Enable insert for authenticated users only" on "public"."juridic_status";

drop policy "Enable read access for all users" on "public"."juridic_status";

drop policy "Enable update for auths" on "public"."juridic_status";

drop policy "Enable insert for authenticated users only" on "public"."languages";

drop policy "Enable read access for all users" on "public"."languages";

drop policy "Enable update for auths" on "public"."languages";

drop policy "Enable insert for authenticated users only" on "public"."message";

drop policy "Enable read access for all users" on "public"."message";

drop policy "Enable update for auths" on "public"."message";

drop policy "Enable insert for authenticated users only" on "public"."mission";

drop policy "Enable read access for all users" on "public"."mission";

drop policy "Enable update for users based on email" on "public"."mission";

drop policy "Enable delete for users based on user_id" on "public"."mission_application";

drop policy "Enable insert for authenticated users only" on "public"."mission_application";

drop policy "Enable read access for all users" on "public"."mission_application";

drop policy "Enable insert for authenticated users only" on "public"."posts";

drop policy "Enable read access for all users" on "public"."posts";

drop policy "Enable update for auths" on "public"."posts";

drop policy "Enable delete for users based on user_id" on "public"."profile";

drop policy "Enable insert for all users" on "public"."profile";

drop policy "Enable read access for all users" on "public"."profile";

drop policy "Enable update for users based on email or admin" on "public"."profile";

drop policy "Enable delete for users based on user_id" on "public"."profile_education";

drop policy "Enable insert for users based on user_id" on "public"."profile_education";

drop policy "Enable read access for all users" on "public"."profile_education";

drop policy "Enable update for users based on email" on "public"."profile_education";

drop policy "Enable delete for users based on user_id" on "public"."profile_experience";

drop policy "Enable insert for users based on user_id" on "public"."profile_experience";

drop policy "Enable read access for all users" on "public"."profile_experience";

drop policy "Enable update for users based on email" on "public"."profile_experience";

drop policy "Enable delete for users based on user_id" on "public"."profile_expertise";

drop policy "Enable insert for users based on user_id" on "public"."profile_expertise";

drop policy "Enable read access for all users" on "public"."profile_expertise";

drop policy "Enable update for users based on email" on "public"."profile_expertise";

drop policy "Enable delete for users based on user_id" on "public"."profile_mission";

drop policy "Enable insert for users based on user_id" on "public"."profile_mission";

drop policy "Enable read access for all users" on "public"."profile_mission";

drop policy "Enable update for users based on email" on "public"."profile_mission";

drop policy "Enable delete for users based on user_id" on "public"."profile_status";

drop policy "Enable insert for users based on user_id" on "public"."profile_status";

drop policy "Enable read access for all users" on "public"."profile_status";

drop policy "Enable update for users based on email" on "public"."profile_status";

drop policy "Enable insert for authenticated users only" on "public"."sectors";

drop policy "Enable read access for all users" on "public"."sectors";

drop policy "Enable update for auths" on "public"."sectors";

drop policy "Enable insert for authenticated users only" on "public"."specialties";

drop policy "Enable read access for all users" on "public"."specialties";

drop policy "Enable update for auths" on "public"."specialties";

drop policy "Enable insert for authenticated users only" on "public"."subjects";

drop policy "Enable read access for all users" on "public"."subjects";

drop policy "Enable update for auths" on "public"."subjects";

revoke delete on table "public"."article" from "anon";

revoke insert on table "public"."article" from "anon";

revoke references on table "public"."article" from "anon";

revoke select on table "public"."article" from "anon";

revoke trigger on table "public"."article" from "anon";

revoke truncate on table "public"."article" from "anon";

revoke update on table "public"."article" from "anon";

revoke delete on table "public"."article" from "authenticated";

revoke insert on table "public"."article" from "authenticated";

revoke references on table "public"."article" from "authenticated";

revoke select on table "public"."article" from "authenticated";

revoke trigger on table "public"."article" from "authenticated";

revoke truncate on table "public"."article" from "authenticated";

revoke update on table "public"."article" from "authenticated";

revoke delete on table "public"."article" from "service_role";

revoke insert on table "public"."article" from "service_role";

revoke references on table "public"."article" from "service_role";

revoke select on table "public"."article" from "service_role";

revoke trigger on table "public"."article" from "service_role";

revoke truncate on table "public"."article" from "service_role";

revoke update on table "public"."article" from "service_role";

revoke delete on table "public"."chat" from "anon";

revoke insert on table "public"."chat" from "anon";

revoke references on table "public"."chat" from "anon";

revoke select on table "public"."chat" from "anon";

revoke trigger on table "public"."chat" from "anon";

revoke truncate on table "public"."chat" from "anon";

revoke update on table "public"."chat" from "anon";

revoke delete on table "public"."chat" from "authenticated";

revoke insert on table "public"."chat" from "authenticated";

revoke references on table "public"."chat" from "authenticated";

revoke select on table "public"."chat" from "authenticated";

revoke trigger on table "public"."chat" from "authenticated";

revoke truncate on table "public"."chat" from "authenticated";

revoke update on table "public"."chat" from "authenticated";

revoke delete on table "public"."chat" from "service_role";

revoke insert on table "public"."chat" from "service_role";

revoke references on table "public"."chat" from "service_role";

revoke select on table "public"."chat" from "service_role";

revoke trigger on table "public"."chat" from "service_role";

revoke truncate on table "public"."chat" from "service_role";

revoke update on table "public"."chat" from "service_role";

revoke delete on table "public"."company_roles" from "anon";

revoke insert on table "public"."company_roles" from "anon";

revoke references on table "public"."company_roles" from "anon";

revoke select on table "public"."company_roles" from "anon";

revoke trigger on table "public"."company_roles" from "anon";

revoke truncate on table "public"."company_roles" from "anon";

revoke update on table "public"."company_roles" from "anon";

revoke delete on table "public"."company_roles" from "authenticated";

revoke insert on table "public"."company_roles" from "authenticated";

revoke references on table "public"."company_roles" from "authenticated";

revoke select on table "public"."company_roles" from "authenticated";

revoke trigger on table "public"."company_roles" from "authenticated";

revoke truncate on table "public"."company_roles" from "authenticated";

revoke update on table "public"."company_roles" from "authenticated";

revoke delete on table "public"."company_roles" from "service_role";

revoke insert on table "public"."company_roles" from "service_role";

revoke references on table "public"."company_roles" from "service_role";

revoke select on table "public"."company_roles" from "service_role";

revoke trigger on table "public"."company_roles" from "service_role";

revoke truncate on table "public"."company_roles" from "service_role";

revoke update on table "public"."company_roles" from "service_role";

revoke delete on table "public"."contact_xpert_demands" from "anon";

revoke insert on table "public"."contact_xpert_demands" from "anon";

revoke references on table "public"."contact_xpert_demands" from "anon";

revoke select on table "public"."contact_xpert_demands" from "anon";

revoke trigger on table "public"."contact_xpert_demands" from "anon";

revoke truncate on table "public"."contact_xpert_demands" from "anon";

revoke update on table "public"."contact_xpert_demands" from "anon";

revoke delete on table "public"."contact_xpert_demands" from "authenticated";

revoke insert on table "public"."contact_xpert_demands" from "authenticated";

revoke references on table "public"."contact_xpert_demands" from "authenticated";

revoke select on table "public"."contact_xpert_demands" from "authenticated";

revoke trigger on table "public"."contact_xpert_demands" from "authenticated";

revoke truncate on table "public"."contact_xpert_demands" from "authenticated";

revoke update on table "public"."contact_xpert_demands" from "authenticated";

revoke delete on table "public"."contact_xpert_demands" from "service_role";

revoke insert on table "public"."contact_xpert_demands" from "service_role";

revoke references on table "public"."contact_xpert_demands" from "service_role";

revoke select on table "public"."contact_xpert_demands" from "service_role";

revoke trigger on table "public"."contact_xpert_demands" from "service_role";

revoke truncate on table "public"."contact_xpert_demands" from "service_role";

revoke update on table "public"."contact_xpert_demands" from "service_role";

revoke delete on table "public"."diplomas" from "anon";

revoke insert on table "public"."diplomas" from "anon";

revoke references on table "public"."diplomas" from "anon";

revoke select on table "public"."diplomas" from "anon";

revoke trigger on table "public"."diplomas" from "anon";

revoke truncate on table "public"."diplomas" from "anon";

revoke update on table "public"."diplomas" from "anon";

revoke delete on table "public"."diplomas" from "authenticated";

revoke insert on table "public"."diplomas" from "authenticated";

revoke references on table "public"."diplomas" from "authenticated";

revoke select on table "public"."diplomas" from "authenticated";

revoke trigger on table "public"."diplomas" from "authenticated";

revoke truncate on table "public"."diplomas" from "authenticated";

revoke update on table "public"."diplomas" from "authenticated";

revoke delete on table "public"."diplomas" from "service_role";

revoke insert on table "public"."diplomas" from "service_role";

revoke references on table "public"."diplomas" from "service_role";

revoke select on table "public"."diplomas" from "service_role";

revoke trigger on table "public"."diplomas" from "service_role";

revoke truncate on table "public"."diplomas" from "service_role";

revoke update on table "public"."diplomas" from "service_role";

revoke delete on table "public"."expertises" from "anon";

revoke insert on table "public"."expertises" from "anon";

revoke references on table "public"."expertises" from "anon";

revoke select on table "public"."expertises" from "anon";

revoke trigger on table "public"."expertises" from "anon";

revoke truncate on table "public"."expertises" from "anon";

revoke update on table "public"."expertises" from "anon";

revoke delete on table "public"."expertises" from "authenticated";

revoke insert on table "public"."expertises" from "authenticated";

revoke references on table "public"."expertises" from "authenticated";

revoke select on table "public"."expertises" from "authenticated";

revoke trigger on table "public"."expertises" from "authenticated";

revoke truncate on table "public"."expertises" from "authenticated";

revoke update on table "public"."expertises" from "authenticated";

revoke delete on table "public"."expertises" from "service_role";

revoke insert on table "public"."expertises" from "service_role";

revoke references on table "public"."expertises" from "service_role";

revoke select on table "public"."expertises" from "service_role";

revoke trigger on table "public"."expertises" from "service_role";

revoke truncate on table "public"."expertises" from "service_role";

revoke update on table "public"."expertises" from "service_role";

revoke delete on table "public"."habilitations" from "anon";

revoke insert on table "public"."habilitations" from "anon";

revoke references on table "public"."habilitations" from "anon";

revoke select on table "public"."habilitations" from "anon";

revoke trigger on table "public"."habilitations" from "anon";

revoke truncate on table "public"."habilitations" from "anon";

revoke update on table "public"."habilitations" from "anon";

revoke delete on table "public"."habilitations" from "authenticated";

revoke insert on table "public"."habilitations" from "authenticated";

revoke references on table "public"."habilitations" from "authenticated";

revoke select on table "public"."habilitations" from "authenticated";

revoke trigger on table "public"."habilitations" from "authenticated";

revoke truncate on table "public"."habilitations" from "authenticated";

revoke update on table "public"."habilitations" from "authenticated";

revoke delete on table "public"."habilitations" from "service_role";

revoke insert on table "public"."habilitations" from "service_role";

revoke references on table "public"."habilitations" from "service_role";

revoke select on table "public"."habilitations" from "service_role";

revoke trigger on table "public"."habilitations" from "service_role";

revoke truncate on table "public"."habilitations" from "service_role";

revoke update on table "public"."habilitations" from "service_role";

revoke delete on table "public"."infrastructures" from "anon";

revoke insert on table "public"."infrastructures" from "anon";

revoke references on table "public"."infrastructures" from "anon";

revoke select on table "public"."infrastructures" from "anon";

revoke trigger on table "public"."infrastructures" from "anon";

revoke truncate on table "public"."infrastructures" from "anon";

revoke update on table "public"."infrastructures" from "anon";

revoke delete on table "public"."infrastructures" from "authenticated";

revoke insert on table "public"."infrastructures" from "authenticated";

revoke references on table "public"."infrastructures" from "authenticated";

revoke select on table "public"."infrastructures" from "authenticated";

revoke trigger on table "public"."infrastructures" from "authenticated";

revoke truncate on table "public"."infrastructures" from "authenticated";

revoke update on table "public"."infrastructures" from "authenticated";

revoke delete on table "public"."infrastructures" from "service_role";

revoke insert on table "public"."infrastructures" from "service_role";

revoke references on table "public"."infrastructures" from "service_role";

revoke select on table "public"."infrastructures" from "service_role";

revoke trigger on table "public"."infrastructures" from "service_role";

revoke truncate on table "public"."infrastructures" from "service_role";

revoke update on table "public"."infrastructures" from "service_role";

revoke delete on table "public"."job_titles" from "anon";

revoke insert on table "public"."job_titles" from "anon";

revoke references on table "public"."job_titles" from "anon";

revoke select on table "public"."job_titles" from "anon";

revoke trigger on table "public"."job_titles" from "anon";

revoke truncate on table "public"."job_titles" from "anon";

revoke update on table "public"."job_titles" from "anon";

revoke delete on table "public"."job_titles" from "authenticated";

revoke insert on table "public"."job_titles" from "authenticated";

revoke references on table "public"."job_titles" from "authenticated";

revoke select on table "public"."job_titles" from "authenticated";

revoke trigger on table "public"."job_titles" from "authenticated";

revoke truncate on table "public"."job_titles" from "authenticated";

revoke update on table "public"."job_titles" from "authenticated";

revoke delete on table "public"."job_titles" from "service_role";

revoke insert on table "public"."job_titles" from "service_role";

revoke references on table "public"."job_titles" from "service_role";

revoke select on table "public"."job_titles" from "service_role";

revoke trigger on table "public"."job_titles" from "service_role";

revoke truncate on table "public"."job_titles" from "service_role";

revoke update on table "public"."job_titles" from "service_role";

revoke delete on table "public"."juridic_status" from "anon";

revoke insert on table "public"."juridic_status" from "anon";

revoke references on table "public"."juridic_status" from "anon";

revoke select on table "public"."juridic_status" from "anon";

revoke trigger on table "public"."juridic_status" from "anon";

revoke truncate on table "public"."juridic_status" from "anon";

revoke update on table "public"."juridic_status" from "anon";

revoke delete on table "public"."juridic_status" from "authenticated";

revoke insert on table "public"."juridic_status" from "authenticated";

revoke references on table "public"."juridic_status" from "authenticated";

revoke select on table "public"."juridic_status" from "authenticated";

revoke trigger on table "public"."juridic_status" from "authenticated";

revoke truncate on table "public"."juridic_status" from "authenticated";

revoke update on table "public"."juridic_status" from "authenticated";

revoke delete on table "public"."juridic_status" from "service_role";

revoke insert on table "public"."juridic_status" from "service_role";

revoke references on table "public"."juridic_status" from "service_role";

revoke select on table "public"."juridic_status" from "service_role";

revoke trigger on table "public"."juridic_status" from "service_role";

revoke truncate on table "public"."juridic_status" from "service_role";

revoke update on table "public"."juridic_status" from "service_role";

revoke delete on table "public"."languages" from "anon";

revoke insert on table "public"."languages" from "anon";

revoke references on table "public"."languages" from "anon";

revoke select on table "public"."languages" from "anon";

revoke trigger on table "public"."languages" from "anon";

revoke truncate on table "public"."languages" from "anon";

revoke update on table "public"."languages" from "anon";

revoke delete on table "public"."languages" from "authenticated";

revoke insert on table "public"."languages" from "authenticated";

revoke references on table "public"."languages" from "authenticated";

revoke select on table "public"."languages" from "authenticated";

revoke trigger on table "public"."languages" from "authenticated";

revoke truncate on table "public"."languages" from "authenticated";

revoke update on table "public"."languages" from "authenticated";

revoke delete on table "public"."languages" from "service_role";

revoke insert on table "public"."languages" from "service_role";

revoke references on table "public"."languages" from "service_role";

revoke select on table "public"."languages" from "service_role";

revoke trigger on table "public"."languages" from "service_role";

revoke truncate on table "public"."languages" from "service_role";

revoke update on table "public"."languages" from "service_role";

revoke delete on table "public"."message" from "anon";

revoke insert on table "public"."message" from "anon";

revoke references on table "public"."message" from "anon";

revoke select on table "public"."message" from "anon";

revoke trigger on table "public"."message" from "anon";

revoke truncate on table "public"."message" from "anon";

revoke update on table "public"."message" from "anon";

revoke delete on table "public"."message" from "authenticated";

revoke insert on table "public"."message" from "authenticated";

revoke references on table "public"."message" from "authenticated";

revoke select on table "public"."message" from "authenticated";

revoke trigger on table "public"."message" from "authenticated";

revoke truncate on table "public"."message" from "authenticated";

revoke update on table "public"."message" from "authenticated";

revoke delete on table "public"."message" from "service_role";

revoke insert on table "public"."message" from "service_role";

revoke references on table "public"."message" from "service_role";

revoke select on table "public"."message" from "service_role";

revoke trigger on table "public"."message" from "service_role";

revoke truncate on table "public"."message" from "service_role";

revoke update on table "public"."message" from "service_role";

revoke delete on table "public"."mission" from "anon";

revoke insert on table "public"."mission" from "anon";

revoke references on table "public"."mission" from "anon";

revoke select on table "public"."mission" from "anon";

revoke trigger on table "public"."mission" from "anon";

revoke truncate on table "public"."mission" from "anon";

revoke update on table "public"."mission" from "anon";

revoke delete on table "public"."mission" from "authenticated";

revoke insert on table "public"."mission" from "authenticated";

revoke references on table "public"."mission" from "authenticated";

revoke select on table "public"."mission" from "authenticated";

revoke trigger on table "public"."mission" from "authenticated";

revoke truncate on table "public"."mission" from "authenticated";

revoke update on table "public"."mission" from "authenticated";

revoke delete on table "public"."mission" from "service_role";

revoke insert on table "public"."mission" from "service_role";

revoke references on table "public"."mission" from "service_role";

revoke select on table "public"."mission" from "service_role";

revoke trigger on table "public"."mission" from "service_role";

revoke truncate on table "public"."mission" from "service_role";

revoke update on table "public"."mission" from "service_role";

revoke delete on table "public"."mission_application" from "anon";

revoke insert on table "public"."mission_application" from "anon";

revoke references on table "public"."mission_application" from "anon";

revoke select on table "public"."mission_application" from "anon";

revoke trigger on table "public"."mission_application" from "anon";

revoke truncate on table "public"."mission_application" from "anon";

revoke update on table "public"."mission_application" from "anon";

revoke delete on table "public"."mission_application" from "authenticated";

revoke insert on table "public"."mission_application" from "authenticated";

revoke references on table "public"."mission_application" from "authenticated";

revoke select on table "public"."mission_application" from "authenticated";

revoke trigger on table "public"."mission_application" from "authenticated";

revoke truncate on table "public"."mission_application" from "authenticated";

revoke update on table "public"."mission_application" from "authenticated";

revoke delete on table "public"."mission_application" from "service_role";

revoke insert on table "public"."mission_application" from "service_role";

revoke references on table "public"."mission_application" from "service_role";

revoke select on table "public"."mission_application" from "service_role";

revoke trigger on table "public"."mission_application" from "service_role";

revoke truncate on table "public"."mission_application" from "service_role";

revoke update on table "public"."mission_application" from "service_role";

revoke delete on table "public"."mission_canceled" from "anon";

revoke insert on table "public"."mission_canceled" from "anon";

revoke references on table "public"."mission_canceled" from "anon";

revoke select on table "public"."mission_canceled" from "anon";

revoke trigger on table "public"."mission_canceled" from "anon";

revoke truncate on table "public"."mission_canceled" from "anon";

revoke update on table "public"."mission_canceled" from "anon";

revoke delete on table "public"."mission_canceled" from "authenticated";

revoke insert on table "public"."mission_canceled" from "authenticated";

revoke references on table "public"."mission_canceled" from "authenticated";

revoke select on table "public"."mission_canceled" from "authenticated";

revoke trigger on table "public"."mission_canceled" from "authenticated";

revoke truncate on table "public"."mission_canceled" from "authenticated";

revoke update on table "public"."mission_canceled" from "authenticated";

revoke delete on table "public"."mission_canceled" from "service_role";

revoke insert on table "public"."mission_canceled" from "service_role";

revoke references on table "public"."mission_canceled" from "service_role";

revoke select on table "public"."mission_canceled" from "service_role";

revoke trigger on table "public"."mission_canceled" from "service_role";

revoke truncate on table "public"."mission_canceled" from "service_role";

revoke update on table "public"."mission_canceled" from "service_role";

revoke delete on table "public"."notification" from "anon";

revoke insert on table "public"."notification" from "anon";

revoke references on table "public"."notification" from "anon";

revoke select on table "public"."notification" from "anon";

revoke trigger on table "public"."notification" from "anon";

revoke truncate on table "public"."notification" from "anon";

revoke update on table "public"."notification" from "anon";

revoke delete on table "public"."notification" from "authenticated";

revoke insert on table "public"."notification" from "authenticated";

revoke references on table "public"."notification" from "authenticated";

revoke select on table "public"."notification" from "authenticated";

revoke trigger on table "public"."notification" from "authenticated";

revoke truncate on table "public"."notification" from "authenticated";

revoke update on table "public"."notification" from "authenticated";

revoke delete on table "public"."notification" from "service_role";

revoke insert on table "public"."notification" from "service_role";

revoke references on table "public"."notification" from "service_role";

revoke select on table "public"."notification" from "service_role";

revoke trigger on table "public"."notification" from "service_role";

revoke truncate on table "public"."notification" from "service_role";

revoke update on table "public"."notification" from "service_role";

revoke delete on table "public"."posts" from "anon";

revoke insert on table "public"."posts" from "anon";

revoke references on table "public"."posts" from "anon";

revoke select on table "public"."posts" from "anon";

revoke trigger on table "public"."posts" from "anon";

revoke truncate on table "public"."posts" from "anon";

revoke update on table "public"."posts" from "anon";

revoke delete on table "public"."posts" from "authenticated";

revoke insert on table "public"."posts" from "authenticated";

revoke references on table "public"."posts" from "authenticated";

revoke select on table "public"."posts" from "authenticated";

revoke trigger on table "public"."posts" from "authenticated";

revoke truncate on table "public"."posts" from "authenticated";

revoke update on table "public"."posts" from "authenticated";

revoke delete on table "public"."posts" from "service_role";

revoke insert on table "public"."posts" from "service_role";

revoke references on table "public"."posts" from "service_role";

revoke select on table "public"."posts" from "service_role";

revoke trigger on table "public"."posts" from "service_role";

revoke truncate on table "public"."posts" from "service_role";

revoke update on table "public"."posts" from "service_role";

revoke delete on table "public"."profile" from "anon";

revoke insert on table "public"."profile" from "anon";

revoke references on table "public"."profile" from "anon";

revoke select on table "public"."profile" from "anon";

revoke trigger on table "public"."profile" from "anon";

revoke truncate on table "public"."profile" from "anon";

revoke update on table "public"."profile" from "anon";

revoke delete on table "public"."profile" from "authenticated";

revoke insert on table "public"."profile" from "authenticated";

revoke references on table "public"."profile" from "authenticated";

revoke select on table "public"."profile" from "authenticated";

revoke trigger on table "public"."profile" from "authenticated";

revoke truncate on table "public"."profile" from "authenticated";

revoke update on table "public"."profile" from "authenticated";

revoke delete on table "public"."profile" from "service_role";

revoke insert on table "public"."profile" from "service_role";

revoke references on table "public"."profile" from "service_role";

revoke select on table "public"."profile" from "service_role";

revoke trigger on table "public"."profile" from "service_role";

revoke truncate on table "public"."profile" from "service_role";

revoke update on table "public"."profile" from "service_role";

revoke delete on table "public"."profile_education" from "anon";

revoke insert on table "public"."profile_education" from "anon";

revoke references on table "public"."profile_education" from "anon";

revoke select on table "public"."profile_education" from "anon";

revoke trigger on table "public"."profile_education" from "anon";

revoke truncate on table "public"."profile_education" from "anon";

revoke update on table "public"."profile_education" from "anon";

revoke delete on table "public"."profile_education" from "authenticated";

revoke insert on table "public"."profile_education" from "authenticated";

revoke references on table "public"."profile_education" from "authenticated";

revoke select on table "public"."profile_education" from "authenticated";

revoke trigger on table "public"."profile_education" from "authenticated";

revoke truncate on table "public"."profile_education" from "authenticated";

revoke update on table "public"."profile_education" from "authenticated";

revoke delete on table "public"."profile_education" from "service_role";

revoke insert on table "public"."profile_education" from "service_role";

revoke references on table "public"."profile_education" from "service_role";

revoke select on table "public"."profile_education" from "service_role";

revoke trigger on table "public"."profile_education" from "service_role";

revoke truncate on table "public"."profile_education" from "service_role";

revoke update on table "public"."profile_education" from "service_role";

revoke delete on table "public"."profile_experience" from "anon";

revoke insert on table "public"."profile_experience" from "anon";

revoke references on table "public"."profile_experience" from "anon";

revoke select on table "public"."profile_experience" from "anon";

revoke trigger on table "public"."profile_experience" from "anon";

revoke truncate on table "public"."profile_experience" from "anon";

revoke update on table "public"."profile_experience" from "anon";

revoke delete on table "public"."profile_experience" from "authenticated";

revoke insert on table "public"."profile_experience" from "authenticated";

revoke references on table "public"."profile_experience" from "authenticated";

revoke select on table "public"."profile_experience" from "authenticated";

revoke trigger on table "public"."profile_experience" from "authenticated";

revoke truncate on table "public"."profile_experience" from "authenticated";

revoke update on table "public"."profile_experience" from "authenticated";

revoke delete on table "public"."profile_experience" from "service_role";

revoke insert on table "public"."profile_experience" from "service_role";

revoke references on table "public"."profile_experience" from "service_role";

revoke select on table "public"."profile_experience" from "service_role";

revoke trigger on table "public"."profile_experience" from "service_role";

revoke truncate on table "public"."profile_experience" from "service_role";

revoke update on table "public"."profile_experience" from "service_role";

revoke delete on table "public"."profile_expertise" from "anon";

revoke insert on table "public"."profile_expertise" from "anon";

revoke references on table "public"."profile_expertise" from "anon";

revoke select on table "public"."profile_expertise" from "anon";

revoke trigger on table "public"."profile_expertise" from "anon";

revoke truncate on table "public"."profile_expertise" from "anon";

revoke update on table "public"."profile_expertise" from "anon";

revoke delete on table "public"."profile_expertise" from "authenticated";

revoke insert on table "public"."profile_expertise" from "authenticated";

revoke references on table "public"."profile_expertise" from "authenticated";

revoke select on table "public"."profile_expertise" from "authenticated";

revoke trigger on table "public"."profile_expertise" from "authenticated";

revoke truncate on table "public"."profile_expertise" from "authenticated";

revoke update on table "public"."profile_expertise" from "authenticated";

revoke delete on table "public"."profile_expertise" from "service_role";

revoke insert on table "public"."profile_expertise" from "service_role";

revoke references on table "public"."profile_expertise" from "service_role";

revoke select on table "public"."profile_expertise" from "service_role";

revoke trigger on table "public"."profile_expertise" from "service_role";

revoke truncate on table "public"."profile_expertise" from "service_role";

revoke update on table "public"."profile_expertise" from "service_role";

revoke delete on table "public"."profile_mission" from "anon";

revoke insert on table "public"."profile_mission" from "anon";

revoke references on table "public"."profile_mission" from "anon";

revoke select on table "public"."profile_mission" from "anon";

revoke trigger on table "public"."profile_mission" from "anon";

revoke truncate on table "public"."profile_mission" from "anon";

revoke update on table "public"."profile_mission" from "anon";

revoke delete on table "public"."profile_mission" from "authenticated";

revoke insert on table "public"."profile_mission" from "authenticated";

revoke references on table "public"."profile_mission" from "authenticated";

revoke select on table "public"."profile_mission" from "authenticated";

revoke trigger on table "public"."profile_mission" from "authenticated";

revoke truncate on table "public"."profile_mission" from "authenticated";

revoke update on table "public"."profile_mission" from "authenticated";

revoke delete on table "public"."profile_mission" from "service_role";

revoke insert on table "public"."profile_mission" from "service_role";

revoke references on table "public"."profile_mission" from "service_role";

revoke select on table "public"."profile_mission" from "service_role";

revoke trigger on table "public"."profile_mission" from "service_role";

revoke truncate on table "public"."profile_mission" from "service_role";

revoke update on table "public"."profile_mission" from "service_role";

revoke delete on table "public"."profile_status" from "anon";

revoke insert on table "public"."profile_status" from "anon";

revoke references on table "public"."profile_status" from "anon";

revoke select on table "public"."profile_status" from "anon";

revoke trigger on table "public"."profile_status" from "anon";

revoke truncate on table "public"."profile_status" from "anon";

revoke update on table "public"."profile_status" from "anon";

revoke delete on table "public"."profile_status" from "authenticated";

revoke insert on table "public"."profile_status" from "authenticated";

revoke references on table "public"."profile_status" from "authenticated";

revoke select on table "public"."profile_status" from "authenticated";

revoke trigger on table "public"."profile_status" from "authenticated";

revoke truncate on table "public"."profile_status" from "authenticated";

revoke update on table "public"."profile_status" from "authenticated";

revoke delete on table "public"."profile_status" from "service_role";

revoke insert on table "public"."profile_status" from "service_role";

revoke references on table "public"."profile_status" from "service_role";

revoke select on table "public"."profile_status" from "service_role";

revoke trigger on table "public"."profile_status" from "service_role";

revoke truncate on table "public"."profile_status" from "service_role";

revoke update on table "public"."profile_status" from "service_role";

revoke delete on table "public"."sectors" from "anon";

revoke insert on table "public"."sectors" from "anon";

revoke references on table "public"."sectors" from "anon";

revoke select on table "public"."sectors" from "anon";

revoke trigger on table "public"."sectors" from "anon";

revoke truncate on table "public"."sectors" from "anon";

revoke update on table "public"."sectors" from "anon";

revoke delete on table "public"."sectors" from "authenticated";

revoke insert on table "public"."sectors" from "authenticated";

revoke references on table "public"."sectors" from "authenticated";

revoke select on table "public"."sectors" from "authenticated";

revoke trigger on table "public"."sectors" from "authenticated";

revoke truncate on table "public"."sectors" from "authenticated";

revoke update on table "public"."sectors" from "authenticated";

revoke delete on table "public"."sectors" from "service_role";

revoke insert on table "public"."sectors" from "service_role";

revoke references on table "public"."sectors" from "service_role";

revoke select on table "public"."sectors" from "service_role";

revoke trigger on table "public"."sectors" from "service_role";

revoke truncate on table "public"."sectors" from "service_role";

revoke update on table "public"."sectors" from "service_role";

revoke delete on table "public"."specialties" from "anon";

revoke insert on table "public"."specialties" from "anon";

revoke references on table "public"."specialties" from "anon";

revoke select on table "public"."specialties" from "anon";

revoke trigger on table "public"."specialties" from "anon";

revoke truncate on table "public"."specialties" from "anon";

revoke update on table "public"."specialties" from "anon";

revoke delete on table "public"."specialties" from "authenticated";

revoke insert on table "public"."specialties" from "authenticated";

revoke references on table "public"."specialties" from "authenticated";

revoke select on table "public"."specialties" from "authenticated";

revoke trigger on table "public"."specialties" from "authenticated";

revoke truncate on table "public"."specialties" from "authenticated";

revoke update on table "public"."specialties" from "authenticated";

revoke delete on table "public"."specialties" from "service_role";

revoke insert on table "public"."specialties" from "service_role";

revoke references on table "public"."specialties" from "service_role";

revoke select on table "public"."specialties" from "service_role";

revoke trigger on table "public"."specialties" from "service_role";

revoke truncate on table "public"."specialties" from "service_role";

revoke update on table "public"."specialties" from "service_role";

revoke delete on table "public"."subjects" from "anon";

revoke insert on table "public"."subjects" from "anon";

revoke references on table "public"."subjects" from "anon";

revoke select on table "public"."subjects" from "anon";

revoke trigger on table "public"."subjects" from "anon";

revoke truncate on table "public"."subjects" from "anon";

revoke update on table "public"."subjects" from "anon";

revoke delete on table "public"."subjects" from "authenticated";

revoke insert on table "public"."subjects" from "authenticated";

revoke references on table "public"."subjects" from "authenticated";

revoke select on table "public"."subjects" from "authenticated";

revoke trigger on table "public"."subjects" from "authenticated";

revoke truncate on table "public"."subjects" from "authenticated";

revoke update on table "public"."subjects" from "authenticated";

revoke delete on table "public"."subjects" from "service_role";

revoke insert on table "public"."subjects" from "service_role";

revoke references on table "public"."subjects" from "service_role";

revoke select on table "public"."subjects" from "service_role";

revoke trigger on table "public"."subjects" from "service_role";

revoke truncate on table "public"."subjects" from "service_role";

revoke update on table "public"."subjects" from "service_role";

revoke delete on table "public"."user_alerts" from "anon";

revoke insert on table "public"."user_alerts" from "anon";

revoke references on table "public"."user_alerts" from "anon";

revoke select on table "public"."user_alerts" from "anon";

revoke trigger on table "public"."user_alerts" from "anon";

revoke truncate on table "public"."user_alerts" from "anon";

revoke update on table "public"."user_alerts" from "anon";

revoke delete on table "public"."user_alerts" from "authenticated";

revoke insert on table "public"."user_alerts" from "authenticated";

revoke references on table "public"."user_alerts" from "authenticated";

revoke select on table "public"."user_alerts" from "authenticated";

revoke trigger on table "public"."user_alerts" from "authenticated";

revoke truncate on table "public"."user_alerts" from "authenticated";

revoke update on table "public"."user_alerts" from "authenticated";

revoke delete on table "public"."user_alerts" from "service_role";

revoke insert on table "public"."user_alerts" from "service_role";

revoke references on table "public"."user_alerts" from "service_role";

revoke select on table "public"."user_alerts" from "service_role";

revoke trigger on table "public"."user_alerts" from "service_role";

revoke truncate on table "public"."user_alerts" from "service_role";

revoke update on table "public"."user_alerts" from "service_role";

alter table "public"."article" drop constraint "article_author_id_fkey";

alter table "public"."article" drop constraint "unique_slug";

alter table "public"."chat" drop constraint "chat_created_by_fkey";

alter table "public"."chat" drop constraint "chat_mission_id_fkey";

alter table "public"."chat" drop constraint "chat_receiver_id_fkey";

alter table "public"."chat" drop constraint "chk_xpert_recipient_id";

alter table "public"."contact_xpert_demands" drop constraint "contact_xpert_demands_asked_xpert_fkey";

alter table "public"."contact_xpert_demands" drop constraint "contact_xpert_demands_sent_by_fkey";

alter table "public"."message" drop constraint "message_answer_to_fkey";

alter table "public"."message" drop constraint "message_send_by_fkey";

alter table "public"."message" drop constraint "messages_chat_id_fkey";

alter table "public"."mission" drop constraint "mission_created_by_fkey";

alter table "public"."mission" drop constraint "mission_xpert_associated_id_fkey";

alter table "public"."mission_application" drop constraint "mission_application_candidate_id_fkey";

alter table "public"."mission_application" drop constraint "mission_application_mission_id_fkey";

alter table "public"."mission_canceled" drop constraint "mission_canceled_mission_fkey";

alter table "public"."notification" drop constraint "notification_chat_id_fkey";

alter table "public"."profile" drop constraint "profile_id_fkey";

alter table "public"."profile" drop constraint "profile_referent_id_fkey";

alter table "public"."profile" drop constraint "profile_username_key";

alter table "public"."profile" drop constraint "unique_generated_id";

alter table "public"."profile_education" drop constraint "profile_education_profile_id_fkey";

alter table "public"."profile_experience" drop constraint "profile_experience_profile_id_fkey";

alter table "public"."profile_expertise" drop constraint "profile_expertise_profile_id_fkey";

alter table "public"."profile_expertise" drop constraint "profile_expertise_profile_id_key";

alter table "public"."profile_mission" drop constraint "profile_mission_profile_id_fkey";

alter table "public"."profile_mission" drop constraint "profile_mission_profile_id_key";

alter table "public"."profile_status" drop constraint "profile_status_profile_id_fkey";

alter table "public"."profile_status" drop constraint "profile_status_profile_id_key";

alter table "public"."user_alerts" drop constraint "user_alerts_user_id_fkey";

drop type "public"."chat_files";

drop function if exists "public"."generate_mission_unique_id"();

drop function if exists "public"."generate_unique_id"();

drop function if exists "public"."generate_unique_id_f"();

drop function if exists "public"."generate_unique_slug"(input_text text, table_name text);

drop function if exists "public"."get_combined_data"();

drop function if exists "public"."get_full_profile"();

drop function if exists "public"."get_profile_other_languages"();

drop type "public"."habilitation_detail";

drop function if exists "public"."handle_new_user"();

drop type "public"."msg_files";

drop function if exists "public"."notify_email_confirmation"();

drop function if exists "public"."set_unique_slug"();

drop function if exists "public"."update_chat_timestamp"();

drop function if exists "public"."update_progression"();

alter table "public"."article" drop constraint "article_pkey";

alter table "public"."chat" drop constraint "chat_pkey";

alter table "public"."company_roles" drop constraint "company_roles_pkey";

alter table "public"."contact_xpert_demands" drop constraint "contact_xpert_demands_pkey";

alter table "public"."diplomas" drop constraint "diplomas_pkey";

alter table "public"."expertises" drop constraint "expertises_pkey";

alter table "public"."habilitations" drop constraint "habilitations_pkey";

alter table "public"."infrastructures" drop constraint "infrastructures_pkey";

alter table "public"."job_titles" drop constraint "job_titles_pkey";

alter table "public"."juridic_status" drop constraint "juridic_status_pkey";

alter table "public"."languages" drop constraint "languages_pkey";

alter table "public"."message" drop constraint "messages_pkey";

alter table "public"."mission" drop constraint "mission_pkey";

alter table "public"."mission_application" drop constraint "mission_application_pkey";

alter table "public"."mission_canceled" drop constraint "mission_canceled_pkey";

alter table "public"."notification" drop constraint "notifications_pkey";

alter table "public"."posts" drop constraint "posts_pkey";

alter table "public"."profile" drop constraint "profile_pkey";

alter table "public"."profile_education" drop constraint "profile_education_pkey";

alter table "public"."profile_experience" drop constraint "profile_experience_pkey";

alter table "public"."profile_expertise" drop constraint "expertise_pkey";

alter table "public"."profile_mission" drop constraint "profile_mission_pkey";

alter table "public"."profile_status" drop constraint "status_pkey";

alter table "public"."sectors" drop constraint "sectors_pkey";

alter table "public"."specialties" drop constraint "specialties_pkey";

alter table "public"."subjects" drop constraint "subjects_pkey";

alter table "public"."user_alerts" drop constraint "user_alerts_pkey";

drop index if exists "public"."article_pkey";

drop index if exists "public"."chat_pkey";

drop index if exists "public"."company_roles_pkey";

drop index if exists "public"."contact_xpert_demands_pkey";

drop index if exists "public"."diplomas_pkey";

drop index if exists "public"."expertise_pkey";

drop index if exists "public"."expertises_pkey";

drop index if exists "public"."habilitations_pkey";

drop index if exists "public"."infrastructures_pkey";

drop index if exists "public"."job_titles_pkey";

drop index if exists "public"."juridic_status_pkey";

drop index if exists "public"."languages_pkey";

drop index if exists "public"."messages_pkey";

drop index if exists "public"."mission_application_pkey";

drop index if exists "public"."mission_canceled_pkey";

drop index if exists "public"."mission_pkey";

drop index if exists "public"."notifications_pkey";

drop index if exists "public"."posts_pkey";

drop index if exists "public"."profile_education_pkey";

drop index if exists "public"."profile_experience_pkey";

drop index if exists "public"."profile_expertise_profile_id_key";

drop index if exists "public"."profile_mission_pkey";

drop index if exists "public"."profile_mission_profile_id_key";

drop index if exists "public"."profile_pkey";

drop index if exists "public"."profile_status_profile_id_key";

drop index if exists "public"."profile_username_key";

drop index if exists "public"."sectors_pkey";

drop index if exists "public"."specialties_pkey";

drop index if exists "public"."status_pkey";

drop index if exists "public"."subjects_pkey";

drop index if exists "public"."unique_generated_id";

drop index if exists "public"."unique_slug";

drop index if exists "public"."user_alerts_pkey";

drop table "public"."article";

drop table "public"."chat";

drop table "public"."company_roles";

drop table "public"."contact_xpert_demands";

drop table "public"."diplomas";

drop table "public"."expertises";

drop table "public"."habilitations";

drop table "public"."infrastructures";

drop table "public"."job_titles";

drop table "public"."juridic_status";

drop table "public"."languages";

drop table "public"."message";

drop table "public"."mission";

drop table "public"."mission_application";

drop table "public"."mission_canceled";

drop table "public"."notification";

drop table "public"."posts";

drop table "public"."profile";

drop table "public"."profile_education";

drop table "public"."profile_experience";

drop table "public"."profile_expertise";

drop table "public"."profile_mission";

drop table "public"."profile_status";

drop table "public"."sectors";

drop table "public"."specialties";

drop table "public"."subjects";

drop table "public"."user_alerts";

drop sequence if exists "public"."company_roles_id_seq";

drop sequence if exists "public"."diplomas_id_seq";

drop sequence if exists "public"."expertise_id_seq";

drop sequence if exists "public"."expertises_id_seq";

drop sequence if exists "public"."habilitations_id_seq";

drop sequence if exists "public"."infrastructures_id_seq";

drop sequence if exists "public"."job_titles_id_seq";

drop sequence if exists "public"."juridic_status_id_seq";

drop sequence if exists "public"."languages_id_seq";

drop sequence if exists "public"."posts_id_seq";

drop sequence if exists "public"."profile_education_id_seq";

drop sequence if exists "public"."profile_experience_id_seq";

drop sequence if exists "public"."profile_mission_id_seq";

drop sequence if exists "public"."sectors_id_seq";

drop sequence if exists "public"."specialties_id_seq";

drop sequence if exists "public"."status_id_seq";

drop sequence if exists "public"."subjects_id_seq";

drop type "public"."article_status";

drop type "public"."categories";

drop type "public"."chat_type";

drop type "public"."mission_state";

drop type "public"."revenu_type";

drop extension if exists "unaccent";


