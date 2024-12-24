CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();

CREATE TRIGGER on_email_confirmation AFTER UPDATE OF confirmed_at ON auth.users FOR EACH ROW WHEN ((new.confirmed_at IS NOT NULL)) EXECUTE FUNCTION notify_email_confirmation();


grant delete on table "storage"."s3_multipart_uploads" to "postgres";

grant insert on table "storage"."s3_multipart_uploads" to "postgres";

grant references on table "storage"."s3_multipart_uploads" to "postgres";

grant select on table "storage"."s3_multipart_uploads" to "postgres";

grant trigger on table "storage"."s3_multipart_uploads" to "postgres";

grant truncate on table "storage"."s3_multipart_uploads" to "postgres";

grant update on table "storage"."s3_multipart_uploads" to "postgres";

grant delete on table "storage"."s3_multipart_uploads_parts" to "postgres";

grant insert on table "storage"."s3_multipart_uploads_parts" to "postgres";

grant references on table "storage"."s3_multipart_uploads_parts" to "postgres";

grant select on table "storage"."s3_multipart_uploads_parts" to "postgres";

grant trigger on table "storage"."s3_multipart_uploads_parts" to "postgres";

grant truncate on table "storage"."s3_multipart_uploads_parts" to "postgres";

grant update on table "storage"."s3_multipart_uploads_parts" to "postgres";

create policy " Allow Read + Insert to auth 1n0bjoh_0 1n0bjoh_0 14rm0as_0"
on "storage"."objects"
as permissive
for insert
to public
with check ((bucket_id = 'mission_files'::text));


create policy " Allow Read + Insert to auth 1n0bjoh_0 1n0bjoh_0 14rm0as_1"
on "storage"."objects"
as permissive
for select
to public
using ((bucket_id = 'mission_files'::text));


create policy " Allow Read + Insert to auth 1n0bjoh_0 1n0bjoh_0 14rm0as_2"
on "storage"."objects"
as permissive
for update
to public
using ((bucket_id = 'mission_files'::text));


create policy " Allow Read + Insert to auth 1n0bjoh_0 1n0bjoh_0"
on "storage"."objects"
as permissive
for select
to public
using ((bucket_id = 'profile_files'::text));


create policy " Allow Read + Insert to auth 1n0bjoh_0 1n0bjoh_1"
on "storage"."objects"
as permissive
for insert
to public
with check ((bucket_id = 'profile_files'::text));


create policy " Allow Read + Insert to auth 1n0bjoh_0 1n0bjoh_2"
on "storage"."objects"
as permissive
for update
to public
using ((bucket_id = 'profile_files'::text));


create policy "Allow Select  1zbfv_0"
on "storage"."objects"
as permissive
for select
to public
using ((bucket_id = 'logo'::text));


create policy "Allow select and insert for auth 1tf88_0"
on "storage"."objects"
as permissive
for insert
to authenticated
with check ((bucket_id = 'chat'::text));


create policy "Allow select and insert for auth 1tf88_1"
on "storage"."objects"
as permissive
for select
to authenticated
using ((bucket_id = 'chat'::text));


create policy "Delete mission file 14rm0as_0"
on "storage"."objects"
as permissive
for delete
to public
using ((bucket_id = 'mission_files'::text));



