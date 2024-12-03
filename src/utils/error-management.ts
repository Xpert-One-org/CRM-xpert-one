export const errorManagement = ({
  error,
}: {
  error: { message: string; code?: string };
}) => {
  if (error.code === 'email_exists') {
    return { response: 'Cet email est déjà utilisé' };
  }
  if (error.code === 'validation_failed') {
    return { response: "Le format de l'email est invalide" };
  }
  return { response: 'Une erreur est survenue' };
};
