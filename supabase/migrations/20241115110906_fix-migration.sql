revoke delete on table "public"."new_table" from "anon";

revoke insert on table "public"."new_table" from "anon";

revoke references on table "public"."new_table" from "anon";

revoke select on table "public"."new_table" from "anon";

revoke trigger on table "public"."new_table" from "anon";

revoke truncate on table "public"."new_table" from "anon";

revoke update on table "public"."new_table" from "anon";

revoke delete on table "public"."new_table" from "authenticated";

revoke insert on table "public"."new_table" from "authenticated";

revoke references on table "public"."new_table" from "authenticated";

revoke select on table "public"."new_table" from "authenticated";

revoke trigger on table "public"."new_table" from "authenticated";

revoke truncate on table "public"."new_table" from "authenticated";

revoke update on table "public"."new_table" from "authenticated";

revoke delete on table "public"."new_table" from "service_role";

revoke insert on table "public"."new_table" from "service_role";

revoke references on table "public"."new_table" from "service_role";

revoke select on table "public"."new_table" from "service_role";

revoke trigger on table "public"."new_table" from "service_role";

revoke truncate on table "public"."new_table" from "service_role";

revoke update on table "public"."new_table" from "service_role";

alter table "public"."new_table" drop constraint "new_table_pkey";

drop index if exists "public"."new_table_pkey";

drop table "public"."new_table";

alter table "public"."user_alerts" drop column "public_profile_test";


