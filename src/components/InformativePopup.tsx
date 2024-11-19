'use client';
import React from 'react';
import {
  Credenza,
  CredenzaContent,
  CredenzaTitle,
  CredenzaDescription,
} from './ui/credenza';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import useUser from '@/store/useUser';
import { usePopupInformativeStore } from '@/store/usePopupInformative';

type HasSeen = {
  has_seen_my_missions: boolean | null;
  has_seen_available_missions: boolean | null;
  has_seen_messaging: boolean | null;
  has_seen_community: boolean | null;
  has_seen_blog: boolean | null;
  has_seen_newsletter: boolean | null;
  has_seen_my_profile: boolean | null;
  has_seen_created_missions: boolean | null;
};

const pathnameToColumnMap: Record<string, keyof HasSeen> = {
  'mes-missions': 'has_seen_my_missions',
  'missions-disponibles': 'has_seen_available_missions',
  messagerie: 'has_seen_messaging',
  communaute: 'has_seen_community',
  blog: 'has_seen_blog',
  'creation-de-mission': 'has_seen_created_missions',
  newsletter: 'has_seen_newsletter',
  'mon-profil': 'has_seen_my_profile',
  'mon-profil/profil': 'has_seen_my_profile',
};

function InformativePopup() {
  const showModal = usePopupInformativeStore((state) => state.showModal);
  const setShowModal = usePopupInformativeStore((state) => state.setShowModal);
  const setHasSeen = usePopupInformativeStore((state) => state.setHasSeen);
  const pathname = usePathname().split('/')[1];
  const hasSeenKey = pathnameToColumnMap[pathname];

  const user = useUser((state) => state.user);

  if (!hasSeenKey) return null;

  return (
    <Credenza
      open={showModal}
      onOpenChange={(isOpen) => {
        setShowModal(isOpen);
        if (!isOpen) {
          setHasSeen(hasSeenKey);
        }
      }}
    >
      <CredenzaContent className="mx-4 max-w-[946px] overflow-hidden rounded-sm border-0 p-0">
        <div className="relative h-[175px] w-full">
          <Image
            src="/static/confirm-email.jpg"
            fill
            objectFit="cover"
            alt="confirm-popup"
          />
        </div>
        <div className="p-6">
          <CredenzaTitle className="text-[20px] font-bold">
            {pathname === 'mon-profil' && 'Bienvenue dans votre profil!'}
            {pathname === 'mes-missions' &&
              'Bienvenue dans vos missions Xpert One ! '}
            {pathname === 'missions-disponibles' &&
              'Bienvenue dans les missions disponibles Xpert One ! '}
            {pathname === 'messagerie' &&
              'Bienvenue dans votre messagerie Xpert One ! '}
            {pathname === 'communaute' &&
              'Bienvenue dans la communauté Xpert One ! '}
            {pathname === 'blog' && 'Bienvenue dans le blog Xpert One!'}
            {pathname === 'newsletter' &&
              'Bienvenue dans la newsletter Xpert One!'}
            {pathname === 'creation-de-mission' &&
              'Bienvenue dans la création de mission Xpert One!'}
          </CredenzaTitle>
          <CredenzaDescription className="mt-6 text-[20px] font-medium text-black">
            {pathname === 'mon-profil' && (
              <p>
                Ici vous pouvez modifier votre profil, consulter vos
                informations personnelles et vos documents.
                <br />
                <br />
                Pour pouvoir accèder aux autres fonctionnalités de
                l'application, veuillez <strong>compléter votre profil.</strong>
              </p>
            )}
            {pathname === 'mes-missions' &&
              "Récapitulatif de l'ensemble de vos missions, vous y trouverez tous les documents nécessaire au bon fonctionnement de celles-ci"}
            {pathname === 'missions-disponibles' &&
              "Découvrez les missions disponibles et postulez en informant votre chargé d'affaire de votre intérêt pour celles-ci."}
            {pathname === 'messagerie' &&
              user?.role === 'xpert' &&
              "Ici je communique directement avec mon chargé d'affaire Xpert One"}
            {pathname === 'messagerie' &&
              user?.role === 'company' &&
              "Ici je communique directement avec mon chargé d'affaire Xpert One"}
            {pathname === 'communaute' && (
              <div>
                <p>
                  <span className="font-bold">Echo de la communauté : </span>
                  Dans cet onglet, vous pouvez suivre les dernières informations
                  de communication transmises par Xpert One.
                </p>
                <br />
                <p>
                  {' '}
                  <span className="font-bold">Forum : </span>
                  Profitez de plusieurs canaux vous pour pouvoir échanger sur
                  tous les sujets liés à la transition énergétique.
                </p>
                <br />
                <p>
                  {' '}
                  <span className="font-bold">Relation XPERT / XPERT : </span>
                  Sous réserve d’autorisation, discutez directement avec un
                  autre Xpert de la communauté.
                </p>
              </div>
            )}
            {pathname === 'blog' &&
              "Retrouvez ici les dernières actualités du monde de l'énergie et de la transition énergétique"}
            {pathname === 'newsletter' &&
              "Retrouvez ici les dernières actualités du monde de l'énergie et de la transition énergétique"}
            {pathname === 'creation-de-mission' &&
              'Ici, vous pouvez créer de nouvelles missions Xpert One.'}
          </CredenzaDescription>
        </div>
      </CredenzaContent>
    </Credenza>
  );
}

export default InformativePopup;
