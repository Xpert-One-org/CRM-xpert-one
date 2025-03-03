drop policy "Enable update for users based on email or admin" on "public"."profile";

create policy "Enable update for users based on email or admin"
on "public"."profile"
as permissive
for update
to authenticated
using (((auth.uid() = id) OR (EXISTS ( SELECT 1
   FROM profile profile_1
  WHERE ((profile_1.id = auth.uid()) AND (profile_1.role = ANY (ARRAY['admin'::profile_roles, 'project_manager'::profile_roles, 'intern'::profile_roles])))))));



