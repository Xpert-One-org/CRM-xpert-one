import EnergyNuclearSvg from '@/components/svg/filter/EnergyNuclearSvg';
import EnergyRenewableSvg from '@/components/svg/filter/EnergyRenewableSvg';
import EntrepreneurshipSvg from '@/components/svg/filter/EntrepreneurshipSvg';
import InfrastructureSvg from '@/components/svg/filter/InfrastructureSvg';
import OtherSvg from '@/components/svg/filter/OtherSvg';
import ProcessIndustrySvg from '@/components/svg/filter/ProcessIndustrySvg';
import WasteTreatmentSvg from '@/components/svg/filter/WasteTreatmentSvg';
import WaterSvg from '@/components/svg/filter/WaterSvg';
import { IceCreamCone } from 'lucide-react';

export const filtersArticle = [
  {
    label: 'Énergie & nucléaire',
    icon: EnergyNuclearSvg,
    value: 'energy_and_nuclear',
  },
  {
    label: 'Énergie renouvelable',
    icon: EnergyRenewableSvg,
    value: 'renewable_energy',
  },
  {
    label: 'Traitement des déchets',
    icon: WasteTreatmentSvg,
    value: 'waste_treatment',
  },
  {
    label: 'Industrie des procédeés',
    icon: ProcessIndustrySvg,
    value: 'process_industry',
  },
  {
    label: 'Eau',
    icon: WaterSvg,
    value: 'water',
  },
  {
    label: 'Infrastructure',
    icon: InfrastructureSvg,
    value: 'infrastructure',
  },
  {
    label: 'Entreprenariat',
    icon: EntrepreneurshipSvg,
    value: 'entrepreneurship',
  },
  { label: 'Autre', icon: OtherSvg, value: 'other' },
];
