CREATE OR REPLACE FUNCTION notify_profile_deletion()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notification (
    user_id,
    message,
    subject,
    category,
    status,
    created_at,
    is_global
  )
  SELECT 
    p.id as user_id,
    CASE 
      WHEN p2.role = 'xpert' THEN format('L''Xpert %s a été supprimé par %s. Motif: %s', NEW.deleted_profile_generated_id, p3.email, NEW.reason)
      WHEN p2.role = 'company' THEN format('Le fournisseur %s a été supprimé par %s. Motif: %s', NEW.deleted_profile_generated_id, p3.email, NEW.reason)
    END as message,
    CASE 
      WHEN p2.role = 'xpert' THEN 'Suppression d''un Xpert'
      WHEN p2.role = 'company' THEN 'Suppression d''un fournisseur'
    END as subject,
    CASE 
      WHEN p2.role = 'xpert' THEN 'xpert_deletion'
      WHEN p2.role = 'company' THEN 'fournisseur_deletion'
    END as category,
    'standard'::notification_status as status,
    NEW.deleted_at as created_at,
    false as is_global
  FROM profile p
  CROSS JOIN (
    SELECT role 
    FROM profile 
    WHERE generated_id = NEW.deleted_profile_generated_id
  ) p2
  LEFT JOIN profile p3 ON p3.id = NEW.deleted_by
  WHERE p.role = 'admin' 
  AND p.id != NEW.deleted_by;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profile_deleted_trigger ON profile_deleted;
CREATE TRIGGER profile_deleted_trigger
  AFTER INSERT ON profile_deleted
  FOR EACH ROW
  EXECUTE FUNCTION notify_profile_deletion();

CREATE INDEX IF NOT EXISTS idx_profile_deleted_generated_id 
ON profile_deleted(deleted_profile_generated_id); 