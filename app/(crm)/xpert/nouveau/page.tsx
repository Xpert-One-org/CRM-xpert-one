'use server';

import { getLastSignUpNewUsersWeek } from '@functions/dashboard';
import NewXpertsTable from './_components/NewXpertsTable';

export default async function XpertNouveauPage() {
  const { newUsersLastWeek } = await getLastSignUpNewUsersWeek();

  const signUpDateOptions = newUsersLastWeek.map((user) => ({
    label: user.created_at || '',
    value: user.created_at || '',
  }));

  const identificationNumberOptions = newUsersLastWeek.map((user) => ({
    label: user.generated_id || '',
    value: user.generated_id || '',
  }));

  const roleOptions = newUsersLastWeek.map((user) => ({
    label: user.role || '',
    value: user.role || '',
  }));

  const totaleProgressionOptions = newUsersLastWeek.map((user) => ({
    label: user.totale_progression.toString() || '',
    value: user.totale_progression.toString() || '',
  }));

  const referantXpertOneOptions = newUsersLastWeek.map((user) => ({
    label: user.firstname || '',
    value: user.firstname || '',
  }));

  return (
    <NewXpertsTable
      signUpDateOptions={signUpDateOptions}
      identificationNumberOptions={identificationNumberOptions}
      roleOptions={roleOptions}
      totaleProgressionOptions={totaleProgressionOptions}
      referantXpertOneOptions={referantXpertOneOptions}
      newUsersLastWeek={newUsersLastWeek}
    />
  );
}
