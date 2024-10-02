'use client';
import { redirect, useSearchParams } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { signIn } from '@/utils/auth/sign-in';
import { Input } from '@/components/ui/input';
import LogoXpertCRM from '@/components/svg/LogoXpertCRM';

export default function Connexion() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (formData: FormData) => {
    const { error } = await signIn(formData);

    if (error) {
      toast.error(error);

      setIsLoading(false);
    } else {
      redirect('/accueil');
    }
  };

  return (
    <div className="relative flex w-full flex-col py-[85px] backdrop-blur-sm lg:w-[40%] lg:max-w-[517px]">
      <div className="absolute inset-0 bg-black opacity-40 backdrop-blur-sm" />
      <div className="z-20 flex h-full w-full flex-col items-center justify-center">
        <LogoXpertCRM className="absolute top-[84px]" />
        <form
          action={handleSignIn}
          onSubmit={() => setIsLoading(true)}
          className="flex w-full max-w-[320px] flex-col gap-y-[14px] px-4 text-white"
        >
          <h3 className="font-khand text-xl uppercase text-white">
            Connectez vous !
          </h3>
          <Input
            type="email"
            label="Adresse e-mail"
            name="email"
            hasPreIcon
            className="text-black"
            required
            placeholder="Adresse e-mail"
          />
          <Input
            label="Mot de passe"
            type="password"
            showPasswordToggle
            hasPreIcon
            name="password"
            className="text-black"
            required
            placeholder="Mot de passe"
          />
          <Label
            htmlFor="last_exp"
            className="-mt-2 flex items-center gap-x-2 self-end font-light text-white"
          >
            Se souvenir de moi
            <Checkbox
              id="last_exp"
              className="data-[state=checked]:text-colors-white scale-90 border-white"
            />
          </Label>{' '}
          <Button type="submit" variant={'accent'}>
            Se connecter
          </Button>
        </form>
      </div>
    </div>
  );
}
