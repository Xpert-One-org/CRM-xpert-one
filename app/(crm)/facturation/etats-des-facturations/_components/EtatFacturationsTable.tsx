'use client';

import { FilterButton } from '@/components/FilterButton';
import type { DBMission } from '@/types/typesDb';
import React, {
  useState,
  useCallback,
  useMemo,
  useContext,
  useEffect,
} from 'react';
import EtatFacturationsRow from './EtatFacturationsRow';
import { useFileStatusFacturationStore } from '@/store/fileStatusFacturation';
import { getUniqueBillingMonths } from '../_utils/getUniqueBillingMonths';
import EtatFacturationUploadRow from './EtatFacturationUploadRow';
import { updateMissionFacturationPayment } from '../etats-facturation.action';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type {
  PaymentStatus,
  PaymentType,
  PendingPayments,
} from '@/types/mission';
import { getFileTypeByStatusFacturation } from '../../gestion-des-facturations/[slug]/_utils/getFileTypeByStatusFacturation';
import { checkFileStatusForDate } from '../_utils/checkFileStatusForDate';
import { AuthContext } from '@/components/auth/AuthProvider';
import { isMissionBillingComplete } from '../_utils/isMissionBillingComplete';
import { useMissionStore } from '@/store/mission';

const yesNoOptions = [
  { label: 'OUI', value: 'yes', color: '#92C6B0' },
  { label: 'NON', value: 'no', color: '#D64242' },
];

type FilterState = {
  presenceSheetValidated?: string;
  salaryPayment?: string;
  salarySheet?: string;
  invoiceValidated?: string;
  invoicePaid?: string;
  invoice?: string;
  payment?: string;
};

type RowItem = {
  mission: DBMission;
  monthYear: { month: number; year: number };
};

