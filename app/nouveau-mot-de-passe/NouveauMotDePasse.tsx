'use client';
import Button from '@/components/Button';
import Input from '@/components/inputs/Input';
import LogoWithText from '@/components/svg/LogoWithText';
import { cn } from '@/lib/utils';
import { signUpPasswordSchema } from '@/lib/schema/schema';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { createSupabaseFrontendClient } from '@/utils/supabase/client';

export default function NouveauMotDePasse() {
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();

  const supabase = createSupabaseFrontendClient();

  const checkPasswordSchema = (value: string) => {
    setPassword(value);
    try {
      signUpPasswordSchema.parse({ password: value });
      setPasswordError('');
    } catch (error) {
      if (error instanceof z.ZodError) {
        setPasswordError(error.errors[0].message);
      }
    }
  };

  const confirmPasswordSchema = (value: string) => {
    if (value !== password) {
      setConfirmPasswordError('Les mots de passe ne sont pas identiques');
    } else {
      setConfirmPasswordError('');
    }
  };

  const handleUpdatePassword = async (formData: FormData) => {
    const password = formData.get('password')?.toString();
    if (!password) {
      toast.error('Veuillez saisir un mot de passe');
      return;
    }

    try {
      setIsLoading(true);
      const { error } = await supabase.auth.updateUser({
        password: password,
      });
      if (error) {
        console.error(error);
        toast.error('Une erreur est survenue');
      } else {
        toast.success('Votre mot de passe a été mis à jour');
        router.push('/connexion');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex w-full flex-col py-[85px] backdrop-blur-sm lg:w-2/5 lg:max-w-[517px]">
      <div className="absolute inset-0 bg-black opacity-40 backdrop-blur-sm" />
      <div className="z-20 flex size-full flex-col items-center justify-between">
        <LogoWithText className="flex fill-white transition" />
        <form
          action={handleUpdatePassword}
          className="flex max-w-[320px] flex-col gap-y-[14px] px-4 text-white"
        >
          <h3 className="font-khand text-xl uppercase text-white">
            Nouveau mot de passe
          </h3>
          <p className="text-sm font-light">
            Veuillez saisir votre nouveau mot de passe.
          </p>
          <div>
            <Input
              hasPreIcon
              type="password"
              name="password"
              label="Nouveau mot de passe"
              className="text-black"
              required
              onChange={(e) => checkPasswordSchema(e.target.value)}
              classNameLabel="text-white"
              placeholder="••••••••"
            />
            <p
              className={cn(
                'max-h-[0px] px-4 text-[12px] opacity-0 transition-all',
                {
                  'max-h-[100px] py-2 text-red-300 opacity-100': passwordError,
                }
              )}
            >
              {passwordError}
            </p>
          </div>
          <div>
            <Input
              hasPreIcon
              type="password"
              name="confirm_password"
              label="Confirmer le mot de passe"
              className="text-black"
              required
              onChange={(e) => confirmPasswordSchema(e.target.value)}
              classNameLabel="text-white"
              placeholder="••••••••"
            />
            <p
              className={cn(
                'max-h-[0px] px-4 text-[12px] opacity-0 transition-all',
                {
                  'max-h-[100px] py-2 text-red-300 opacity-100':
                    confirmPasswordError,
                }
              )}
            >
              {confirmPasswordError}
            </p>
          </div>
          {isLoading ? (
            <Button type="submit" variant={'disabled'}>
              Mise à jour...
            </Button>
          ) : (
            <Button
              type="submit"
              variant={
                !passwordError && !confirmPasswordError ? 'accent' : 'disabled'
              }
            >
              Mettre à jour
            </Button>
          )}
        </form>
        <div></div>
      </div>
    </div>
  );
}
