CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();


create policy "Allow Read + Insert to auth 1n0bjoh_0 1n0bjoh_0 14rm0as_0"
on "storage"."objects"
as permissive
for select
to public
using ((bucket_id = 'mission_files'::text));


create policy "Allow Read + Insert to auth 1n0bjoh_0 1n0bjoh_0 14rm0as_1"
on "storage"."objects"
as permissive
for insert
to public
with check ((bucket_id = 'mission_files'::text));


create policy "Allow Read + Insert to auth 1n0bjoh_0 1n0bjoh_0 14rm0as_2"
on "storage"."objects"
as permissive
for update
to public
using ((bucket_id = 'mission_files'::text));


create policy "Allow Read + Insert to auth 1n0bjoh_0 1n0bjoh_0 1n0bjoh_0"
on "storage"."objects"
as permissive
for select
to public
using ((bucket_id = 'profile_files'::text));


create policy "Allow Read + Insert to auth 1n0bjoh_0 1n0bjoh_0 1n0bjoh_1"
on "storage"."objects"
as permissive
for insert
to public
with check ((bucket_id = 'profile_files'::text));


create policy "Allow Read + Insert to auth 1n0bjoh_0 1n0bjoh_0 1n0bjoh_2"
on "storage"."objects"
as permissive
for update
to public
using ((bucket_id = 'profile_files'::text));


create policy "Allow Read auth 1n0bjoh_0 1n0bjoh_0 1zbfv_0"
on "storage"."objects"
as permissive
for select
to public
using ((bucket_id = 'logo'::text));


create policy "Allow select and insert for auth 1tf88_0 1tf88_0"
on "storage"."objects"
as permissive
for select
to authenticated
using ((bucket_id = 'chat'::text));


create policy "Allow select and insert for auth 1tf88_0 1tf88_1"
on "storage"."objects"
as permissive
for insert
to authenticated
with check ((bucket_id = 'chat'::text));