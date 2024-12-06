set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.calculate_matching_score(p_mission_id bigint, p_xpert_id uuid)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
DECLARE
  v_score numeric;
  v_mission mission;
  v_profile_mission profile_mission;
  v_profile_expertise profile_expertise;
  v_profile_experience profile_experience;
  v_total_criteria integer := 0;
  v_matching_criteria numeric := 0;
  v_partial_matches numeric := 0;
BEGIN
  -- Get mission and profile data
  SELECT * INTO v_mission FROM mission WHERE id = p_mission_id;
  SELECT * INTO v_profile_mission FROM profile_mission WHERE profile_id = p_xpert_id;
  SELECT * INTO v_profile_expertise FROM profile_expertise WHERE profile_id = p_xpert_id;
  SELECT * INTO v_profile_experience FROM profile_experience WHERE profile_id = p_xpert_id ORDER BY id DESC LIMIT 1;

  -- Job Title
  IF v_mission.job_title IS NOT NULL THEN
    v_total_criteria := v_total_criteria + 1;
    IF v_profile_mission.job_titles @> ARRAY[v_mission.job_title] THEN
      v_matching_criteria := v_matching_criteria + 1;
    ELSE
      -- Calculate partial match
      SELECT COUNT(*) / NULLIF(array_length(v_profile_mission.job_titles, 1), 0) * 0.5
      INTO v_partial_matches
      FROM unnest(v_profile_mission.job_titles) j
      WHERE j = v_mission.job_title;
    END IF;
  END IF;

  -- Post Type
  IF v_mission.post_type IS NOT NULL THEN
    v_total_criteria := v_total_criteria + 1;
    IF v_profile_experience.post_type && v_mission.post_type THEN
      v_matching_criteria := v_matching_criteria + 1;
    ELSE
      -- Calculate partial match
      SELECT COUNT(*) / NULLIF(array_length(v_mission.post_type, 1), 0) * 0.5
      INTO v_partial_matches
      FROM unnest(v_profile_experience.post_type) pt
      WHERE pt = ANY(v_mission.post_type);
    END IF;
  END IF;

  -- Sector match
  IF v_mission.sector IS NOT NULL THEN
    v_total_criteria := v_total_criteria + 1;
    IF v_profile_experience.sector = v_mission.sector THEN
      v_matching_criteria := v_matching_criteria + 1;
    END IF;
  END IF;

  -- Specialties
  IF v_mission.specialties IS NOT NULL THEN
    v_total_criteria := v_total_criteria + 1;
    IF v_profile_mission.specialties && v_mission.specialties THEN
      v_matching_criteria := v_matching_criteria + 1;
    ELSE
      -- Calculate partial match
      SELECT COUNT(*) / NULLIF(array_length(v_mission.specialties, 1), 0) * 0.5
      INTO v_partial_matches
      FROM unnest(v_profile_mission.specialties) s
      WHERE s = ANY(v_mission.specialties);
    END IF;
  END IF;

  -- Expertises
  IF v_mission.expertises IS NOT NULL THEN
    v_total_criteria := v_total_criteria + 1;
    IF v_profile_expertise.expertises && v_mission.expertises THEN
      v_matching_criteria := v_matching_criteria + 1;
    ELSE
      -- Calculate partial match
      SELECT COUNT(*) / NULLIF(array_length(v_mission.expertises, 1), 0) * 0.5
      INTO v_partial_matches
      FROM unnest(v_profile_expertise.expertises) e
      WHERE e = ANY(v_mission.expertises);
    END IF;
  END IF;

  -- Languages
  IF v_mission.languages IS NOT NULL THEN
    v_total_criteria := v_total_criteria + 1;
    IF v_profile_expertise.maternal_language = ANY(v_mission.languages) THEN
      v_matching_criteria := v_matching_criteria + 1;
    END IF;
  END IF;

  -- Calculate final score including partial matches
  IF v_total_criteria = 0 THEN
    v_score := 0;
  ELSE
    v_score := ((v_matching_criteria + v_partial_matches) / v_total_criteria) * 100;
  END IF;

  RETURN ROUND(LEAST(100, GREATEST(0, v_score))::numeric, 2);
END;
$function$
;


