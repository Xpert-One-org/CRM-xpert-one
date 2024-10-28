'use client';
import { redirect } from 'next/navigation';
import { Label } from '@components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

import { toast } from 'sonner';
import { Button } from '@components/ui/button';
import { signIn } from '@functions/auth/signIn';
import { Input } from '@components/ui/input';
import LogoXpertCRM from '@components/svg/LogoXpertCRM';

export default function ConnexionForm() {
  const handleSignIn = async (formData: FormData) => {
    const { error } = await signIn(formData);

    if (error) {
      toast.error(error);
    } else {
      redirect('/dashboard');
    }
  };

  return (
    <div className="relative flex w-full flex-col py-[85px] backdrop-blur-sm lg:w-2/5 lg:max-w-[517px]">
      <div className="absolute inset-0 bg-black opacity-40 backdrop-blur-sm" />
      <div className="z-20 flex size-full flex-col items-center justify-center">
        <LogoXpertCRM className="absolute top-[84px]" />
        <form
          action={handleSignIn}
          className="flex w-full max-w-[320px] flex-col gap-y-[14px] px-4 text-white"
        >
          <h3 className="font-khand text-xl uppercase text-white">
            Connectez vous !
          </h3>
          <Input
            classNameLabel="text-white"
            type="email"
            label="Adresse e-mail"
            name="email"
            hasPreIcon
            className="text-black"
            required
            placeholder="Adresse e-mail"
          />
          <Input
            classNameLabel="text-white"
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
              className="scale-90 border-white data-[state=checked]:text-white"
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
