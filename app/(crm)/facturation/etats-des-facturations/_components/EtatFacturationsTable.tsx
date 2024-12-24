import { FilterButton } from '@/components/FilterButton';
import type { DBMission } from '@/types/typesDb';
import React, { useState, useCallback, useMemo } from 'react';
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

export default function EtatFacturationsTable({
  missions,
}: {
  missions: DBMission[];
}) {
  const { fileStatusesByMission, checkAllMissionsFiles } =
    useFileStatusFacturationStore();

  const [sortedRows, setSortedRows] = useState<
    { mission: DBMission; monthYear: { month: number; year: number } }[]
  >([]);

  const [pendingPayments, setPendingPayments] = useState<PendingPayments>({});

  const [activeFilters, setActiveFilters] = useState<FilterState>({});

  const [filterKey, setFilterKey] = useState(0);

  const baseRows = missions
    .flatMap((mission) => {
      const fileStatuses =
        fileStatusesByMission[mission.mission_number || ''] || {};

      const monthsForMission = getUniqueBillingMonths(fileStatuses, mission);

      return monthsForMission.map((monthYear) => ({
        mission,
        monthYear,
      }));
    })
    .sort((a, b) => {
      if (a.monthYear.year !== b.monthYear.year) {
        return a.monthYear.year - b.monthYear.year;
      }
      if (a.monthYear.month !== b.monthYear.month) {
        return a.monthYear.month - b.monthYear.month;
      }
      const missionNumberA = parseInt(
        a.mission.mission_number?.split(' ')[1] || '0'
      );
      const missionNumberB = parseInt(
        b.mission.mission_number?.split(' ')[1] || '0'
      );
      return missionNumberA - missionNumberB;
    });

  const handleDateSort = (value: string) => {
    const newSortedRows = [...baseRows].sort((a, b) => {
      const dateA = new Date(a.monthYear.year, a.monthYear.month);
      const dateB = new Date(b.monthYear.year, b.monthYear.month);

      if (value === 'asc') {
        return dateA.getTime() - dateB.getTime();
      } else {
        return dateB.getTime() - dateA.getTime();
      }
    });

    setSortedRows(newSortedRows);
  };

  const handleSalaryPaymentChange = (
    mission: DBMission,
    monthYear: { month: number; year: number },
    isSelected: boolean,
    isNull: boolean,
    paymentType: PaymentType
  ) => {
    setPendingPayments((prev) => {
      const missionKey = `${mission.id}_${paymentType}`;
      const existingPayments = prev[missionKey] || [];

      if (isNull) {
        return {
          ...prev,
          [missionKey]: [
            ...existingPayments.filter(
              (p) =>
                p.monthYear.month !== monthYear.month ||
                p.monthYear.year !== monthYear.year
            ),
            {
              monthYear,
              date: null,
              paymentType,
            },
          ],
        };
      }

      const paymentExists = existingPayments.some(
        (p) =>
          p.monthYear.month === monthYear.month &&
          p.monthYear.year === monthYear.year
      );

      if (paymentExists) {
        return {
          ...prev,
          [missionKey]: existingPayments.filter(
            (p) =>
              p.monthYear.month !== monthYear.month ||
              p.monthYear.year !== monthYear.year
          ),
        };
      }

      return {
        ...prev,
        [missionKey]: [
          ...existingPayments,
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

      const [missionId, ...paymentTypeParts] = key.split('_');
      const paymentType = paymentTypeParts.join('_') as PaymentType;

      const mission = missions.find(
        (mission) => mission.id === parseInt(missionId)
      );

      const paymentData = payments.reduce(
        (acc, { monthYear, date }) => ({
          ...acc,
          [`${monthYear.year}-${(monthYear.month + 1)
            .toString()
            .padStart(2, '0')}`]: date,
        }),
        {}
      );

      await updateMissionFacturationPayment(
        parseInt(missionId),
        paymentData,
        paymentType
      );

      toast.success(
        `${paymentType === 'facturation_salary_payment' ? 'Paiements salaire' : 'Paiements fournisseur'} enregistrés pour la mission ${mission?.mission_number}`
      );
    }
    setPendingPayments({});
  };

  const handleFilterChange = (filterKey: keyof FilterState, value: string) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterKey]: value === prev[filterKey] ? undefined : value,
    }));
  };

  const filterRows = useCallback(
    (rows: typeof baseRows) => {
      return rows.filter(({ mission, monthYear }) => {
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

        const checkPayment = (
          payments: PaymentStatus[] | null,
          type: string
        ) => {
          if (!Array.isArray(payments)) return false;
          const key = `${monthYear.year}-${(monthYear.month + 1).toString().padStart(2, '0')}`;
          return payments.some((payment) => payment.period === key);
        };

        for (const [key, value] of Object.entries(activeFilters)) {
          if (!value) continue;

          const isYes = value === 'yes';

          switch (key) {
            case 'presenceSheetValidated':
              if (checkFileStatus('presence_sheet_validated') !== isYes)
                return false;
              break;
            case 'salaryPayment':
              if (
                checkPayment(
                  mission.facturation_salary_payment as PaymentStatus[],
                  'salary'
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
              if (
                missionStatus !== 'cdi' &&
                checkFileStatus('invoice_received') !== isYes
              )
                return false;
              break;
            case 'invoicePaid':
              if (
                checkPayment(
                  mission.facturation_invoice_paid as PaymentStatus[],
                  'invoice'
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
                  mission.facturation_fournisseur_payment as PaymentStatus[],
                  'payment'
                ) !== isYes
              )
                return false;
              break;
          }
        }
        return true;
      });
    },
    [fileStatusesByMission, activeFilters]
  );

  const displayRows = useMemo(() => {
    const rows = sortedRows.length > 0 ? sortedRows : baseRows;
    return filterRows(rows);
  }, [sortedRows, baseRows, filterRows]);

  const resetFilters = () => {
    setActiveFilters({});
    setSortedRows([]);
    setFilterKey((prev) => prev + 1);
  };

  return (
    <div className="flex h-[calc(100vh-260px)] flex-col gap-3">
      <div className="grid grid-cols-10 gap-3">
        <FilterButton
          key={`gestion-${filterKey}`}
          className="col-span-1"
          placeholder="Gestion de facturation"
        />
        <FilterButton
          key={`date-${filterKey}`}
          className="col-span-1"
          placeholder="Mois / Année"
          filter={true}
          options={[
            { label: 'Plus ancien', value: 'asc' },
            { label: 'Plus récent', value: 'desc' },
          ]}
          onValueChange={handleDateSort}
        />
        <FilterButton
          key={`referent-${filterKey}`}
          className="col-span-1"
          placeholder="Référent Xpert One"
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

      <div className="flex items-center gap-x-4 px-1">
        <p className="whitespace-nowrap">{displayRows.length} résultats</p>
        {(Object.keys(activeFilters).some(
          (key) => activeFilters[key as keyof FilterState]
        ) ||
          sortedRows.length > 0) && (
          <button className="font-[600] text-primary" onClick={resetFilters}>
            Réinitialiser
          </button>
        )}
      </div>

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
