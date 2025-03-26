-- Add evaluation fields to profile table
ALTER TABLE public.profile
ADD COLUMN evaluation_score smallint NULL,
ADD COLUMN self_evaluation_score smallint NULL;

-- Add constraints to ensure scores are between 1 and 10
ALTER TABLE public.profile
ADD CONSTRAINT profile_evaluation_score_check CHECK (evaluation_score >= 1 AND evaluation_score <= 10),
ADD CONSTRAINT profile_self_evaluation_score_check CHECK (self_evaluation_score >= 1 AND self_evaluation_score <= 10); 