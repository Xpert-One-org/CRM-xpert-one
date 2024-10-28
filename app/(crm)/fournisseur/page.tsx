import React from 'react';
import FournisseurTable from './_components/FournisseurTable';
import { getAllFournisseurs } from './fournisseur.action';

export default async function FournisseurPage() {
  return <FournisseurTable />;
}
