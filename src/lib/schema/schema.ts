import { z } from 'zod';
import parsePhoneNumberFromString from 'libphonenumber-js';

const uppercaseRegex = /[A-Z]/;
const digitRegex = /\d/;

export const signUpSchema = z.object({
  email: z.string().email('Veuillez entrer une adresse email valide'),
  password: z
    .string()
    .min(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' })
    .regex(uppercaseRegex, {
      message: 'Le mot de passe doit contenir au moins une majuscule',
    })
    .regex(digitRegex, {
      message: 'Le mot de passe doit contenir au moins un chiffre',
    }),
  firstname: z.string().min(1, { message: 'Veuillez rentrer votre prénom' }),
  lastname: z.string().min(1, { message: 'Veuillez rentrer votre nom' }),
  phone: z.string().transform((arg, ctx) => {
    const phone = parsePhoneNumberFromString(arg, {
      extract: false,
    });

    // when it's good
    if (phone?.isValid()) {
      return phone.number;
    }

    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Le numéro de téléphone est invalide',
    });
    return z.NEVER;
  }),
  checked: z
    .string()
    .min(1, { message: "Vous devez accepter les conditions d'utilisation" }),
});

export const signUpEmailSchema = z.object({
  email: z.string().email('Veuillez entrer une adresse email valide'),
});

export const signUpFistname = z.object({
  firstname: z.string().min(1, { message: 'Veuillez rentrer votre prénom' }),
});

export const signUpLastnameSchema = z.object({
  lastname: z.string().min(1, { message: 'Veuillez rentrer votre nom' }),
});

export const signUpPasswordSchema = z.object({
  password: z
    .string()
    .min(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' })
    .regex(uppercaseRegex, {
      message: 'Le mot de passe doit contenir au moins une majuscule',
    })
    .regex(digitRegex, {
      message: 'Le mot de passe doit contenir au moins un chiffre',
    }),
});

export const isRgpdAccepted = z.object({
  checked: z
    .string()
    .min(1, { message: 'Vous devez accepter les conditions RGPD' }),
});

export const phoneSchema = z.string().transform((arg, ctx) => {
  const phone = parsePhoneNumberFromString(arg, {
    extract: false,
  });

  // when it's good
  if (phone?.isValid()) {
    return phone.number;
  }

  ctx.addIssue({
    code: z.ZodIssueCode.custom,
    message: 'Le numéro de téléphone est invalide',
  });
  return z.NEVER;
});
