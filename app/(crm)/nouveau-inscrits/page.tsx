'use client';

import { useSearchParams } from 'next/navigation';
import NewsXpertFournisseursTable from './_components/NewTable';

export default function NouveauInscritsPage() {
  const searchParams = useSearchParams();

  const role = searchParams.get('role');

  return <NewsXpertFournisseursTable role={role ?? ''} />;
}
