SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.6
-- Dumped by pg_dump version 15.7 (Ubuntu 15.7-1.pgdg20.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") VALUES
	('00000000-0000-0000-0000-000000000000', 'a1460fa3-7f78-47b1-ad67-896e8e5e2862', '{"action":"user_signedup","actor_id":"186a1e18-f9f4-488a-85cd-8fe348aca58d","actor_username":"j.michael@agweb-communication.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2024-10-09 13:05:59.73967+00', ''),
	('00000000-0000-0000-0000-000000000000', '86af930d-fb80-4d43-8de0-a78d1561220d', '{"action":"login","actor_id":"186a1e18-f9f4-488a-85cd-8fe348aca58d","actor_username":"j.michael@agweb-communication.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-09 13:05:59.74587+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c8a258f4-6792-4adf-b45a-ee2d4edd65b2', '{"action":"logout","actor_id":"186a1e18-f9f4-488a-85cd-8fe348aca58d","actor_username":"j.michael@agweb-communication.com","actor_via_sso":false,"log_type":"account"}', '2024-10-09 13:08:32.406455+00', ''),
	('00000000-0000-0000-0000-000000000000', '7f1384b7-e122-44aa-80ce-df586e316882', '{"action":"login","actor_id":"186a1e18-f9f4-488a-85cd-8fe348aca58d","actor_username":"j.michael@agweb-communication.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-09 13:08:43.27259+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f07cd72b-3208-488d-aa6f-d4a62e3f9bd6', '{"action":"logout","actor_id":"186a1e18-f9f4-488a-85cd-8fe348aca58d","actor_username":"j.michael@agweb-communication.com","actor_via_sso":false,"log_type":"account"}', '2024-10-09 13:08:47.017763+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b2d297f0-eca5-4835-9748-d74e14f0d05b', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"j.michael@agweb-communication.com","user_id":"186a1e18-f9f4-488a-85cd-8fe348aca58d","user_phone":""}}', '2024-10-09 13:08:59.533602+00', ''),
	('00000000-0000-0000-0000-000000000000', '2f09adb2-0462-43f3-9a91-1026676385b0', '{"action":"user_signedup","actor_id":"f853fa14-247a-406a-b4d7-469dbbb28c4c","actor_username":"j.michael@agweb-communication.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2024-10-09 13:11:22.698187+00', ''),
	('00000000-0000-0000-0000-000000000000', '2a1b697c-ce63-4bf6-8659-1407e2605f2b', '{"action":"login","actor_id":"f853fa14-247a-406a-b4d7-469dbbb28c4c","actor_username":"j.michael@agweb-communication.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-09 13:11:22.70133+00', ''),
	('00000000-0000-0000-0000-000000000000', '59367039-6946-4d96-b6ce-b6bb3f59ba5a', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"j.michael@agweb-communication.com","user_id":"f853fa14-247a-406a-b4d7-469dbbb28c4c","user_phone":""}}', '2024-10-09 13:11:54.927326+00', ''),
	('00000000-0000-0000-0000-000000000000', '09bafb67-f62e-4f0f-85eb-fb9d9cfcb1f0', '{"action":"user_signedup","actor_id":"bba3fcbe-c509-43d1-b5d2-090c3298c8f8","actor_username":"j.michael@agweb-communication.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2024-10-09 14:12:15.395413+00', ''),
	('00000000-0000-0000-0000-000000000000', '20256652-954e-4353-a770-ec72e4b26855', '{"action":"login","actor_id":"bba3fcbe-c509-43d1-b5d2-090c3298c8f8","actor_username":"j.michael@agweb-communication.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-09 14:12:15.399639+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e963da3a-dbd2-4086-8b8d-3643a8dca608', '{"action":"token_refreshed","actor_id":"bba3fcbe-c509-43d1-b5d2-090c3298c8f8","actor_username":"j.michael@agweb-communication.com","actor_via_sso":false,"log_type":"token"}', '2024-10-09 15:50:11.240761+00', ''),
	('00000000-0000-0000-0000-000000000000', '1df7a913-6b45-4862-8ebb-304e2b4194ed', '{"action":"token_revoked","actor_id":"bba3fcbe-c509-43d1-b5d2-090c3298c8f8","actor_username":"j.michael@agweb-communication.com","actor_via_sso":false,"log_type":"token"}', '2024-10-09 15:50:11.242303+00', ''),
	('00000000-0000-0000-0000-000000000000', '041cfd03-fc01-4219-b3fe-29ad3bad1e6b', '{"action":"logout","actor_id":"bba3fcbe-c509-43d1-b5d2-090c3298c8f8","actor_username":"j.michael@agweb-communication.com","actor_via_sso":false,"log_type":"account"}', '2024-10-09 15:50:17.428504+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd453c001-ed61-4045-a7b6-33f1b9109ca2', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"j.michael@agweb-communication.com","user_id":"bba3fcbe-c509-43d1-b5d2-090c3298c8f8","user_phone":""}}', '2024-10-09 15:50:29.098924+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bdea0690-e4ab-4c90-8285-163e094a5968', '{"action":"user_signedup","actor_id":"8be89c56-a351-44fb-9013-afcaefb67f79","actor_username":"j.michael@agweb-communication.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2024-10-09 15:51:03.162358+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c06e5d31-4509-4b8a-a685-fe834fbbc8cb', '{"action":"login","actor_id":"8be89c56-a351-44fb-9013-afcaefb67f79","actor_username":"j.michael@agweb-communication.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-09 15:51:03.165086+00', ''),
	('00000000-0000-0000-0000-000000000000', '2c8ef707-caf6-4857-910c-4988b6885f1b', '{"action":"token_refreshed","actor_id":"8be89c56-a351-44fb-9013-afcaefb67f79","actor_username":"j.michael@agweb-communication.com","actor_via_sso":false,"log_type":"token"}', '2024-10-09 16:54:37.948477+00', ''),
	('00000000-0000-0000-0000-000000000000', '308e098a-6efe-4365-88d6-abfd255bb8b8', '{"action":"token_revoked","actor_id":"8be89c56-a351-44fb-9013-afcaefb67f79","actor_username":"j.michael@agweb-communication.com","actor_via_sso":false,"log_type":"token"}', '2024-10-09 16:54:37.950416+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd3ee9b9e-c188-41ec-87cd-bbcb81515c82', '{"action":"token_refreshed","actor_id":"8be89c56-a351-44fb-9013-afcaefb67f79","actor_username":"j.michael@agweb-communication.com","actor_via_sso":false,"log_type":"token"}', '2024-10-09 18:13:34.83219+00', ''),
	('00000000-0000-0000-0000-000000000000', '99ed56c2-590f-4817-b85c-00c3a2937dd4', '{"action":"token_revoked","actor_id":"8be89c56-a351-44fb-9013-afcaefb67f79","actor_username":"j.michael@agweb-communication.com","actor_via_sso":false,"log_type":"token"}', '2024-10-09 18:13:34.833036+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b25a9d4b-ae3d-42dc-8e6a-859ae3bf0599', '{"action":"logout","actor_id":"8be89c56-a351-44fb-9013-afcaefb67f79","actor_username":"j.michael@agweb-communication.com","actor_via_sso":false,"log_type":"account"}', '2024-10-09 18:13:51.4674+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bdcc1323-fbe2-429c-8af6-582f0b862304', '{"action":"user_signedup","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2024-10-09 18:14:24.346444+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a613cac4-01dc-4626-9a2c-4b0f43efaba6', '{"action":"login","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-09 18:14:24.349372+00', ''),
	('00000000-0000-0000-0000-000000000000', '70f08f7d-d4a1-4a81-b6fe-ae10fc4d4ba5', '{"action":"logout","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-10-09 18:15:11.882685+00', ''),
	('00000000-0000-0000-0000-000000000000', '28e4d159-a85e-4fe8-a60b-508946620164', '{"action":"login","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-09 18:15:27.394169+00', ''),
	('00000000-0000-0000-0000-000000000000', '8e29368e-aaf7-4303-9d89-bbf09dedd62b', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 08:02:52.037673+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c0e316f7-0384-4c50-bcf2-55d2091b7cbe', '{"action":"token_revoked","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 08:02:52.043021+00', ''),
	('00000000-0000-0000-0000-000000000000', '581ee5a8-29f5-49ec-bdd9-b31e0768775a', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 08:02:53.098941+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a4403072-422d-4b45-9ff3-165a0a0baee5', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 08:02:53.264163+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd5267f6b-b3d3-4bb2-93d3-8873ff30313c', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 08:02:53.50463+00', ''),
	('00000000-0000-0000-0000-000000000000', '164e76bf-196c-4ba9-8818-d973cc776e6c', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 08:02:54.471838+00', ''),
	('00000000-0000-0000-0000-000000000000', '2dc1e5a6-c253-4a4b-bb54-2d605166f0b1', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 08:02:54.654353+00', ''),
	('00000000-0000-0000-0000-000000000000', '5086fca7-a908-43cd-9ab9-834cad81a5f0', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 08:02:54.697431+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f95f6e9b-77f0-4cd0-9e9a-888b321bcf5a', '{"action":"logout","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-10-10 08:14:08.560089+00', ''),
	('00000000-0000-0000-0000-000000000000', '2ede8374-f7d5-43e7-9e7b-b66a9ff5d02d', '{"action":"login","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-10 08:19:38.839093+00', ''),
	('00000000-0000-0000-0000-000000000000', '9ed5091d-d03f-4edd-ab96-231a40e88681', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 09:19:38.129142+00', ''),
	('00000000-0000-0000-0000-000000000000', '3c6d7e09-14c3-451f-9c4b-e3e72bd14660', '{"action":"token_revoked","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 09:19:38.132483+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e78a3cbe-297f-4b8c-bba6-3c64a9f07172', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 09:19:38.296231+00', ''),
	('00000000-0000-0000-0000-000000000000', '645f3e34-5012-4ed5-94ec-15a74e88ab56', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 09:19:49.99974+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cb3e05c8-1b6b-4ded-89a7-bea296c804a1', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 09:19:50.173007+00', ''),
	('00000000-0000-0000-0000-000000000000', '0ec8f49e-5536-49d2-9b74-2a2b9ecc4983', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 09:19:57.230149+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e3efeb75-d6f8-4962-a5de-d25a5fe85d34', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 09:19:57.423871+00', ''),
	('00000000-0000-0000-0000-000000000000', '2e89b21f-6d7b-43c2-92ef-c2f3570f0576', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 09:20:04.401714+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd4f2467e-118e-4da0-b0fb-c4c8bc595b6b', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 09:20:04.56563+00', ''),
	('00000000-0000-0000-0000-000000000000', '8919ebf2-41b7-45ee-876b-10fbc6f12a9c', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 09:20:21.573585+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bccf6399-6430-4c5c-9178-4cb997efd018', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 09:20:21.72725+00', ''),
	('00000000-0000-0000-0000-000000000000', '4590fe98-ed28-4a2c-bf12-bb9792943472', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 09:20:41.966849+00', ''),
	('00000000-0000-0000-0000-000000000000', '3eb0b7ed-f7a9-482f-80f8-94f3ce397dc7', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 09:20:42.152297+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fb39319a-d664-419c-8afd-0f9893fa738a', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 09:20:52.117699+00', ''),
	('00000000-0000-0000-0000-000000000000', '8febb17c-4e9d-41ec-853e-4843ae992add', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 09:20:52.296656+00', ''),
	('00000000-0000-0000-0000-000000000000', '9881513a-185e-4007-b1d5-0f6c16aa3e00', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 09:21:32.357648+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c719fe9f-d299-4470-b4a2-a48cf64569a7', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 09:21:32.581671+00', ''),
	('00000000-0000-0000-0000-000000000000', '1bcc2b1e-8eb3-4890-b17d-25faacc67dc9', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 09:21:33.701712+00', ''),
	('00000000-0000-0000-0000-000000000000', '56e940c9-bd00-424c-a5fa-ff99bc303d48', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 09:21:33.863202+00', ''),
	('00000000-0000-0000-0000-000000000000', '63e83d7a-19e4-4693-a0fa-04406f5d55bf', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 09:21:37.661883+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c1e0e123-6254-4c1a-be92-990fcda860b1', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 09:21:37.789878+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bab1b62e-e12f-4285-b88f-f208a1f3fcfe', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 09:22:09.285779+00', ''),
	('00000000-0000-0000-0000-000000000000', 'feab18c1-9d10-44ca-8288-d68d7808ec7e', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 09:22:09.461874+00', ''),
	('00000000-0000-0000-0000-000000000000', '5187414e-3c87-4664-adb5-b87c2b9900a5', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 09:22:09.471953+00', ''),
	('00000000-0000-0000-0000-000000000000', 'db13f3c4-6545-48f7-9c31-5e2c3b4ff426', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 09:22:10.302075+00', ''),
	('00000000-0000-0000-0000-000000000000', '58126ec8-43e7-4183-9759-c7308339f02c', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 09:22:10.463709+00', ''),
	('00000000-0000-0000-0000-000000000000', '96e140ff-5fec-4260-a90c-2f01858bf79f', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 09:22:10.605673+00', ''),
	('00000000-0000-0000-0000-000000000000', '54d88555-37d4-444d-8a22-1621a873a9bf', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 09:22:10.627115+00', ''),
	('00000000-0000-0000-0000-000000000000', '52bb35db-82a7-49ef-95fa-4e889a10aacd', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 10:26:24.386232+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fc038b5f-2658-45c3-8ec8-d11e120a3686', '{"action":"token_revoked","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 10:26:24.387666+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bc072845-ad3f-4c14-9969-213380163cbe', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 10:26:24.685382+00', ''),
	('00000000-0000-0000-0000-000000000000', 'dca541b3-88e4-440f-9959-63a1e92de1b0', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 10:26:25.306645+00', ''),
	('00000000-0000-0000-0000-000000000000', '2516fdfc-6a7b-4e9c-b64a-acd87adcaef3', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 10:26:25.8434+00', ''),
	('00000000-0000-0000-0000-000000000000', '4df719dd-dbb1-40ec-b8e8-de9a274b6c60', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 11:37:41.777775+00', ''),
	('00000000-0000-0000-0000-000000000000', '02809791-c8be-412c-8ffd-312371086009', '{"action":"token_revoked","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 11:37:41.779183+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c93ff681-14c5-4238-b298-3aabef2c6c74', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 11:37:42.076423+00', ''),
	('00000000-0000-0000-0000-000000000000', '38c216b9-6def-4003-80d7-7a8ef5d634b1', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 11:37:42.253235+00', ''),
	('00000000-0000-0000-0000-000000000000', '6933cf87-a08b-40b2-b2d2-445bef55d04d', '{"action":"logout","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-10-10 11:48:15.190358+00', ''),
	('00000000-0000-0000-0000-000000000000', 'daa84ec3-cbbe-48b1-bb3a-2b15fd36424c', '{"action":"user_repeated_signup","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2024-10-10 11:48:52.673617+00', ''),
	('00000000-0000-0000-0000-000000000000', '96585478-4451-4ceb-bd2b-64fa2029352a', '{"action":"user_signedup","actor_id":"12bf2774-968c-4434-befa-83577a278b99","actor_username":"michael.jerance.xpert@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2024-10-10 11:49:00.200356+00', ''),
	('00000000-0000-0000-0000-000000000000', '3f18a002-41db-4f05-b8a2-63e4008f1dd1', '{"action":"login","actor_id":"12bf2774-968c-4434-befa-83577a278b99","actor_username":"michael.jerance.xpert@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-10 11:49:00.204307+00', ''),
	('00000000-0000-0000-0000-000000000000', '5d22005d-ee46-4351-a9c5-9df3be5cf079', '{"action":"logout","actor_id":"12bf2774-968c-4434-befa-83577a278b99","actor_username":"michael.jerance.xpert@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-10-10 12:10:07.977383+00', ''),
	('00000000-0000-0000-0000-000000000000', '31e328a8-867d-4555-838c-5027ff81b435', '{"action":"login","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-10 12:10:29.693212+00', ''),
	('00000000-0000-0000-0000-000000000000', '74646a7c-862a-45b8-9733-b401910e2225', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 13:11:26.276493+00', ''),
	('00000000-0000-0000-0000-000000000000', '6ed7bb7a-1abc-4615-ae60-97fe54597e54', '{"action":"token_revoked","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 13:11:26.282591+00', ''),
	('00000000-0000-0000-0000-000000000000', '0645a07a-7eb1-4159-b423-1fdc1ec6f60b', '{"action":"login","actor_id":"8be89c56-a351-44fb-9013-afcaefb67f79","actor_username":"j.michael@agweb-communication.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-10 13:56:16.247025+00', ''),
	('00000000-0000-0000-0000-000000000000', '43c667e6-e001-417f-ab36-9f01520920b6', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 14:12:54.133516+00', ''),
	('00000000-0000-0000-0000-000000000000', 'af397a77-ab59-43f8-914e-277182914388', '{"action":"token_revoked","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 14:12:54.13502+00', ''),
	('00000000-0000-0000-0000-000000000000', '09f32ce5-0224-4baf-9a5a-de99c6de8d86', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 14:12:54.385215+00', ''),
	('00000000-0000-0000-0000-000000000000', '6189eec0-cd92-44b0-95d3-ed8ba4448f34', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 14:13:05.252467+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd769bb95-a816-4fef-b0e6-e1639e2e8ca7', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 14:13:05.4742+00', ''),
	('00000000-0000-0000-0000-000000000000', '6435f773-11be-4066-8fa4-9b3e6dabf9c9', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 14:13:15.533463+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e8088f45-d490-47b8-a8a6-c3abe19fee21', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 14:13:15.795426+00', ''),
	('00000000-0000-0000-0000-000000000000', '72018ff4-8ebd-4252-b5f2-e8d12290d320', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 14:14:32.303717+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c13f1d2a-b074-4860-8aa2-c3162b7eb876', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 14:14:32.545272+00', ''),
	('00000000-0000-0000-0000-000000000000', '8735e1eb-e741-4f5a-8e59-6625b1511fd0', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 14:14:45.701791+00', ''),
	('00000000-0000-0000-0000-000000000000', 'df1b8259-0a9d-4463-bae1-c30923026f8f', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 14:14:45.936387+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd4a9720d-e155-49d3-85bf-7a4466d3ed7f', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 14:16:15.224917+00', ''),
	('00000000-0000-0000-0000-000000000000', '0303f99d-c800-44ea-9d17-709196eefa17', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 14:16:15.707323+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd500035c-110a-42cc-9460-a68d40168166', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 14:17:32.137322+00', ''),
	('00000000-0000-0000-0000-000000000000', '26054486-4959-41ed-8cc1-cf1aff831bc4', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 14:17:32.324369+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e31b553c-723f-41f6-bcf9-26d23e07c85a', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 14:17:40.360322+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a008b3de-bfce-4998-a6c4-e2b8dfe949a9', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 14:17:40.534075+00', ''),
	('00000000-0000-0000-0000-000000000000', '29c272f8-74bf-4e2c-93f9-2731f0cee15d', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 14:18:11.427843+00', ''),
	('00000000-0000-0000-0000-000000000000', '3654d4f2-4578-4155-b52a-8dff81055dec', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 14:18:11.624989+00', ''),
	('00000000-0000-0000-0000-000000000000', '225eb21f-2f6a-4511-bf6a-f87294c6d7a2', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 14:18:14.002647+00', ''),
	('00000000-0000-0000-0000-000000000000', '844320aa-a6ed-4aec-8e55-a576e8f02446', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 14:18:14.154895+00', ''),
	('00000000-0000-0000-0000-000000000000', 'dd668f9b-49c2-4071-b053-622ad8fd8c24', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 14:18:15.142235+00', ''),
	('00000000-0000-0000-0000-000000000000', '1eba497b-c833-4ffc-8a5c-73ef5ee4cafc', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 14:18:15.285517+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a6fe8f95-9041-4e1b-8c65-2a6f06e220d6', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 14:19:12.1369+00', ''),
	('00000000-0000-0000-0000-000000000000', '848e8465-d8e7-4bfd-99e8-5978a7a6f86d', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 14:19:12.467093+00', ''),
	('00000000-0000-0000-0000-000000000000', '45f00451-443e-4968-b306-5dbacd2dd786', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 14:20:05.113694+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ebd35b61-12ca-432a-88b5-a21c47ce64ff', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 14:20:05.430554+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f6b6fce4-ce58-4638-9bbb-2790c062d343', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 14:20:50.38948+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd3315e3a-a365-4d13-9200-5b7e0911db48', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 14:20:50.585695+00', ''),
	('00000000-0000-0000-0000-000000000000', '2f3be2e4-2cf2-4a6b-9035-a0e843b8ccf4', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 14:21:22.540826+00', ''),
	('00000000-0000-0000-0000-000000000000', '31825f54-2e15-4e5b-9499-c032c9fd5ae1', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 14:21:22.965819+00', ''),
	('00000000-0000-0000-0000-000000000000', '938bc7e7-55a3-4698-b871-ab5c8c949014', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 14:21:52.339328+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a841f781-ef24-4fa3-b77d-5cc86792c008', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 14:21:52.599177+00', ''),
	('00000000-0000-0000-0000-000000000000', '5b838f56-af31-4215-a01c-2011d471aa6b', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 14:22:05.155275+00', ''),
	('00000000-0000-0000-0000-000000000000', '440c93cc-8de5-4f37-943c-d6c49e2b2671', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 14:22:05.382901+00', ''),
	('00000000-0000-0000-0000-000000000000', '4b15ea49-376b-4776-8355-71b4c4530d73', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 14:22:21.483648+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fd040ebc-5fcf-4c65-8fbe-fab5c4c67000', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 14:22:21.534369+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a6455ecb-b7cd-4ac9-ba24-addcedfad3ba', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 14:22:21.801481+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd8f22a10-a18e-4c0b-9951-63961b4899b5', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 14:22:21.880464+00', ''),
	('00000000-0000-0000-0000-000000000000', '1fbe5a15-57f2-4717-8352-7ba5d97a75a8', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 14:22:22.94744+00', ''),
	('00000000-0000-0000-0000-000000000000', '999cfb0e-730f-41ce-8f86-61d9571d9231', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 14:22:23.847637+00', ''),
	('00000000-0000-0000-0000-000000000000', '4e16020a-fd52-4a64-b0fa-9e33013f3fe1', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 14:22:23.85375+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f52656c7-8404-4fc7-bcf7-65ae489c987c', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 14:22:24.176928+00', ''),
	('00000000-0000-0000-0000-000000000000', '1016b3b1-c0b1-4d11-b8d9-017cd03a0e3e', '{"action":"token_refreshed","actor_id":"8be89c56-a351-44fb-9013-afcaefb67f79","actor_username":"j.michael@agweb-communication.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 17:55:04.571586+00', ''),
	('00000000-0000-0000-0000-000000000000', '2cd44299-4e10-4e65-afa1-73f4792e8ad4', '{"action":"token_revoked","actor_id":"8be89c56-a351-44fb-9013-afcaefb67f79","actor_username":"j.michael@agweb-communication.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 17:55:04.573732+00', ''),
	('00000000-0000-0000-0000-000000000000', 'efa8d51c-8624-4351-a99a-508b1e7dc3c7', '{"action":"token_refreshed","actor_id":"8be89c56-a351-44fb-9013-afcaefb67f79","actor_username":"j.michael@agweb-communication.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 18:54:59.766194+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e353526c-1726-423c-9319-c86483cfb78e', '{"action":"token_revoked","actor_id":"8be89c56-a351-44fb-9013-afcaefb67f79","actor_username":"j.michael@agweb-communication.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 18:54:59.768103+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ab096913-a75c-49b6-9931-51ac72766176', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 18:55:05.01123+00', ''),
	('00000000-0000-0000-0000-000000000000', '591c0ca4-2637-411b-9346-053ba742c9d5', '{"action":"token_revoked","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 18:55:05.011792+00', ''),
	('00000000-0000-0000-0000-000000000000', '77792830-b8eb-4d19-8e8c-9374fe0ff4f9', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 18:55:05.291588+00', ''),
	('00000000-0000-0000-0000-000000000000', '75000514-8143-4d4d-b1fe-90a8d22a6ea6', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 18:55:05.579983+00', ''),
	('00000000-0000-0000-0000-000000000000', '7e9b5362-ec6c-4460-bc4c-35bad3c40e9b', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 18:55:05.605135+00', ''),
	('00000000-0000-0000-0000-000000000000', '064ab971-e98d-4ab6-8645-752e35691c09', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 18:55:05.750083+00', ''),
	('00000000-0000-0000-0000-000000000000', '30b9bf09-dfa5-47f7-87f2-0854024c1560', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 18:55:06.084619+00', ''),
	('00000000-0000-0000-0000-000000000000', '460d3adb-b50c-464c-9152-e3cbbceebf8c', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 18:55:06.24365+00', ''),
	('00000000-0000-0000-0000-000000000000', '1e524f3f-6516-4a64-92ec-29f7c5a4d29a', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 18:55:06.250929+00', ''),
	('00000000-0000-0000-0000-000000000000', 'de41f391-367d-48b8-8ccb-f7170933ca5c', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 19:55:06.703564+00', ''),
	('00000000-0000-0000-0000-000000000000', '02c4720c-2fa1-4e8e-9129-773fd7768fc1', '{"action":"token_revoked","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 19:55:06.706011+00', ''),
	('00000000-0000-0000-0000-000000000000', '7b7d22c8-5a6b-4e2a-a6b5-3dfa1e808140', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 19:55:07.125176+00', ''),
	('00000000-0000-0000-0000-000000000000', '084a7f4b-c01b-49da-adfd-90e447e4567d', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 19:55:07.882565+00', ''),
	('00000000-0000-0000-0000-000000000000', '82827186-9c02-4c71-b15a-f69566d1c8ff', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 19:55:08.084291+00', ''),
	('00000000-0000-0000-0000-000000000000', '9cb29756-dc46-4804-adb7-4aa741a8ebff', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 19:55:08.094975+00', ''),
	('00000000-0000-0000-0000-000000000000', '704db9c5-b042-4319-89a6-99ef9f9d729b', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 20:58:54.23485+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ef7f301f-bfef-4da6-91aa-c4a1e45b0b10', '{"action":"token_revoked","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 20:58:54.237596+00', ''),
	('00000000-0000-0000-0000-000000000000', '8d46edd5-2383-4712-9828-534a0f7c642a', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 20:58:54.483176+00', ''),
	('00000000-0000-0000-0000-000000000000', '1729bf42-1354-418e-951d-0e4d816f6d34', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 20:58:54.790087+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ce8c934c-1eee-4d16-bc6c-18dbf670ca05', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 20:58:55.036955+00', ''),
	('00000000-0000-0000-0000-000000000000', '0ee5b1a0-0296-4587-a703-cc95d0f3c1cf', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-10 20:58:55.050815+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ae960cf4-5ea3-47de-b68c-198131c3b82d', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-11 07:16:34.02268+00', ''),
	('00000000-0000-0000-0000-000000000000', '57c25d5c-b527-458b-8d05-28721e85b156', '{"action":"token_revoked","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-11 07:16:34.02883+00', ''),
	('00000000-0000-0000-0000-000000000000', '9733da9b-976b-48ce-abeb-13a6f402055d', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-11 07:16:34.432837+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a6012a28-4a88-4365-a1d9-18f1cfdde334', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-11 07:16:34.798091+00', ''),
	('00000000-0000-0000-0000-000000000000', '1eb2f85c-6f03-45be-a227-144261aecf9c', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-11 07:16:34.81116+00', ''),
	('00000000-0000-0000-0000-000000000000', '49ca544d-4c8c-4f76-be5a-b85af34d5a45', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-11 07:16:35.026915+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c7e29a6e-37df-4861-8303-a7be74c2150f', '{"action":"logout","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-10-11 07:51:03.359963+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b03101b0-7e80-46af-8c3b-2d49df78eb36', '{"action":"login","actor_id":"8be89c56-a351-44fb-9013-afcaefb67f79","actor_username":"j.michael@agweb-communication.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-11 07:51:07.722474+00', ''),
	('00000000-0000-0000-0000-000000000000', '74640869-eb44-4166-ba05-866506cdcbba', '{"action":"logout","actor_id":"8be89c56-a351-44fb-9013-afcaefb67f79","actor_username":"j.michael@agweb-communication.com","actor_via_sso":false,"log_type":"account"}', '2024-10-11 07:52:19.050047+00', ''),
	('00000000-0000-0000-0000-000000000000', '5af8b363-06f4-423d-a416-46c0d38c26ae', '{"action":"login","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-11 07:53:33.871181+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a209838b-e994-4254-beba-7d56bb836971', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-11 08:55:01.773838+00', ''),
	('00000000-0000-0000-0000-000000000000', '24ee52c4-69c8-467a-b963-e50192bc0abf', '{"action":"token_revoked","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-11 08:55:01.776362+00', ''),
	('00000000-0000-0000-0000-000000000000', '3751f553-eda9-4cfe-a583-5715beea7b60', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-11 08:55:01.970134+00', ''),
	('00000000-0000-0000-0000-000000000000', '1fd4b33c-5a2a-4a1c-9982-2da40ccb60cd', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-11 08:55:02.091191+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f6e4cb8a-ee8a-4fec-897a-7c3f2e4de568', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-11 08:55:02.1023+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cd20d823-c6ec-4bae-b8b7-c2f499731793', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-11 09:55:16.989492+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bd33b233-1311-4866-8ca5-a02148176e22', '{"action":"token_revoked","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-11 09:55:16.992063+00', ''),
	('00000000-0000-0000-0000-000000000000', '7082f71e-347b-427b-926f-25201039e860', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-11 09:55:17.182748+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c0f1df7c-0cdb-4b52-af81-4a349a0a52b5', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-11 09:55:20.440485+00', ''),
	('00000000-0000-0000-0000-000000000000', '76be26a5-50eb-431e-adff-bcd7e3443a89', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-11 09:55:20.593275+00', ''),
	('00000000-0000-0000-0000-000000000000', '02b9dcbb-82d5-4cb5-99c5-5fd4a8f39c89', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-11 09:55:21.183984+00', ''),
	('00000000-0000-0000-0000-000000000000', '7c20e325-be5b-45fe-a1de-933f000b38c1', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-11 09:55:21.312592+00', ''),
	('00000000-0000-0000-0000-000000000000', '25035f23-af67-4883-8959-820d0038b6d1', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-11 09:55:21.338134+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b0909a8b-1943-4fba-811e-af0b745f54c2', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-11 11:50:23.397548+00', ''),
	('00000000-0000-0000-0000-000000000000', '6ba37199-d2dc-44d7-876d-1644baaad386', '{"action":"token_revoked","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-11 11:50:23.400291+00', ''),
	('00000000-0000-0000-0000-000000000000', '9688e761-0f1b-4750-b15e-fc6bc91b29a3', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-11 11:50:23.612448+00', ''),
	('00000000-0000-0000-0000-000000000000', '8d9b4bf8-f876-452c-bd40-1f07e94ceeba', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-11 12:57:22.98712+00', ''),
	('00000000-0000-0000-0000-000000000000', '7c0e47ce-8280-49ab-81d4-d9814e728d82', '{"action":"token_revoked","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-11 12:57:22.990411+00', ''),
	('00000000-0000-0000-0000-000000000000', '5db720f5-d194-48e4-aac6-cd333130d920', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-11 12:57:27.441501+00', ''),
	('00000000-0000-0000-0000-000000000000', '9e7304f9-b5f0-48c2-bc1a-5fbae5a66266', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-11 12:57:28.519169+00', ''),
	('00000000-0000-0000-0000-000000000000', '0b41ee31-eadc-46fc-9dd7-4f6365e795d9', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-11 12:57:31.146621+00', ''),
	('00000000-0000-0000-0000-000000000000', '89743606-1600-466e-bb33-58ddd436531a', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-11 12:57:31.170664+00', ''),
	('00000000-0000-0000-0000-000000000000', '5859abd7-8252-4765-afd3-b15710321583', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-11 14:00:59.250849+00', ''),
	('00000000-0000-0000-0000-000000000000', '7d7407f0-c261-425d-a252-f01c050a08ab', '{"action":"token_revoked","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-11 14:00:59.253141+00', ''),
	('00000000-0000-0000-0000-000000000000', '79acadbd-c2b3-4cd6-a23d-cb99d05d86bb', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-11 14:00:59.562753+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c8bbdd09-0338-454f-b69d-cb17c0d48568', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-11 14:01:08.181583+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c4bec6c1-a103-4495-b755-eab53e5a420e', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-11 14:01:08.342869+00', ''),
	('00000000-0000-0000-0000-000000000000', '9f200d7c-b0f2-4809-a6c6-5e2f257ebfb3', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-11 14:12:29.155951+00', ''),
	('00000000-0000-0000-0000-000000000000', '44c422e7-acaa-4608-87ce-a6eb4b9095ef', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-11 14:12:30.069961+00', ''),
	('00000000-0000-0000-0000-000000000000', '50d7b955-1dc9-4704-b760-694b85277167', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-11 14:12:30.179306+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c410ca1e-999c-4b6e-824f-49906ce6532b', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-11 14:12:30.727246+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f924d5ac-e978-4cfe-af66-8747b4b6e114', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-11 14:12:31.551868+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd6ba9873-a05b-47d0-93bc-17136348b229', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-11 14:12:31.688724+00', ''),
	('00000000-0000-0000-0000-000000000000', '755e98f1-0383-4d4c-974a-4caee762305c', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-11 14:12:31.71697+00', ''),
	('00000000-0000-0000-0000-000000000000', '00ce236a-2a63-4843-83c9-48be12d446dc', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-11 15:12:27.324248+00', ''),
	('00000000-0000-0000-0000-000000000000', '38430916-41c2-42ee-9f22-4f1cd9c20ca5', '{"action":"token_revoked","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-11 15:12:27.326433+00', ''),
	('00000000-0000-0000-0000-000000000000', '00dc2172-e6a8-4b0e-9b85-008a4c96feff', '{"action":"token_refreshed","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-11 18:27:05.747455+00', ''),
	('00000000-0000-0000-0000-000000000000', '94736ebf-a90d-4702-b089-a4f711f56a91', '{"action":"token_revoked","actor_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-11 18:27:05.751098+00', ''),
	('00000000-0000-0000-0000-000000000000', '7baf8c76-59a2-40c3-ad5e-c99d57298415', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"t.aubert.dev@outlook.com","user_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","user_phone":""}}', '2024-10-14 11:19:25.093165+00', ''),
	('00000000-0000-0000-0000-000000000000', '82efb960-9905-442f-af00-5e5768f73095', '{"action":"login","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-14 11:20:22.033839+00', ''),
	('00000000-0000-0000-0000-000000000000', '6b1a7880-fece-4067-9763-6380dba2184a', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-14 12:18:58.317548+00', ''),
	('00000000-0000-0000-0000-000000000000', '6faf641b-a5e1-4786-8865-e720cce7ce98', '{"action":"token_revoked","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-14 12:18:58.320724+00', ''),
	('00000000-0000-0000-0000-000000000000', '7ad621f4-eb1f-416f-92b5-cac478cf06f9', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-14 13:17:56.348643+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a110d1f4-5c21-4af5-bc8f-b2ed417c9569', '{"action":"token_revoked","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-14 13:17:56.352683+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bf742ef7-bcd9-47c4-987a-3c193389a3d1', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-14 14:17:57.439381+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd0c28845-5e65-4e23-b7df-19bf14d801b9', '{"action":"token_revoked","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-14 14:17:57.442289+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e6b34c97-1a52-4229-9680-332dd5f31897', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-14 14:17:57.692694+00', ''),
	('00000000-0000-0000-0000-000000000000', '6d0445d2-7ae5-4524-954f-b29c2f51e89f', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-14 14:18:01.558799+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e2577657-4ee0-4a9e-bda9-3abcef641ca9', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-14 14:18:01.585015+00', ''),
	('00000000-0000-0000-0000-000000000000', '016f7f0e-17bf-435c-b96f-60bc86d86788', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-14 14:18:03.237677+00', ''),
	('00000000-0000-0000-0000-000000000000', '19314fc4-41a5-458b-a992-8dd64b07a2d3', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-14 14:18:03.263256+00', ''),
	('00000000-0000-0000-0000-000000000000', '37ce0dc3-3643-4c71-ae6c-7ea49e7fe2f4', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-14 14:18:05.243089+00', ''),
	('00000000-0000-0000-0000-000000000000', '5e1a286f-2148-4e11-aefc-ae5349f66565', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-14 14:18:05.249203+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e282f4d0-71b2-47e2-87b4-5d5f605c571c', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-14 14:18:17.84761+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b6af7696-b3ae-4ffb-b307-c2b1f1699de8', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-14 14:18:18.078818+00', ''),
	('00000000-0000-0000-0000-000000000000', '3ef75bc0-a23c-431b-90c8-3ee3a28584b5', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-14 14:18:20.470779+00', ''),
	('00000000-0000-0000-0000-000000000000', '0f9a81f5-e4f4-4433-aaa8-179422930d81', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-14 14:18:20.479449+00', ''),
	('00000000-0000-0000-0000-000000000000', '78cf7a8e-bc9d-4b73-9c7e-1891a1a86b22', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-14 14:18:21.12468+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b9b9a8cf-f48f-4e63-9c5c-2806197a0c2e', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-14 14:18:23.081637+00', ''),
	('00000000-0000-0000-0000-000000000000', '2dfa6283-0db6-4bcf-8a8b-59e77dff263f', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-14 14:18:23.101721+00', ''),
	('00000000-0000-0000-0000-000000000000', '53336094-d0b6-4c2e-ad70-0ce17fadf8a0', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-14 14:18:26.157848+00', ''),
	('00000000-0000-0000-0000-000000000000', 'eeabd431-a78c-4b52-b7e7-1e207e80ab89', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-14 14:18:26.176969+00', ''),
	('00000000-0000-0000-0000-000000000000', '8b2c1b33-fef7-40ca-81be-eee008dbe315', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-14 14:18:29.766308+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b5da0708-834d-4d7b-9078-1593a3fb6aa4', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-14 14:18:29.793767+00', ''),
	('00000000-0000-0000-0000-000000000000', '1301a389-110f-4bba-94a7-dec0ed408f20', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-14 14:18:43.013581+00', ''),
	('00000000-0000-0000-0000-000000000000', '56547793-bbbe-4014-b438-e736de2d97a1', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-14 14:18:43.201537+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c6539442-93d8-44ad-be12-90089880eab0', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-14 14:18:43.457303+00', ''),
	('00000000-0000-0000-0000-000000000000', '84c8fe4b-0aa5-4656-90bd-0f04afb0c10d', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-14 14:18:43.475388+00', ''),
	('00000000-0000-0000-0000-000000000000', '7f4a8d5d-133a-486e-9387-6fba77ecf6ee', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-14 14:18:43.492008+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a1254484-ee6f-405a-a7f5-846a56648858', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-14 14:18:44.481652+00', ''),
	('00000000-0000-0000-0000-000000000000', '6853ff38-631d-4f16-9168-a904b483b045', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-14 14:18:44.672625+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd7c62e58-d898-478e-8579-54e4c1a5b31f', '{"action":"login","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-15 11:39:32.901248+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bc0b9396-f52d-4170-b922-0d7d14d6fa26', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 12:37:42.500172+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f303dca5-34c1-4f77-b4ad-a452bc945349', '{"action":"token_revoked","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 12:37:42.503371+00', ''),
	('00000000-0000-0000-0000-000000000000', '82a3eb89-56b3-4b1e-b322-1d63b59d24a9', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 13:37:00.607943+00', ''),
	('00000000-0000-0000-0000-000000000000', '4381c257-0eeb-4e76-9627-92d2d96a4dde', '{"action":"token_revoked","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 13:37:00.610773+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f09b0ad8-f8e6-4bf5-b282-a0070eb241fd', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 14:35:38.776894+00', ''),
	('00000000-0000-0000-0000-000000000000', '323b7776-145c-41bd-b19b-fd0179624bcf', '{"action":"token_revoked","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 14:35:38.782333+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f279f5cd-9363-45b5-ba70-b3035e4f4dd9', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:35:56.650697+00', ''),
	('00000000-0000-0000-0000-000000000000', '7912d4f4-d9a4-4b41-ad69-07c3df871e98', '{"action":"token_revoked","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:35:56.653287+00', ''),
	('00000000-0000-0000-0000-000000000000', '297c9e01-678d-426b-acce-ca891fbf4e6b', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:35:56.677366+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd17d0c8e-86ec-412a-bbe9-d17399f0c869', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:35:56.91449+00', ''),
	('00000000-0000-0000-0000-000000000000', '66a1e664-fe4c-4682-857b-bb11848f804d', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:35:56.941033+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd8b3baa0-6083-42c9-87a3-791d94bca3fc', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:35:58.937455+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bda16f99-46fe-4dc5-a40d-cdc2185d51c4', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:35:58.948989+00', ''),
	('00000000-0000-0000-0000-000000000000', '619bbd7b-2120-40bc-b098-1adc1c1ef43b', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:35:59.123783+00', ''),
	('00000000-0000-0000-0000-000000000000', '79b7f269-d59a-4998-b5c7-54916763f843', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:36:00.690922+00', ''),
	('00000000-0000-0000-0000-000000000000', '492a9d50-0899-4802-a644-e6d2047bcd71', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:36:00.69876+00', ''),
	('00000000-0000-0000-0000-000000000000', '0bdb608b-5a05-4b18-a86c-04440c5a2b53', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:36:00.861757+00', ''),
	('00000000-0000-0000-0000-000000000000', '970fc0ac-f74b-4ce2-a3a3-dea753521ecf', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:36:02.415134+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a5581092-b8d4-45b5-8fe8-5deec9333e32', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:36:02.430571+00', ''),
	('00000000-0000-0000-0000-000000000000', '45e3f804-d0f3-42d0-87c2-8092b1323a48', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:36:02.566534+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f0a0cf29-dc77-463e-8230-d3137a0132fa', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:36:09.182367+00', ''),
	('00000000-0000-0000-0000-000000000000', '30cbf661-0236-479e-9983-50da93c97eda', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:36:09.371452+00', ''),
	('00000000-0000-0000-0000-000000000000', '8234da08-6872-4534-bad1-a8bd5690a7f7', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:36:40.564928+00', ''),
	('00000000-0000-0000-0000-000000000000', '611744d5-38dc-4ba7-a079-1ab70723d3ba', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:36:40.748113+00', ''),
	('00000000-0000-0000-0000-000000000000', '6166edc0-b93d-4a73-b0fd-111cb651a58a', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:36:52.341779+00', ''),
	('00000000-0000-0000-0000-000000000000', '8caf8f3b-e86d-47cc-a44a-84e3f4d3eefd', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:36:52.6673+00', ''),
	('00000000-0000-0000-0000-000000000000', '2d0d7d07-cdad-4520-b077-4e068db8ae81', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:37:01.206958+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f7365326-f842-4fe6-ba4f-9d16159857da', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:37:01.396014+00', ''),
	('00000000-0000-0000-0000-000000000000', '86f7d530-0a95-407e-b875-51ae19966c89', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:37:03.634234+00', ''),
	('00000000-0000-0000-0000-000000000000', '0aa1d52b-e569-4027-903f-a578e4e07c34', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:37:03.82002+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bab8b134-f4ec-4794-a4e4-25b070d091e2', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:37:12.283583+00', ''),
	('00000000-0000-0000-0000-000000000000', '02dfc275-36f9-4114-9703-f4e2f2b4fb90', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:37:12.509076+00', ''),
	('00000000-0000-0000-0000-000000000000', '669d80f5-335d-4b72-9cda-2371e4ff2f05', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:37:23.655807+00', ''),
	('00000000-0000-0000-0000-000000000000', '3cf1b3b0-26f3-492f-8cff-3d255185f89f', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:37:23.976778+00', ''),
	('00000000-0000-0000-0000-000000000000', '6ad21d55-cfbb-4533-aa35-3f3ccf0465db', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:37:28.603539+00', ''),
	('00000000-0000-0000-0000-000000000000', '65a035aa-1191-41cf-9fea-09804dc6866e', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:37:29.059446+00', ''),
	('00000000-0000-0000-0000-000000000000', '75e2a732-2f7f-4b87-9483-e4d800fdaa9d', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:37:43.41063+00', ''),
	('00000000-0000-0000-0000-000000000000', '56fb12e2-bfaa-4ad7-9808-0dd5ef98250d', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:37:43.734189+00', ''),
	('00000000-0000-0000-0000-000000000000', '09940f19-2def-4225-9cab-6f32d274e8ab', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:37:56.219801+00', ''),
	('00000000-0000-0000-0000-000000000000', '4411d1b9-677d-4664-a9c8-9faec52e0d34', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:37:56.399719+00', ''),
	('00000000-0000-0000-0000-000000000000', '8ba3d183-e96c-4c68-877c-e61df256a8c2', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:37:56.42668+00', ''),
	('00000000-0000-0000-0000-000000000000', '14ff4834-2681-45a8-96ba-0861cb3ee2e2', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:37:56.581766+00', ''),
	('00000000-0000-0000-0000-000000000000', '4908db9b-177d-4564-a2eb-4b47aeb8c30d', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:38:00.073663+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bf8111c4-bf69-4889-8c41-bca99b355de6', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:38:00.162115+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b51abce1-f3fb-4070-828b-5033015d7f09', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:38:00.343808+00', ''),
	('00000000-0000-0000-0000-000000000000', '852acb0f-a7e6-44c1-85a5-bd1b70e815e5', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:38:05.485177+00', ''),
	('00000000-0000-0000-0000-000000000000', '699a9174-6b51-43d6-8cbc-34c4980f2434', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:38:05.517574+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c740ab95-9527-480c-83f5-61e41dacfeaf', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:38:05.733438+00', ''),
	('00000000-0000-0000-0000-000000000000', '200415b7-6a3b-4a1a-add8-25a41c16c3b1', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:38:08.254357+00', ''),
	('00000000-0000-0000-0000-000000000000', '326c0f84-cabe-473d-892a-24d2a58e7284', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:38:08.26578+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a3f7ca52-3c99-42b8-b2e4-648c8aa2c6e6', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:38:08.423075+00', ''),
	('00000000-0000-0000-0000-000000000000', '1780e58a-b95f-43af-9b30-0b93db919d25', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:38:18.972766+00', ''),
	('00000000-0000-0000-0000-000000000000', 'eed45ca4-d9a1-4212-8850-09a4d5d07c66', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:38:19.593052+00', ''),
	('00000000-0000-0000-0000-000000000000', '60097a9a-f022-4254-8360-19e13faceb4e', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:38:22.344335+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c69adf49-65b7-4e98-9cf5-9a63a3df1d50', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:38:25.957112+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f84b3c2e-7fdc-4a44-a946-eabef71bad98', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:38:26.21617+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b51a8cfc-8278-4e48-af7e-a8a07748af86', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:38:26.230395+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e5999737-a70f-4c12-a4bd-5cd172dc4cc1', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:38:26.357847+00', ''),
	('00000000-0000-0000-0000-000000000000', '260ef63f-26a1-42e6-a517-112c620ca57b', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:38:26.371007+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c9fefd91-f6a3-401b-b82d-6375dadbea4a', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:38:26.481755+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd5d54d1d-1d70-40d0-b766-91deb9e829d0', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:38:26.512969+00', ''),
	('00000000-0000-0000-0000-000000000000', 'de266651-1fb5-424e-8a2f-5904ce7682d8', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:38:26.654112+00', ''),
	('00000000-0000-0000-0000-000000000000', '62a6e197-6f2f-4b9f-8c95-da8776d4cdc7', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:38:34.630701+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f4db8d17-eefb-4878-8f44-f87d5d7f9007', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:38:34.995627+00', ''),
	('00000000-0000-0000-0000-000000000000', '1720ed41-c1ba-42ca-9345-38c9dadb899a', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:38:35.959597+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f2c4f240-3dbd-4173-86d2-4e992cff3342', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:38:35.978552+00', ''),
	('00000000-0000-0000-0000-000000000000', 'dbf13589-71ed-49fb-8e4d-8402888536c2', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:38:36.098166+00', ''),
	('00000000-0000-0000-0000-000000000000', '98913b13-572e-4a4f-94d7-da9ccd8d3a0f', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:38:39.695161+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f8667235-0519-41fc-9ab0-390abf347934', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:38:39.853713+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ffa3a8b9-5d84-4642-a974-2482d9b29bd9', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:38:43.988452+00', ''),
	('00000000-0000-0000-0000-000000000000', 'dbf37b1c-8ea3-4dea-9f3c-d264800ffccc', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:38:44.184872+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f41b3963-f0a6-4626-9ebe-38a2f4b5ae14', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:38:47.715874+00', ''),
	('00000000-0000-0000-0000-000000000000', '8cf67586-ea9b-488f-bf29-cdd80967aa9e', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:38:47.860099+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f9e82cbf-25f4-42f2-af59-a42a7886c2c6', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:38:49.904522+00', ''),
	('00000000-0000-0000-0000-000000000000', '9d998729-8ad9-4ad9-b178-d7dbaf2ff01e', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:38:50.13267+00', ''),
	('00000000-0000-0000-0000-000000000000', '63ff414a-b431-4fc1-9efc-31f6e8fc35da', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:38:54.909546+00', ''),
	('00000000-0000-0000-0000-000000000000', '3b91a2f1-54db-4263-9b89-11e915e6461a', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:38:55.161066+00', ''),
	('00000000-0000-0000-0000-000000000000', '2c8972db-5f72-43ad-bb65-ffb3770f5bcf', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:38:58.388352+00', ''),
	('00000000-0000-0000-0000-000000000000', '6b4e32a5-a02e-477d-b44b-0d57ee58b5a1', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:38:58.583467+00', ''),
	('00000000-0000-0000-0000-000000000000', '7349d7ea-58fe-425c-89e5-0b74d32bc63f', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:39:04.164067+00', ''),
	('00000000-0000-0000-0000-000000000000', 'db24f009-3cf2-4c87-971f-0baa002e0260', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:39:04.377623+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ee07a42e-7d1b-4b88-abfb-c150f3ccc6a6', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:39:05.863678+00', ''),
	('00000000-0000-0000-0000-000000000000', '99495035-420f-45af-be43-39274927183c', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:39:06.026285+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e8bdc54c-37cf-40d1-b8e2-0d3c71e8ec76', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:39:07.620935+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c0c2e471-7cf0-4db2-b6be-fdbd381de4d9', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:39:07.774794+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c6bb8284-8373-4380-9092-f039d01331b1', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:39:15.830703+00', ''),
	('00000000-0000-0000-0000-000000000000', '45fb6ecb-7087-4b2c-abe1-41b58e45c543', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:39:16.042482+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ff0d8ece-c023-4924-964b-50720b722cf3', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:39:21.985122+00', ''),
	('00000000-0000-0000-0000-000000000000', '08a14a68-02a2-4941-a3ef-7f74f3e51aa6', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:39:22.211039+00', ''),
	('00000000-0000-0000-0000-000000000000', '0ffd4382-f606-42cb-b0d4-1d7482d2aeeb', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:39:34.420187+00', ''),
	('00000000-0000-0000-0000-000000000000', '98dda5a1-eedb-43de-8210-6ede3824e7bf', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:39:34.690942+00', ''),
	('00000000-0000-0000-0000-000000000000', '8ebfd27d-fdbf-4f27-b13c-8374f375590b', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:39:55.739142+00', ''),
	('00000000-0000-0000-0000-000000000000', '6f5cb78f-a711-40d1-9e8a-d51849ceeba5', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:39:55.984441+00', ''),
	('00000000-0000-0000-0000-000000000000', 'da3761d0-e639-4ee3-b1a2-a2a71ea9399d', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:39:57.122375+00', ''),
	('00000000-0000-0000-0000-000000000000', '0427ba54-b228-4ca8-ae27-7a079eecf800', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:39:57.285561+00', ''),
	('00000000-0000-0000-0000-000000000000', '7cc1334c-41f1-410d-bf1f-caff302e7129', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:40:12.364724+00', ''),
	('00000000-0000-0000-0000-000000000000', '6264239c-e935-41a2-91c9-fbb693c1a37d', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:40:12.60226+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e5efc1a6-443b-4a66-9a57-326ce68a91e0', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:40:14.178446+00', ''),
	('00000000-0000-0000-0000-000000000000', '67f85ff4-f2dd-4d5d-98aa-978055804263', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:40:14.36086+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b8883e94-1f23-42bd-9fd7-e654138bef70', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:40:20.563345+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fff3304b-a851-4d8c-bcea-c2a05997fa9a', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:40:20.982087+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e65d129d-8aaf-4a37-a2ee-79fd4959b97a', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:49:20.031034+00', ''),
	('00000000-0000-0000-0000-000000000000', '796b29bd-24c4-4620-92a0-f601483026a0', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:49:24.809054+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bbb9e20c-bbc4-432b-bdc3-9d3206604fd5', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:49:28.604943+00', ''),
	('00000000-0000-0000-0000-000000000000', '05d7b947-a23c-489e-8671-0fc46677a5fe', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-15 15:49:28.752526+00', ''),
	('00000000-0000-0000-0000-000000000000', '425af4d5-75a1-4f01-83e4-c6687d3f0d81', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 07:47:37.101475+00', ''),
	('00000000-0000-0000-0000-000000000000', '6b0ca62f-c15d-41b1-bdad-27b6d106f6dc', '{"action":"token_revoked","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 07:47:37.123908+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ddef4c01-0158-4940-a94f-8711e6864619', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 07:47:40.704723+00', ''),
	('00000000-0000-0000-0000-000000000000', '9a396a0b-84b7-40b7-b920-f186582e5e75', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 07:47:40.968806+00', ''),
	('00000000-0000-0000-0000-000000000000', '487a9804-a3d3-448b-8b4a-bdd686c1aa1c', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 07:47:44.216033+00', ''),
	('00000000-0000-0000-0000-000000000000', '79af807d-9dd4-4839-99d4-85c0698fca0d', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 07:47:45.401079+00', ''),
	('00000000-0000-0000-0000-000000000000', '82222a31-a4d5-40ba-948e-5fe3aed4ded4', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 07:47:45.647197+00', ''),
	('00000000-0000-0000-0000-000000000000', '4948116f-120a-4053-b541-96ad676e137a', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 07:47:45.732641+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd31f7f1b-ac24-451b-839c-c8a5212a91d5', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 08:47:52.279291+00', ''),
	('00000000-0000-0000-0000-000000000000', '2e673652-c426-4158-90f6-607e85d21e6a', '{"action":"token_revoked","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 08:47:52.282732+00', ''),
	('00000000-0000-0000-0000-000000000000', '0b5586f3-97d4-4346-8dbf-130a8e3efca6', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 08:47:52.307084+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a4eb2b1f-f65f-41e5-9287-7d78a8bf5624', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 08:47:52.42615+00', ''),
	('00000000-0000-0000-0000-000000000000', '7615d08a-1c97-4bde-aed9-0c612f19836f', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 08:47:52.434817+00', ''),
	('00000000-0000-0000-0000-000000000000', '75f5fee2-c159-4d73-9fb5-25581f357f4a', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 08:47:52.458978+00', ''),
	('00000000-0000-0000-0000-000000000000', '75271b89-3bb9-49ee-b219-b4894f254806', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 08:47:57.791214+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a5496fd1-152a-4909-ba25-2fcc9825094a', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 08:47:57.803309+00', ''),
	('00000000-0000-0000-0000-000000000000', '47ddeb26-0de7-444d-bf5e-5a31a1dd8e94', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 08:47:57.990064+00', ''),
	('00000000-0000-0000-0000-000000000000', '36b9862a-cf7e-40eb-8bfa-506dea3f3412', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 08:47:57.998172+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e2189411-c371-41ac-8015-5d1aa8dbbe8e', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 08:47:58.005937+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ee9029a7-71e5-4e33-a6c6-56703d042c93', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 08:47:59.686002+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e563c7c6-eecb-4363-b36e-456d3b05fc97', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 08:47:59.715899+00', ''),
	('00000000-0000-0000-0000-000000000000', '184f4f73-819d-429e-84e4-5180eb757429', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 08:47:59.82086+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fb4636d8-89ca-4002-91e9-99f79b21152a', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 08:47:59.849606+00', ''),
	('00000000-0000-0000-0000-000000000000', '5e4ce610-df61-42c1-ad2e-933021458b26', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 08:47:59.860224+00', ''),
	('00000000-0000-0000-0000-000000000000', '4088e9b0-456a-46a8-bbe8-dc37967fbbba', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 08:48:00.886263+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd9e6ac9c-1310-4e53-9027-98ac658a9dc5', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 08:48:00.909199+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b2ddb2ee-26ae-4d89-9f6e-3052baf200bf', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 08:48:00.986907+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e5b5a624-22d2-4e32-98cd-dbc0f7b0ca92', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 08:48:05.24541+00', ''),
	('00000000-0000-0000-0000-000000000000', '9b8d80f1-1d77-4a82-93de-3203abf3ee37', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 08:48:05.264279+00', ''),
	('00000000-0000-0000-0000-000000000000', '398dc06b-4cc9-47e2-9136-4f020e36b234', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 08:48:06.15196+00', ''),
	('00000000-0000-0000-0000-000000000000', '18f83914-8735-481e-aa72-aa49c5e9396f', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 08:48:06.17437+00', ''),
	('00000000-0000-0000-0000-000000000000', '9948e247-1155-4c81-bdc6-90d6672131b7', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 08:48:06.279331+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a2079692-c89a-498b-8cf1-8d112a40363f', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 08:48:06.296682+00', ''),
	('00000000-0000-0000-0000-000000000000', '124441b9-5d8c-4e09-a9cc-2586331a382e', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 08:48:06.304701+00', ''),
	('00000000-0000-0000-0000-000000000000', '257f26bd-b9b9-425a-94ee-5780b39bc89a', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 08:48:16.976839+00', ''),
	('00000000-0000-0000-0000-000000000000', '6fc12424-0857-45b1-ae12-2342b1fbf932', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 08:48:17.000264+00', ''),
	('00000000-0000-0000-0000-000000000000', '47b164b8-08ee-4454-ad49-2527c257b214', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 08:48:17.119226+00', ''),
	('00000000-0000-0000-0000-000000000000', '51b7b448-95dc-49e1-a7bf-fc819aa0ab31', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 08:48:17.151941+00', ''),
	('00000000-0000-0000-0000-000000000000', '93bdbc21-e5f6-4eba-ae0f-4ca5171f2223', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 08:48:17.164985+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a0fbde84-709a-44bc-b163-9ec78b0f4588', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 08:48:43.136802+00', ''),
	('00000000-0000-0000-0000-000000000000', '71392c80-208c-4cae-b009-01ec2a4995ba', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 08:48:48.472936+00', ''),
	('00000000-0000-0000-0000-000000000000', '55dd49e1-fe6e-46e4-9676-7c7c4452f707', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 08:48:00.993504+00', ''),
	('00000000-0000-0000-0000-000000000000', '662a5224-052f-40b2-be94-d0767f9f3770', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 08:48:01.012669+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c9b80a01-844e-4247-8b73-daa8a400c33b', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 08:48:05.101442+00', ''),
	('00000000-0000-0000-0000-000000000000', '5b306a03-86c0-4fab-ae31-c87d72864e42', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 08:48:05.109303+00', ''),
	('00000000-0000-0000-0000-000000000000', '53702946-2408-4893-b388-45ee93d7ded1', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 08:48:05.238039+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cbcf41d9-366a-4216-9f3f-428b2c3ab318', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 08:48:48.488594+00', ''),
	('00000000-0000-0000-0000-000000000000', '08a54558-c447-4d81-80af-a03884799394', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 08:48:48.50366+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd5be2b19-7461-4903-b430-4a64f2c24570', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 08:48:49.339918+00', ''),
	('00000000-0000-0000-0000-000000000000', '73c88bfe-120f-4aeb-9f11-f5106c34c637', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 08:48:49.489809+00', ''),
	('00000000-0000-0000-0000-000000000000', 'dd9e162d-b54c-45cb-910f-08c5f9bc7d55', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 10:15:12.558254+00', ''),
	('00000000-0000-0000-0000-000000000000', '61a09ee8-cc48-4ab6-95f0-35e42fcf4c86', '{"action":"token_revoked","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 10:15:12.559816+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ccd55b31-722b-4dbc-abd4-89822f8f4b37', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 10:15:31.865266+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd8e3e093-e871-496c-ab62-e477f33d531c', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 10:15:38.143658+00', ''),
	('00000000-0000-0000-0000-000000000000', '470626a2-6c69-47ef-9db7-ff4dbc8acf9e', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 10:15:38.859538+00', ''),
	('00000000-0000-0000-0000-000000000000', '1e31bf3f-fffd-41bc-875b-05cfb0fb2e43', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 10:15:39.014127+00', ''),
	('00000000-0000-0000-0000-000000000000', '97180a97-2ac3-44a7-9c62-97a4a7c3093c', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 10:15:39.039844+00', ''),
	('00000000-0000-0000-0000-000000000000', '6ba2bf77-c7ad-4349-b0f0-237fc21d2174', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 11:13:55.139127+00', ''),
	('00000000-0000-0000-0000-000000000000', '06d93435-ae3f-45e3-a336-4f33fece3317', '{"action":"token_revoked","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 11:13:55.141128+00', ''),
	('00000000-0000-0000-0000-000000000000', '69aac9ed-87a4-4253-a1f0-efb63affc596', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 12:12:07.964007+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c06035de-450f-4277-bd45-e35f41f61803', '{"action":"token_revoked","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 12:12:07.966995+00', ''),
	('00000000-0000-0000-0000-000000000000', '8d3b8d66-7191-4ac2-91c1-f327b2165069', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 13:12:07.541944+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ac7ef3a5-34b4-4297-b834-1e283b6e2af5', '{"action":"token_revoked","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 13:12:07.548777+00', ''),
	('00000000-0000-0000-0000-000000000000', '68874dda-10a4-4c5a-a194-650998cf8d69', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 13:12:07.740264+00', ''),
	('00000000-0000-0000-0000-000000000000', '04babd72-35ae-451c-af65-67baf3112674', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 13:12:37.777943+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f51803bb-6cc1-491f-a354-ae3f1bbd80c3', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 13:12:38.029538+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fb43897d-9444-447f-bbc7-add9ac246364', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 13:12:45.125627+00', ''),
	('00000000-0000-0000-0000-000000000000', 'eedc9d04-f3f5-4c31-b42f-5b5773871a18', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 13:12:45.40064+00', ''),
	('00000000-0000-0000-0000-000000000000', 'dde8202f-fa63-4167-9b63-67913ec3b68a', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 13:12:48.975794+00', ''),
	('00000000-0000-0000-0000-000000000000', 'eb8ccaa9-8496-43e3-b247-da5c97af74bb', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 13:12:49.140445+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ad4c0307-0707-4e1f-ac83-66765ea0cf39', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 13:13:19.144199+00', ''),
	('00000000-0000-0000-0000-000000000000', '8141da38-7e90-45b1-8c65-f8cd3d4b810c', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 13:13:20.243928+00', ''),
	('00000000-0000-0000-0000-000000000000', 'eb49d2be-0e44-4e53-b843-23de65af62b2', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 13:13:20.922485+00', ''),
	('00000000-0000-0000-0000-000000000000', 'eeb6762e-a71c-4156-af61-d9f9f72a6daf', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-16 13:13:20.931188+00', ''),
	('00000000-0000-0000-0000-000000000000', '3b146b96-62c3-456e-8159-c0899f5031a1', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-17 08:22:46.629732+00', ''),
	('00000000-0000-0000-0000-000000000000', '5330006e-9e24-48e1-8424-31bacd0d53ae', '{"action":"token_revoked","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-17 08:22:46.654068+00', ''),
	('00000000-0000-0000-0000-000000000000', '2f657d8e-e395-4774-8c6a-607e000f2b62', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-17 08:22:51.268515+00', ''),
	('00000000-0000-0000-0000-000000000000', '00604c06-67c0-4bc9-9927-4965e02ba472', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-17 08:22:51.409084+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ffcfb148-83d3-4f41-8c3b-fef11a31f556', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-17 08:22:54.83758+00', ''),
	('00000000-0000-0000-0000-000000000000', '0dfe70ab-2334-4e54-94a4-6f741dd4e0af', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-17 08:22:56.270258+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f48e80f6-6d01-44d2-922b-50eeffe61475', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-17 08:22:56.875988+00', ''),
	('00000000-0000-0000-0000-000000000000', '85ec5cae-30f4-4f2c-8a4b-b38081ad5588', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-17 08:22:56.898017+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b8dddea9-fe0d-468f-b039-91e056bcb0be', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-17 10:37:46.825366+00', ''),
	('00000000-0000-0000-0000-000000000000', 'aac89599-74d4-408e-9455-eb3e4605d13c', '{"action":"token_revoked","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-17 10:37:46.827642+00', ''),
	('00000000-0000-0000-0000-000000000000', '3b1f752f-67d5-4093-a46c-7d4beb8618d0', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-17 10:37:49.580649+00', ''),
	('00000000-0000-0000-0000-000000000000', '13007b6b-52c2-48fa-846e-8debeb17177a', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-17 10:37:49.70575+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b12171c1-b642-48ac-b2b9-a41b6e874cf1', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-17 10:37:53.537997+00', ''),
	('00000000-0000-0000-0000-000000000000', '82e3f801-b3b2-4f23-a655-17b328ae69ad', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-17 10:37:54.273431+00', ''),
	('00000000-0000-0000-0000-000000000000', 'aed6a0b0-1669-41f1-adca-fe75c5acfc38', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-17 10:37:54.497901+00', ''),
	('00000000-0000-0000-0000-000000000000', '45c14510-b437-40d1-b2a8-bf46b32c3583', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-17 10:37:54.507004+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd98a2769-8dfc-404c-9aa6-548d9fb5a4d3', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-17 11:36:03.202199+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b36b04c2-0966-4ddf-8f85-76d033fb144b', '{"action":"token_revoked","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-17 11:36:03.206736+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e3361df6-606f-406b-9aee-9ceb5bcb957c', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-17 12:34:04.305568+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e010cf59-d450-4c05-994e-b8c79cac79a9', '{"action":"token_revoked","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-17 12:34:04.310655+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bff9d73f-88cf-41e0-bf4f-a973685ca866', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-17 13:32:28.499217+00', ''),
	('00000000-0000-0000-0000-000000000000', '58ef311d-b5f2-4ec1-9476-d8d52cdf757c', '{"action":"token_revoked","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-17 13:32:28.50275+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cce68e7c-9013-4c67-b215-1bd765b2f71d', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-17 14:32:20.252507+00', ''),
	('00000000-0000-0000-0000-000000000000', '7974cd67-55b2-4381-8f1f-883eacc2beec', '{"action":"token_revoked","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-17 14:32:20.258106+00', ''),
	('00000000-0000-0000-0000-000000000000', 'df7224ba-c304-43ac-8dd4-aa33d7d26936', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-17 15:30:37.030346+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ec4fd530-2e7b-49de-9e5c-4d4f86eb6753', '{"action":"token_revoked","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-17 15:30:37.03724+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a247064d-90c6-4e26-8ea7-dc2442b8a7dd', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-18 07:46:56.839603+00', ''),
	('00000000-0000-0000-0000-000000000000', '8c4865c0-e4ed-4734-9a7d-4d093aefe961', '{"action":"token_revoked","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-18 07:46:56.854314+00', ''),
	('00000000-0000-0000-0000-000000000000', 'baa52957-d832-43a2-b230-811b8adc21fc', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-18 07:47:01.509978+00', ''),
	('00000000-0000-0000-0000-000000000000', '2e8097aa-8766-43c9-a1dd-ee8dd18cb4e0', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-18 07:47:01.788721+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd405d6dc-1e88-4b11-836b-46fc6dcccb9b', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-18 07:47:06.051571+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd8e8ecdb-5715-4d93-9bc6-0aa39eb2d386', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-18 07:47:07.464504+00', ''),
	('00000000-0000-0000-0000-000000000000', '791314b7-213d-4e22-bb1a-ccdf0770a979', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-18 07:47:07.755913+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd441669a-276c-40b4-ac71-b570c054ad2e', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-18 07:47:07.862564+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ad13cd0d-4a16-4cbe-8af2-2eee4eed24a6', '{"action":"logout","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"account"}', '2024-10-18 08:31:22.023433+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ad53ba8f-11b1-4c3c-b9c5-671629efaf50', '{"action":"user_signedup","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2024-10-18 08:31:46.988065+00', ''),
	('00000000-0000-0000-0000-000000000000', '00ca5e66-0e7d-416e-955a-843bede74594', '{"action":"login","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-18 08:31:46.994521+00', ''),
	('00000000-0000-0000-0000-000000000000', '29de2b6c-be72-4e7a-b724-323ff09ae971', '{"action":"login","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-18 08:37:49.907853+00', ''),
	('00000000-0000-0000-0000-000000000000', '5b166a6c-15a7-4ced-a566-39e3a635e95a', '{"action":"login","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-18 09:04:38.290821+00', ''),
	('00000000-0000-0000-0000-000000000000', '6437f581-2120-4d12-901e-e774a404a2ec', '{"action":"token_refreshed","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"token"}', '2024-10-18 09:30:01.568114+00', ''),
	('00000000-0000-0000-0000-000000000000', '2cb2620c-c23f-49cc-99c6-905714098624', '{"action":"token_revoked","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"token"}', '2024-10-18 09:30:01.584533+00', ''),
	('00000000-0000-0000-0000-000000000000', '52b96d98-bef6-4788-8667-03fd8e07f32e', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-18 09:36:13.500831+00', ''),
	('00000000-0000-0000-0000-000000000000', '7e176e02-d722-4407-b2f5-ba93a7ccd86f', '{"action":"token_revoked","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-18 09:36:13.502521+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f596d3ef-fabc-4cdc-bb74-21857af212f6', '{"action":"token_refreshed","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"token"}', '2024-10-18 10:04:15.178172+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd7e27ab9-737b-447c-8b28-8ed4af5071f1', '{"action":"token_revoked","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"token"}', '2024-10-18 10:04:15.182952+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd950aca5-687f-4800-b746-9329f45a792c', '{"action":"token_refreshed","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"token"}', '2024-10-18 10:28:16.465134+00', ''),
	('00000000-0000-0000-0000-000000000000', '82c45a3d-5dc6-4e3a-9007-ea69c0fbcd13', '{"action":"token_revoked","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"token"}', '2024-10-18 10:28:16.470359+00', ''),
	('00000000-0000-0000-0000-000000000000', '1019b92f-0408-4268-9e93-2fcdae3ed244', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-18 10:34:29.107746+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e0f3b2b3-7abe-4f52-96ce-3dc0af541db9', '{"action":"token_revoked","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-18 10:34:29.111788+00', ''),
	('00000000-0000-0000-0000-000000000000', '29a3bcba-6b46-46cc-9c46-9140af5d686d', '{"action":"token_refreshed","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"token"}', '2024-10-18 11:02:15.180607+00', ''),
	('00000000-0000-0000-0000-000000000000', '3acea5f2-6b1d-4841-9725-512a3db3c3fa', '{"action":"token_revoked","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"token"}', '2024-10-18 11:02:15.184581+00', ''),
	('00000000-0000-0000-0000-000000000000', '9c9d9e4d-047f-4d0f-a8dd-1ea9ec66c67d', '{"action":"logout","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"account"}', '2024-10-18 11:14:49.785048+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ca158488-3b4d-46fd-bb6b-a74d596604be', '{"action":"login","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-18 11:14:58.272842+00', ''),
	('00000000-0000-0000-0000-000000000000', '084e34c2-8d4f-4182-830f-91ddb8b7a82b', '{"action":"logout","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"account"}', '2024-10-18 11:15:56.405958+00', ''),
	('00000000-0000-0000-0000-000000000000', '867024b5-7b92-41ed-a64a-3b2afdbc4463', '{"action":"login","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-18 11:16:01.456409+00', ''),
	('00000000-0000-0000-0000-000000000000', '0a387e86-6d88-48da-8d08-0b6a52a0d267', '{"action":"logout","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"account"}', '2024-10-18 11:24:03.487507+00', ''),
	('00000000-0000-0000-0000-000000000000', 'eec862bb-a887-41cf-af08-9d5135ae68aa', '{"action":"login","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-18 11:24:20.720608+00', ''),
	('00000000-0000-0000-0000-000000000000', '800e02a1-fafb-460c-9734-ae0b82a64372', '{"action":"logout","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"account"}', '2024-10-18 11:26:07.593248+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ed3577a5-6c00-49d6-860b-e0adc442f61f', '{"action":"login","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-18 11:26:16.583734+00', ''),
	('00000000-0000-0000-0000-000000000000', '27b99722-ea5e-45fb-b1ce-60601ecc9d23', '{"action":"logout","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"account"}', '2024-10-18 11:26:36.069619+00', ''),
	('00000000-0000-0000-0000-000000000000', 'aa2a1d0b-0fcd-4f81-a52f-c9592464d075', '{"action":"login","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-18 11:26:58.506154+00', ''),
	('00000000-0000-0000-0000-000000000000', '13c07a6a-5e3b-4279-a0b2-5b5ebb7c5664', '{"action":"login","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-18 11:27:05.234183+00', ''),
	('00000000-0000-0000-0000-000000000000', '0c1ee731-848c-4181-b1eb-dcfb3b1ab2eb', '{"action":"logout","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"account"}', '2024-10-18 12:02:47.955239+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e068400c-1a25-4ddf-9fc9-531c803fd3fc', '{"action":"login","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-18 12:03:08.260207+00', ''),
	('00000000-0000-0000-0000-000000000000', '3cd34efe-e9b0-4596-b44a-bfe1d614ac14', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-18 12:25:07.942795+00', ''),
	('00000000-0000-0000-0000-000000000000', '199a6bbb-d4c1-4599-b8cd-aaca41be85ba', '{"action":"token_revoked","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-18 12:25:07.946482+00', ''),
	('00000000-0000-0000-0000-000000000000', '81bb1fd1-bad9-4678-985d-d2fbe805078f', '{"action":"token_refreshed","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"token"}', '2024-10-18 13:19:42.57266+00', ''),
	('00000000-0000-0000-0000-000000000000', '8dd5acd2-1a53-4ba5-b202-0ddfc2ea4fb1', '{"action":"token_revoked","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"token"}', '2024-10-18 13:19:42.578521+00', ''),
	('00000000-0000-0000-0000-000000000000', '60964e03-3a43-4bcb-8ca0-b5f1afdf9157', '{"action":"token_refreshed","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"token"}', '2024-10-18 13:19:42.604157+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e508adb6-7c05-4d4b-8486-f83c3dffb9d1', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-18 13:23:19.481865+00', ''),
	('00000000-0000-0000-0000-000000000000', '7cf88d36-d228-439f-881b-2d5b1520c56e', '{"action":"token_revoked","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-18 13:23:19.483371+00', ''),
	('00000000-0000-0000-0000-000000000000', '4fb145bb-f15a-4cc8-b7f6-6914f219ae05', '{"action":"token_refreshed","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"token"}', '2024-10-18 14:17:50.261142+00', ''),
	('00000000-0000-0000-0000-000000000000', '525c3d53-9cee-496b-ae1f-2248590e637a', '{"action":"token_revoked","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"token"}', '2024-10-18 14:17:50.26361+00', ''),
	('00000000-0000-0000-0000-000000000000', '4abcbed0-1cf0-4d79-9d62-a21b2cb05e9c', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-18 14:21:37.549173+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cb744ed4-f851-4346-8baf-41bb2295c07f', '{"action":"token_revoked","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-10-18 14:21:37.553102+00', ''),
	('00000000-0000-0000-0000-000000000000', '18cce8cf-ff9d-4187-a55d-b91000937f3c', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"michael.jerance.admin@gmail.com","user_id":"4732f5a5-eec4-4d09-9143-9b90106b6c7e","user_phone":""}}', '2024-10-24 19:26:30.778445+00', ''),
	('00000000-0000-0000-0000-000000000000', '27f9e6e2-c946-4b76-bba8-4452157b4324', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"j.michael@agweb-communication.com","user_id":"8be89c56-a351-44fb-9013-afcaefb67f79","user_phone":""}}', '2024-10-24 19:26:35.0202+00', ''),
	('00000000-0000-0000-0000-000000000000', '8f27703d-b879-4cc9-bfd0-a6da4bdf750f', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"michael.jerance.xpert@gmail.com","user_id":"12bf2774-968c-4434-befa-83577a278b99","user_phone":""}}', '2024-10-24 19:26:39.668302+00', ''),
	('00000000-0000-0000-0000-000000000000', '0b8c5a10-a5a2-4a19-be04-b0acb855ab61', '{"action":"user_signedup","actor_id":"22acd7d7-3589-4fab-b388-c44227db7335","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2024-10-24 19:30:39.51952+00', ''),
	('00000000-0000-0000-0000-000000000000', '8b5bc5b9-c3e8-4351-b377-778c579037d0', '{"action":"login","actor_id":"22acd7d7-3589-4fab-b388-c44227db7335","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-24 19:30:39.527645+00', ''),
	('00000000-0000-0000-0000-000000000000', '12d5a95c-9991-4817-b47e-6562229a4aa9', '{"action":"token_refreshed","actor_id":"22acd7d7-3589-4fab-b388-c44227db7335","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-25 20:01:54.685753+00', ''),
	('00000000-0000-0000-0000-000000000000', '18802f43-5510-47d9-934a-ba3ff116561e', '{"action":"token_revoked","actor_id":"22acd7d7-3589-4fab-b388-c44227db7335","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-25 20:01:54.704814+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a8f02913-2006-4522-8174-30fc585ffddb', '{"action":"token_refreshed","actor_id":"22acd7d7-3589-4fab-b388-c44227db7335","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-25 20:01:57.90791+00', ''),
	('00000000-0000-0000-0000-000000000000', '14a18b44-a373-4b46-9d47-c97283940359', '{"action":"token_refreshed","actor_id":"22acd7d7-3589-4fab-b388-c44227db7335","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-25 20:01:58.071626+00', ''),
	('00000000-0000-0000-0000-000000000000', '4fce078c-9ac1-4d64-8cc9-54311a93ce07', '{"action":"token_refreshed","actor_id":"22acd7d7-3589-4fab-b388-c44227db7335","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-25 20:02:02.35209+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a39fe346-c6f2-4ade-9790-ffcd8b874cd1', '{"action":"token_refreshed","actor_id":"22acd7d7-3589-4fab-b388-c44227db7335","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-25 20:02:03.526755+00', ''),
	('00000000-0000-0000-0000-000000000000', '31b973b1-e33e-43c1-8a0c-c2ab0122b049', '{"action":"token_refreshed","actor_id":"22acd7d7-3589-4fab-b388-c44227db7335","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-25 20:02:03.810998+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b8c40ea7-753d-4b58-bc61-b6098618623d', '{"action":"token_refreshed","actor_id":"22acd7d7-3589-4fab-b388-c44227db7335","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-25 20:02:03.848136+00', ''),
	('00000000-0000-0000-0000-000000000000', '627c64a3-92af-4ad9-a5fa-7b69434e3e75', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"admin@xpert-one.fr","user_id":"6a76c9f5-829e-42f3-96c3-408cd901227e","user_phone":""}}', '2024-10-29 13:35:08.654633+00', ''),
	('00000000-0000-0000-0000-000000000000', '965c07f3-0308-49b5-be04-97ce1d0e24f3', '{"action":"login","actor_id":"6a76c9f5-829e-42f3-96c3-408cd901227e","actor_username":"admin@xpert-one.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-29 13:44:18.533616+00', ''),
	('00000000-0000-0000-0000-000000000000', 'dc8bcc30-9159-4920-9e2c-6f7264cffabb', '{"action":"logout","actor_id":"6a76c9f5-829e-42f3-96c3-408cd901227e","actor_username":"admin@xpert-one.fr","actor_via_sso":false,"log_type":"account"}', '2024-10-29 13:44:19.228988+00', ''),
	('00000000-0000-0000-0000-000000000000', '95c03586-b7ee-4948-995f-f39f964c86b3', '{"action":"login","actor_id":"6a76c9f5-829e-42f3-96c3-408cd901227e","actor_username":"admin@xpert-one.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-29 13:45:24.383463+00', ''),
	('00000000-0000-0000-0000-000000000000', '23e9ef0d-7d5c-4ae6-a024-09e0496da600', '{"action":"logout","actor_id":"6a76c9f5-829e-42f3-96c3-408cd901227e","actor_username":"admin@xpert-one.fr","actor_via_sso":false,"log_type":"account"}', '2024-10-29 13:47:38.53892+00', ''),
	('00000000-0000-0000-0000-000000000000', '00a7c5ba-2333-436b-9777-0975761a2993', '{"action":"login","actor_id":"6a76c9f5-829e-42f3-96c3-408cd901227e","actor_username":"admin@xpert-one.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-29 14:20:15.119663+00', ''),
	('00000000-0000-0000-0000-000000000000', '69ce7b8f-d96f-4380-8c0a-67ddcd9ed790', '{"action":"login","actor_id":"6a76c9f5-829e-42f3-96c3-408cd901227e","actor_username":"admin@xpert-one.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-29 14:59:52.878604+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ad503a08-8500-4dc4-a872-f08d2d44e02c', '{"action":"logout","actor_id":"6a76c9f5-829e-42f3-96c3-408cd901227e","actor_username":"admin@xpert-one.fr","actor_via_sso":false,"log_type":"account"}', '2024-10-29 15:17:57.96502+00', ''),
	('00000000-0000-0000-0000-000000000000', 'da0b5c70-2a06-4e03-bacf-e38c4a206591', '{"action":"token_refreshed","actor_id":"22acd7d7-3589-4fab-b388-c44227db7335","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-30 19:54:44.269797+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd5eccfe8-62ff-4632-8f64-cb19d178e421', '{"action":"token_revoked","actor_id":"22acd7d7-3589-4fab-b388-c44227db7335","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-30 19:54:44.283975+00', ''),
	('00000000-0000-0000-0000-000000000000', '8e4a8a91-cb0f-4906-83f2-ffd5f25fe2f0', '{"action":"token_refreshed","actor_id":"22acd7d7-3589-4fab-b388-c44227db7335","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-30 20:55:20.308968+00', ''),
	('00000000-0000-0000-0000-000000000000', '7fb83e9e-d601-4ea2-a0b5-33eec28faea4', '{"action":"token_revoked","actor_id":"22acd7d7-3589-4fab-b388-c44227db7335","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-30 20:55:20.310701+00', ''),
	('00000000-0000-0000-0000-000000000000', '949a9e59-e8e9-475e-beaf-b260067f9648', '{"action":"token_refreshed","actor_id":"22acd7d7-3589-4fab-b388-c44227db7335","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-30 20:55:20.665432+00', ''),
	('00000000-0000-0000-0000-000000000000', '0ba5106a-ef33-450e-a6eb-6cd6853a78b7', '{"action":"login","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-11-08 11:59:14.848771+00', ''),
	('00000000-0000-0000-0000-000000000000', '0768efa8-c2c9-4587-b161-25bcb2e20eec', '{"action":"logout","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"account"}', '2024-11-08 12:03:46.536298+00', ''),
	('00000000-0000-0000-0000-000000000000', '194dc6db-ee0e-494e-b9ed-89c49d4e4267', '{"action":"login","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-11-08 12:03:53.573915+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f0a14474-cf7a-4b9e-8745-debad96c2c6b', '{"action":"token_refreshed","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"token"}', '2024-11-08 13:17:50.230061+00', ''),
	('00000000-0000-0000-0000-000000000000', '8b037f12-675d-4956-935e-9e432b57571e', '{"action":"token_revoked","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"token"}', '2024-11-08 13:17:50.236156+00', ''),
	('00000000-0000-0000-0000-000000000000', '1a5d38fd-cb0d-4495-aeb7-d266309fae82', '{"action":"token_refreshed","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"token"}', '2024-11-08 14:15:57.951927+00', ''),
	('00000000-0000-0000-0000-000000000000', '59b30db7-de3f-41b1-b21c-3615994b65f3', '{"action":"token_revoked","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"token"}', '2024-11-08 14:15:57.962335+00', ''),
	('00000000-0000-0000-0000-000000000000', '3f3fe6da-0333-4289-8147-b9c4efd1278a', '{"action":"logout","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"account"}', '2024-11-08 14:59:12.398053+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b1db084a-d9da-48a8-9071-196ba896304b', '{"action":"login","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-11-08 14:59:32.894337+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f0cc5a59-4e4f-4696-b340-3c1ca16ef928', '{"action":"login","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-11-08 14:59:58.527736+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a8ea9ea2-e3d4-42e7-b4d1-097e5fe97c16', '{"action":"login","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-11-08 15:07:17.3286+00', ''),
	('00000000-0000-0000-0000-000000000000', '85d6ae9b-f8c5-4516-9270-fb646d4709d9', '{"action":"login","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-11-12 13:00:13.347418+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a11513a8-b97d-4852-aeaa-8973afeb621e', '{"action":"login","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-11-12 13:14:25.762139+00', ''),
	('00000000-0000-0000-0000-000000000000', '243bf5ab-96d7-4bbe-a1ef-0b4c3e37c288', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-11-12 13:29:22.94192+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd489d4d4-b4ff-4e60-939e-d0a6af25685e', '{"action":"token_revoked","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-11-12 13:29:22.947631+00', ''),
	('00000000-0000-0000-0000-000000000000', '4e6d958e-2bd2-4b1f-a252-39d13e98d305', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-11-12 13:29:23.09609+00', ''),
	('00000000-0000-0000-0000-000000000000', '5350240b-533d-4cfc-8c21-70079837ca9c', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-11-12 13:29:23.452289+00', ''),
	('00000000-0000-0000-0000-000000000000', '2ec95938-bb52-4830-bdfa-b87225c44ea7', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-11-12 13:29:23.811533+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f17f8795-755f-416b-90be-87366c283f35', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-11-12 13:29:31.197279+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b69a74c0-bbb1-49bf-8875-d4e08885c6b3', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-11-12 13:29:31.215383+00', ''),
	('00000000-0000-0000-0000-000000000000', '760e2354-8586-402d-b8f0-8b7026bfdd53', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-11-12 13:29:31.244832+00', ''),
	('00000000-0000-0000-0000-000000000000', '2ec2d2aa-5036-4bb7-89de-861f8a28eef1', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-11-12 13:29:31.25511+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd5611623-e0b5-4950-9265-4e7a2d2f0e1c', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-11-12 13:29:31.334568+00', ''),
	('00000000-0000-0000-0000-000000000000', '067cd888-c4fd-4fc4-a2f1-ea3941a552eb', '{"action":"login","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-11-12 13:29:45.751746+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a42250fe-22d0-4532-bfeb-a4b644980ac3', '{"action":"login","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-11-12 13:53:50.469375+00', ''),
	('00000000-0000-0000-0000-000000000000', '4c641a22-e201-4ce3-91c3-a31a6c7c58d4', '{"action":"login","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-11-12 13:54:53.359325+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b2396b04-2e0a-490b-908e-4350f2474277', '{"action":"token_refreshed","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"token"}', '2024-11-12 14:28:15.299329+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd010a79c-d726-4476-b14c-7dcbf3510854', '{"action":"token_revoked","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"token"}', '2024-11-12 14:28:15.313039+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b58d519c-fa1b-4b93-9b07-6cee55b30b62', '{"action":"logout","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"account"}', '2024-11-12 14:51:58.045603+00', ''),
	('00000000-0000-0000-0000-000000000000', '76114173-18c2-483d-a7fd-583560390ac9', '{"action":"login","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-11-12 14:52:03.510337+00', ''),
	('00000000-0000-0000-0000-000000000000', '0637b0b0-6f04-4701-8046-9104388f4ed8', '{"action":"logout","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"account"}', '2024-11-12 14:52:15.677892+00', ''),
	('00000000-0000-0000-0000-000000000000', '07f4ed89-280c-4b2d-a86a-c14fdf1fdb2c', '{"action":"login","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-11-12 14:52:23.807562+00', ''),
	('00000000-0000-0000-0000-000000000000', '84c6b596-94f4-42d2-8c64-a28301c376d9', '{"action":"logout","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"account"}', '2024-11-12 14:52:23.977181+00', ''),
	('00000000-0000-0000-0000-000000000000', '7a919e9c-0393-4b99-a06e-6c465197d739', '{"action":"login","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-11-12 14:52:56.755605+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd57a585c-5a93-46da-b4f5-60f67b558171', '{"action":"login","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-11-12 15:35:04.544612+00', ''),
	('00000000-0000-0000-0000-000000000000', '77736fe3-3de4-442f-b927-757847623495', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-11-12 15:51:21.855431+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b9d94ec8-3aa4-44b9-96ae-a4f2f11e4380', '{"action":"token_revoked","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-11-12 15:51:21.857797+00', ''),
	('00000000-0000-0000-0000-000000000000', '96de4f12-fbb4-4f9d-bec0-59b040e94ac5', '{"action":"token_refreshed","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"token"}', '2024-11-12 16:33:35.182154+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a3f16c2e-d536-4f25-9558-cb9b221bb6ff', '{"action":"token_revoked","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"token"}', '2024-11-12 16:33:35.191643+00', ''),
	('00000000-0000-0000-0000-000000000000', '81183e13-2561-4f87-9a4c-618274c52661', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-11-12 16:49:29.888179+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a1cc2ad4-c2d0-42c7-ae40-691c7071641c', '{"action":"token_revoked","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-11-12 16:49:29.89021+00', ''),
	('00000000-0000-0000-0000-000000000000', '8eca244e-51ab-456f-91fb-4603f4c7f396', '{"action":"logout","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"account"}', '2024-11-12 17:04:59.711418+00', ''),
	('00000000-0000-0000-0000-000000000000', '7fb8eb2a-7573-4d8e-bca0-c647add04aa5', '{"action":"login","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-11-12 17:05:14.551542+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b644ca79-2339-4c1e-80d5-8be36c9845a1', '{"action":"logout","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"account"}', '2024-11-12 17:05:36.421776+00', ''),
	('00000000-0000-0000-0000-000000000000', '02adc288-ee5a-490f-8153-5191c6438b60', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"t.aubert@agweb-communication.com","user_id":"ef1134fc-eb6f-4411-80c7-45e4e89fcdb1","user_phone":""}}', '2024-11-12 17:08:46.913372+00', ''),
	('00000000-0000-0000-0000-000000000000', '9f3d7858-c4e2-4a81-a573-b533435f8abc', '{"action":"login","actor_id":"ef1134fc-eb6f-4411-80c7-45e4e89fcdb1","actor_username":"t.aubert@agweb-communication.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-11-12 17:09:16.613079+00', ''),
	('00000000-0000-0000-0000-000000000000', '926c75d1-a414-4c53-929c-f3a2b2a69460', '{"action":"logout","actor_id":"ef1134fc-eb6f-4411-80c7-45e4e89fcdb1","actor_username":"t.aubert@agweb-communication.com","actor_via_sso":false,"log_type":"account"}', '2024-11-12 17:11:00.127622+00', ''),
	('00000000-0000-0000-0000-000000000000', 'dd501676-638b-4d3f-9a8e-734095925216', '{"action":"login","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-11-12 17:11:06.475128+00', ''),
	('00000000-0000-0000-0000-000000000000', '6cb332b6-efe7-4ca0-8710-0a6520fbcd1b', '{"action":"logout","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"account"}', '2024-11-12 17:11:12.848349+00', ''),
	('00000000-0000-0000-0000-000000000000', '20414b64-f5e5-4926-8fb7-a88911d17308', '{"action":"login","actor_id":"ef1134fc-eb6f-4411-80c7-45e4e89fcdb1","actor_username":"t.aubert@agweb-communication.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-11-12 17:11:18.137522+00', ''),
	('00000000-0000-0000-0000-000000000000', '26576fdd-624d-41c1-ae73-b6056fd4ca42', '{"action":"logout","actor_id":"ef1134fc-eb6f-4411-80c7-45e4e89fcdb1","actor_username":"t.aubert@agweb-communication.com","actor_via_sso":false,"log_type":"account"}', '2024-11-12 17:16:12.48612+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd8ae8e97-7cca-4772-a3c4-16a7a361644c', '{"action":"login","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-11-12 17:16:20.200124+00', ''),
	('00000000-0000-0000-0000-000000000000', '50529ee3-2e91-4172-9ccc-043d1bb21c87', '{"action":"token_refreshed","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"token"}', '2024-11-13 09:28:39.380029+00', ''),
	('00000000-0000-0000-0000-000000000000', '53c19748-12c7-4fb5-9c0d-445bf7104dc3', '{"action":"token_revoked","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"token"}', '2024-11-13 09:28:39.394493+00', ''),
	('00000000-0000-0000-0000-000000000000', 'aca1e3f1-8bc3-40da-80b2-fa0eea8ae171', '{"action":"logout","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"account"}', '2024-11-13 09:28:54.648456+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ce34f1d9-12c8-4603-bc33-eedce84c07fa', '{"action":"login","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-11-13 09:29:07.566011+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd52999a0-1594-419a-be6a-9f1b5250ee65', '{"action":"login","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-11-13 09:29:20.466274+00', ''),
	('00000000-0000-0000-0000-000000000000', '9d3a04b3-7e8d-412f-afe4-a4a956f9d96e', '{"action":"logout","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"account"}', '2024-11-13 09:44:40.976888+00', ''),
	('00000000-0000-0000-0000-000000000000', '0aba192e-7db0-48ca-88c3-a3398b2b8af3', '{"action":"login","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-11-13 09:45:44.385072+00', ''),
	('00000000-0000-0000-0000-000000000000', '6172f6db-85cd-4443-aa3d-6606059f5ede', '{"action":"logout","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"account"}', '2024-11-13 10:18:44.693193+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b22f05db-d508-41ee-b245-d0d02d11ae6a', '{"action":"login","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-11-13 10:18:51.136773+00', ''),
	('00000000-0000-0000-0000-000000000000', '12a168c2-101a-40ed-95b4-c7c20b9855e9', '{"action":"logout","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"account"}', '2024-11-13 10:20:41.108632+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a112c1c1-b694-422f-bda1-b8cdb577cfbb', '{"action":"login","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-11-13 10:22:46.820446+00', ''),
	('00000000-0000-0000-0000-000000000000', '10a0b9f8-3b0f-42fa-b7d7-b45184928dc5', '{"action":"login","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-11-13 10:24:06.780872+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd08222b9-7700-4b78-bc45-37aa0b261bdd', '{"action":"token_refreshed","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"token"}', '2024-11-13 11:21:12.547786+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b3fd6c5c-1259-406a-9dd5-a707a8070180', '{"action":"token_revoked","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"token"}', '2024-11-13 11:21:12.5521+00', ''),
	('00000000-0000-0000-0000-000000000000', '90c1973a-ba48-4044-93a5-adedd54363ac', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-11-13 11:22:24.118269+00', ''),
	('00000000-0000-0000-0000-000000000000', '14108028-17ec-4f52-a90a-3d6203811e39', '{"action":"token_revoked","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-11-13 11:22:24.118997+00', ''),
	('00000000-0000-0000-0000-000000000000', '81e69d8b-eaa8-40e2-a749-5984072abf7f', '{"action":"token_refreshed","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"token"}', '2024-11-13 12:19:22.291985+00', ''),
	('00000000-0000-0000-0000-000000000000', '67ca91d5-62f0-411b-b07f-75d64e31f9e5', '{"action":"token_revoked","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"token"}', '2024-11-13 12:19:22.296161+00', ''),
	('00000000-0000-0000-0000-000000000000', '70a31e6e-592c-4092-9669-0937c3bfa108', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-11-13 12:20:27.794109+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fb416524-ef3a-4c22-b8d9-1bb9fe0b9d62', '{"action":"token_revoked","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-11-13 12:20:27.796222+00', ''),
	('00000000-0000-0000-0000-000000000000', '93e3a8b9-5b11-438b-b677-6b7468ebcf1e', '{"action":"token_refreshed","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"token"}', '2024-11-13 13:17:46.3281+00', ''),
	('00000000-0000-0000-0000-000000000000', '2133bce3-8dc5-4cea-a283-6325fd772b14', '{"action":"token_revoked","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"token"}', '2024-11-13 13:17:46.343676+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a8afcb9f-b187-4ed8-b711-7461c62414e3', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-11-13 13:18:34.815945+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cfd03367-54ba-4013-8ba0-cfa71790d583', '{"action":"token_revoked","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-11-13 13:18:34.816601+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e46adba0-3df4-4511-a1ec-a03a6a1831d7', '{"action":"login","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-11-13 14:02:02.472811+00', ''),
	('00000000-0000-0000-0000-000000000000', '3e0c305e-b5be-41e0-a941-d5abc7a86247', '{"action":"token_refreshed","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"token"}', '2024-11-13 14:16:06.068322+00', ''),
	('00000000-0000-0000-0000-000000000000', '1442f561-e634-4920-8703-ce36a11c6f66', '{"action":"token_revoked","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"token"}', '2024-11-13 14:16:06.070955+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f86117c0-cade-45f6-826c-e6e7f02c8f62', '{"action":"logout","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"account"}', '2024-11-13 14:32:30.972926+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e6153089-823d-4e9f-a509-aff181d3cff4', '{"action":"login","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-11-13 14:32:43.152247+00', ''),
	('00000000-0000-0000-0000-000000000000', '75726a29-6ea8-49ab-be55-f39ca37c7507', '{"action":"login","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-11-13 14:35:49.540335+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b4c048d8-3c7a-4ac2-a057-42f2dbc86284', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-11-13 14:59:45.331555+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b6ed5698-b27a-40ea-8a47-f509d5cccbef', '{"action":"token_revoked","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-11-13 14:59:45.333602+00', ''),
	('00000000-0000-0000-0000-000000000000', '0da7dca7-a088-4fe5-ada1-599a01574cce', '{"action":"login","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-11-13 15:05:34.58553+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e6dcdff5-f503-436c-96c6-b64990b23b01', '{"action":"logout","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"account"}', '2024-11-13 15:21:05.501978+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c4257fec-29ff-4a93-afeb-043116947c43', '{"action":"login","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-11-13 15:21:11.078942+00', ''),
	('00000000-0000-0000-0000-000000000000', '01fc236b-9f71-4349-b4a1-33eed5cf9986', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-11-13 16:19:15.728449+00', ''),
	('00000000-0000-0000-0000-000000000000', '2b10f454-b1e5-4067-aeb4-c84fee332307', '{"action":"token_revoked","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-11-13 16:19:15.734567+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a991e5db-3866-4a88-80ef-5d1ab98a6443', '{"action":"login","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-11-13 16:24:11.452348+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ab6aff99-1f70-4c4e-b797-a37b78ed9e4b', '{"action":"login","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-11-13 16:29:36.196026+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd7f9482a-901f-4fbf-89ee-b6265d103a4c', '{"action":"token_refreshed","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"token"}', '2024-11-13 17:27:37.378434+00', ''),
	('00000000-0000-0000-0000-000000000000', '27e2faf0-63c3-4239-ab53-351f39bd4d44', '{"action":"token_revoked","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"token"}', '2024-11-13 17:27:37.387588+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd78a66b2-9a7e-4c1b-b116-9c1e1aae58ae', '{"action":"user_recovery_requested","actor_id":"22acd7d7-3589-4fab-b388-c44227db7335","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"user"}', '2024-11-14 09:31:54.135223+00', ''),
	('00000000-0000-0000-0000-000000000000', '9087dbf4-cffb-446a-b0b7-28ee70ba28c3', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"michael.jerance.admin@gmail.com","user_id":"22acd7d7-3589-4fab-b388-c44227db7335","user_phone":""}}', '2024-11-14 09:32:05.958636+00', ''),
	('00000000-0000-0000-0000-000000000000', '9c814aa2-a76b-4aa6-b96e-5bc49ce9af3e', '{"action":"user_signedup","actor_id":"dcae2de7-dc8c-49fb-a3e1-673b33a802af","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2024-11-14 09:44:33.213449+00', ''),
	('00000000-0000-0000-0000-000000000000', '5e11bfb6-24b8-4bf6-9dfe-6bfe0528ca27', '{"action":"login","actor_id":"dcae2de7-dc8c-49fb-a3e1-673b33a802af","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-11-14 09:44:33.219686+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e626b1d2-f274-4fca-ad35-1a010eafcded', '{"action":"logout","actor_id":"dcae2de7-dc8c-49fb-a3e1-673b33a802af","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-11-14 09:47:59.107973+00', ''),
	('00000000-0000-0000-0000-000000000000', '9602a1d2-9e07-4e83-ad42-58a4022a4ada', '{"action":"login","actor_id":"dcae2de7-dc8c-49fb-a3e1-673b33a802af","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-11-14 09:48:15.992106+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a6928d5e-4d33-4309-a360-754c8fff9cdb', '{"action":"logout","actor_id":"dcae2de7-dc8c-49fb-a3e1-673b33a802af","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-11-14 09:48:16.133923+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bf22be14-b8d7-4906-a031-61a8c7d7fbc8', '{"action":"login","actor_id":"dcae2de7-dc8c-49fb-a3e1-673b33a802af","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-11-14 09:48:54.07343+00', ''),
	('00000000-0000-0000-0000-000000000000', '8631f381-5345-482e-9925-4ad764d9074c', '{"action":"token_refreshed","actor_id":"dcae2de7-dc8c-49fb-a3e1-673b33a802af","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-14 12:24:17.808868+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd8ff632d-35f8-44a6-ba92-f1270a6aa10b', '{"action":"token_revoked","actor_id":"dcae2de7-dc8c-49fb-a3e1-673b33a802af","actor_username":"michael.jerance.admin@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-14 12:24:17.822356+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b577575f-862a-4688-8038-3955c3881eaf', '{"action":"login","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-11-14 15:46:48.033699+00', ''),
	('00000000-0000-0000-0000-000000000000', '5c597118-2280-47f7-bd37-7d0a2ace7bc2', '{"action":"login","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-11-14 16:05:48.306101+00', ''),
	('00000000-0000-0000-0000-000000000000', '1a69aa98-6a32-407f-a3d9-f828651e1036', '{"action":"token_refreshed","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-11-14 16:09:27.287836+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e68f15b4-5c0b-46f7-a5db-c3d4cafc12c9', '{"action":"token_revoked","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"token"}', '2024-11-14 16:09:27.290762+00', ''),
	('00000000-0000-0000-0000-000000000000', 'daa4f46c-b7c6-4bd4-a9fa-b63c1e9b7ebf', '{"action":"logout","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"account"}', '2024-11-14 16:10:37.903023+00', ''),
	('00000000-0000-0000-0000-000000000000', '15879235-bbd0-41f6-bb53-e202db20376a', '{"action":"login","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-11-14 16:10:46.35019+00', ''),
	('00000000-0000-0000-0000-000000000000', '4a7a6cb9-7cf5-4fa5-8fb5-121db12e897b', '{"action":"login","actor_id":"b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2","actor_username":"t.aubert.dev@outlook.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-11-14 16:13:37.262719+00', ''),
	('00000000-0000-0000-0000-000000000000', '79b1c456-0916-46a7-9b5d-2a097efced9b', '{"action":"token_refreshed","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"token"}', '2024-11-14 17:08:59.243073+00', ''),
	('00000000-0000-0000-0000-000000000000', '86239fb3-cdaf-4dc3-92f2-dbe051b51f89', '{"action":"token_revoked","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"token"}', '2024-11-14 17:08:59.252656+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e534331c-0080-48a7-8006-25979164adab', '{"action":"token_refreshed","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"token"}', '2024-11-14 17:41:31.802806+00', ''),
	('00000000-0000-0000-0000-000000000000', '08e8eb8d-d602-4d4b-9ec6-7b94e90ad2b7', '{"action":"token_revoked","actor_id":"48048977-4654-4347-ace1-c29af405c1ce","actor_username":"thomas2002@outlook.fr","actor_via_sso":false,"log_type":"token"}', '2024-11-14 17:41:31.805338+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', 'dcae2de7-dc8c-49fb-a3e1-673b33a802af', 'authenticated', 'authenticated', 'michael.jerance.admin@gmail.com', '$2a$10$ox2b3tmvwIN6WeUZiWjpwOmr8o/zGXWLxDMQHrTicn4Iu6pAcX6TC', '2024-11-14 09:44:33.215999+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-11-14 09:48:54.074175+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "dcae2de7-dc8c-49fb-a3e1-673b33a802af", "role": "xpert", "email": "michael.jerance.admin@gmail.com", "lastname": "michael", "firstname": "jerance", "is_student": false, "default_phone": "+33695907623", "email_verified": false, "phone_verified": false}', NULL, '2024-11-14 09:44:33.194538+00', '2024-11-14 12:24:17.830741+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '6a76c9f5-829e-42f3-96c3-408cd901227e', 'authenticated', 'authenticated', 'admin@xpert-one.fr', '$2a$10$NheTgWPWP.s2jB55MK4sneBJod0qIGS80J/p6aRW6Gji8BQmg5EXq', '2024-10-29 13:35:08.668838+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-10-29 14:59:52.881652+00', '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2024-10-29 13:35:08.615161+00', '2024-10-29 14:59:52.888277+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2', 'authenticated', 'authenticated', 't.aubert.dev@outlook.com', '$2a$10$L4hTjtPAhCuyDn7kfr3moeskQ4rBvc5G5X2oYdY.Olz82aUF.ZO4i', '2024-10-14 11:19:25.107622+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-11-14 16:13:37.284236+00', '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2024-10-14 11:19:25.062271+00', '2024-11-14 16:13:37.322324+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '48048977-4654-4347-ace1-c29af405c1ce', 'authenticated', 'authenticated', 'thomas2002@outlook.fr', '$2a$10$e1Mo6gCN0iHxMjmeEpM1huFAFUzQe0SIYluARPusjOhdOmg/AP8Ui', '2024-10-18 08:31:46.988645+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-11-14 16:10:46.350948+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "48048977-4654-4347-ace1-c29af405c1ce", "role": "xpert", "email": "thomas2002@outlook.fr", "lastname": "Aubert", "firstname": "Thomas", "is_student": false, "default_phone": "+33768787878", "email_verified": false, "phone_verified": false}', NULL, '2024-10-18 08:31:46.960825+00', '2024-11-14 17:41:31.809893+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'ef1134fc-eb6f-4411-80c7-45e4e89fcdb1', 'authenticated', 'authenticated', 't.aubert@agweb-communication.com', '$2a$10$psK8UXY4CEtlt.XBqx9WJeKwRoi.FqJjhq8RhLdkDXmU6sWPF0i0C', '2024-11-12 17:08:46.915394+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-11-12 17:11:18.138293+00', '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2024-11-12 17:08:46.898102+00', '2024-11-12 17:11:18.140498+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2', 'b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2', '{"sub": "b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2", "email": "t.aubert.dev@outlook.com", "email_verified": false, "phone_verified": false}', 'email', '2024-10-14 11:19:25.087344+00', '2024-10-14 11:19:25.087442+00', '2024-10-14 11:19:25.087442+00', 'f4b7d4c2-c1bf-4696-bc2d-1a8323eaba43'),
	('48048977-4654-4347-ace1-c29af405c1ce', '48048977-4654-4347-ace1-c29af405c1ce', '{"sub": "48048977-4654-4347-ace1-c29af405c1ce", "role": "xpert", "email": "thomas2002@outlook.fr", "lastname": "Aubert", "firstname": "Thomas", "is_student": false, "company_name": null, "company_role": null, "default_phone": "+33768787878", "email_verified": false, "phone_verified": false, "referent_generated_id": null}', 'email', '2024-10-18 08:31:46.981873+00', '2024-10-18 08:31:46.981934+00', '2024-10-18 08:31:46.981934+00', 'bf0021ad-2b5a-46f7-8302-c0474460ddf2'),
	('6a76c9f5-829e-42f3-96c3-408cd901227e', '6a76c9f5-829e-42f3-96c3-408cd901227e', '{"sub": "6a76c9f5-829e-42f3-96c3-408cd901227e", "email": "admin@xpert-one.fr", "email_verified": false, "phone_verified": false}', 'email', '2024-10-29 13:35:08.648501+00', '2024-10-29 13:35:08.64856+00', '2024-10-29 13:35:08.64856+00', '51148e19-d84d-4651-a95d-5c6853bd70e3'),
	('ef1134fc-eb6f-4411-80c7-45e4e89fcdb1', 'ef1134fc-eb6f-4411-80c7-45e4e89fcdb1', '{"sub": "ef1134fc-eb6f-4411-80c7-45e4e89fcdb1", "email": "t.aubert@agweb-communication.com", "email_verified": false, "phone_verified": false}', 'email', '2024-11-12 17:08:46.90965+00', '2024-11-12 17:08:46.909725+00', '2024-11-12 17:08:46.909725+00', 'ce02c2f5-b2f3-42e2-a9ff-d739478cff80'),
	('dcae2de7-dc8c-49fb-a3e1-673b33a802af', 'dcae2de7-dc8c-49fb-a3e1-673b33a802af', '{"sub": "dcae2de7-dc8c-49fb-a3e1-673b33a802af", "role": "xpert", "email": "michael.jerance.admin@gmail.com", "lastname": "michael", "firstname": "jerance", "is_student": false, "company_name": null, "company_role": null, "default_phone": "+33695907623", "email_verified": false, "phone_verified": false, "referent_generated_id": null}', 'email', '2024-11-14 09:44:33.209864+00', '2024-11-14 09:44:33.20992+00', '2024-11-14 09:44:33.20992+00', '06391989-4be2-4691-85d0-f65421af011b');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag") VALUES
	('06d5d65a-9cb6-4e44-97de-6a99c8b662f1', '48048977-4654-4347-ace1-c29af405c1ce', '2024-11-13 14:35:49.542469+00', '2024-11-13 14:35:49.542469+00', NULL, 'aal1', NULL, NULL, 'node', '149.62.159.212', NULL),
	('09d06c70-9509-4907-ac0e-892efa849d82', '48048977-4654-4347-ace1-c29af405c1ce', '2024-11-13 15:05:34.590158+00', '2024-11-13 15:05:34.590158+00', NULL, 'aal1', NULL, NULL, 'node', '149.62.159.212', NULL),
	('fce8693b-db10-4bf9-84c7-18278594bfc8', '48048977-4654-4347-ace1-c29af405c1ce', '2024-11-13 16:24:11.455284+00', '2024-11-13 16:24:11.455284+00', NULL, 'aal1', NULL, NULL, 'node', '149.62.159.212', NULL),
	('8a3c6a03-2057-4508-9fcc-049e81c7561b', '48048977-4654-4347-ace1-c29af405c1ce', '2024-11-13 16:29:36.199874+00', '2024-11-13 17:27:37.395677+00', NULL, 'aal1', NULL, '2024-11-13 17:27:37.395605', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36', '149.62.159.212', NULL),
	('cd667282-6a8f-4d0b-a4c6-2af29f7f9ab9', 'dcae2de7-dc8c-49fb-a3e1-673b33a802af', '2024-11-14 09:48:54.07425+00', '2024-11-14 12:24:17.83257+00', NULL, 'aal1', NULL, '2024-11-14 12:24:17.832498', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36', '149.62.159.212', NULL),
	('86f7fba0-766c-43d7-bf66-50ba234747e0', 'b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2', '2024-11-14 16:13:37.285249+00', '2024-11-14 16:13:37.285249+00', NULL, 'aal1', NULL, NULL, 'node', '149.62.159.212', NULL),
	('e9ead660-2471-499c-916c-c803f052780e', '48048977-4654-4347-ace1-c29af405c1ce', '2024-11-14 16:10:46.351026+00', '2024-11-14 17:08:59.26143+00', NULL, 'aal1', NULL, '2024-11-14 17:08:59.261306', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', '149.62.159.212', NULL),
	('2d0318b6-f365-4754-bdd1-5fb35e8c05c8', '48048977-4654-4347-ace1-c29af405c1ce', '2024-11-14 15:46:48.046784+00', '2024-11-14 17:41:31.812386+00', NULL, 'aal1', NULL, '2024-11-14 17:41:31.812316', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36', '149.62.159.212', NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('06d5d65a-9cb6-4e44-97de-6a99c8b662f1', '2024-11-13 14:35:49.547071+00', '2024-11-13 14:35:49.547071+00', 'password', 'a8c9d90c-1336-49c5-b0c5-562aa7ef5fea'),
	('09d06c70-9509-4907-ac0e-892efa849d82', '2024-11-13 15:05:34.599085+00', '2024-11-13 15:05:34.599085+00', 'password', 'ab3185ee-5177-4129-9677-9aef6e82544d'),
	('fce8693b-db10-4bf9-84c7-18278594bfc8', '2024-11-13 16:24:11.46229+00', '2024-11-13 16:24:11.46229+00', 'password', 'a2843ef0-e446-4bdc-9651-1685b03743db'),
	('8a3c6a03-2057-4508-9fcc-049e81c7561b', '2024-11-13 16:29:36.20579+00', '2024-11-13 16:29:36.20579+00', 'password', '46a839d1-114c-4a77-bf16-2966ab4ad877'),
	('cd667282-6a8f-4d0b-a4c6-2af29f7f9ab9', '2024-11-14 09:48:54.07641+00', '2024-11-14 09:48:54.07641+00', 'password', 'ef20005e-563e-49d9-8497-25f2673d0614'),
	('2d0318b6-f365-4754-bdd1-5fb35e8c05c8', '2024-11-14 15:46:48.058406+00', '2024-11-14 15:46:48.058406+00', 'password', '874cbe04-e5d2-42a4-986e-3f0b76312c06'),
	('e9ead660-2471-499c-916c-c803f052780e', '2024-11-14 16:10:46.354286+00', '2024-11-14 16:10:46.354286+00', 'password', '7a6aca0d-fe27-4858-8b8b-052788583e95'),
	('86f7fba0-766c-43d7-bf66-50ba234747e0', '2024-11-14 16:13:37.323316+00', '2024-11-14 16:13:37.323316+00', 'password', '4894d618-e48b-4dab-931f-37e05e768f2b');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 146, 'klWUPCN_B_AE5BA1N5qUgw', 'b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2', false, '2024-11-14 16:13:37.296068+00', '2024-11-14 16:13:37.296068+00', NULL, '86f7fba0-766c-43d7-bf66-50ba234747e0'),
	('00000000-0000-0000-0000-000000000000', 145, 'tf6703cczpTzPIJd_kGoLg', '48048977-4654-4347-ace1-c29af405c1ce', true, '2024-11-14 16:10:46.352579+00', '2024-11-14 17:08:59.253221+00', NULL, 'e9ead660-2471-499c-916c-c803f052780e'),
	('00000000-0000-0000-0000-000000000000', 147, '0IdGx3oZbNHy0SPRsMqvNw', '48048977-4654-4347-ace1-c29af405c1ce', false, '2024-11-14 17:08:59.256925+00', '2024-11-14 17:08:59.256925+00', 'tf6703cczpTzPIJd_kGoLg', 'e9ead660-2471-499c-916c-c803f052780e'),
	('00000000-0000-0000-0000-000000000000', 142, 'qg59_PiNV21RqOc-dNHoDg', '48048977-4654-4347-ace1-c29af405c1ce', true, '2024-11-14 15:46:48.052899+00', '2024-11-14 17:41:31.807588+00', NULL, '2d0318b6-f365-4754-bdd1-5fb35e8c05c8'),
	('00000000-0000-0000-0000-000000000000', 148, 'HqtjHDub2hrf4cTBF84koA', '48048977-4654-4347-ace1-c29af405c1ce', false, '2024-11-14 17:41:31.808765+00', '2024-11-14 17:41:31.808765+00', 'qg59_PiNV21RqOc-dNHoDg', '2d0318b6-f365-4754-bdd1-5fb35e8c05c8'),
	('00000000-0000-0000-0000-000000000000', 130, '6r3ZIW3NFDEBj0W7dUY8-w', '48048977-4654-4347-ace1-c29af405c1ce', false, '2024-11-13 14:35:49.543397+00', '2024-11-13 14:35:49.543397+00', NULL, '06d5d65a-9cb6-4e44-97de-6a99c8b662f1'),
	('00000000-0000-0000-0000-000000000000', 132, 'UsfjOJbJYiC2c0psyY52pA', '48048977-4654-4347-ace1-c29af405c1ce', false, '2024-11-13 15:05:34.593336+00', '2024-11-13 15:05:34.593336+00', NULL, '09d06c70-9509-4907-ac0e-892efa849d82'),
	('00000000-0000-0000-0000-000000000000', 135, '6ARAK8zU9LMJh62H3ApH0A', '48048977-4654-4347-ace1-c29af405c1ce', false, '2024-11-13 16:24:11.459062+00', '2024-11-13 16:24:11.459062+00', NULL, 'fce8693b-db10-4bf9-84c7-18278594bfc8'),
	('00000000-0000-0000-0000-000000000000', 136, 'ZWbnkP5sCshGwlzg34LIcw', '48048977-4654-4347-ace1-c29af405c1ce', true, '2024-11-13 16:29:36.202288+00', '2024-11-13 17:27:37.389379+00', NULL, '8a3c6a03-2057-4508-9fcc-049e81c7561b'),
	('00000000-0000-0000-0000-000000000000', 137, 'bqCdmOHPnct-OVJGxcuXTg', '48048977-4654-4347-ace1-c29af405c1ce', false, '2024-11-13 17:27:37.391266+00', '2024-11-13 17:27:37.391266+00', 'ZWbnkP5sCshGwlzg34LIcw', '8a3c6a03-2057-4508-9fcc-049e81c7561b'),
	('00000000-0000-0000-0000-000000000000', 140, 'paOempM--93t7-NiJORkeg', 'dcae2de7-dc8c-49fb-a3e1-673b33a802af', true, '2024-11-14 09:48:54.075002+00', '2024-11-14 12:24:17.822947+00', NULL, 'cd667282-6a8f-4d0b-a4c6-2af29f7f9ab9'),
	('00000000-0000-0000-0000-000000000000', 141, 'uIE0QNGD8yNlr0FR707MKA', 'dcae2de7-dc8c-49fb-a3e1-673b33a802af', false, '2024-11-14 12:24:17.827955+00', '2024-11-14 12:24:17.827955+00', 'paOempM--93t7-NiJORkeg', 'cd667282-6a8f-4d0b-a4c6-2af29f7f9ab9');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: key; Type: TABLE DATA; Schema: pgsodium; Owner: supabase_admin
--



--
-- Data for Name: profile; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."profile" ("civility", "birthdate", "firstname", "lastname", "generated_id", "mobile", "fix", "email", "street_number", "address", "city", "postal_code", "country", "linkedin", "how_did_you_hear_about_us", "how_did_you_hear_about_us_other", "id", "role", "company_role", "company_name", "referent_id", "created_at", "totale_progression", "profile_progression", "expertise_progression", "status_progression", "mission_progression", "sector", "service_dependance", "siret", "username", "avatar_url", "has_seen_my_missions", "has_seen_available_missions", "has_seen_messaging", "has_seen_community", "has_seen_blog", "has_seen_newsletter", "has_seen_my_profile", "sector_other", "company_role_other", "has_seen_created_missions", "area", "france_detail", "regions", "sector_renewable_energy", "sector_waste_treatment", "sector_energy", "sector_infrastructure", "sector_infrastructure_other", "sector_renewable_energy_other", "cv_name", "is_banned_from_community", "community_banning_explanations") VALUES
	('mr', '2024-11-14', 'jerance', 'michael', '209d7f83-43a3-4dd3-9cc5-00f68d5c4846', '+33695907623', NULL, 'michael.jerance.admin@gmail.com', '32', 'teszfaz', 'LA COURNEUVE', '93120', 'FR', NULL, 'call', NULL, 'dcae2de7-dc8c-49fb-a3e1-673b33a802af', 'admin', NULL, NULL, NULL, '2024-11-14 09:44:33.194165+00', 98, 94, 100, 100, 100, NULL, NULL, NULL, NULL, NULL, false, true, false, false, false, false, true, NULL, NULL, false, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Person Photo 1171169099.jpg', false, ''),
	(NULL, NULL, NULL, NULL, 'X 7220', NULL, NULL, 't.aubert.dev@outlook.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2', 'admin', NULL, NULL, NULL, '2024-10-14 11:19:25.059629+00', 0, 0, 0, 0, 0, NULL, NULL, NULL, NULL, NULL, false, false, false, false, false, false, true, NULL, NULL, false, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL),
	(NULL, NULL, NULL, NULL, 'X 2788', NULL, NULL, 'admin@xpert-one.fr', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '6a76c9f5-829e-42f3-96c3-408cd901227e', 'admin', NULL, NULL, NULL, '2024-10-29 13:35:08.613208+00', 0, 0, 0, 0, 0, NULL, NULL, NULL, NULL, NULL, false, false, false, false, false, false, false, NULL, NULL, false, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL),
	('mr', '2024-10-31', 'Thomas', 'Aubert', 'X 8727', '+33768787878', NULL, 'thomas2002@outlook.fr', '2', 'Rue des codes', 'Paris', '77777', 'FR', NULL, 'mouth', NULL, '48048977-4654-4347-ace1-c29af405c1ce', 'xpert', NULL, NULL, NULL, '2024-10-18 08:31:46.960459+00', 93, 94, 98, 100, 86, NULL, NULL, NULL, NULL, NULL, true, true, false, false, false, true, true, NULL, NULL, false, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Prévention santé.pdf', false, ''),
	('mr', NULL, 'THOMAs', 'Aubert', 'F 7626', '+33232323232', '+33232323232', 't.aubert@agweb-communication.com', '22', 'mmmm', 'paris', '23232', 'FR', NULL, 'web', NULL, 'ef1134fc-eb6f-4411-80c7-45e4e89fcdb1', 'company', 'administrative', 'Socozd', NULL, '2024-11-12 17:08:46.89774+00', 100, 100, 100, 100, 100, 'process_industries', 'zdz', '23323233232323', NULL, NULL, false, false, false, false, false, false, true, NULL, NULL, true, '{france}', '{drom_com}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL);


--
-- Data for Name: article; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: mission; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: chat; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."chat" ("id", "created_at", "created_by", "title", "topic", "mission_id", "category", "type", "receiver_id", "updated_at") VALUES
	(75, '2024-11-13 15:24:47.984669+00', 'b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2', 'Nouvel echo', 'profil', NULL, NULL, 'echo_community', NULL, '2024-11-14 09:51:24.912137'),
	(77, '2024-11-14 16:07:29.539232+00', 'b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2', 'Test', '', NULL, 'renewable_energy', 'forum', NULL, '2024-11-14 16:07:29.581241'),
	(74, '2024-11-13 15:22:57.941932+00', 'b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2', 'Bonjour', 'profil', NULL, NULL, 'chat', '48048977-4654-4347-ace1-c29af405c1ce', '2024-11-14 16:57:02.581465'),
	(76, '2024-11-13 15:25:06.474286+00', 'b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2', 'Nouveau forum', '', NULL, 'waste_treatment', 'forum', NULL, '2024-11-13 16:52:32.42783');


--
-- Data for Name: company_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."company_roles" ("id", "label", "value", "json_key") VALUES
	(1, 'Achat', 'achat', 'achat-option'),
	(2, 'Administrative', 'administrative', 'administrative-option'),
	(3, 'Commerciale', 'commerciale', 'commerciale-option'),
	(4, 'Comptabilité', 'comptabilite', 'comptabilite-option'),
	(5, 'Direction', 'direction', 'direction-option'),
	(6, 'Directeur de site', 'directeur_de_site', 'directeur-de-site-option'),
	(7, 'Finance', 'finance', 'finance-option'),
	(8, 'Production', 'production', 'production-option'),
	(9, 'RH', 'rh', 'rh-option'),
	(10, 'Sécurité', 'securite', 'securite-option'),
	(11, 'Technique', 'technique', 'technique-option'),
	(12, 'Autre', 'other', 'other-option');


--
-- Data for Name: contact_xpert_demands; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: diplomas; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."diplomas" ("id", "label", "value", "json_key") VALUES
	(1, 'Baccalauréat', 'baccalaureat', 'baccalaureat-option'),
	(2, 'BEP', 'bep', 'bep-option'),
	(3, 'BTS', 'bts', 'bts-option'),
	(4, 'BUT', 'but', 'but-option'),
	(5, 'CAP', 'cap', 'cap-option'),
	(6, 'DEUG', 'deug', 'deug-option'),
	(7, 'DEUST', 'deust', 'deust-option'),
	(8, 'Diplôme d''études approfondies', 'diplome_etudes_approfondies', 'diplome-etudes-approfondies-option'),
	(9, 'Diplôme d''études supérieures spécialisées', 'diplome_etudes_superieures_specialisees', 'diplome-etudes-superieures-specialisees-option'),
	(10, 'Diplôme d''ingénieur', 'diplome_ingenieur', 'diplome-ingenieur-option'),
	(11, 'Doctorat', 'doctorat', 'doctorat-option'),
	(12, 'Habilitation à diriger des recherches', 'habilitation_diriger_recherches', 'habilitation-diriger-recherches-option'),
	(13, 'Licence', 'licence', 'licence-option'),
	(14, 'Licence professionnelle', 'licence_professionnelle', 'licence-professionnelle-option'),
	(15, 'Maîtrise', 'maitrise', 'maitrise-option'),
	(16, 'Master', 'master', 'master-option'),
	(17, 'Autre', 'other', 'other-option');


--
-- Data for Name: expertises; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."expertises" ("id", "label", "value", "json_key") VALUES
	(1, 'Analyse chimique', 'analyse_chimique', 'analyse-chimique-option'),
	(2, 'Analyse fonctionnelle', 'analyse_fonctionnelle', 'analyse-fonctionnelle-option'),
	(3, 'Conception', 'conception', 'conception-option'),
	(4, 'Conduite d''installation', 'conduite_installation', 'conduite-installation-option'),
	(5, 'Développement de la supervision', 'supervision', 'supervision-option'),
	(6, 'Dimensionnement projet', 'dimensionnement_projet', 'dimensionnement-projet-option'),
	(7, 'Dessin', 'dessin', 'dessin-option'),
	(8, 'Encadrement d''equipe', 'encadrement_equipe', 'encadrement-equipe-option'),
	(9, 'Elaboration budget', 'budget', 'budget-option'),
	(10, 'FAT/SAT', 'fat_sat', 'fat-sat-option'),
	(11, 'Gestion Appels d''offres', 'appels_offres', 'appels-offres-option'),
	(12, 'Gestion relation client final', 'relation_client', 'relation-client-option'),
	(13, 'Instrumentation', 'instrumentation', 'instrumentation-option'),
	(14, 'Maintenance électrique', 'maintenance_electrique', 'maintenance-electrique-option'),
	(15, 'Maintenance électro-technique', 'maintenance_electro_technique', 'maintenance-electro-technique-option'),
	(16, 'Maintenance mécanique', 'maintenance_mecanique', 'maintenance-mecanique-option'),
	(17, 'Organisation du chantier OPC', 'organisation_chantier', 'organisation-chantier-option'),
	(18, 'Programmation', 'programmation', 'programmation-option'),
	(19, 'Rédaction cahier des charges', 'cahier_des_charges', 'cahier-des-charges-option'),
	(20, 'Rédaction des Procédures', 'procedures', 'procedures-option'),
	(21, 'Suivi des travaux', 'suivi_travaux', 'suivi-travaux-option'),
	(22, 'Suivi Montage', 'suivi_montage', 'suivi-montage-option'),
	(23, 'Suivi sous-traitant', 'suivi_sous_traitant', 'suivi-sous-traitant-option'),
	(24, 'Test de boucles', 'test_boucles', 'test-boucles-option'),
	(25, 'Autres', 'others', 'others-option'),
	(26, 'Pas d''expertise requise', 'no_expertise', 'no-expertise-option');


--
-- Data for Name: habilitations; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."habilitations" ("id", "label", "value", "json_key") VALUES
	(1, 'Habilitation amiante', 'habilitation_amiante', 'habilitation-amiante-option'),
	(2, 'Habilitation ATEX', 'habilitation_atex', 'habilitation-atex-option'),
	(3, 'Habilitation CACES', 'habilitation_caces', 'habilitation-caces-option'),
	(4, 'Habilitation électrique', 'habilitation_electrique', 'habilitation-electrique-option'),
	(5, 'Habilitation gaz', 'habilitation_gaz', 'habilitation-gaz-option'),
	(6, 'Habilitation plomb', 'habilitation_plomb', 'habilitation-plomb-option'),
	(7, 'Autres', 'others', 'others-option');


--
-- Data for Name: infrastructures; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."infrastructures" ("id", "label", "value", "json_key") VALUES
	(1, 'Port', 'port', 'port-option'),
	(2, 'Tunnel', 'tunnel', 'tunnel-option'),
	(3, 'Autre', 'other', 'other-option');


--
-- Data for Name: job_titles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."job_titles" ("id", "label", "value", "image", "json_key") VALUES
	(1, 'Assistant Dessinateur', 'assistant_dessinateur', '/static/jobs/Assistant Dessinateur.jpeg', 'assistant-dessinateur-option'),
	(2, 'Chargé d''affaires', 'charge_d_affaires', '/static/jobs/Chargé d''affaires.jpeg', 'charge-d-affaires-option'),
	(3, 'Chef d''équipes en Montage mécanique', 'chef_de_quipes_en_montage_mecanique', '/static/jobs/Chef d''équipes en Montage mécanique.jpeg', 'chef-de-quipes-en-montage-mecanique-option'),
	(4, 'Chef de Quart', 'chef_de_quart', '/static/jobs/Chef de Quart.jpeg', 'chef-de-quart-option'),
	(5, 'Chef(fe) de projets photovoltaïques', 'chef_de_projets_photovoltaiques', '/static/jobs/Chef(fe) de projets photovoltaïques.jpeg', 'chef-de-projets-photovoltaiques-option'),
	(6, 'Commissioning manager', 'commissioning_manager', '/static/jobs/Commissioning manager.jpeg', 'commissioning-manager-option'),
	(7, 'Dessinateur', 'dessinateur', '/static/jobs/Dessinateur.jpeg', 'dessinateur-option'),
	(8, 'Directeur d''exploitation', 'directeur_exploitation', '/static/jobs/Directeur d''exploitation.jpeg', 'directeur-exploitation-option'),
	(9, 'Directeur de projet', 'directeur_de_projet', '/static/jobs/DirecteurProjet.jpeg', 'directeur-de-projet-option'),
	(10, 'Directeur de site/Site manager', 'directeur_de_site_site_manager', '/static/jobs/Directeur de site: Site manager.jpeg', 'directeur-de-site-site-manager-option'),
	(11, 'Ingénieur analyses fonctionnelles', 'ingenieur_analyses_fonctionnelles', '/static/jobs/Ingénieur analyses fonctionnelles.jpeg', 'ingenieur-analyses-fonctionnelles-option'),
	(12, 'Ingénieur automaticien', 'ingenieur_automaticien', '/static/jobs/Ingénieur automaticien.jpeg', 'ingenieur-automaticien-option'),
	(13, 'Ingénieur Calcul Génie Civil', 'ingenieur_calcul_genie_civil', '/static/jobs/IngenieurCalculGenie.jpeg', 'ingenieur-calcul-genie-civil-option'),
	(14, 'Ingénieur d''études solaires PV', 'ingenieur_etudes_solaires_pv', '/static/jobs/Ingénieur d''études solaires PV.jpeg', 'ingenieur-etudes-solaires-pv-option'),
	(15, 'Ingénieur des procédés', 'ingenieur_des_procedes', '/static/jobs/Ingénieur des procédés.jpeg', 'ingenieur-des-procedes-option'),
	(16, 'Ingénieur électricien', 'ingenieur_electricien', '/static/jobs/Ingénieur électricien.jpeg', 'ingenieur-electricien-option'),
	(17, 'Ingénieur étude électriques', 'ingenieur_etude_electriques', '/static/jobs/Ingénieur étude électriques.jpeg', 'ingenieur-etude-electriques-option'),
	(18, 'Ingénieur génie civil', 'ingenieur_genie_civil', '/static/jobs/Ingénieur génie civil.jpeg', 'ingenieur-genie-civil-option'),
	(19, 'Ingénieur structure', 'ingenieur_structure', '/static/jobs/Ingénieur structure.jpeg', 'ingenieur-structure-option'),
	(20, 'Instrumentiste', 'instrumentiste', '/static/jobs/Instrumentiste.jpeg', 'instrumentiste-option'),
	(21, 'Metteur en route UVE: BIOMASSE', 'metteur_en_route_uve_biomasse', '/static/jobs/Metteur en route UVE: BIOMASSE.jpeg', 'metteur-en-route-uve-biomasse-option'),
	(22, 'Monteurs électromécanicien', 'monteurs_electromecanicien', '/static/jobs/Monteurs électromécanicien.jpeg', 'monteurs-electromecanicien-option'),
	(23, 'Monteurs mécaniciens', 'monteurs_mecaniciens', '/static/jobs/Monteurs mécaniciens.jpeg', 'monteurs-mecaniciens-option'),
	(24, 'Planner', 'planner', '/static/jobs/Planner.jpeg', 'planner-option'),
	(25, 'Responsable exploitation UVE', 'responsable_exploitation_uve', '/static/jobs/Responsable exploitation UVE.jpeg', 'responsable-exploitation-uve-option'),
	(26, 'Responsable montage', 'responsable_montage', '/static/jobs/Responsable montage.jpeg', 'responsable-montage-option'),
	(27, 'Responsable: Superviseur HSE: QHSE', 'responsable_superviseur_hse_qhse', '/static/jobs/Responsable: Superviseur HSE: QHSE.jpeg', 'responsable-superviseur-hse-qhse-option'),
	(28, 'Site manager (Déchets, eau, énergie)', 'site_manager_dechets_eau_energie', '/static/jobs/Site manager (Déchets, eau, énergie).jpeg', 'site-manager-dechets-eau-energie-option'),
	(29, 'Superviseur électricien', 'superviseur_electricien', '/static/jobs/Superviseur électricien.jpeg', 'superviseur-electricien-option'),
	(30, 'Superviseur mécanicien', 'superviseur_mecanicien', '/static/jobs/Superviseur mécanicien.jpeg', 'superviseur-mecanicien-option'),
	(31, 'Technicien Eolien Onshore/Offshore', 'technicien_eolien_onshore_offshore', '/static/jobs/Technicien Eolien Onshore:Offshore.jpeg', 'technicien-eolien-onshore-offshore-option'),
	(32, 'Autre', 'other', '/static/wind-turbine.jpeg', 'other-option');


--
-- Data for Name: juridic_status; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."juridic_status" ("id", "label", "value", "json_key") VALUES
	(1, 'EURL', 'eurl', 'eurl-option'),
	(2, 'Micro-entreprise (EI)', 'micro_entreprise', 'micro-entreprise-option'),
	(3, 'SA', 'sa', 'sa-option'),
	(4, 'SARL', 'sarl', 'sarl-option'),
	(5, 'SAS', 'sas', 'sas-option'),
	(6, 'SASU', 'sasu', 'sasu-option'),
	(7, 'SCA', 'sca', 'sca-option'),
	(8, 'SCS', 'scs', 'scs-option'),
	(9, 'SNC', 'snc', 'snc-option'),
	(10, 'Autre', 'other', 'other-option');


--
-- Data for Name: languages; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."languages" ("id", "label", "value", "json_key") VALUES
	(1, 'Allemand', 'de', 'de-option'),
	(2, 'Anglais', 'en', 'en-option'),
	(3, 'Arabe', 'ar', 'ar-option'),
	(4, 'Chinois', 'zh', 'zh-option'),
	(5, 'Espagnol', 'es', 'es-option'),
	(6, 'Français', 'fr', 'fr-option'),
	(7, 'Italien', 'it', 'it-option'),
	(8, 'Russe', 'ru', 'ru-option'),
	(9, 'Autre', 'other', 'other-option');


--
-- Data for Name: message; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."message" ("id", "created_at", "chat_id", "content", "reactions", "send_by", "read_by", "answer_to", "is_pinned", "files") VALUES
	(239, '2024-11-13 15:22:57.993018+00', 74, 'Ma description', NULL, 'b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2', '{b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2,48048977-4654-4347-ace1-c29af405c1ce}', NULL, false, NULL),
	(242, '2024-11-13 15:45:20.663874+00', 76, 'Message supprimé', NULL, '48048977-4654-4347-ace1-c29af405c1ce', '{b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2,48048977-4654-4347-ace1-c29af405c1ce,dcae2de7-dc8c-49fb-a3e1-673b33a802af}', NULL, false, '{}'),
	(241, '2024-11-13 15:25:06.523429+00', 76, 'Traitement des déchets', NULL, 'b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2', '{b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2,48048977-4654-4347-ace1-c29af405c1ce,dcae2de7-dc8c-49fb-a3e1-673b33a802af}', NULL, false, NULL),
	(245, '2024-11-13 16:48:38.78167+00', 76, 'aha', NULL, 'b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2', '{b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2,48048977-4654-4347-ace1-c29af405c1ce,dcae2de7-dc8c-49fb-a3e1-673b33a802af}', 243, false, '{"(,,)"}'),
	(246, '2024-11-13 16:52:32.42783+00', 76, 'test', NULL, 'b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2', '{b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2,48048977-4654-4347-ace1-c29af405c1ce,dcae2de7-dc8c-49fb-a3e1-673b33a802af}', NULL, false, '{"(,,)"}'),
	(243, '2024-11-13 15:45:33.243216+00', 76, 'Message supprimé', NULL, '48048977-4654-4347-ace1-c29af405c1ce', '{b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2,48048977-4654-4347-ace1-c29af405c1ce,dcae2de7-dc8c-49fb-a3e1-673b33a802af}', NULL, false, '{}'),
	(244, '2024-11-13 16:38:40.133759+00', 76, 'Message supprimé', NULL, '48048977-4654-4347-ace1-c29af405c1ce', '{b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2,48048977-4654-4347-ace1-c29af405c1ce,dcae2de7-dc8c-49fb-a3e1-673b33a802af}', 241, false, '{}'),
	(248, '2024-11-13 17:09:39.797154+00', 75, 'Message supprimé', NULL, '48048977-4654-4347-ace1-c29af405c1ce', '{dcae2de7-dc8c-49fb-a3e1-673b33a802af,48048977-4654-4347-ace1-c29af405c1ce,b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2}', 247, false, '{}'),
	(249, '2024-11-13 17:10:52.797696+00', 75, 'Message supprimé', NULL, '48048977-4654-4347-ace1-c29af405c1ce', '{dcae2de7-dc8c-49fb-a3e1-673b33a802af,48048977-4654-4347-ace1-c29af405c1ce,b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2}', 248, false, '{}'),
	(250, '2024-11-13 17:11:45.052471+00', 75, 'Message supprimé', NULL, '48048977-4654-4347-ace1-c29af405c1ce', '{dcae2de7-dc8c-49fb-a3e1-673b33a802af,48048977-4654-4347-ace1-c29af405c1ce,b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2}', 249, false, '{}'),
	(251, '2024-11-13 17:12:20.504124+00', 75, 'Message supprimé', NULL, '48048977-4654-4347-ace1-c29af405c1ce', '{dcae2de7-dc8c-49fb-a3e1-673b33a802af,48048977-4654-4347-ace1-c29af405c1ce,b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2}', 250, false, '{}'),
	(240, '2024-11-13 15:24:48.035755+00', 75, 'Echo sur le profil', NULL, 'b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2', '{dcae2de7-dc8c-49fb-a3e1-673b33a802af,48048977-4654-4347-ace1-c29af405c1ce,b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2}', NULL, false, NULL),
	(247, '2024-11-13 17:09:30.162935+00', 75, '?', NULL, 'b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2', '{dcae2de7-dc8c-49fb-a3e1-673b33a802af,48048977-4654-4347-ace1-c29af405c1ce,b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2}', 240, false, '{"(,,)"}'),
	(257, '2024-11-14 09:51:24.912137+00', 75, 'Message supprimé', NULL, 'dcae2de7-dc8c-49fb-a3e1-673b33a802af', '{dcae2de7-dc8c-49fb-a3e1-673b33a802af,48048977-4654-4347-ace1-c29af405c1ce,b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2}', 256, false, '{}'),
	(256, '2024-11-14 09:51:14.513547+00', 75, 'Message supprimé', '{"{\"count\": 1, \"emoji\": \"😍\", \"user_id\": [\"dcae2de7-dc8c-49fb-a3e1-673b33a802af\"]}"}', 'dcae2de7-dc8c-49fb-a3e1-673b33a802af', '{dcae2de7-dc8c-49fb-a3e1-673b33a802af,48048977-4654-4347-ace1-c29af405c1ce,b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2}', NULL, false, '{}'),
	(252, '2024-11-13 17:20:06.573376+00', 75, 'Message supprimé', NULL, '48048977-4654-4347-ace1-c29af405c1ce', '{dcae2de7-dc8c-49fb-a3e1-673b33a802af,48048977-4654-4347-ace1-c29af405c1ce,b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2}', 251, false, '{}'),
	(253, '2024-11-13 17:21:01.801437+00', 75, 'Message supprimé', NULL, '48048977-4654-4347-ace1-c29af405c1ce', '{dcae2de7-dc8c-49fb-a3e1-673b33a802af,48048977-4654-4347-ace1-c29af405c1ce,b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2}', NULL, false, '{}'),
	(254, '2024-11-13 17:21:21.38778+00', 75, 'Message supprimé', NULL, '48048977-4654-4347-ace1-c29af405c1ce', '{dcae2de7-dc8c-49fb-a3e1-673b33a802af,48048977-4654-4347-ace1-c29af405c1ce,b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2}', NULL, false, '{}'),
	(255, '2024-11-13 17:22:30.632584+00', 75, 'Message supprimé', NULL, '48048977-4654-4347-ace1-c29af405c1ce', '{dcae2de7-dc8c-49fb-a3e1-673b33a802af,48048977-4654-4347-ace1-c29af405c1ce,b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2}', 254, false, '{}'),
	(258, '2024-11-14 16:07:29.581241+00', 77, 'Nouvelle', NULL, 'b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2', '{b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2,48048977-4654-4347-ace1-c29af405c1ce}', NULL, false, NULL),
	(259, '2024-11-14 16:57:02.581465+00', 74, 'Bonjour', NULL, '48048977-4654-4347-ace1-c29af405c1ce', '{48048977-4654-4347-ace1-c29af405c1ce}', NULL, false, '{"(,,)"}');


--
-- Data for Name: mission_application; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: mission_canceled; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: notification; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."posts" ("id", "label", "value", "json_key") VALUES
	(1, 'Adjoint Directeur', 'adjoint_directeur', 'adjoint-directeur-option'),
	(2, 'Automaticien', 'automaticien', 'automaticien-option'),
	(3, 'Chargé d''affaires', 'charge_d_affaires', 'charge-daffaires-option'),
	(4, 'Chef de chantier', 'chef_de_chantier', 'chef-de-chantier-option'),
	(5, 'Chef de quart', 'chef_de_quart', 'chef-de-quart-option'),
	(6, 'Chimiste', 'chimiste', 'chimiste-option'),
	(7, 'Commisionning Manager', 'commisionning_manager', 'commisionning-manager-option'),
	(8, 'Conducteur de travaux', 'conducteur_de_travaux', 'conducteur-de-travaux-option'),
	(9, 'Dessinateur/projeteur', 'dessinateur_projeteur', 'dessinateur-projeteur-option'),
	(10, 'Directeur de projet', 'directeur_de_projet', 'directeur-de-projet-option'),
	(11, 'Directeur de site', 'directeur_de_site', 'directeur-de-site-option'),
	(12, 'Directeur HSE', 'directeur_hse', 'directeur-hse-option'),
	(13, 'Electricien', 'electricien', 'electricien-option'),
	(14, 'Ingénieur d''étude', 'ingenieur_etude', 'ingenieur-detude-option'),
	(15, 'Ingénieur HSE', 'ingenieur_hse', 'ingenieur-hse-option'),
	(16, 'Ingénieur Process', 'ingenieur_process', 'ingenieur-process-option'),
	(17, 'Instrumentiste', 'instrumentiste', 'instrumentiste-option'),
	(18, 'Mécanicien', 'mecanicien', 'mecanicien-option'),
	(19, 'Metteur en route', 'metteur_en_route', 'metteur-en-route-option'),
	(20, 'Planer', 'planer', 'planer-option'),
	(21, 'Pontier', 'pontier', 'pontier-option'),
	(22, 'Responsable achat', 'responsable_achat', 'responsable-achat-option'),
	(23, 'Responsable de site', 'responsable_de_site', 'responsable-de-site-option'),
	(24, 'Responsable Maintenance', 'responsable_maintenance', 'responsable-maintenance-option'),
	(25, 'Responsable Qualité', 'responsable_qualite', 'responsable-qualite-option'),
	(26, 'Responsable supply chain', 'responsable_supply_chain', 'responsable-supply-chain-option'),
	(27, 'Autre', 'other', 'other-option');


--
-- Data for Name: profile_education; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."profile_education" ("id", "education_diploma", "detail_diploma", "school", "department", "education_others", "profile_id") VALUES
	(2, 'baccalaureat', NULL, 'Geneve school', '04', NULL, '48048977-4654-4347-ace1-c29af405c1ce'),
	(3, 'bep', NULL, 'rvedre', '01', NULL, 'dcae2de7-dc8c-49fb-a3e1-673b33a802af');


--
-- Data for Name: profile_experience; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."profile_experience" ("id", "is_last", "post", "company", "duree", "has_led_team", "how_many_people_led", "sector", "comments", "profile_id", "sector_energy", "sector_renewable_energy", "sector_waste_treatment", "sector_infrastructure", "post_type", "post_other", "sector_other", "sector_infrastructure_other", "sector_renewable_energy_other") VALUES
	(6, 'true', 'charge_d_affaires', 'AGWEB', '3-5', 'true', '4-6', 'renewable_energy', NULL, '48048977-4654-4347-ace1-c29af405c1ce', NULL, 'wind', NULL, NULL, '{exploitation}', NULL, NULL, NULL, NULL),
	(7, 'true', 'automaticien', 'AGWEB Communication', '1-2', 'true', '4-6', 'energy', NULL, 'dcae2de7-dc8c-49fb-a3e1-673b33a802af', 'wood_boiler', NULL, NULL, NULL, '{chantier}', NULL, NULL, NULL, NULL);


--
-- Data for Name: profile_expertise; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."profile_expertise" ("id", "seniority", "specialties", "expertises", "diploma", "degree", "others", "maternal_language", "cv_name", "profile_id", "other_language", "specialties_other", "expertises_other", "habilitations_other", "other_language_detail", "maternal_language_other", "degree_other", "habilitations", "habilitations_details") VALUES
	(5, 2, '{purchases}', '{analyse_fonctionnelle,conception}', NULL, NULL, NULL, 'fr', NULL, '48048977-4654-4347-ace1-c29af405c1ce', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}', NULL),
	(7, 5, '{purchases}', '{analyse_fonctionnelle}', NULL, NULL, NULL, 'fr', NULL, 'dcae2de7-dc8c-49fb-a3e1-673b33a802af', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{habilitation_amiante}', NULL);


--
-- Data for Name: profile_mission; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."profile_mission" ("id", "sector", "posts_type", "specialties", "expertises", "others", "availability", "desired_tjm", "desired_monthly_brut", "workstation_needed", "workstation_description", "profile_id", "student_contract", "revenu_type", "sector_other", "specialties_others", "expertises_others", "area", "regions", "france_detail", "job_titles", "job_titles_other") VALUES
	(5, '{renewable_energy}', '{exploitation}', '{amoex}', '{others}', NULL, NULL, NULL, NULL, 'false', NULL, '48048977-4654-4347-ace1-c29af405c1ce', 'alternation', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{assistant_dessinateur}', NULL),
	(6, '{energy}', '{etude}', '{purchases}', '{analyse_chimique}', NULL, '2024-12-08', NULL, NULL, 'false', NULL, 'dcae2de7-dc8c-49fb-a3e1-673b33a802af', 'alternation', NULL, NULL, NULL, NULL, '{france}', NULL, '{metropolitan_france}', '{assistant_dessinateur}', NULL);


--
-- Data for Name: profile_status; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."profile_status" ("id", "iam", "status", "company_name", "juridic_status", "siret", "has_portage", "portage_name", "urssaf_name", "kbis_name", "civil_responsability_name", "rib_name", "profile_id", "juridic_status_other") VALUES
	(6, 'student_apprentice', '', NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '48048977-4654-4347-ace1-c29af405c1ce', NULL),
	(7, 'student_apprentice', '', NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'dcae2de7-dc8c-49fb-a3e1-673b33a802af', NULL);


--
-- Data for Name: sectors; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."sectors" ("id", "label", "value", "json_key") VALUES
	(1, 'Energie', 'energy', 'energy-option'),
	(2, 'Energies renouvelables', 'renewable_energy', 'renewable-energy-option'),
	(3, 'Industries des procédés', 'process_industries', 'process-industries-option'),
	(4, 'Infrastructure', 'infrastructure', 'infrastructure-option'),
	(5, 'Traitement de l''eau', 'water_treatment', 'water-treatment-option'),
	(6, 'Traitement des Déchêts', 'waste_treatment', 'waste-treatment-option'),
	(7, 'Autre', 'others', 'others-option');


--
-- Data for Name: specialties; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."specialties" ("id", "label", "value", "json_key") VALUES
	(1, 'Achats', 'purchases', 'purchases-option'),
	(2, 'AMOEX', 'amoex', 'amoex-option'),
	(3, 'Automatismes/ Contrôle commande', 'automation_control', 'automation-control-option'),
	(4, 'CVC', 'cvc', 'cvc-option'),
	(5, 'Chimie', 'chemistry', 'chemistry-option'),
	(6, 'Combustion', 'combustion', 'combustion-option'),
	(7, 'Conduite installation', 'installation_management', 'installation-management-option'),
	(8, 'Direction de projets', 'dir', 'dir-option'),
	(9, 'Elaboration budget', 'budget', 'budget-option'),
	(10, 'Electricité CFA', 'electricity_cfa', 'electricity-cfa-option'),
	(11, 'Electricité CFO', 'electricity_cfo', 'electricity-cfo-option'),
	(12, 'Génie civil', 'civil_engineering', 'civil-engineering-option'),
	(13, 'Gestion de projets', 'project_management', 'project-management-option'),
	(14, 'Hygiène sécurité Environnement', 'hse', 'hse-option'),
	(15, 'Logistique', 'logistics', 'logistics-option'),
	(16, 'Maintenance', 'maintenance', 'maintenance-option'),
	(17, 'Mécanique', 'mechanics', 'mechanics-option'),
	(18, 'Mise en service', 'commissioning', 'commissioning-option'),
	(19, 'Ouvrage d''art', 'art_work', 'art-work-option'),
	(20, 'Piping', 'piping', 'piping-option'),
	(21, 'Process', 'process', 'process-option'),
	(22, 'Qualité', 'quality', 'quality-option'),
	(23, 'Suivi environnementale', 'environmental_monitoring', 'environmental-monitoring-option'),
	(24, 'Valorisation énergétique', 'energy_recovery', 'energy-recovery-option'),
	(25, 'VRD', 'vrd', 'vrd-option'),
	(26, 'Autres', 'others', 'others-option'),
	(27, 'Pas de spécialité requise', 'no_specialty', 'no-specialty-option');


--
-- Data for Name: subjects; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."subjects" ("id", "label", "value", "json_key") VALUES
	(1, 'Énergie & nucléaire', 'energy_and_nuclear', 'energy-and-nuclear-option'),
	(2, 'Énergie renouvelable', 'renewable_energy', 'renewable-energy-option'),
	(3, 'Traitement des déchets', 'waste_treatment', 'waste-treatment-option'),
	(4, 'Industrie des procédeés', 'process_industry', 'process-industry-option'),
	(5, 'Eau', 'water', 'water-option'),
	(6, 'Infrastructure', 'infrastructure', 'infrastructure-option'),
	(7, 'Entreprenariat', 'entrepreneurship', 'entrepreneurship-option'),
	(8, 'Autre', 'other', 'other-option');


--
-- Data for Name: user_alerts; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id") VALUES
	('profile_files', 'profile_files', NULL, '2024-10-09 09:39:03.215275+00', '2024-10-09 09:39:03.215275+00', true, false, NULL, NULL, NULL),
	('mission_files', 'mission_files', NULL, '2024-10-09 09:39:19.423225+00', '2024-10-09 09:39:19.423225+00', true, false, NULL, NULL, NULL),
	('chat', 'chat', NULL, '2024-10-09 09:39:32.83972+00', '2024-10-09 09:39:32.83972+00', true, false, NULL, NULL, NULL),
	('blog', 'blog', NULL, '2024-10-09 09:39:45.578981+00', '2024-10-09 09:39:45.578981+00', true, false, NULL, NULL, NULL),
	('logo', 'logo', NULL, '2024-10-09 09:39:54.621875+00', '2024-10-09 09:39:54.621875+00', true, false, NULL, NULL, NULL);


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."objects" ("id", "bucket_id", "name", "owner", "created_at", "updated_at", "last_accessed_at", "metadata", "version", "owner_id", "user_metadata") VALUES
	('3c185d30-322d-4b19-8787-e056621eeef2', 'blog', 'zoom-des-metiers-de-la-transition-energetique-une-carriere-davenir-dans-les-energies-renouvelables-2/head.jpeg', NULL, '2024-10-09 10:40:33.605311+00', '2024-10-09 10:40:38.540735+00', '2024-10-09 10:40:33.605311+00', '{"eTag": "\"f83c187c3afeb0dc04264e6de46b305e\"", "size": 90026, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2024-10-09T10:40:39.000Z", "contentLength": 90026, "httpStatusCode": 200}', 'c9748d49-d716-4192-bad0-5da2ffcada96', NULL, NULL),
	('325dfcb9-bb38-46bd-a0ba-d53bb357a1c3', 'logo', 'xpert_one.png', NULL, '2024-10-09 09:40:26.82515+00', '2024-10-09 09:40:38.096586+00', '2024-10-09 09:40:26.82515+00', '{"eTag": "\"29c46e61c77e5b72507c94bce3fd9bdb\"", "size": 18294, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2024-10-09T09:40:38.000Z", "contentLength": 18294, "httpStatusCode": 200}', 'ab73f480-35a9-462b-be47-0c94adee04b5', NULL, NULL),
	('e56f6510-0825-415a-9cc0-b41b851ef255', 'profile_files', '60c8e7eb-fa23-4061-a1c2-af72856919b0/cv/cv_1728483987393', 'bba3fcbe-c509-43d1-b5d2-090c3298c8f8', '2024-10-09 14:26:30.55935+00', '2024-10-09 14:26:30.55935+00', '2024-10-09 14:26:30.55935+00', '{"eTag": "\"75cb4d74f6cc3efc4ebb2375c58fd3dd-2\"", "size": 9044930, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2024-10-09T14:26:31.000Z", "contentLength": 9044930, "httpStatusCode": 200}', '3745ce91-48fd-486e-bb59-52a1c6a0e9ba', 'bba3fcbe-c509-43d1-b5d2-090c3298c8f8', '{}'),
	('4dd1e9dc-2922-46f7-80f3-cc2966cf05d3', 'profile_files', '60c8e7eb-fa23-4061-a1c2-af72856919b0/cv/cv_1728483999049', 'bba3fcbe-c509-43d1-b5d2-090c3298c8f8', '2024-10-09 14:26:41.547956+00', '2024-10-09 14:26:41.547956+00', '2024-10-09 14:26:41.547956+00', '{"eTag": "\"75cb4d74f6cc3efc4ebb2375c58fd3dd-2\"", "size": 9044930, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2024-10-09T14:26:42.000Z", "contentLength": 9044930, "httpStatusCode": 200}', 'da13af9c-c842-4d83-8200-bcffec1d81d6', 'bba3fcbe-c509-43d1-b5d2-090c3298c8f8', '{}'),
	('023fcf3d-a8ab-4639-b32d-fe2738ac5d28', 'blog', 'a-la-conquete-dun-avenir-energetique-durable-2/head.jpeg', NULL, '2024-10-09 09:41:31.43381+00', '2024-10-09 09:41:47.522123+00', '2024-10-09 09:41:31.43381+00', '{"eTag": "\"1cc1b259675288a179d64426ae15f4ef\"", "size": 105220, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2024-10-09T09:41:48.000Z", "contentLength": 105220, "httpStatusCode": 200}', 'f61be43b-2d8e-4a7c-b72b-73859a34432c', NULL, NULL),
	('12713d1c-3c45-41d7-9677-fac815b1949c', 'blog', 'creer-son-entreprise-en-france-en-tant-que-freelance-avantages-et-inconvenients-des-differents-statuts-2/head.jpeg', NULL, '2024-10-09 10:36:02.167852+00', '2024-10-09 10:36:14.196172+00', '2024-10-09 10:36:02.167852+00', '{"eTag": "\"666b3abf53ab19e349560ef3c70ba4ea\"", "size": 9044930, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2024-10-09T10:36:14.000Z", "contentLength": 9044930, "httpStatusCode": 200}', '9aa851d6-f811-4623-af3d-7a6b164089d7', NULL, NULL),
	('93bf0bfb-c6ca-4d8d-9006-92e99b813e88', 'blog', 'le-freelancing-dans-le-domaine-de-la-transition-energetique-2/head.jpeg', NULL, '2024-10-09 10:36:39.814831+00', '2024-10-09 10:36:50.342705+00', '2024-10-09 10:36:39.814831+00', '{"eTag": "\"c38964f39eb59c2e3a7ee5f9b2b69750\"", "size": 133963, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2024-10-09T10:36:51.000Z", "contentLength": 133963, "httpStatusCode": 200}', '95c0ef8b-52ba-435f-8824-0da4a5f3d0f1', NULL, NULL),
	('22656499-c0fa-4e2d-9d72-3a88d13a8d3d', 'blog', 'le-freelancing-lalternative-moderne-au-cdi-de-chantier-2/head.jpeg', NULL, '2024-10-09 10:38:08.987273+00', '2024-10-09 10:38:20.311781+00', '2024-10-09 10:38:08.987273+00', '{"eTag": "\"291d2657a10657e4a39a9890abab2f3c\"", "size": 58649, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2024-10-09T10:38:21.000Z", "contentLength": 58649, "httpStatusCode": 200}', '666054be-a18d-4ff5-8eff-3a9de319cee9', NULL, NULL),
	('08be3995-d535-4731-9cea-221c16cadc76', 'blog', 'lessor-des-plateformes-de-freelance-une-opportunite-pour-les-metiers-de-la-transition-energetique-2/head.jpeg', NULL, '2024-10-09 10:38:36.97542+00', '2024-10-09 10:38:54.958963+00', '2024-10-09 10:38:36.97542+00', '{"eTag": "\"a4086a32ea4d7c784a5ee0661da457b4\"", "size": 403780, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2024-10-09T10:38:55.000Z", "contentLength": 403780, "httpStatusCode": 200}', 'a9409f26-c220-47ad-aa38-6fc80f76761d', NULL, NULL),
	('4cb6161b-9f7d-4a7f-8d17-6fbd0817dc8e', 'blog', 'model-30-linteret-du-freelancing-dans-les-entreprises-de-la-transition-energetique-2/head.jpeg', NULL, '2024-10-09 10:39:14.009034+00', '2024-10-09 10:39:47.539914+00', '2024-10-09 10:39:14.009034+00', '{"eTag": "\"0355d129b9e6766c0ba43465385fd407\"", "size": 480270, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2024-10-09T10:39:48.000Z", "contentLength": 480270, "httpStatusCode": 200}', '534aa5fd-095c-48ea-950f-46103bca7c88', NULL, NULL),
	('dba56445-c7d1-453a-9a04-82a208296ecd', 'blog', 'ou-trouver-un-emploi-en-freelance-dans-la-transition-energetique--2/head.jpeg', NULL, '2024-10-09 10:39:16.853031+00', '2024-10-09 10:39:55.393013+00', '2024-10-09 10:39:16.853031+00', '{"eTag": "\"e9852e19a06840e0c4ea8071878af412\"", "size": 194454, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2024-10-09T10:39:56.000Z", "contentLength": 194454, "httpStatusCode": 200}', '5b368491-b788-487d-a6a6-da6e0304200e', NULL, NULL),
	('5b1a9b60-3ef6-4b46-8eb0-57ee18b28845', 'blog', 'transition-energetique-ce-que-recherche-lingenieur-daujourdhui-2/head.jpeg', NULL, '2024-10-09 10:39:25.764864+00', '2024-10-09 10:40:02.204729+00', '2024-10-09 10:39:25.764864+00', '{"eTag": "\"c51c473d07ab0cb59905d0b36e5e55fc\"", "size": 95474, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2024-10-09T10:40:02.000Z", "contentLength": 95474, "httpStatusCode": 200}', 'cc45c641-348f-42c4-9eb0-63e3125082ad', NULL, NULL),
	('089e576e-c926-4efd-ace3-ab78bc19afcb', 'profile_files', '60c8e7eb-fa23-4061-a1c2-af72856919b0/civil_responsability/civil_responsability_1728484025290', 'bba3fcbe-c509-43d1-b5d2-090c3298c8f8', '2024-10-09 14:27:07.898283+00', '2024-10-09 14:27:07.898283+00', '2024-10-09 14:27:07.898283+00', '{"eTag": "\"75cb4d74f6cc3efc4ebb2375c58fd3dd-2\"", "size": 9044930, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2024-10-09T14:27:08.000Z", "contentLength": 9044930, "httpStatusCode": 200}', '1e9a9cdc-0c99-45ca-822e-cdfe905d581d', 'bba3fcbe-c509-43d1-b5d2-090c3298c8f8', '{}'),
	('3bc7b462-cc1a-493d-86c7-f7dd4fb53b99', 'profile_files', '60c8e7eb-fa23-4061-a1c2-af72856919b0/habilitations/habilitation_atex', 'bba3fcbe-c509-43d1-b5d2-090c3298c8f8', '2024-10-09 14:27:42.786731+00', '2024-10-09 14:27:42.786731+00', '2024-10-09 14:27:42.786731+00', '{"eTag": "\"f83c187c3afeb0dc04264e6de46b305e\"", "size": 90026, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2024-10-09T14:27:43.000Z", "contentLength": 90026, "httpStatusCode": 200}', 'e4943b56-35e3-4555-8473-f6dff4e6aec6', 'bba3fcbe-c509-43d1-b5d2-090c3298c8f8', '{}'),
	('f524f46e-4644-4c5c-b1a5-828080d84fdb', 'profile_files', 'F 8510/cv/cv_1728568444508', '4732f5a5-eec4-4d09-9143-9b90106b6c7e', '2024-10-10 13:54:05.069236+00', '2024-10-14 12:25:54.046348+00', '2024-10-10 13:54:05.069236+00', '{"eTag": "\"a4086a32ea4d7c784a5ee0661da457b4\"", "size": 403780, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2024-10-14T12:25:54.000Z", "contentLength": 403780, "httpStatusCode": 200}', 'cdf16cc9-7335-4bf5-b5dc-9bf77a202e70', '4732f5a5-eec4-4d09-9143-9b90106b6c7e', '{}'),
	('8341e346-303b-487a-9f02-f30827e7e638', 'profile_files', 'X 7676/cv/cv_1728560986395', '12bf2774-968c-4434-befa-83577a278b99', '2024-10-10 11:49:47.042091+00', '2024-10-14 12:27:28.100193+00', '2024-10-10 11:49:47.042091+00', '{"eTag": "\"e9852e19a06840e0c4ea8071878af412\"", "size": 194454, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2024-10-14T12:27:28.000Z", "contentLength": 194454, "httpStatusCode": 200}', 'dda25a1d-e151-4f7a-90ad-39a8f6e6aecb', '12bf2774-968c-4434-befa-83577a278b99', '{}'),
	('0da1d54d-6c74-475a-be5b-14de555394c1', 'profile_files', 'X 7676/civil_responsability/civil_responsability_1728561012560', '12bf2774-968c-4434-befa-83577a278b99', '2024-10-10 11:50:13.079432+00', '2024-10-14 12:27:28.094885+00', '2024-10-10 11:50:13.079432+00', '{"eTag": "\"a4086a32ea4d7c784a5ee0661da457b4\"", "size": 403780, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2024-10-14T12:27:28.000Z", "contentLength": 403780, "httpStatusCode": 200}', 'd92b200e-3043-48df-bcf4-1bbcb32f1d46', '12bf2774-968c-4434-befa-83577a278b99', '{}'),
	('14eba0c0-f7f4-4cd5-b94f-422b4ab90a8d', 'profile_files', 'X 7676/habilitations/others', '12bf2774-968c-4434-befa-83577a278b99', '2024-10-10 11:50:58.90976+00', '2024-10-14 12:27:29.124846+00', '2024-10-10 11:50:58.90976+00', '{"eTag": "\"f83c187c3afeb0dc04264e6de46b305e\"", "size": 90026, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2024-10-14T12:27:29.000Z", "contentLength": 90026, "httpStatusCode": 200}', '2267c1f8-32ad-43e1-88c7-af625220d020', '12bf2774-968c-4434-befa-83577a278b99', '{}'),
	('dc8dc921-13a4-43e1-ad97-0cd7bfca3994', 'chat', 'chat/2/image/jpeg_1729174404868', 'b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2', '2024-10-17 14:13:25.716004+00', '2024-10-17 14:13:25.716004+00', '2024-10-17 14:13:25.716004+00', '{"eTag": "\"a4086a32ea4d7c784a5ee0661da457b4\"", "size": 403780, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2024-10-17T14:13:26.000Z", "contentLength": 403780, "httpStatusCode": 200}', '37650470-6a92-4bcd-aa10-dcde0ef3eb7e', 'b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2', '{}'),
	('2f6ec31d-9887-47f9-b757-947a6f3ac678', 'profile_files', '08c42297-8844-48a5-a30a-f00b62525e1b/cv/cv_1729240352365', '48048977-4654-4347-ace1-c29af405c1ce', '2024-10-18 08:32:32.902856+00', '2024-10-18 08:32:32.902856+00', '2024-10-18 08:32:32.902856+00', '{"eTag": "\"bf6e3ef511ebf2729dd395da2a7e823d\"", "size": 110771, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2024-10-18T08:32:33.000Z", "contentLength": 110771, "httpStatusCode": 200}', '7d3eb4d4-c5e6-4fe7-bb71-96af651684c0', '48048977-4654-4347-ace1-c29af405c1ce', '{}'),
	('b952d9a0-5d5b-4574-9706-27a2a302a111', 'chat', 'chat/30/image/jpeg_1729240834637', '48048977-4654-4347-ace1-c29af405c1ce', '2024-10-18 08:40:35.347575+00', '2024-10-18 08:40:35.347575+00', '2024-10-18 08:40:35.347575+00', '{"eTag": "\"a4086a32ea4d7c784a5ee0661da457b4\"", "size": 403780, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2024-10-18T08:40:36.000Z", "contentLength": 403780, "httpStatusCode": 200}', '8f594449-c58a-4e6b-8453-d88c1601afab', '48048977-4654-4347-ace1-c29af405c1ce', '{}'),
	('decb88ce-0d44-4a0f-a057-cd688adee6e3', 'chat', 'chat/63/image/jpeg_1729263513408', 'b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2', '2024-10-18 14:58:34.179503+00', '2024-10-18 14:58:34.179503+00', '2024-10-18 14:58:34.179503+00', '{"eTag": "\"291d2657a10657e4a39a9890abab2f3c\"", "size": 58649, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2024-10-18T14:58:34.000Z", "contentLength": 58649, "httpStatusCode": 200}', '534ac1a8-f7da-459f-95da-05902ffa3161', 'b5c938b0-70ca-4fd0-8c8b-ea1f14e7bfd2', '{}'),
	('ddf10bc0-050b-4719-a2ab-3f22d1cbf808', 'chat', 'chat/63/text/html_1729263544303', '48048977-4654-4347-ace1-c29af405c1ce', '2024-10-18 14:59:04.968265+00', '2024-10-18 14:59:04.968265+00', '2024-10-18 14:59:04.968265+00', '{"eTag": "\"a5eef7592976a793b38c0c96f6abc217\"", "size": 32749, "mimetype": "text/html", "cacheControl": "max-age=3600", "lastModified": "2024-10-18T14:59:05.000Z", "contentLength": 32749, "httpStatusCode": 200}', 'e8edd5b2-d844-43fb-9669-0069d0809ff8', '48048977-4654-4347-ace1-c29af405c1ce', '{}'),
	('4804edd2-65f9-4cee-8070-4142ef72c552', 'profile_files', '209d7f83-43a3-4dd3-9cc5-00f68d5c4846/cv/cv_1731577556751', 'dcae2de7-dc8c-49fb-a3e1-673b33a802af', '2024-11-14 09:45:57.238971+00', '2024-11-14 09:45:57.238971+00', '2024-11-14 09:45:57.238971+00', '{"eTag": "\"22012fae4b52c27bf1fb920d2c8c1b81\"", "size": 18493, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2024-11-14T09:45:58.000Z", "contentLength": 18493, "httpStatusCode": 200}', 'b6ea234e-9204-4b61-836e-bd09bc802dfc', 'dcae2de7-dc8c-49fb-a3e1-673b33a802af', '{}');


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: hooks; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--



--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 148, true);


--
-- Name: key_key_id_seq; Type: SEQUENCE SET; Schema: pgsodium; Owner: supabase_admin
--

SELECT pg_catalog.setval('"pgsodium"."key_key_id_seq"', 1, false);


--
-- Name: article_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."article_id_seq"', 1, false);


--
-- Name: chat_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."chat_id_seq"', 77, true);


--
-- Name: company_roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."company_roles_id_seq"', 12, true);


--
-- Name: contact_xpert_demands_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."contact_xpert_demands_id_seq"', 1, false);


--
-- Name: diplomas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."diplomas_id_seq"', 17, true);


--
-- Name: expertise_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."expertise_id_seq"', 7, true);


--
-- Name: expertises_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."expertises_id_seq"', 26, true);


--
-- Name: habilitations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."habilitations_id_seq"', 8, true);


--
-- Name: infrastructures_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."infrastructures_id_seq"', 3, true);


--
-- Name: job_titles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."job_titles_id_seq"', 32, true);


--
-- Name: juridic_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."juridic_status_id_seq"', 10, true);


--
-- Name: languages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."languages_id_seq"', 9, true);


--
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."messages_id_seq"', 259, true);


--
-- Name: mission_application_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."mission_application_id_seq"', 1, true);


--
-- Name: mission_canceled_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."mission_canceled_id_seq"', 1, false);


--
-- Name: mission_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."mission_id_seq"', 3, true);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."notifications_id_seq"', 1, false);


--
-- Name: posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."posts_id_seq"', 27, true);


--
-- Name: profile_education_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."profile_education_id_seq"', 3, true);


--
-- Name: profile_experience_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."profile_experience_id_seq"', 7, true);


--
-- Name: profile_mission_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."profile_mission_id_seq"', 6, true);


--
-- Name: sectors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."sectors_id_seq"', 7, true);


--
-- Name: specialties_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."specialties_id_seq"', 27, true);


--
-- Name: status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."status_id_seq"', 7, true);


--
-- Name: subjects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."subjects_id_seq"', 8, true);


--
-- Name: user_alerts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."user_alerts_id_seq"', 1, false);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('"supabase_functions"."hooks_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

RESET ALL;
