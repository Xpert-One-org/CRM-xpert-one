set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_presence_sheet_upload()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    mission_number TEXT;
    xpert_id TEXT;
    affected_ref_id UUID;
    xpert_firstname TEXT;
    xpert_lastname TEXT;
    year TEXT;
    month TEXT;
    period TEXT;
BEGIN
    -- Extraire le numéro de mission et l'ID de l'expert du chemin
    -- Exemple de chemin: 'M 8728/X 2780/facturation/2025/01/presence_sheet_signed_cdi/mon_fichier.pdf'
    mission_number := SUBSTRING(split_part(NEW.name, '/', 1) FROM 'M ([0-9]+)');
    xpert_id := SUBSTRING(split_part(NEW.name, '/', 2) FROM 'X ([0-9]+)');
    
    -- Extraire l'année et le mois du chemin
    year := split_part(NEW.name, '/', 4);
    month := split_part(NEW.name, '/', 5);
    
    -- Formater la période (par exemple: "Janvier 2025")
    period := CASE month
        WHEN '01' THEN 'Janvier'
        WHEN '02' THEN 'Février'
        WHEN '03' THEN 'Mars'
        WHEN '04' THEN 'Avril'
        WHEN '05' THEN 'Mai'
        WHEN '06' THEN 'Juin'
        WHEN '07' THEN 'Juillet'
        WHEN '08' THEN 'Août'
        WHEN '09' THEN 'Septembre'
        WHEN '10' THEN 'Octobre'
        WHEN '11' THEN 'Novembre'
        WHEN '12' THEN 'Décembre'
    END || ' ' || year;
    
    -- Récupérer le affected_referent_id de la mission
    SELECT affected_referent_id 
    INTO affected_ref_id
    FROM missions 
    WHERE mission_number = mission_number;
    
    -- Récupérer les informations de l'expert
    SELECT first_name, last_name 
    INTO xpert_firstname, xpert_lastname
    FROM xperts 
    WHERE generated_id = xpert_id;
    
    -- Insérer la notification
    INSERT INTO notification (
                user_id,
                link,
                message,
                subject
            )
            VALUES (
                affected_ref_id,
                'mission/fiche/'|| REPLACE(mission_number, ' ', '-'),
                'L''Xpert ' || xpert_id || ' a publié sa feuille de présence pour la période de ' || period,
                'Nouveau document reçu'
            );
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log l'erreur dans une table de logs si nécessaire
        RAISE NOTICE 'Erreur lors de la création de la notification: %', SQLERRM;
        RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.notify_new_invoice_payment()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    old_payments jsonb[];
    new_payments jsonb[];
    payment jsonb;
    period text;
BEGIN
    old_payments := COALESCE(OLD.facturation_invoice_paid::jsonb[], ARRAY[]::jsonb[]);
    new_payments := NEW.facturation_invoice_paid::jsonb[];
    
    FOREACH payment IN ARRAY new_payments
    LOOP
        IF NOT (payment::text IN (SELECT unnest(old_payments)::text)) THEN
            period := payment#>>'{period}';
            INSERT INTO notification (
                user_id,
                link,
                message,
                subject
            )
            VALUES (
                NEW.affected_referent_id,
                'mission/fiche/'|| REPLACE(NEW.mission_number, ' ', '-'),
                'La facture de la mission ' || REPLACE(NEW.mission_number, ' ', '-') || ' pour la période ' || period || ' a été payée.',
                'Facture payée'
            );
        END IF;
    END LOOP;
    
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.notify_new_salary_payment()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    old_payments jsonb[];
    new_payments jsonb[];
    payment jsonb;
    period text;
BEGIN
    old_payments := COALESCE(OLD.facturation_salary_payment::jsonb[], ARRAY[]::jsonb[]);
    new_payments := NEW.facturation_salary_payment::jsonb[];
    
    FOREACH payment IN ARRAY new_payments
    LOOP
        IF NOT (payment::text IN (SELECT unnest(old_payments)::text)) THEN
            period := payment#>>'{period}';
            INSERT INTO notification (
                user_id,
                link,
                message,
                subject
            )
            VALUES (
                NEW.affected_referent_id,
                'mission/fiche/'|| REPLACE(NEW.mission_number, ' ', '-'),
                'Le salaire de la mission ' || REPLACE(NEW.mission_number, ' ', '-') || ' pour la période ' || period || ' a été payé.',
                'Paiement du salaire effectué'
            );
        END IF;
    END LOOP;
    
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.notify_new_payment()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    old_payments jsonb[];
    new_payments jsonb[];
    payment jsonb;
    period text;
BEGIN
    old_payments := COALESCE(OLD.facturation_fournisseur_payment::jsonb[], ARRAY[]::jsonb[]);
    new_payments := NEW.facturation_fournisseur_payment::jsonb[];
    
    FOREACH payment IN ARRAY new_payments
    LOOP
        IF NOT (payment::text IN (SELECT unnest(old_payments)::text)) THEN
            period := payment#>>'{period}';
            INSERT INTO notification (
                user_id,
                link,
                message,
                subject
            )
            VALUES (
                NEW.affected_referent_id,
                'mission/fiche/'|| REPLACE(NEW.mission_number, ' ', '-'),
                'Le fournisseur de la mission ' || REPLACE(NEW.mission_number, ' ', '-') || ' pour la période ' || period || ' a payé une facture.',
                'Paiement effectué'
            );
        END IF;
    END LOOP;
    
    RETURN NEW;
END;
$function$
;

CREATE TRIGGER invoice_payment_notification_trigger AFTER UPDATE OF facturation_invoice_paid ON public.mission FOR EACH ROW EXECUTE FUNCTION notify_new_invoice_payment();

CREATE TRIGGER salary_payment_notification_trigger AFTER UPDATE OF facturation_salary_payment ON public.mission FOR EACH ROW EXECUTE FUNCTION notify_new_salary_payment();


