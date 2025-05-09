import { useState, useEffect } from 'react';
import SelectComponent from '@/components/inputs/SelectComponent';
import Input from '@/components/inputs/Input';
import { useEditMissionStore } from '../../../editMissionStore';
import type { DBMissionFinance } from '@/types/typesDb';
import { InfoCircle } from '@/components/ui/info-circle';

type CalculatedValues = {
  totalSalaryNoCharges: number;
  totalSalaryWithCharges: number;
  totalGD: number;
  totalXpertCost: number;
  marginEuros: number;
  marginPercent: number;
  totalCA: number;
};

const initialCalculatedValues: CalculatedValues = {
  totalSalaryNoCharges: 0,
  totalSalaryWithCharges: 0,
  totalGD: 0,
  totalXpertCost: 0,
  marginEuros: 0,
  marginPercent: 0,
  totalCA: 0,
};

const CHARGES_SOCIALES = 1.55;

export function MissionFinancials() {
  const { openedMissionNotSaved: mission, handleUpdateField } =
    useEditMissionStore();
  const [calculated, setCalculated] = useState<CalculatedValues>(
    initialCalculatedValues
  );

  const statusOptions = [
    { value: 'Entreprise', label: 'Entreprise' },
    { value: 'CDI de mission', label: 'CDI de mission' },
    { value: 'Portage', label: 'Portage' },
  ];

  const getBaseOptions = (status: string) => {
    if (status === 'CDI de mission') {
      return [
        { value: 'TJM', label: 'TJM' },
        { value: 'Brut Mensuel', label: 'Brut Mensuel' },
      ];
    }
    return [
      { value: 'TJM', label: 'TJM' },
      { value: 'Prix Mensuel', label: 'Prix Mensuel' },
    ];
  };

  const handleFinanceUpdate = (key: keyof DBMissionFinance, value: any) => {
    if (!mission?.finance) return;

    handleUpdateField('finance', {
      ...mission.finance,
      [key]: value,
    });
  };

  const calculateFinanceValues = (finance: DBMissionFinance) => {
    try {
      let totalSalaryNoCharges = 0;
      let totalGD = 0;

      const {
        base_tarifaire,
        daily_rate = 0,
        monthly_rate = 0,
        days_worked = 0,
        months_worked = 0,
        gd_rate = 0,
        annex_costs = 0,
        total_ca = 0,
        xpert_status,
      } = finance;

      // Calculate total days based on mission dates
      let totalDays = 0;
      if (mission?.start_date && mission?.end_date) {
        const start = new Date(mission.start_date);
        const end = new Date(mission.end_date);

        // Calculate all days between dates (including weekends)
        const diffTime = Math.abs(end.getTime() - start.getTime());
        totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end dates
      }

      // Calcul du salaire total sans charges
      if (base_tarifaire === 'TJM') {
        totalSalaryNoCharges = (daily_rate ?? 0) * (days_worked ?? 0);
        totalGD = (gd_rate ?? 0) * totalDays;
      } else {
        totalSalaryNoCharges = (monthly_rate ?? 0) * (months_worked ?? 0);
        totalGD = (gd_rate ?? 0) * totalDays;
      }

      // Calcul du salaire avec charges pour CDI de mission uniquement
      const totalSalaryWithCharges =
        xpert_status === 'CDI de mission'
          ? totalSalaryNoCharges * CHARGES_SOCIALES
          : totalSalaryNoCharges;

      // Calcul des coûts totaux
      const totalXpertCost =
        totalSalaryWithCharges + totalGD + (annex_costs ?? 0);

      // Calcul de la marge à partir du CA total
      const totalCA = total_ca ?? 0;
      const marginEuros = Math.max(0, totalCA - totalXpertCost);

      // Calcul du pourcentage de marge
      const marginPercent =
        totalXpertCost > 0 ? (marginEuros / totalXpertCost) * 100 : 0;

      setCalculated({
        totalSalaryNoCharges,
        totalSalaryWithCharges,
        totalGD,
        totalXpertCost,
        marginEuros,
        marginPercent,
        totalCA,
      });
    } catch (error) {
      console.error('Erreur dans le calcul des finances:', error);
      setCalculated(initialCalculatedValues);
    }
  };

  // Fonction pour calculer le CA avant marge à partir du CA total
  const calculatePreMarginCA = (totalCA: number) => {
    if (!mission?.finance) return;

    const totalXpertCost = calculated.totalXpertCost;
    const marginPercent = ((totalCA - totalXpertCost) / totalXpertCost) * 100;

    handleFinanceUpdate('total_ca', totalCA);
  };

  const getSalaryLabel = () => {
    if (mission?.finance?.xpert_status === 'CDI de mission') {
      return mission?.finance?.base_tarifaire === 'TJM' ? 'Salaire' : 'Salaire';
    }
    return mission?.finance?.base_tarifaire === 'TJM' ? 'TJM' : 'Prix Mensuel';
  };

  const getSalarySuffix = () => {
    if (mission?.finance?.base_tarifaire === 'TJM') {
      return '€ / jour';
    }
    return '€ / mois';
  };

  const getWorkPeriodLabel = () => {
    if (mission?.finance?.base_tarifaire === 'TJM') {
      return 'Nb de jour travaillé';
    }
    return 'Nb de mois travaillé';
  };

  const getTotalSalaryLabel = () => {
    if (mission?.finance?.xpert_status === 'CDI de mission') {
      return 'Total salaire (hors charge)';
    }
    if (mission?.finance?.base_tarifaire === 'TJM') {
      return 'Total TJM';
    }
    return 'Total Prix';
  };

  // Fonction pour appliquer une marge au CA
  const applyMargin = (marginPercent: number) => {
    if (!mission?.finance) return;

    const newCA = calculated.totalXpertCost * (1 + marginPercent / 100);
    handleFinanceUpdate('total_ca', newCA);
  };

  useEffect(() => {
    if (mission?.finance) {
      calculateFinanceValues(mission.finance);
    }
  }, [mission?.finance]);

  if (!mission?.finance) return null;

  const { finance } = mission;
  const isTJM = finance.base_tarifaire === 'TJM';

  const MonetaryInput = ({
    label,
    value,
    fieldName,
    suffix = '€',
    disabled = false,
    helpText,
  }: {
    label: string;
    value: number | null | undefined;
    fieldName?: keyof DBMissionFinance;
    suffix?: string;
    disabled?: boolean;
    helpText?: string;
  }) => {
    const formatValue = (val: number | null | undefined): string => {
      if (val === null || val === undefined || isNaN(val)) return '';
      // Format with 2 decimals and replace dot with comma
      const withDecimals = val.toFixed(2).replace('.', ',');
      // Remove trailing zeros after comma
      const withoutTrailingZeros = withDecimals.replace(/,?0+$/, '');
      // Add spaces between thousands
      const [integerPart, decimalPart] = withoutTrailingZeros.split(',');
      const withSpaces = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
      return decimalPart ? `${withSpaces},${decimalPart}` : withSpaces;
    };

    const [localValue, setLocalValue] = useState<string>(formatValue(value));

    useEffect(() => {
      setLocalValue(formatValue(value));
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setLocalValue(newValue);
    };

    const handleBlur = () => {
      if (fieldName) {
        const valueForParsing = localValue.replace(',', '.');
        const parsedValue =
          valueForParsing === '' ? null : parseFloat(valueForParsing);
        handleFinanceUpdate(fieldName, parsedValue);
        setLocalValue(formatValue(parsedValue));
      }
    };

    return (
      <Input
        label={label}
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={disabled}
        suffix={suffix}
        explain={helpText}
        numbersOnly
        className="w-full"
      />
    );
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg bg-[#D0DDE1] px-spaceMediumContainer py-[10px] text-black shadow-container">
      <h3 className="text-lg font-medium">Information monétaire</h3>

      {/* Statut et Base tarifaire */}
      <div className="grid grid-cols-4 gap-4">
        <SelectComponent
          label="Statut XPERT"
          options={statusOptions}
          defaultSelectedKeys={finance.xpert_status}
          onValueChange={(value) => handleFinanceUpdate('xpert_status', value)}
          name="xpert_status"
          className="w-full"
        />

        <SelectComponent
          label="Base tarifaire"
          options={getBaseOptions(finance.xpert_status ?? '')}
          defaultSelectedKeys={finance.base_tarifaire}
          onValueChange={(value) =>
            handleFinanceUpdate('base_tarifaire', value)
          }
          name="base_tarifaire"
          className="w-full"
        />
      </div>

      {/* Taux et période */}
      {finance.xpert_status && finance.base_tarifaire && (
        <>
          {/* Première ligne */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MonetaryInput
              label={getSalaryLabel()}
              value={isTJM ? finance.daily_rate : finance.monthly_rate}
              fieldName={isTJM ? 'daily_rate' : 'monthly_rate'}
              suffix={getSalarySuffix()}
            />

            <MonetaryInput
              label={getWorkPeriodLabel()}
              value={isTJM ? finance.days_worked : finance.months_worked}
              fieldName={isTJM ? 'days_worked' : 'months_worked'}
              suffix={isTJM ? 'jours' : 'mois'}
            />

            <MonetaryInput
              label={getTotalSalaryLabel()}
              value={calculated.totalSalaryNoCharges}
              disabled
            />

            {finance.xpert_status === 'CDI de mission' && (
              <MonetaryInput
                label="Total salaire (avec charge)"
                value={calculated.totalSalaryWithCharges}
                disabled
              />
            )}
          </div>

          {/* Deuxième ligne - Déplacements et frais */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MonetaryInput
              label="Grand Déplacement"
              value={finance.gd_rate}
              fieldName="gd_rate"
              suffix="€ / jour"
            />

            <MonetaryInput
              label="Total GD"
              value={calculated.totalGD}
              disabled
            />

            <MonetaryInput
              label="Frais Annexes"
              value={finance.annex_costs}
              fieldName="annex_costs"
              helpText="Total frais supplémentaire pour toute la durée du contrat"
            />

            <MonetaryInput
              label="Total coût de l'XPERT"
              value={calculated.totalXpertCost}
              disabled
            />
          </div>

          {/* Troisième ligne - CA et Marge */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <MonetaryInput
              label="CA de la mission"
              value={finance.total_ca}
              fieldName="total_ca"
              helpText="Chiffre d'affaires total de la mission"
            />

            <MonetaryInput
              label="CA avant marge"
              value={calculated.totalXpertCost}
              disabled
              helpText="Montant exact des coûts avant application de la marge"
            />

            <MonetaryInput
              label="Marge XPERT ONE"
              value={calculated.marginPercent}
              disabled
              suffix="%"
              helpText="Pourcentage de marge calculé à partir du CA total"
            />
          </div>

          {/* Quatrième ligne - Marge en euros */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <MonetaryInput
              label="Marge en euros"
              value={calculated.marginEuros}
              disabled
            />
          </div>
        </>
      )}
    </div>
  );
}
