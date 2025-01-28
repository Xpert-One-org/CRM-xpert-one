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
  totalCA: number;
};

const initialCalculatedValues: CalculatedValues = {
  totalSalaryNoCharges: 0,
  totalSalaryWithCharges: 0,
  totalGD: 0,
  totalXpertCost: 0,
  marginEuros: 0,
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
        margin = 0,
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

      // Calcul du salaire avec charges pour CDI de mission
      const totalSalaryWithCharges =
        xpert_status === 'CDI de mission'
          ? totalSalaryNoCharges * CHARGES_SOCIALES
          : totalSalaryNoCharges;

      // Calcul des coûts totaux
      const totalXpertCost =
        totalSalaryWithCharges + totalGD + (annex_costs ?? 0);
      const marginEuros =
        totalXpertCost * (1 + (margin ?? 0) / 100) - totalXpertCost;
      const totalCA = totalXpertCost + marginEuros;

      setCalculated({
        totalSalaryNoCharges,
        totalSalaryWithCharges,
        totalGD,
        totalXpertCost,
        marginEuros,
        totalCA,
      });
    } catch (error) {
      console.error('Erreur dans le calcul des finances:', error);
      setCalculated(initialCalculatedValues);
    }
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

  useEffect(() => {
    console.log('mission?.finance', mission?.finance);
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
      const withDecimals = val.toFixed(2).replace('.', ',');
      return withDecimals.replace(/,?0+$/, '');
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
        className="w-fit"
      />
    );
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg bg-[#D0DDE1] px-spaceMediumContainer py-[10px] text-black shadow-container">
      <h3 className="text-lg font-medium">Information monétaire</h3>

      {/* Statut et Base tarifaire */}
      <div className="flex w-full flex-row gap-4">
        <SelectComponent
          label="Statut XPERT"
          options={statusOptions}
          defaultSelectedKeys={finance.xpert_status}
          onValueChange={(value) => handleFinanceUpdate('xpert_status', value)}
          name="xpert_status"
          className="!max-w-[150px]"
        />

        <SelectComponent
          label="Base tarifaire"
          options={getBaseOptions(finance.xpert_status ?? '')}
          defaultSelectedKeys={finance.base_tarifaire}
          onValueChange={(value) =>
            handleFinanceUpdate('base_tarifaire', value)
          }
          name="base_tarifaire"
          className="!w-full !max-w-[150px]"
        />
      </div>

      {/* Taux et période */}
      <div className="flex w-fit flex-row gap-4">
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

      {/* Déplacements et frais */}
      <div className="flex w-fit flex-row gap-4">
        <MonetaryInput
          label="Grand Déplacement"
          value={finance.gd_rate}
          fieldName="gd_rate"
          suffix="€ / jour"
        />

        <MonetaryInput label="Total GD" value={calculated.totalGD} disabled />

        <div className="relative">
          <MonetaryInput
            label="Frais Annexes"
            value={finance.annex_costs}
            fieldName="annex_costs"
            helpText="Total frais supplémentaire pour toute la durée du contrat"
          />
          {/* <div className="absolute right-[-20px] top-[38px]">
            <InfoCircle
              title="Total frais supplémentaire pour toute la durée du contrat"
            />
          </div> */}
        </div>

        <MonetaryInput
          label="Total coût de l'XPERT"
          value={calculated.totalXpertCost}
          disabled
        />
      </div>

      {/* Marge et CA */}
      <div className="flex w-fit flex-row gap-4">
        <MonetaryInput
          label="Marge XPERT ONE"
          value={finance.margin}
          fieldName="margin"
          suffix="%"
        />

        <MonetaryInput
          label="soit en euro"
          value={calculated.marginEuros}
          disabled
        />

        <MonetaryInput
          label="CA de la mission"
          value={calculated.totalCA}
          disabled
        />
      </div>
    </div>
  );
}
