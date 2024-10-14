'use server';

import React from 'react';
import FournisseurTable from '../_components/FournisseurTable';
import { getAllFournisseurs } from '../fournisseur.action';

export default async function FournisseurPage() {
  const fournisseurs = await getAllFournisseurs();

  return <FournisseurTable fournisseurs={fournisseurs} />;
}
