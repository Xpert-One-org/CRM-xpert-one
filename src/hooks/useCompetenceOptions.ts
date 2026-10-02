'use client';

import { useEffect, useMemo, useState } from 'react';
import type { CompetenceOption } from '@functions/select/competence-options';
import { getCompetenceOptions } from '@functions/select/competence-options';
import { useSelect } from '@/store/select';

// Listes complètes (base) des expertises/spécialités, pour AFFICHER les libellés.
// Les menus, eux, passent par useCompetenceOptions (filtré).
export function useReferenceCompetences() {
  const { expertises, specialities, fetchExpertises, fetchSpecialties } =
    useSelect();
  useEffect(() => {
    fetchExpertises();
    fetchSpecialties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const allExpertises = useMemo(
    () =>
      expertises.map((e) => ({ label: e.label ?? '', value: e.value ?? '' })),
    [expertises]
  );
  const allSpecialties = useMemo(
    () =>
      specialities.map((s) => ({ label: s.label ?? '', value: s.value ?? '' })),
    [specialities]
  );
  return { allExpertises, allSpecialties };
}

type Option = { value: string; label: string };
type RefRow = { value: string | null; label: string | null };

const signature = (values: string[]) => [...values].sort().join('|');

// "Autre" toujours en dernier, le reste par ordre alphabétique.
const sortOptions = (options: Option[]) =>
  [...options].sort((a, b) => {
    const aOther = a.value === 'others' || a.value === 'other';
    const bOther = b.value === 'others' || b.value === 'other';
    if (aOther !== bOther) return aOther ? 1 : -1;
    return a.label.localeCompare(b.label, 'fr');
  });

const buildOptions = (
  rows: CompetenceOption[] | null,
  kind: CompetenceOption['kind'],
  selected: string[],
  all: RefRow[]
): Option[] => {
  const base = (rows ?? [])
    .filter((row) => row.kind === kind)
    .map((row) => ({ value: row.value, label: row.label }));
  const present = new Set(base.map((option) => option.value));
  // Une sélection existante n'est jamais retirée des options.
  const kept = selected
    .filter((value) => value && !present.has(value))
    .map((value) => ({
      value,
      label: all.find((row) => row.value === value)?.label ?? value,
    }));
  return sortOptions([...base, ...kept]);
};

// Options d'expertises/spécialités filtrées selon les secteurs + intitulés choisis
// (référentiel « CRM métiers »). Sans intitulé choisi : listes historiques seules.
export function useCompetenceOptions({
  sectors,
  jobTitles,
  selectedExpertises,
  selectedSpecialties,
  allExpertises,
  allSpecialties,
}: {
  sectors: string[];
  jobTitles: string[];
  selectedExpertises: string[];
  selectedSpecialties: string[];
  allExpertises: RefRow[];
  allSpecialties: RefRow[];
}) {
  const [rows, setRows] = useState<CompetenceOption[] | null>(null);
  const sectorsKey = signature(sectors);
  const jobTitlesKey = signature(jobTitles);

  useEffect(() => {
    let cancelled = false;
    getCompetenceOptions(sectors, jobTitles).then(({ data }) => {
      if (!cancelled && data) setRows(data);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectorsKey, jobTitlesKey]);

  const expertiseOptions = useMemo(
    () => buildOptions(rows, 'expertise', selectedExpertises, allExpertises),
    [rows, selectedExpertises, allExpertises]
  );
  const specialtyOptions = useMemo(
    () => buildOptions(rows, 'specialty', selectedSpecialties, allSpecialties),
    [rows, selectedSpecialties, allSpecialties]
  );

  return { expertiseOptions, specialtyOptions, loading: rows === null };
}
