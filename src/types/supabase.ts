export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      article: {
        Row: {
          author_id: string | null;
          categories: Database['public']['Enums']['categories'][] | null;
          category: string | null;
          content: string | null;
          created_at: string;
          description: string | null;
          id: number;
          image: string | null;
          slug: string | null;
          title: string | null;
        };
        Insert: {
          author_id?: string | null;
          categories?: Database['public']['Enums']['categories'][] | null;
          category?: string | null;
          content?: string | null;
          created_at?: string;
          description?: string | null;
          id?: number;
          image?: string | null;
          slug?: string | null;
          title?: string | null;
        };
        Update: {
          author_id?: string | null;
          categories?: Database['public']['Enums']['categories'][] | null;
          category?: string | null;
          content?: string | null;
          created_at?: string;
          description?: string | null;
          id?: number;
          image?: string | null;
          slug?: string | null;
          title?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'article_author_id_fkey';
            columns: ['author_id'];
            isOneToOne: false;
            referencedRelation: 'profile';
            referencedColumns: ['id'];
          },
        ];
      };
      chat: {
        Row: {
          category: string | null;
          created_at: string;
          created_by: string | null;
          id: number;
          mission_id: number | null;
          title: string;
          topic: string;
          type: Database['public']['Enums']['chat_type'];
          xpert_recipient_id: string | null;
        };
        Insert: {
          category?: string | null;
          created_at?: string;
          created_by?: string | null;
          id?: number;
          mission_id?: number | null;
          title: string;
          topic: string;
          type?: Database['public']['Enums']['chat_type'];
          xpert_recipient_id?: string | null;
        };
        Update: {
          category?: string | null;
          created_at?: string;
          created_by?: string | null;
          id?: number;
          mission_id?: number | null;
          title?: string;
          topic?: string;
          type?: Database['public']['Enums']['chat_type'];
          xpert_recipient_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'chat_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profile';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'chat_mission_id_fkey';
            columns: ['mission_id'];
            isOneToOne: false;
            referencedRelation: 'mission';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'chat_xpert_recipient_id_fkey';
            columns: ['xpert_recipient_id'];
            isOneToOne: false;
            referencedRelation: 'profile';
            referencedColumns: ['id'];
          },
        ];
      };
      company_roles: {
        Row: {
          id: number;
          json_key: string | null;
          label: string | null;
          value: string | null;
        };
        Insert: {
          id?: number;
          json_key?: string | null;
          label?: string | null;
          value?: string | null;
        };
        Update: {
          id?: number;
          json_key?: string | null;
          label?: string | null;
          value?: string | null;
        };
        Relationships: [];
      };
      contact_xpert_demands: {
        Row: {
          asked_xpert: string | null;
          created_at: string;
          id: number;
          message: string | null;
          sent_by: string | null;
          state: string | null;
        };
        Insert: {
          asked_xpert?: string | null;
          created_at?: string;
          id?: number;
          message?: string | null;
          sent_by?: string | null;
          state?: string | null;
        };
        Update: {
          asked_xpert?: string | null;
          created_at?: string;
          id?: number;
          message?: string | null;
          sent_by?: string | null;
          state?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'contact_xpert_demands_asked_xpert_fkey';
            columns: ['asked_xpert'];
            isOneToOne: false;
            referencedRelation: 'profile';
            referencedColumns: ['generated_id'];
          },
          {
            foreignKeyName: 'contact_xpert_demands_sent_by_fkey';
            columns: ['sent_by'];
            isOneToOne: false;
            referencedRelation: 'profile';
            referencedColumns: ['id'];
          },
        ];
      };
      diplomas: {
        Row: {
          id: number;
          json_key: string | null;
          label: string | null;
          value: string | null;
        };
        Insert: {
          id?: number;
          json_key?: string | null;
          label?: string | null;
          value?: string | null;
        };
        Update: {
          id?: number;
          json_key?: string | null;
          label?: string | null;
          value?: string | null;
        };
        Relationships: [];
      };
      expertises: {
        Row: {
          id: number;
          json_key: string | null;
          label: string | null;
          value: string | null;
        };
        Insert: {
          id?: number;
          json_key?: string | null;
          label?: string | null;
          value?: string | null;
        };
        Update: {
          id?: number;
          json_key?: string | null;
          label?: string | null;
          value?: string | null;
        };
        Relationships: [];
      };
      habilitations: {
        Row: {
          id: number;
          json_key: string | null;
          label: string | null;
          value: string | null;
        };
        Insert: {
          id?: number;
          json_key?: string | null;
          label?: string | null;
          value?: string | null;
        };
        Update: {
          id?: number;
          json_key?: string | null;
          label?: string | null;
          value?: string | null;
        };
        Relationships: [];
      };
      infrastructures: {
        Row: {
          id: number;
          json_key: string | null;
          label: string | null;
          value: string | null;
        };
        Insert: {
          id?: number;
          json_key?: string | null;
          label?: string | null;
          value?: string | null;
        };
        Update: {
          id?: number;
          json_key?: string | null;
          label?: string | null;
          value?: string | null;
        };
        Relationships: [];
      };
      job_titles: {
        Row: {
          id: number;
          image: string | null;
          json_key: string | null;
          label: string | null;
          value: string | null;
        };
        Insert: {
          id?: number;
          image?: string | null;
          json_key?: string | null;
          label?: string | null;
          value?: string | null;
        };
        Update: {
          id?: number;
          image?: string | null;
          json_key?: string | null;
          label?: string | null;
          value?: string | null;
        };
        Relationships: [];
      };
      juridic_status: {
        Row: {
          id: number;
          json_key: string | null;
          label: string | null;
          value: string | null;
        };
        Insert: {
          id?: number;
          json_key?: string | null;
          label?: string | null;
          value?: string | null;
        };
        Update: {
          id?: number;
          json_key?: string | null;
          label?: string | null;
          value?: string | null;
        };
        Relationships: [];
      };
      languages: {
        Row: {
          id: number;
          json_key: string | null;
          label: string | null;
          value: string | null;
        };
        Insert: {
          id?: number;
          json_key?: string | null;
          label?: string | null;
          value?: string | null;
        };
        Update: {
          id?: number;
          json_key?: string | null;
          label?: string | null;
          value?: string | null;
        };
        Relationships: [];
      };
      message: {
        Row: {
          answer_to: number | null;
          chat_id: number | null;
          content: string | null;
          created_at: string;
          files: Database['public']['CompositeTypes']['msg_files'][] | null;
          id: number;
          is_pinned: boolean | null;
          reactions: Json[] | null;
          read_by: string[];
          send_by: string | null;
        };
        Insert: {
          answer_to?: number | null;
          chat_id?: number | null;
          content?: string | null;
          created_at?: string;
          files?: Database['public']['CompositeTypes']['msg_files'][] | null;
          id?: number;
          is_pinned?: boolean | null;
          reactions?: Json[] | null;
          read_by?: string[];
          send_by?: string | null;
        };
        Update: {
          answer_to?: number | null;
          chat_id?: number | null;
          content?: string | null;
          created_at?: string;
          files?: Database['public']['CompositeTypes']['msg_files'][] | null;
          id?: number;
          is_pinned?: boolean | null;
          reactions?: Json[] | null;
          read_by?: string[];
          send_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'message_answer_to_fkey';
            columns: ['answer_to'];
            isOneToOne: false;
            referencedRelation: 'message';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'message_send_by_fkey';
            columns: ['send_by'];
            isOneToOne: false;
            referencedRelation: 'profile';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'messages_chat_id_fkey';
            columns: ['chat_id'];
            isOneToOne: false;
            referencedRelation: 'chat';
            referencedColumns: ['id'];
          },
        ];
      };
      mission: {
        Row: {
          address: string | null;
          advantages_company: string | null;
          city: string | null;
          contract_file_name: string | null;
          country: string | null;
          created_at: string;
          created_by: string;
          deadline_application: string | null;
          description: string | null;
          diplomas: string[] | null;
          diplomas_other: string | null;
          end_date: string | null;
          expertises: string[] | null;
          expertises_other: string | null;
          id: number;
          job_title: string | null;
          job_title_other: string | null;
          languages: string[] | null;
          languages_other: string | null;
          mission_number: string | null;
          needed: string | null;
          open_to_disabled: string | null;
          post_type: string[] | null;
          postal_code: string | null;
          profile_searched: string | null;
          referent_fix: string | null;
          referent_mail: string | null;
          referent_mobile: string | null;
          referent_name: string | null;
          sector: string | null;
          sector_energy: string | null;
          sector_infrastructure: string | null;
          sector_infrastructure_other: string | null;
          sector_other: string | null;
          sector_renewable_energy: string | null;
          sector_renewable_energy_other: string | null;
          sector_waste_treatment: string | null;
          signed_quote_file_name: string | null;
          specialties: string[] | null;
          specialties_other: string | null;
          start_date: string | null;
          state: string;
          street_number: number | null;
          tjm: string | null;
          xpert_associated_id: string | null;
        };
        Insert: {
          address?: string | null;
          advantages_company?: string | null;
          city?: string | null;
          contract_file_name?: string | null;
          country?: string | null;
          created_at?: string;
          created_by?: string;
          deadline_application?: string | null;
          description?: string | null;
          diplomas?: string[] | null;
          diplomas_other?: string | null;
          end_date?: string | null;
          expertises?: string[] | null;
          expertises_other?: string | null;
          id?: number;
          job_title?: string | null;
          job_title_other?: string | null;
          languages?: string[] | null;
          languages_other?: string | null;
          mission_number?: string | null;
          needed?: string | null;
          open_to_disabled?: string | null;
          post_type?: string[] | null;
          postal_code?: string | null;
          profile_searched?: string | null;
          referent_fix?: string | null;
          referent_mail?: string | null;
          referent_mobile?: string | null;
          referent_name?: string | null;
          sector?: string | null;
          sector_energy?: string | null;
          sector_infrastructure?: string | null;
          sector_infrastructure_other?: string | null;
          sector_other?: string | null;
          sector_renewable_energy?: string | null;
          sector_renewable_energy_other?: string | null;
          sector_waste_treatment?: string | null;
          signed_quote_file_name?: string | null;
          specialties?: string[] | null;
          specialties_other?: string | null;
          start_date?: string | null;
          state?: string;
          street_number?: number | null;
          tjm?: string | null;
          xpert_associated_id?: string | null;
        };
        Update: {
          address?: string | null;
          advantages_company?: string | null;
          city?: string | null;
          contract_file_name?: string | null;
          country?: string | null;
          created_at?: string;
          created_by?: string;
          deadline_application?: string | null;
          description?: string | null;
          diplomas?: string[] | null;
          diplomas_other?: string | null;
          end_date?: string | null;
          expertises?: string[] | null;
          expertises_other?: string | null;
          id?: number;
          job_title?: string | null;
          job_title_other?: string | null;
          languages?: string[] | null;
          languages_other?: string | null;
          mission_number?: string | null;
          needed?: string | null;
          open_to_disabled?: string | null;
          post_type?: string[] | null;
          postal_code?: string | null;
          profile_searched?: string | null;
          referent_fix?: string | null;
          referent_mail?: string | null;
          referent_mobile?: string | null;
          referent_name?: string | null;
          sector?: string | null;
          sector_energy?: string | null;
          sector_infrastructure?: string | null;
          sector_infrastructure_other?: string | null;
          sector_other?: string | null;
          sector_renewable_energy?: string | null;
          sector_renewable_energy_other?: string | null;
          sector_waste_treatment?: string | null;
          signed_quote_file_name?: string | null;
          specialties?: string[] | null;
          specialties_other?: string | null;
          start_date?: string | null;
          state?: string;
          street_number?: number | null;
          tjm?: string | null;
          xpert_associated_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'mission_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profile';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'mission_xpert_associated_id_fkey';
            columns: ['xpert_associated_id'];
            isOneToOne: false;
            referencedRelation: 'profile';
            referencedColumns: ['id'];
          },
        ];
      };
      mission_application: {
        Row: {
          candidate_id: string | null;
          created_at: string;
          id: number;
          mission_id: number | null;
        };
        Insert: {
          candidate_id?: string | null;
          created_at?: string;
          id?: number;
          mission_id?: number | null;
        };
        Update: {
          candidate_id?: string | null;
          created_at?: string;
          id?: number;
          mission_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'mission_application_candidate_id_fkey';
            columns: ['candidate_id'];
            isOneToOne: false;
            referencedRelation: 'profile';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'mission_application_mission_id_fkey';
            columns: ['mission_id'];
            isOneToOne: false;
            referencedRelation: 'mission';
            referencedColumns: ['id'];
          },
        ];
      };
      mission_canceled: {
        Row: {
          created_at: string;
          id: number;
          mission: number | null;
          reason: string | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          mission?: number | null;
          reason?: string | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          mission?: number | null;
          reason?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'mission_canceled_mission_fkey';
            columns: ['mission'];
            isOneToOne: false;
            referencedRelation: 'mission';
            referencedColumns: ['id'];
          },
        ];
      };
      notification: {
        Row: {
          chat_id: number | null;
          created_at: string;
          id: number;
          read_by: string[] | null;
          type: string | null;
        };
        Insert: {
          chat_id?: number | null;
          created_at?: string;
          id?: number;
          read_by?: string[] | null;
          type?: string | null;
        };
        Update: {
          chat_id?: number | null;
          created_at?: string;
          id?: number;
          read_by?: string[] | null;
          type?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'notification_chat_id_fkey';
            columns: ['chat_id'];
            isOneToOne: false;
            referencedRelation: 'chat';
            referencedColumns: ['id'];
          },
        ];
      };
      posts: {
        Row: {
          id: number;
          json_key: string | null;
          label: string | null;
          value: string | null;
        };
        Insert: {
          id?: number;
          json_key?: string | null;
          label?: string | null;
          value?: string | null;
        };
        Update: {
          id?: number;
          json_key?: string | null;
          label?: string | null;
          value?: string | null;
        };
        Relationships: [];
      };
      profile: {
        Row: {
          address: string | null;
          area: string[] | null;
          avatar_url: string | null;
          birthdate: string | null;
          city: string | null;
          civility: string | null;
          company_name: string | null;
          company_role: string | null;
          company_role_other: string | null;
          country: string | null;
          created_at: string;
          cv_name: string | null;
          email: string | null;
          expertise_progression: number;
          firstname: string | null;
          fix: string | null;
          france_detail: string[] | null;
          generated_id: string;
          has_seen_available_missions: boolean | null;
          has_seen_blog: boolean | null;
          has_seen_community: boolean | null;
          has_seen_created_missions: boolean | null;
          has_seen_messaging: boolean | null;
          has_seen_my_missions: boolean | null;
          has_seen_my_profile: boolean | null;
          has_seen_newsletter: boolean | null;
          how_did_you_hear_about_us: string | null;
          how_did_you_hear_about_us_other: string | null;
          id: string;
          lastname: string | null;
          linkedin: string | null;
          mission_progression: number;
          mobile: string | null;
          postal_code: string | null;
          profile_progression: number;
          referent_id: string | null;
          regions: string[] | null;
          role: string;
          sector: string | null;
          sector_energy: string | null;
          sector_infrastructure: string | null;
          sector_infrastructure_other: string | null;
          sector_other: string | null;
          sector_renewable_energy: string | null;
          sector_renewable_energy_other: string | null;
          sector_waste_treatment: string | null;
          service_dependance: string | null;
          siret: string | null;
          status_progression: number;
          street_number: string | null;
          totale_progression: number;
          username: string | null;
        };
        Insert: {
          address?: string | null;
          area?: string[] | null;
          avatar_url?: string | null;
          birthdate?: string | null;
          city?: string | null;
          civility?: string | null;
          company_name?: string | null;
          company_role?: string | null;
          company_role_other?: string | null;
          country?: string | null;
          created_at?: string;
          cv_name?: string | null;
          email?: string | null;
          expertise_progression?: number;
          firstname?: string | null;
          fix?: string | null;
          france_detail?: string[] | null;
          generated_id: string;
          has_seen_available_missions?: boolean | null;
          has_seen_blog?: boolean | null;
          has_seen_community?: boolean | null;
          has_seen_created_missions?: boolean | null;
          has_seen_messaging?: boolean | null;
          has_seen_my_missions?: boolean | null;
          has_seen_my_profile?: boolean | null;
          has_seen_newsletter?: boolean | null;
          how_did_you_hear_about_us?: string | null;
          how_did_you_hear_about_us_other?: string | null;
          id: string;
          lastname?: string | null;
          linkedin?: string | null;
          mission_progression?: number;
          mobile?: string | null;
          postal_code?: string | null;
          profile_progression?: number;
          referent_id?: string | null;
          regions?: string[] | null;
          role?: string;
          sector?: string | null;
          sector_energy?: string | null;
          sector_infrastructure?: string | null;
          sector_infrastructure_other?: string | null;
          sector_other?: string | null;
          sector_renewable_energy?: string | null;
          sector_renewable_energy_other?: string | null;
          sector_waste_treatment?: string | null;
          service_dependance?: string | null;
          siret?: string | null;
          status_progression?: number;
          street_number?: string | null;
          totale_progression?: number;
          username?: string | null;
        };
        Update: {
          address?: string | null;
          area?: string[] | null;
          avatar_url?: string | null;
          birthdate?: string | null;
          city?: string | null;
          civility?: string | null;
          company_name?: string | null;
          company_role?: string | null;
          company_role_other?: string | null;
          country?: string | null;
          created_at?: string;
          cv_name?: string | null;
          email?: string | null;
          expertise_progression?: number;
          firstname?: string | null;
          fix?: string | null;
          france_detail?: string[] | null;
          generated_id?: string;
          has_seen_available_missions?: boolean | null;
          has_seen_blog?: boolean | null;
          has_seen_community?: boolean | null;
          has_seen_created_missions?: boolean | null;
          has_seen_messaging?: boolean | null;
          has_seen_my_missions?: boolean | null;
          has_seen_my_profile?: boolean | null;
          has_seen_newsletter?: boolean | null;
          how_did_you_hear_about_us?: string | null;
          how_did_you_hear_about_us_other?: string | null;
          id?: string;
          lastname?: string | null;
          linkedin?: string | null;
          mission_progression?: number;
          mobile?: string | null;
          postal_code?: string | null;
          profile_progression?: number;
          referent_id?: string | null;
          regions?: string[] | null;
          role?: string;
          sector?: string | null;
          sector_energy?: string | null;
          sector_infrastructure?: string | null;
          sector_infrastructure_other?: string | null;
          sector_other?: string | null;
          sector_renewable_energy?: string | null;
          sector_renewable_energy_other?: string | null;
          sector_waste_treatment?: string | null;
          service_dependance?: string | null;
          siret?: string | null;
          status_progression?: number;
          street_number?: string | null;
          totale_progression?: number;
          username?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'profile_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'profile_referent_id_fkey';
            columns: ['referent_id'];
            isOneToOne: false;
            referencedRelation: 'profile';
            referencedColumns: ['generated_id'];
          },
        ];
      };
      profile_education: {
        Row: {
          department: string | null;
          detail_diploma: string | null;
          education_diploma: string | null;
          education_others: string | null;
          id: number;
          profile_id: string | null;
          school: string | null;
        };
        Insert: {
          department?: string | null;
          detail_diploma?: string | null;
          education_diploma?: string | null;
          education_others?: string | null;
          id?: number;
          profile_id?: string | null;
          school?: string | null;
        };
        Update: {
          department?: string | null;
          detail_diploma?: string | null;
          education_diploma?: string | null;
          education_others?: string | null;
          id?: number;
          profile_id?: string | null;
          school?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'profile_education_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profile';
            referencedColumns: ['id'];
          },
        ];
      };
      profile_experience: {
        Row: {
          comments: string | null;
          company: string | null;
          duree: string | null;
          has_led_team: string;
          how_many_people_led: string | null;
          id: number;
          is_last: string | null;
          post: string | null;
          post_other: string | null;
          post_type: string[] | null;
          profile_id: string | null;
          sector: string | null;
          sector_energy: string | null;
          sector_infrastructure: string | null;
          sector_infrastructure_other: string | null;
          sector_other: string | null;
          sector_renewable_energy: string | null;
          sector_renewable_energy_other: string | null;
          sector_waste_treatment: string | null;
        };
        Insert: {
          comments?: string | null;
          company?: string | null;
          duree?: string | null;
          has_led_team?: string;
          how_many_people_led?: string | null;
          id?: number;
          is_last?: string | null;
          post?: string | null;
          post_other?: string | null;
          post_type?: string[] | null;
          profile_id?: string | null;
          sector?: string | null;
          sector_energy?: string | null;
          sector_infrastructure?: string | null;
          sector_infrastructure_other?: string | null;
          sector_other?: string | null;
          sector_renewable_energy?: string | null;
          sector_renewable_energy_other?: string | null;
          sector_waste_treatment?: string | null;
        };
        Update: {
          comments?: string | null;
          company?: string | null;
          duree?: string | null;
          has_led_team?: string;
          how_many_people_led?: string | null;
          id?: number;
          is_last?: string | null;
          post?: string | null;
          post_other?: string | null;
          post_type?: string[] | null;
          profile_id?: string | null;
          sector?: string | null;
          sector_energy?: string | null;
          sector_infrastructure?: string | null;
          sector_infrastructure_other?: string | null;
          sector_other?: string | null;
          sector_renewable_energy?: string | null;
          sector_renewable_energy_other?: string | null;
          sector_waste_treatment?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'profile_experience_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profile';
            referencedColumns: ['id'];
          },
        ];
      };
      profile_expertise: {
        Row: {
          cv_name: string | null;
          degree: string | null;
          degree_other: string | null;
          diploma: string | null;
          expertises: string[] | null;
          expertises_other: string | null;
          habilitations: string[] | null;
          habilitations_details: Json[] | null;
          habilitations_other: string | null;
          id: number;
          maternal_language: string | null;
          maternal_language_other: string | null;
          other_language: Json[] | null;
          other_language_detail: string | null;
          others: string | null;
          profile_id: string | null;
          seniority: number | null;
          specialties: string[] | null;
          specialties_other: string | null;
        };
        Insert: {
          cv_name?: string | null;
          degree?: string | null;
          degree_other?: string | null;
          diploma?: string | null;
          expertises?: string[] | null;
          expertises_other?: string | null;
          habilitations?: string[] | null;
          habilitations_details?: Json[] | null;
          habilitations_other?: string | null;
          id?: number;
          maternal_language?: string | null;
          maternal_language_other?: string | null;
          other_language?: Json[] | null;
          other_language_detail?: string | null;
          others?: string | null;
          profile_id?: string | null;
          seniority?: number | null;
          specialties?: string[] | null;
          specialties_other?: string | null;
        };
        Update: {
          cv_name?: string | null;
          degree?: string | null;
          degree_other?: string | null;
          diploma?: string | null;
          expertises?: string[] | null;
          expertises_other?: string | null;
          habilitations?: string[] | null;
          habilitations_details?: Json[] | null;
          habilitations_other?: string | null;
          id?: number;
          maternal_language?: string | null;
          maternal_language_other?: string | null;
          other_language?: Json[] | null;
          other_language_detail?: string | null;
          others?: string | null;
          profile_id?: string | null;
          seniority?: number | null;
          specialties?: string[] | null;
          specialties_other?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'profile_expertise_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: true;
            referencedRelation: 'profile';
            referencedColumns: ['id'];
          },
        ];
      };
      profile_mission: {
        Row: {
          area: string[] | null;
          availability: string | null;
          desired_monthly_brut: string | null;
          desired_tjm: string | null;
          expertises: string[] | null;
          expertises_others: string | null;
          france_detail: string[] | null;
          id: number;
          job_titles: string[] | null;
          job_titles_other: string | null;
          others: string | null;
          posts_type: string[] | null;
          profile_id: string | null;
          regions: string[] | null;
          revenu_type: Database['public']['Enums']['revenu_type'] | null;
          sector: string[] | null;
          sector_other: string | null;
          specialties: string[] | null;
          specialties_others: string | null;
          student_contract: string | null;
          workstation_description: string | null;
          workstation_needed: string | null;
        };
        Insert: {
          area?: string[] | null;
          availability?: string | null;
          desired_monthly_brut?: string | null;
          desired_tjm?: string | null;
          expertises?: string[] | null;
          expertises_others?: string | null;
          france_detail?: string[] | null;
          id?: number;
          job_titles?: string[] | null;
          job_titles_other?: string | null;
          others?: string | null;
          posts_type?: string[] | null;
          profile_id?: string | null;
          regions?: string[] | null;
          revenu_type?: Database['public']['Enums']['revenu_type'] | null;
          sector?: string[] | null;
          sector_other?: string | null;
          specialties?: string[] | null;
          specialties_others?: string | null;
          student_contract?: string | null;
          workstation_description?: string | null;
          workstation_needed?: string | null;
        };
        Update: {
          area?: string[] | null;
          availability?: string | null;
          desired_monthly_brut?: string | null;
          desired_tjm?: string | null;
          expertises?: string[] | null;
          expertises_others?: string | null;
          france_detail?: string[] | null;
          id?: number;
          job_titles?: string[] | null;
          job_titles_other?: string | null;
          others?: string | null;
          posts_type?: string[] | null;
          profile_id?: string | null;
          regions?: string[] | null;
          revenu_type?: Database['public']['Enums']['revenu_type'] | null;
          sector?: string[] | null;
          sector_other?: string | null;
          specialties?: string[] | null;
          specialties_others?: string | null;
          student_contract?: string | null;
          workstation_description?: string | null;
          workstation_needed?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'profile_mission_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: true;
            referencedRelation: 'profile';
            referencedColumns: ['id'];
          },
        ];
      };
      profile_status: {
        Row: {
          civil_responsability_name: string | null;
          company_name: string | null;
          has_portage: boolean | null;
          iam: string | null;
          id: number;
          juridic_status: string | null;
          juridic_status_other: string | null;
          kbis_name: string | null;
          portage_name: string | null;
          profile_id: string;
          rib_name: string | null;
          siret: string | null;
          status: string | null;
          urssaf_name: string | null;
        };
        Insert: {
          civil_responsability_name?: string | null;
          company_name?: string | null;
          has_portage?: boolean | null;
          iam?: string | null;
          id?: number;
          juridic_status?: string | null;
          juridic_status_other?: string | null;
          kbis_name?: string | null;
          portage_name?: string | null;
          profile_id?: string;
          rib_name?: string | null;
          siret?: string | null;
          status?: string | null;
          urssaf_name?: string | null;
        };
        Update: {
          civil_responsability_name?: string | null;
          company_name?: string | null;
          has_portage?: boolean | null;
          iam?: string | null;
          id?: number;
          juridic_status?: string | null;
          juridic_status_other?: string | null;
          kbis_name?: string | null;
          portage_name?: string | null;
          profile_id?: string;
          rib_name?: string | null;
          siret?: string | null;
          status?: string | null;
          urssaf_name?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'profile_status_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: true;
            referencedRelation: 'profile';
            referencedColumns: ['id'];
          },
        ];
      };
      sectors: {
        Row: {
          id: number;
          json_key: string | null;
          label: string | null;
          value: string | null;
        };
        Insert: {
          id?: number;
          json_key?: string | null;
          label?: string | null;
          value?: string | null;
        };
        Update: {
          id?: number;
          json_key?: string | null;
          label?: string | null;
          value?: string | null;
        };
        Relationships: [];
      };
      specialties: {
        Row: {
          id: number;
          json_key: string | null;
          label: string | null;
          value: string | null;
        };
        Insert: {
          id?: number;
          json_key?: string | null;
          label?: string | null;
          value?: string | null;
        };
        Update: {
          id?: number;
          json_key?: string | null;
          label?: string | null;
          value?: string | null;
        };
        Relationships: [];
      };
      subjects: {
        Row: {
          id: number;
          json_key: string | null;
          label: string | null;
          value: string | null;
        };
        Insert: {
          id?: number;
          json_key?: string | null;
          label?: string | null;
          value?: string | null;
        };
        Update: {
          id?: number;
          json_key?: string | null;
          label?: string | null;
          value?: string | null;
        };
        Relationships: [];
      };
      user_alerts: {
        Row: {
          answer_message_mail: boolean;
          blog_alert: boolean;
          categories: string[] | null;
          center_of_interest: string[] | null;
          created_at: string;
          fav_alert: boolean;
          id: number;
          mission_state_change_alert: boolean;
          new_message_alert: boolean;
          new_mission_alert: boolean;
          newsletter: boolean;
          show_on_website: boolean;
          show_profile_picture: boolean;
          topics: string[] | null;
          user_id: string | null;
        };
        Insert: {
          answer_message_mail?: boolean;
          blog_alert?: boolean;
          categories?: string[] | null;
          center_of_interest?: string[] | null;
          created_at?: string;
          fav_alert?: boolean;
          id?: number;
          mission_state_change_alert?: boolean;
          new_message_alert?: boolean;
          new_mission_alert?: boolean;
          newsletter?: boolean;
          show_on_website?: boolean;
          show_profile_picture?: boolean;
          topics?: string[] | null;
          user_id?: string | null;
        };
        Update: {
          answer_message_mail?: boolean;
          blog_alert?: boolean;
          categories?: string[] | null;
          center_of_interest?: string[] | null;
          created_at?: string;
          fav_alert?: boolean;
          id?: number;
          mission_state_change_alert?: boolean;
          new_message_alert?: boolean;
          new_mission_alert?: boolean;
          newsletter?: boolean;
          show_on_website?: boolean;
          show_profile_picture?: boolean;
          topics?: string[] | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'user_alerts_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profile';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      generate_mission_unique_id: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      generate_new_mission_number: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      generate_unique_id: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      generate_unique_id_f: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      generate_unique_slug: {
        Args: {
          input_text: string;
          table_name: string;
        };
        Returns: string;
      };
      get_combined_data: {
        Args: Record<PropertyKey, never>;
        Returns: {
          company_roles: string;
          diplomas: string;
          expertises: string;
          habilitations: string;
          infrastructures: string;
          job_titles: string;
          juridic_status: string;
          languages: string;
          posts: string;
          sectors: string;
          specialties: string;
          subjects: string;
        }[];
      };
      get_full_profile: {
        Args: Record<PropertyKey, never>;
        Returns: Json;
      };
      get_profile_other_languages: {
        Args: Record<PropertyKey, never>;
        Returns: Json;
      };
      unaccent: {
        Args: {
          '': string;
        };
        Returns: string;
      };
      unaccent_init: {
        Args: {
          '': unknown;
        };
        Returns: unknown;
      };
    };
    Enums: {
      categories:
        | 'energy_and_nuclear'
        | 'renewable_energy'
        | 'waste_treatment'
        | 'process_industry'
        | 'water'
        | 'infrastructure'
        | 'entrepreneurship'
        | 'other'
        | 'relation_presse';
      chat_type: 'chat' | 'echo_community' | 'forum' | 'xpert_to_xpert';
      revenu_type: 'tjm' | 'brut';
    };
    CompositeTypes: {
      chat_files: {
        name: string | null;
        type: string | null;
        url: string | null;
      };
      habilitation_detail: {
        expiration_date: string | null;
        file_name: string | null;
        habilitation_name: string | null;
      };
      msg_files: {
        name: string | null;
        type: string | null;
        url: string | null;
      };
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['Views'])
    ? (PublicSchema['Tables'] &
        PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never;
