'use client';
import { toast } from 'sonner';

export function checkResponse(code: string) {
  if (code === 'same_password') {
    return toast.error("Le nouveau mot de passe est identique à l'ancien");
  }
  if (code === 'Email already used') {
    return toast.error('Cette adresse mail est déjà utilisée');
  }
  if (code === 'User already registered') {
    return toast.error('Cette adresse mail est déjà utilisée');
  }
  if (code.includes('invalid format')) {
    return toast.error("Le format de l'adresse mail est incorrect");
  }
  if (code.includes('Invalid phone number format (E.164 required)')) {
    return toast.error('Le format du numéro de téléphone est incorrect');
  }
  if (code.includes('duplicate key value violates unique constraint')) {
    return toast.error("Le nom d'utilisateur est déjà utilisé");
  }
  if (code.includes('Password should be at least 6 characters')) {
    return toast.error('Le mot de passe doit contenir au moins 6 caractères');
  }
  if (code.includes('For security purposes, you can only request this')) {
    return toast.error(
      "Pour des raisons de sécurité, vous ne pouvez faire cette demande qu'une fois toutes les 60 secondes.",
      { duration: 10000 }
    );
  }

  return toast.error('Une erreur est survenue');
}
