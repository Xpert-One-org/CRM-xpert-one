create type "public"."reason_mission_deletion" as enum ('status_candidate_not_found', 'won_competition', 'mission_suspended_by_supplier', 'other');

alter table "public"."mission" add column "reason_deletion" reason_mission_deletion;


