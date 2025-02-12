create table profile_deleted (
  id uuid default uuid_generate_v4() primary key,
  deleted_by uuid references auth.users(id),
  reason text not null,
  deleted_at timestamp with time zone default now(),
  deleted_profile_generated_id text not null
);

create policy "Enable all access for admins"
  on profile_deleted
  using (auth.jwt() ->> 'role' = 'admin'); 