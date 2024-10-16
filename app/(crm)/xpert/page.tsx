import React from 'react';
import XpertTable from './_components/XpertTable';
import { getAllXperts } from './xpert.action';

export default async function XpertPage() {
  const xperts = await getAllXperts();

  return <XpertTable xperts={xperts} />;
}
