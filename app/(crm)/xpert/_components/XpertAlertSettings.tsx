import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import MultiSelectComponent from '@/components/MultiSelectComponent';
import { cn } from '@/lib/utils';
import type { DBUserAlerts } from '@/types/typesDb';
import type { CheckedState } from '@radix-ui/react-checkbox';
import React from 'react';

type Props = {
  userAlerts: DBUserAlerts | null;
  onChangeCheckbox: (checked: CheckedState, name: string) => void;
  onChangeSelect: (value: string[] | string, name: string) => void;
  subjects: any[];
  sectors: any[];
  loadingSubjects: boolean;
  loadingSectors: boolean;
  categories: string[];
  topics: string[];
  center_of_interest: string[];
};

export default function XpertAlertSettings({
  userAlerts,
  onChangeCheckbox,
  onChangeSelect,
  subjects,
  sectors,
  loadingSubjects,
  loadingSectors,
  categories,
  topics,
  center_of_interest,
}: Props) {
  const {
    new_mission_alert,
    new_message_alert,
    mission_state_change_alert,
    newsletter,
    show_on_website,
    show_profile_picture,
    blog_alert,
    answer_message_mail,
    fav_alert,
  } = userAlerts ?? {};

  return (
    <div className="flex flex-col gap-y-spaceXSmall py-spaceSmall">
      <p className="text-lg font-medium text-black">
        Préférences de notifications
      </p>
      <div className="flex flex-col gap-4">
        <Label className="flex items-center font-light">
          Nouvelle mission publiée
          <Checkbox
            name="new_mission_alert"
            onCheckedChange={(e) => onChangeCheckbox(e, 'new_mission_alert')}
            defaultChecked={new_mission_alert}
            className="data-[state=checked]:text-colors-primary ml-2 scale-90"
          />
          {/* <Info color="light" side="right">
            Me notifier par mail lorsqu'une nouvelle mission est publiée
          </Info> */}
        </Label>

        <Label className="flex items-center font-light">
          Nouveau message
          <Checkbox
            name="new_message_alert"
            defaultChecked={new_message_alert}
            onCheckedChange={(e) => onChangeCheckbox(e, 'new_message_alert')}
            className="data-[state=checked]:text-colors-primary ml-2 scale-90"
          />
          {/* <Info color="light" side="right">
            Me notifier par mail à la réception d'un nouveau message
          </Info> */}
        </Label>

        <Label className="flex items-center font-light">
          Évolution des états de missions
          <Checkbox
            defaultChecked={mission_state_change_alert}
            onCheckedChange={(e) =>
              onChangeCheckbox(e, 'mission_state_change_alert')
            }
            name="mission_state_change_alert"
            className="data-[state=checked]:text-colors-primary ml-2 scale-90"
          />
          {/* <Info color="light" side="right">
            Me notifier par mail lorsqu'une mission change d'état
          </Info> */}
        </Label>

        <Label className="flex items-center font-light">
          Réception des newsletters
          <Checkbox
            defaultChecked={newsletter}
            onCheckedChange={(e) => onChangeCheckbox(e, 'newsletter')}
            name="newsletter"
            className="data-[state=checked]:text-colors-primary ml-2 scale-90"
          />
          {/* <Info color="light" side="right">
            M'alerter par mail de la newsletter Xpert One
          </Info> */}
        </Label>

        <div className="my-4 h-px w-full bg-[#BEBEC0]" />

        <p className="text-lg font-medium text-black">Confidentialité</p>
        <Label className="flex items-center font-light">
          Apparaître sur le site vitrine
          <Checkbox
            onCheckedChange={(e) => onChangeCheckbox(e, 'show_on_website')}
            defaultChecked={show_on_website}
            name="show_on_website"
            className="data-[state=checked]:text-colors-primary ml-2 scale-90"
          />
        </Label>

        <div className="my-4 h-px w-full bg-[#BEBEC0]" />

        <p className="text-lg font-medium text-black">Profil communautaire</p>
        <Label className="flex items-center font-light">
          Afficher ma photo de profil
          <Checkbox
            defaultChecked={show_profile_picture}
            onCheckedChange={(e) => onChangeCheckbox(e, 'show_profile_picture')}
            name="show_profile_picture"
            className="data-[state=checked]:text-colors-primary ml-2 scale-90"
          />
        </Label>

        <div className="my-4 h-px w-full bg-[#BEBEC0]" />

        <p className="text-lg font-medium text-black">Mes favoris</p>
        <Label className="flex items-center font-light">
          M'alerter
          <Checkbox
            defaultChecked={fav_alert}
            onCheckedChange={(e) => onChangeCheckbox(e, 'fav_alert')}
            name="fav_alert"
            className="data-[state=checked]:text-colors-primary ml-2 scale-90"
          />
        </Label>

        <MultiSelectComponent
          defaultSelectedKeys={loadingSectors ? null : categories}
          placeholder={loadingSectors ? 'Chargement...' : 'Catégories'}
          options={sectors}
          label="Suivre les catégories"
          name="categories"
          onValueChange={onChangeSelect}
          disabled={loadingSectors}
        />

        <div className="my-4 h-px w-full bg-[#BEBEC0]" />

        <p className="text-lg font-medium text-black">Mes sujets suivis BLOG</p>
        <Label className="flex items-center font-light">
          M'alerter
          <Checkbox
            defaultChecked={blog_alert}
            onCheckedChange={(e) => onChangeCheckbox(e, 'blog_alert')}
            name="blog_alert"
            className="data-[state=checked]:text-colors-primary ml-2 scale-90"
          />
        </Label>

        <MultiSelectComponent
          defaultSelectedKeys={loadingSubjects ? null : center_of_interest}
          placeholder={
            loadingSubjects ? 'Chargement...' : "Mes centres d'intérêts"
          }
          options={subjects}
          label="Mes centres d'intérêts"
          name="center_of_interest"
          onValueChange={onChangeSelect}
          disabled={loadingSubjects}
        />

        <Label className="flex items-center font-light">
          M'informer par mail d'une réponse à un de mes messages
          <Checkbox
            defaultChecked={answer_message_mail}
            onCheckedChange={(e) => onChangeCheckbox(e, 'answer_message_mail')}
            name="answer_message_mail"
            className="data-[state=checked]:text-colors-primary ml-2 scale-90"
          />
        </Label>
      </div>
    </div>
  );
}
