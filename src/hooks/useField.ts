import { creationMissionData } from '@/data/mission';
import {
  profileData,
  profileDataCompany,
  profileDataEducation,
  profileDataExperience,
  profileDataExpertise,
  profileDataMission,
  profileDataStatus,
} from '@/data/profile';
import type {
  CreationMission,
  ProfileData,
  ProfileDataEducation,
  ProfileDataExperience,
  ProfileDataExpertise,
  ProfileDataMission,
  ProfileDataStatus,
  ProfileDataUnion,
  UserType,
} from '@/types/types';
import type {
  DBMission,
  DBProfileEducation,
  DBProfileExperience,
  DBProfileExpertise,
  DBProfileMission,
  DBProfileStatus,
  DBUser,
} from '@/types/typesDb';
import { checkLinkedInUrl, checkPhone, checkSIRET } from '@/utils/check';
import { deepEqual } from '@/utils/deepEqual';
import { useState } from 'react';

type PageAllowed =
  | 'profile'
  | 'status'
  | 'expertise'
  | 'mission'
  | 'experience'
  | 'education'
  | 'profile_company'
  | 'creation_mission'
  | 'creation_xpert';

export const useField = ({
  user,
  userBis,
  page,
}: {
  user: UserType;
  userBis?: UserType | DBMission;
  page:
    | 'profile'
    | 'status'
    | 'expertise'
    | 'mission'
    | 'experience'
    | 'education'
    | 'profile_company'
    | 'creation_mission'
    | 'creation_xpert';
}) => {
  const [isInitialized, setIsInitialized] = useState(false);

  const dataMap: Record<PageAllowed, ProfileDataUnion | CreationMission> = {
    profile: profileData,
    status: profileDataStatus,
    expertise: profileDataExpertise,
    experience: profileDataExperience,
    education: profileDataEducation,
    mission: profileDataMission,
    profile_company: profileDataCompany,
    creation_mission: creationMissionData,
    creation_xpert: profileData,
  };

  const currentProfileData = dataMap[page];

  // GET FIELDS REQUIRED TO GO TO NEXT STEP
  const getRequiredFields = (
    data: ProfileDataUnion | CreationMission,
    objUser?: UserType
  ) => {
    const requiredFields = Object.entries(data).filter(([key, value]) => {
      if (value.required == 'false') return false;
      if (value.required == 'depends') {
        return checkDependFields({
          key: key as keyof UserType,
          objUser: objUser,
        });
      }
      return value.required == 'true';
    });
    return requiredFields;
  };

  // GET FIELDS NOT REQUIRED TO GO TO NEXT STEP BUT INCREASE PROGRESS
  const getNotRequiredFields = (data: ProfileDataUnion | CreationMission) => {
    const notRequiredFields = Object.entries(data).filter(([key, value]) => {
      if (value.required == 'false') {
        return checkNotRequiredFields(key as keyof UserType);
      }
    });
    return notRequiredFields;
  };

  // CHECK WHEN FIELDS APPEAR AND SO INCREASE PROGRESS
  const checkNotRequiredFields = (key: keyof UserType) => {
    // CHECK PROFILE SECTION
    if (currentProfileData == profileData) {
      return key == (profileData as ProfileData).linkedin?.name;
    }

    //CHECK STATUS SECTION
    if (currentProfileData == profileDataStatus) {
      if ((user as DBProfileStatus).status === 'company') {
        // return key == (profileDataStatus as ProfileDataStatus)?.urssaf_name?.name || key == (profileDataStatus as ProfileDataStatus)?.civil_responsability_name?.name || key == (profileDataStatus as ProfileDataStatus)?.rib_name?.name || key == (profileDataStatus as ProfileDataStatus)?.kbis_name?.name
        return (
          key == (profileDataStatus as ProfileDataStatus).urssaf_name?.name ||
          key ==
            (profileDataStatus as ProfileDataStatus).civil_responsability_name
              ?.name ||
          key == (profileDataStatus as ProfileDataStatus).kbis_name?.name
        );
      }
      // if ((user as DBProfileStatus).status === "portage" || (user as DBProfileStatus).status === "cdi_mission" || (user as DBProfileStatus).status === "cdd" || (user as DBProfileStatus).status === "cdi") {
      // 	return key == (profileDataStatus as ProfileDataStatus)?.rib_name?.name
      // }
      // if ((user as DBProfileStatus).status === "auto-entrepreneur") {
      // 	return key == (profileDataStatus as ProfileDataStatus)?.civil_responsability_name?.name || key == (profileDataStatus as ProfileDataStatus)?.rib_name?.name
      // }
    }

    if (currentProfileData == profileDataExpertise) {
      return (
        key ==
        (profileDataExpertise as ProfileDataExpertise).habilitations?.name
      );
    }
  };

  // CHECK IF FIELDS ARE REQUIRED AND MISSING
  const checkIfRequiredAndNotMissing = (key: keyof UserType) => {
    if (!isInitialized) return false;
    const requiredFields = getRequiredFields(currentProfileData);
    const isRequired = requiredFields.some(([keyField]) => {
      return keyField == key;
    });

    if (!isRequired) return false;

    return Array.isArray(user[key])
      ? (user as any)[key].length == 0
      : !user[key];
  };

  // CHECK IF FIELDS ARE REQUIRED DEPEND ON OTHER FIELDS SELECTED
  const checkDependFields = ({
    key,
    objUser = user,
  }: {
    key: keyof UserType;
    objUser?: UserType;
  }) => {
    // CHECK PROFILE DEPEND SECTION
    if (currentProfileData === profileData) {
      if ((objUser as DBUser).how_did_you_hear_about_us === 'other') {
        return (
          key ===
          (profileData as ProfileData).how_did_you_hear_about_us_other?.name
        );
      }
      return false;
    }

    // CHECK STATUS DEPEND SECTION
    if (currentProfileData === profileDataStatus) {
      if ((objUser as DBProfileStatus).juridic_status?.includes('other')) {
        return (
          key ===
          (profileDataStatus as ProfileDataStatus).juridic_status_other?.name
        );
      }

      if ((objUser as DBProfileStatus).status === 'auto-entrepreneur') {
        return (
          key === (profileDataStatus as ProfileDataStatus).status?.name ||
          key ===
            (profileDataStatus as ProfileDataStatus).juridic_status?.name ||
          key === (profileDataStatus as ProfileDataStatus).siret?.name
        );
      }

      if ((objUser as DBProfileStatus).status === 'company') {
        return (
          key === (profileDataStatus as ProfileDataStatus).status?.name ||
          key ===
            (profileDataStatus as ProfileDataStatus).juridic_status?.name ||
          key === (profileDataStatus as ProfileDataStatus).siret?.name ||
          key === (profileDataStatus as ProfileDataStatus).company_name?.name
        );
      }

      if ((objUser as DBProfileStatus).status === 'portage') {
        if ((objUser as DBProfileStatus).has_portage === true) {
          return (
            key === (profileDataStatus as ProfileDataStatus).status?.name ||
            key ===
              (profileDataStatus as ProfileDataStatus).has_portage?.name ||
            key === (profileDataStatus as ProfileDataStatus).portage_name?.name
          );
        }
        return (
          key === (profileDataStatus as ProfileDataStatus).status?.name ||
          key === (profileDataStatus as ProfileDataStatus).has_portage?.name
        );
      }

      if (
        (objUser as DBProfileStatus).iam === 'employee' ||
        (user as DBProfileStatus).iam === 'inde_freelance'
      ) {
        return key === (profileDataStatus as ProfileDataStatus).status?.name;
      }

      return false;
    }

    // CHECK EXPERTISE DEPEND SECTION
    const requiredFields: string[] = [];

    if (currentProfileData === profileDataExpertise) {
      if ((objUser as DBProfileExpertise).expertises?.includes('others')) {
        requiredFields.push(
          (profileDataExpertise as ProfileDataExpertise).expertises_other
            ?.name ?? ''
        );
      }
      if ((objUser as DBProfileExpertise).specialties?.includes('others')) {
        requiredFields.push(
          (profileDataExpertise as ProfileDataExpertise).specialties_other
            ?.name ?? ''
        );
      }
      if ((userBis as DBProfileStatus).iam !== 'student_apprentice') {
        requiredFields.push(
          (profileDataExpertise as ProfileDataExpertise).diploma?.name ?? ''
        );
        requiredFields.push(
          (profileDataExpertise as ProfileDataExpertise).degree?.name ?? ''
        );
      }

      if ((objUser as DBProfileExpertise).maternal_language === 'other') {
        requiredFields.push(
          (profileDataExpertise as ProfileDataExpertise).maternal_language_other
            ?.name ?? ''
        );
      }
      if ((objUser as DBProfileExpertise).degree === 'other') {
        requiredFields.push(
          (profileDataExpertise as ProfileDataExpertise).degree_other?.name ??
            ''
        );
      }

      // CHECK EXPERTISE -> EDUCATION DEPEND SECTION
      if ((userBis as DBProfileStatus).iam == 'student_apprentice') {
        if ((objUser as DBProfileEducation).education_diploma === 'other') {
          requiredFields.push(
            (profileDataEducation as ProfileDataEducation).detail_diploma
              ?.name ?? ''
          );
        }
      }

      // CHECK EXPERTISE -> EXPERIENCE DEPEND SECTION
      if ((objUser as DBProfileExperience).has_led_team === 'true') {
        requiredFields.push(
          (profileDataExperience as ProfileDataExperience).how_many_people_led
            ?.name ?? ''
        );
      }
      if ((objUser as DBProfileExperience).post?.includes('other')) {
        requiredFields.push(
          (profileDataExperience as ProfileDataExperience).post_other?.name ??
            ''
        );
      }
      if ((objUser as DBProfileExperience).sector === 'energy') {
        requiredFields.push(
          (profileDataExperience as ProfileDataExperience).sector_energy
            ?.name ?? ''
        );
      }
      if ((objUser as DBProfileExperience).sector === 'renewable_energy') {
        requiredFields.push(
          (profileDataExperience as ProfileDataExperience)
            .sector_renewable_energy?.name ?? ''
        );
      }
      if ((objUser as DBProfileExperience).sector === 'waste_treatment') {
        requiredFields.push(
          (profileDataExperience as ProfileDataExperience)
            .sector_waste_treatment?.name ?? ''
        );
      }
      if ((objUser as DBProfileExperience).sector === 'infrastructure') {
        requiredFields.push(
          (profileDataExperience as ProfileDataExperience).sector_infrastructure
            ?.name ?? ''
        );
      }

      if (
        (objUser as DBProfileExperience).sector === 'others' ||
        (objUser as DBProfileExperience).sector === 'other'
      ) {
        requiredFields.push(
          (profileDataExperience as ProfileDataExperience).sector_other?.name ??
            ''
        );
      }

      if ((objUser as DBProfileExperience).sector_infrastructure === 'other') {
        requiredFields.push(
          (profileDataExperience as ProfileDataExperience)
            .sector_infrastructure_other?.name ?? ''
        );
      }
      if (
        (objUser as DBProfileExperience).sector_renewable_energy === 'other'
      ) {
        requiredFields.push(
          (profileDataExperience as ProfileDataExperience)
            .sector_renewable_energy_other?.name ?? ''
        );
      }
    }

    // PROFIL MISSION DEPEND SECTION
    if (currentProfileData === profileDataMission) {
      if ((objUser as DBProfileMission).sector?.includes('others')) {
        requiredFields.push(
          (profileDataMission as ProfileDataMission).sector_other?.name ?? ''
        );
      }
      if ((objUser as DBProfileMission).job_titles?.includes('other')) {
        requiredFields.push(
          (profileDataMission as ProfileDataMission).job_titles_other?.name ??
            ''
        );
      }
      if ((objUser as DBProfileMission).specialties?.includes('others')) {
        requiredFields.push(
          (profileDataMission as ProfileDataMission).specialties_others?.name ??
            ''
        );
      }
      if ((userBis as DBProfileStatus).iam === 'student_apprentice') {
        requiredFields.push(
          (profileDataMission as ProfileDataMission).student_contract?.name ??
            ''
        );
      }
      if ((objUser as DBProfileMission).workstation_needed?.includes('true')) {
        requiredFields.push(
          (profileDataMission as ProfileDataMission).workstation_description
            ?.name ?? ''
        );
      }
      if ((objUser as DBProfileMission).expertises?.includes('others')) {
        requiredFields.push(
          (profileDataMission as ProfileDataMission).expertises_others?.name ??
            ''
        );
      }
      if ((objUser as DBProfileMission).area?.includes('france')) {
        requiredFields.push(
          (profileDataMission as ProfileDataMission).france_detail?.name ?? ''
        );
      }
      if ((objUser as DBProfileMission).france_detail?.includes('regions')) {
        requiredFields.push(
          (profileDataMission as ProfileDataMission).regions?.name ?? ''
        );
      }
      if ((objUser as DBProfileMission).revenu_type === 'brut') {
        requiredFields.push(
          (profileDataMission as ProfileDataMission).desired_monthly_brut
            ?.name ?? ''
        );
      }
      if ((objUser as DBProfileMission).revenu_type === 'tjm') {
        requiredFields.push(
          (profileDataMission as ProfileDataMission).desired_tjm?.name ?? ''
        );
      }
      if ((userBis as DBProfileStatus).iam != 'student_apprentice') {
        requiredFields.push(profileDataMission.revenu_type?.name ?? '');
      }
    }

    // PROFIL COMPANY DEPEND SECTION
    if (currentProfileData === profileDataCompany) {
      if ((objUser as DBUser).company_role?.includes('other')) {
        requiredFields.push(
          (profileDataCompany as ProfileData).company_role_other?.name ?? ''
        );
      }
      if ((objUser as DBUser).sector?.includes('others')) {
        requiredFields.push(
          (profileDataCompany as ProfileData).sector_other?.name ?? ''
        );
      }
      if (
        (objUser as DBUser).sector?.includes('energy') &&
        !(objUser as DBUser).sector?.includes('renewable_energy')
      ) {
        requiredFields.push(
          (profileDataCompany as ProfileData).sector_energy?.name ?? ''
        );
      }
      if ((objUser as DBUser).sector?.includes('renewable_energy')) {
        requiredFields.push(
          (profileDataCompany as ProfileData).sector_renewable_energy?.name ??
            ''
        );
      }
      if ((objUser as DBUser).sector?.includes('waste_treatment')) {
        requiredFields.push(
          (profileDataCompany as ProfileData).sector_waste_treatment?.name ?? ''
        );
      }
      if ((objUser as DBUser).sector?.includes('infrastructure')) {
        requiredFields.push(
          (profileDataCompany as ProfileData).sector_infrastructure?.name ?? ''
        );
      }
      if ((objUser as DBUser).sector_infrastructure?.includes('other')) {
        requiredFields.push(
          (profileDataCompany as ProfileData).sector_infrastructure_other
            ?.name ?? ''
        );
      }
      if ((objUser as DBUser).sector_renewable_energy === 'other') {
        requiredFields.push(
          creationMissionData.sector_renewable_energy_other?.name ?? ''
        );
      }

      if ((objUser as DBUser).area?.includes('france')) {
        requiredFields.push(
          (profileDataCompany as ProfileData).france_detail?.name ?? ''
        );
      }
      if ((objUser as DBUser).france_detail?.includes('regions')) {
        requiredFields.push(
          (profileDataCompany as ProfileData).regions?.name ?? ''
        );
      }
      if ((objUser as DBUser).how_did_you_hear_about_us?.includes('other')) {
        requiredFields.push(
          (profileDataCompany as ProfileData).how_did_you_hear_about_us_other
            ?.name ?? ''
        );
      }
    }

    // CREATION MISSION DEPEND SECTION
    if (currentProfileData === creationMissionData) {
      if (
        (objUser as DBMission).job_title === 'other' ||
        (objUser as DBMission).job_title === 'other'
      ) {
        requiredFields.push(creationMissionData.job_title_other?.name ?? '');
      }

      if (
        (objUser as DBMission).sector === 'other' ||
        (objUser as DBMission).sector === 'others'
      ) {
        requiredFields.push(creationMissionData.sector_other?.name ?? '');
      }

      if ((objUser as DBMission).specialties?.includes('others')) {
        requiredFields.push(creationMissionData.specialties_other?.name ?? '');
      }

      if ((objUser as DBMission).expertises?.includes('others')) {
        requiredFields.push(creationMissionData.expertises_other?.name ?? '');
      }

      if ((objUser as DBMission).diplomas?.includes('other')) {
        requiredFields.push(creationMissionData.diplomas_other?.name ?? '');
      }

      if ((objUser as DBMission).languages?.includes('other')) {
        requiredFields.push(creationMissionData.languages_other?.name ?? '');
      }
      if ((objUser as DBMission).sector === 'energy') {
        requiredFields.push(creationMissionData.sector_energy?.name ?? '');
      }
      if ((objUser as DBMission).sector === 'renewable_energy') {
        requiredFields.push(
          creationMissionData.sector_renewable_energy?.name ?? ''
        );
      }
      if ((objUser as DBMission).sector === 'waste_treatment') {
        requiredFields.push(
          creationMissionData.sector_waste_treatment?.name ?? ''
        );
      }
      if ((objUser as DBMission).sector === 'infrastructure') {
        requiredFields.push(
          creationMissionData.sector_infrastructure?.name ?? ''
        );
      }
      if ((objUser as DBMission).sector_renewable_energy === 'other') {
        requiredFields.push(
          creationMissionData.sector_renewable_energy_other?.name ?? ''
        );
      }

      if ((objUser as DBMission).sector_infrastructure === 'other') {
        requiredFields.push(
          creationMissionData.sector_infrastructure_other?.name ?? ''
        );
      }
    }
    return requiredFields.includes(key);
  };

  // PREPARE DATA TO SEND TO BACKEND TO GET PROGRESS - MISSINGS - USED DATA - CUSTOM ERROR
  const prepareData = ({
    profileData,
    objUser = user,
  }: {
    profileData: ProfileDataUnion | CreationMission;
    objUser?: UserType;
  }) => {
    // GET REQUIRED FIELDS
    const requiredFields = getRequiredFields(profileData, objUser);

    // GET MISSINGS ELEMENTS
    const elementMissings = requiredFields
      .filter(([key]) => {
        const value = objUser[key as keyof UserType];
        return !value || (Array.isArray(value) && value.length === 0);
      })
      .map(([_, value]) => value);

    // GET NOT REQUIRED FIELDS TO ADAPT PROGRESS BAR
    const notRequiredFields = getNotRequiredFields(profileData);

    const elementsMissingToProgressBeFull = notRequiredFields
      .filter(([key]) => {
        const value = objUser[key as keyof UserType];

        return !value || (Array.isArray(value) && value.length === 0);
      })
      .map(([_, value]) => value);

    // GET DATA UPDATED TO SEND TO BACKEND
    const usedData = Object.entries(objUser).filter(([key, value]) => {
      // return !deepEqual({ obj1: value, obj2DB: profileData }) && key == profileData[key as keyof UserType]?.name && (requiredFields.some(([keyField]) => keyField == key) || notRequiredFields.some(([keyField]) => keyField == key))
      return (
        !deepEqual({ obj1: value, obj2DB: profileData }) &&
        key == profileData[key as keyof UserType]?.name
      );
    });

    // 'TRANSFORM' DATA TO JSON
    const usedDataJson = Object.fromEntries(usedData);

    const customsError = [];
    const errorFields = [];

    // CHECK SIRET
    const siret = usedDataJson.siret;
    if (siret) {
      const isSiretValid = checkSIRET(siret as string);
      if (!isSiretValid) {
        // GET PROGRESS BAR
        customsError.push("Le numéro de SIRET n'est pas valide");
        errorFields.push('siret');
      }
    }

    const linkedin = usedDataJson.linkedin;

    if (linkedin) {
      const isLinkedinValid = checkLinkedInUrl(linkedin);
      if (!isLinkedinValid) {
        customsError.push("Le lien Linkedin n'est pas valide");
        errorFields.push('linkedin');
      }
    }

    const mobile = usedDataJson.mobile;
    if (mobile) {
      const isValid = checkPhone(mobile as string);
      if (!isValid) {
        errorFields.push('mobile');
        customsError.push("Le numéro de téléphone mobile n'est pas valide");
      }
    }
    const fix = usedDataJson.fix;
    if (fix) {
      const isValid = checkPhone(fix as string);
      if (!isValid) {
        errorFields.push('fix');
        customsError.push("Le numéro de téléphone fixe n'est pas valide");
      }
    }
    if (customsError.length > 0) {
      const { mobile, fix, linkedin, siret, ...rest } = usedDataJson;
      const progress = Math.round(
        ((Object.keys(profileData).length -
          elementMissings.length -
          elementsMissingToProgressBeFull.length -
          customsError.length) *
          100) /
          Object.keys(profileData).length
      );
      return {
        usedDataJson: rest,
        elementMissings,
        progress,
        customError: customsError.join(', '),
        errorFields,
      };
    }

    // GET PROGRESS BAR
    const progress = Math.round(
      ((Object.keys(profileData).length -
        elementMissings.length -
        elementsMissingToProgressBeFull.length) *
        100) /
        Object.keys(profileData).length
    );

    return { usedDataJson, elementMissings, progress, customError: null };
  };

  return {
    checkIfRequiredAndNotMissing,
    prepareData,
    setIsInitialized,
    isInitialized,
  };
};
