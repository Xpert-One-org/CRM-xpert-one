create type "public"."article_type" as enum ('web', 'link', 'press');

alter table "public"."article" add column "type" article_type not null default 'web'::article_type;

alter table "public"."article" add column "url" text;


