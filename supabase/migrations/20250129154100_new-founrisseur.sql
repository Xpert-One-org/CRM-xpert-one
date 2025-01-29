alter table "public"."profile" add column "allow_documents_notifications" boolean not null default true;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.notify_new_payment()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    old_payments jsonb[];
    new_payments jsonb[];
    payment jsonb;
BEGIN
    -- Convertir les tableaux JSON correctement
    old_payments := COALESCE(OLD.facturation_fournisseur_payment::jsonb[], ARRAY[]::jsonb[]);
    new_payments := NEW.facturation_fournisseur_payment::jsonb[];
    
    -- Parcourir les nouveaux paiements
    FOREACH payment IN ARRAY new_payments
    LOOP
        -- Vérifier si ce paiement n'existait pas dans l'ancien état
        IF NOT (payment::text IN (SELECT unnest(old_payments)::text)) THEN
            -- Insérer une notification dans la table notifications
            INSERT INTO notification (
                user_id,
                link,
                message,
                subject
            )
            VALUES (
                NEW.affected_referent_id,
                'mission/fiche/'|| REPLACE(NEW.mission_number, ' ', '-'),
                'Le fournisseur de la mission ' || REPLACE(NEW.mission_number, ' ', '-') || ' a payé une facture.',
                'Paiement effectué'
            );
        END IF;
    END LOOP;
    
    RETURN NEW;
END;
$function$
;

CREATE TRIGGER payment_notification_trigger AFTER UPDATE OF facturation_fournisseur_payment ON public.mission FOR EACH ROW EXECUTE FUNCTION notify_new_payment();


