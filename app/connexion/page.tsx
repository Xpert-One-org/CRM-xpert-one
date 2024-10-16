import React, { Suspense } from 'react';
import Image from 'next/image';
import ConnexionForm from './_components/ConnexionForm';

export default function LoginPage() {
  return (
    <section className="relative flex h-screen w-screen overflow-hidden bg-[#c4812e] bg-[url('/static/connexion/center_background.jpg')] bg-cover bg-center bg-no-repeat md:bg-[url('/static/connexion/main_background.jpg')] md:bg-right">
      <div className="absolute right-0 hidden h-screen w-[220px] flex-col md:flex">
        <div className="relative h-[25vh]">
          <Image
            src={'/static/connexion/1.png'}
            fill
            alt="xpert_1"
            objectFit="cover"
          />
        </div>
        <div className="relative h-[25vh]">
          <Image
            src={'/static/connexion/2.png'}
            fill
            alt="xpert_1"
            objectFit="cover"
          />
        </div>
        <div className="relative h-[25vh]">
          <Image
            src={'/static/connexion/3.png'}
            alt="xpert_1"
            fill
            objectFit="cover"
          />
        </div>
        <div className="relative h-[25vh]">
          <Image
            src={'/static/connexion/4.png'}
            alt="xpert_1"
            fill
            objectFit="cover"
          />
        </div>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <ConnexionForm />
      </Suspense>
    </section>
  );
}