export default function EtatFacturationsTable({
  missions,
}: {
  missions: DBMission[];
}) {
  const { fileStatusesByMission, checkAllMissionsFiles } =
    useFileStatusFacturationStore();
  const { updateMission } = useMissionStore();
  const { isProjectManager } = useContext(AuthContext);
  const [sortConfig, setSortConfig] = useState<{
    key: 'date' | 'mission' | 'referent';
    order: 'asc' | 'desc';
  } | null>(null);
  const [yearFilter, setYearFilter] = useState<number | null>(null);
  const [monthFilter, setMonthFilter] = useState<number | null>(null);

  useEffect(() => {
    missions.forEach((mission) => {
      // 1. Check if mission is already finished
      if (mission.state === 'finished') return;

      // 2. Check if end date passed
      if (!mission.end_date) return;
      const endDate = new Date(mission.end_date);
      const now = new Date();
      if (endDate >= now) {
        return;
      }

      // 3. Check if billing is complete
      const fileStatuses = fileStatusesByMission[mission.mission_number || ''];
      if (!fileStatuses) return;

      if (isMissionBillingComplete(mission, fileStatuses)) {
        updateMission(mission.id.toString(), 'finished');
        toast.success(
          `Mission ${mission.mission_number} archivée automatiquement.`
        );
      }
    });
  }, [missions, fileStatusesByMission, updateMission]);
  const [pendingPayments, setPendingPayments] = useState<PendingPayments>({});
  const [activeFilters, setActiveFilters] = useState<FilterState>({});
  const [filterKey, setFilterKey] = useState(0);

  // 1) Base rows = toutes les (mission, mois) calculées à partir des statuts
  const baseRows: RowItem[] = useMemo(() => {
    const rows = missions
      .flatMap((mission) => {
        const fileStatuses =
          fileStatusesByMission[mission.mission_number || ''] || {};
        const monthsForMission = getUniqueBillingMonths(fileStatuses, mission);
        return monthsForMission.map((monthYear) => ({ mission, monthYear }));
      })
      .sort((a, b) => {
        if (a.monthYear.year !== b.monthYear.year) {
          return a.monthYear.year - b.monthYear.year;
        }
        if (a.monthYear.month !== b.monthYear.month) {
          return a.monthYear.month - b.monthYear.month;
        }
        const missionNumberA = Number.parseInt(
          a.mission.mission_number?.split(' ')[1] || '0',
          10
        );
        const missionNumberB = Number.parseInt(
          b.mission.mission_number?.split(' ')[1] || '0',
          10
        );
        return missionNumberA - missionNumberB;
      });

    return rows;
  }, [missions, fileStatusesByMission]);

  // 2) Tri (date / n° de mission / référent)
  const handleSort =
    (key: 'date' | 'mission' | 'referent') => (value: string) => {
      setSortConfig(
        value === '' ? null : { key, order: value as 'asc' | 'desc' }
      );
    };

  // Années disponibles (pour le filtre "année au choix")
  const availableYears = useMemo(() => {
    const years = new Set(baseRows.map((r) => r.monthYear.year));
    return Array.from(years).sort((a, b) => b - a);
  }, [baseRows]);

  const yearOptions = useMemo(
    () => availableYears.map((y) => ({ label: String(y), value: String(y) })),
    [availableYears]
  );

  const monthOptions = useMemo(
    () =>
      [
        'Janvier',
        'Février',
        'Mars',
        'Avril',
        'Mai',
        'Juin',
        'Juillet',
        'Août',
        'Septembre',
        'Octobre',
        'Novembre',
        'Décembre',
      ].map((label, i) => ({ label, value: String(i) })),
    []
  );

  // 3) Clics “paiements”
  const handleSalaryPaymentChange = (
    mission: DBMission,
    monthYear: { month: number; year: number },
    isSelected: boolean,
    isNull: boolean,
    paymentType: PaymentType,
    customDate?: string | null
  ) => {
    if (isProjectManager) return;

    setPendingPayments((prev) => {
      const missionKey = `${mission.id}_${paymentType}`;
      const existing = prev[missionKey] || [];

      if (isNull) {
        return {
          ...prev,
          [missionKey]: [
            ...existing.filter(
              (p) =>
                p.monthYear.month !== monthYear.month ||
                p.monthYear.year !== monthYear.year
            ),
            { monthYear, date: null, paymentType },
          ],
        };
      }

      // Si on fournit une customDate, on met à jour ou on ajoute, sans toggler
      if (customDate) {
        const filtered = existing.filter(
          (p) =>
            p.monthYear.month !== monthYear.month ||
            p.monthYear.year !== monthYear.year
        );
        return {
          ...prev,
          [missionKey]: [
            ...filtered,
            { monthYear, date: customDate, paymentType },
          ],
        };
      }

      // Logique de toggle standard (pour le clic direct sans date spécifique)
      const exists = existing.some(
        (p) =>
          p.monthYear.month === monthYear.month &&
          p.monthYear.year === monthYear.year
      );
      if (exists) {
        return {
          ...prev,
          [missionKey]: existing.filter(
            (p) =>
              p.monthYear.month !== monthYear.month ||
              p.monthYear.year !== monthYear.year
          ),
        };
      }

      return {
        ...prev,
        [missionKey]: [
          ...existing,
          {
            monthYear,
            date: isSelected ? new Date().toISOString() : null,
            paymentType,
          },
        ],
      };
    });
  };

  const handleSavePayments = async () => {
    for (const [key, payments] of Object.entries(pendingPayments)) {
      if (payments.length === 0) continue;

      const [missionId, ...typeParts] = key.split('_');
      const paymentType = typeParts.join('_') as PaymentType;

      const mission = missions.find(
        (m) => m.id === Number.parseInt(missionId, 10)
      );

      const paymentData = payments.reduce<Record<string, string | null>>(
        (acc, { monthYear, date }) => {
          acc[
            `${monthYear.year}-${(monthYear.month + 1).toString().padStart(2, '0')}`
          ] = date;
          return acc;
        },
        {}
      );

      await updateMissionFacturationPayment(
        Number.parseInt(missionId, 10),
        paymentData,
        paymentType
      );

      toast.success(
        `${paymentType === 'facturation_salary_payment' ? 'Paiements salaire' : 'Paiements fournisseur'} enregistrés pour la mission ${mission?.mission_number}`
      );
    }
    setPendingPayments({});
  };

  // 4) Filtres
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setActiveFilters((prev) => ({
      ...prev,
      [key]: value === prev[key] ? undefined : value,
    }));
  };

  const filterRows = useCallback(
    (rows: RowItem[]) =>
      rows.filter(({ mission, monthYear }) => {
        const fileStatuses =
          fileStatusesByMission[mission.mission_number || ''] || {};

        const missionStatus = mission.xpert_associated_status;

        const checkFileStatus = (fileType: string, isFournisseur = false) => {
          const status = checkFileStatusForDate(
            fileStatuses,
            monthYear.year,
            monthYear.month,
            isFournisseur,
            getFileTypeByStatusFacturation(fileType, missionStatus || '')
          );

          return status.exists;
        };

        const checkPayment = (payments: PaymentStatus[] | null) => {
          if (!Array.isArray(payments)) return false;
          const key = `${monthYear.year}-${(monthYear.month + 1).toString().padStart(2, '0')}`;
          return payments.some((p) => p.period === key);
        };

        for (const [k, v] of Object.entries(activeFilters)) {
          if (!v) continue;

          const isYes = v === 'yes';

          switch (k as keyof FilterState) {
            case 'presenceSheetValidated':
              if (checkFileStatus('presence_sheet_validated') !== isYes)
                return false;
              break;
            case 'salaryPayment':
              if (
                checkPayment(
                  mission.facturation_salary_payment as PaymentStatus[]
                ) !== isYes
              )
                return false;
              break;
            case 'salarySheet':
              if (
                missionStatus === 'cdi' &&
                checkFileStatus('salary_sheet') !== isYes
              )
                return false;
              break;
            case 'invoiceValidated':
              // NB: ton code initial utilisait 'invoice_received' ici.
              if (
                missionStatus !== 'cdi' &&
                checkFileStatus('invoice_received') !== isYes
              )
                return false;
              break;
            case 'invoicePaid':
              if (
                checkPayment(
                  mission.facturation_invoice_paid as PaymentStatus[]
                ) !== isYes
              )
                return false;
              break;
            case 'invoice':
              if (checkFileStatus('invoice', true) !== isYes) return false;
              break;
            case 'payment':
              if (
                checkPayment(
                  mission.facturation_fournisseur_payment as PaymentStatus[]
                ) !== isYes
              )
                return false;
              break;
          }
        }
        return true;
      }),

    [fileStatusesByMission, activeFilters]
  );

  const displayRows: RowItem[] = useMemo(() => {
    let rows = filterRows(baseRows);

    // Filtre "année au choix" / "mois au choix"
    if (yearFilter !== null) {
      rows = rows.filter((r) => r.monthYear.year === yearFilter);
    }
    if (monthFilter !== null) {
      rows = rows.filter((r) => r.monthYear.month === monthFilter);
    }

    // Tri
    if (sortConfig) {
      const { key, order } = sortConfig;
      rows = [...rows].sort((a, b) => {
        let cmp = 0;
        if (key === 'date') {
          cmp =
            new Date(a.monthYear.year, a.monthYear.month).getTime() -
            new Date(b.monthYear.year, b.monthYear.month).getTime();
        } else if (key === 'mission') {
          const na = Number.parseInt(
            a.mission.mission_number?.split(' ')[1] || '0',
            10
          );
          const nb = Number.parseInt(
            b.mission.mission_number?.split(' ')[1] || '0',
            10
          );
          cmp = na - nb;
        } else {
          const ra =
            `${a.mission.referent?.firstname ?? ''} ${a.mission.referent?.lastname ?? ''}`
              .trim()
              .toLowerCase();
          const rb =
            `${b.mission.referent?.firstname ?? ''} ${b.mission.referent?.lastname ?? ''}`
              .trim()
              .toLowerCase();
          cmp = ra.localeCompare(rb);
        }
        return order === 'asc' ? cmp : -cmp;
      });
    }

    return rows;
  }, [baseRows, filterRows, yearFilter, monthFilter, sortConfig]);

  const hasActiveFiltersOrSort =
    Object.keys(activeFilters).some(
      (k) => activeFilters[k as keyof FilterState]
    ) ||
    sortConfig !== null ||
    yearFilter !== null ||
    monthFilter !== null;

  const resetFilters = () => {
    setActiveFilters({});
    setSortConfig(null);
    setYearFilter(null);
    setMonthFilter(null);
    setFilterKey((prev) => prev + 1);
  };

  return (
    <div className="flex h-[calc(100vh-260px)] flex-col gap-3">
      {/* Filtres */}
      <div className="grid grid-cols-10 gap-3">
        <FilterButton
          key={`gestion-${filterKey}`}
          className="col-span-1"
          placeholder="Gestion de facturation"
          filter={true}
          showSelectedOption
          options={[
            { label: 'N° de M croissant', value: 'asc' },
            { label: 'N° de M décroissant', value: 'desc' },
          ]}
          onValueChange={handleSort('mission')}
        />
        <FilterButton
          key={`date-${filterKey}`}
          className="col-span-1"
          placeholder="Mois / Année"
          filter={true}
          showSelectedOption
          options={[
            { label: 'Plus ancien', value: 'asc' },
            { label: 'Plus récent', value: 'desc' },
          ]}
          onValueChange={handleSort('date')}
        />
        <FilterButton
          key={`referent-${filterKey}`}
          className="col-span-1"
          placeholder="Référent Xpert One"
          filter={true}
          showSelectedOption
          options={[
            { label: 'Référent A → Z', value: 'asc' },
            { label: 'Référent Z → A', value: 'desc' },
          ]}
          onValueChange={handleSort('referent')}
        />
        <FilterButton
          key={`presence-${filterKey}`}
          className="col-span-1"
          placeholder="Feuille de présence validée"
          filter={true}
          options={yesNoOptions}
          coloredOptions
          onValueChange={(value) =>
            handleFilterChange('presenceSheetValidated', value)
          }
        />
        <FilterButton
          key={`salary-payment-${filterKey}`}
          className="col-span-1"
          placeholder="Paiement de salaire"
          filter={true}
          options={yesNoOptions}
          coloredOptions
          onValueChange={(value) => handleFilterChange('salaryPayment', value)}
        />
        <FilterButton
          key={`salary-sheet-${filterKey}`}
          className="col-span-1"
          placeholder="Bulletin de salaire"
          filter={true}
          options={yesNoOptions}
          coloredOptions
          onValueChange={(value) => handleFilterChange('salarySheet', value)}
        />
        <FilterButton
          key={`invoice-validated-${filterKey}`}
          className="col-span-1"
          placeholder="Facture validée"
          filter={true}
          options={yesNoOptions}
          coloredOptions
          onValueChange={(value) =>
            handleFilterChange('invoiceValidated', value)
          }
        />
        <FilterButton
          key={`invoice-paid-${filterKey}`}
          className="col-span-1"
          placeholder="Facture payée"
          filter={true}
          options={yesNoOptions}
          coloredOptions
          onValueChange={(value) => handleFilterChange('invoicePaid', value)}
        />
        <FilterButton
          key={`invoice-${filterKey}`}
          className="col-span-1"
          placeholder="Facture"
          filter={true}
          options={yesNoOptions}
          coloredOptions
          onValueChange={(value) => handleFilterChange('invoice', value)}
        />
        <FilterButton
          key={`payment-${filterKey}`}
          className="col-span-1"
          placeholder="Paiement"
          filter={true}
          options={yesNoOptions}
          coloredOptions
          onValueChange={(value) => handleFilterChange('payment', value)}
        />
      </div>

      {/* Filtre par date : année au choix + mois au choix */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-1">
        <span className="whitespace-nowrap text-sm font-medium">
          Trier par date :
        </span>
        <FilterButton
          key={`year-${filterKey}`}
          placeholder="Année"
          filter={true}
          showSelectedOption
          options={yearOptions}
          onValueChange={(value) =>
            setYearFilter(value === '' ? null : Number(value))
          }
        />
        <FilterButton
          key={`month-${filterKey}`}
          placeholder="Mois"
          filter={true}
          showSelectedOption
          options={monthOptions}
          onValueChange={(value) =>
            setMonthFilter(value === '' ? null : Number(value))
          }
        />
      </div>

      {/* Résumé & reset */}
      <div className="flex items-center gap-x-4 px-1">
        <p className="whitespace-nowrap">{displayRows.length} résultats</p>
        {hasActiveFiltersOrSort && (
          <button className="font-[600] text-primary" onClick={resetFilters}>
            Réinitialiser
          </button>
        )}
      </div>

      {/* Liste des lignes */}
      <div className="overflow-y-auto">
        <div className="grid grid-cols-10 gap-3">
          {displayRows.map(({ mission, monthYear }) => (
            <EtatFacturationsRow
              key={`${mission.id}-${monthYear.year}-${monthYear.month}`}
              missionData={mission}
              selectedMonthYear={monthYear}
              onSalaryPaymentChange={handleSalaryPaymentChange}
            />
          ))}
        </div>
      </div>

      {/* Bouton d'enregistrement des paiements */}
      {Object.keys(pendingPayments).length > 0 && (
        <div className="fixed bottom-10 right-10">
          <Button
            className="bg-primary px-spaceLarge py-spaceContainer text-white"
            onClick={handleSavePayments}
          >
            Enregistrer
          </Button>
        </div>
      )}

      {/* Ligne d'upload + refresh des statuts au succès */}
      <div className="grid grid-cols-10 gap-3">
        <EtatFacturationUploadRow
          missions={missions}
          onUploadSuccess={() => {
            checkAllMissionsFiles(missions);
          }}
        />
      </div>
    </div>
  );
}
