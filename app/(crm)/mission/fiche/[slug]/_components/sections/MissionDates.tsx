import { BaseSectionProps } from '@/types/mission';
import Input from '@/components/inputs/Input';
import { useEditMissionStore } from '../../../editMissionStore';
import { cn } from '@/lib/utils';

const calculateDuration = (startDate: string, endDate: string) => {
  if (!startDate || !endDate) return { days: 0, months: 0 };

  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const months = +(days / 30.44).toFixed(2);

  return { days, months };
};

const getDaysDifference = (date: string) => {
  if (!date) return 0;
  const today = new Date();
  const targetDate = new Date(date);
  const diffTime = targetDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const getDateIndicator = (daysDiff: number) => {
  if (daysDiff < 0) return `(Date dépassée)`;
  if (daysDiff <= 15) return `(J-${daysDiff})`;
  if (daysDiff <= 30) return `(J-${daysDiff})`;
  return `(J-${daysDiff})`;
};

const getDateColor = (daysDiff: number) => {
  if (daysDiff < 0) return 'text-gray-500';
  if (daysDiff <= 15) return 'text-red-500';
  if (daysDiff <= 30) return 'text-[#F9A800]';
  return 'text-[#3CB739]';
};

export function MissionDates() {
  const { openedMissionNotSaved: mission, handleUpdateField } =
    useEditMissionStore();

  if (!mission) return null;

  const { days, months } = calculateDuration(
    mission.start_date || '',
    mission.end_date || ''
  );

  const renderDateWithIndicator = (date: string, label: string) => {
    const daysDiff = getDaysDifference(date);
    const indicator = getDateIndicator(daysDiff);
    const colorClass = getDateColor(daysDiff);

    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span>{label}</span>
          <span className={cn('text-sm', colorClass)}>{indicator}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg bg-[#D0DDE1] px-spaceMediumContainer py-[10px] text-black shadow-container">
      <h3 className="text-lg font-medium text-black">Date de mission</h3>
      <div className="flex w-full flex-col gap-4 md:flex-row">
        <Input
          type="date"
          label={renderDateWithIndicator(
            mission.start_date || '',
            'Début de mission prévisionnel*'
          )}
          value={mission.start_date ? mission.start_date.split('T')[0] : ''}
          onChange={(e) => handleUpdateField('start_date', e.target.value)}
          className="w-full"
        />
        <Input
          type="date"
          label={renderDateWithIndicator(
            mission.end_date || '',
            'Fin de mission prévisionnel*'
          )}
          value={mission.end_date ? mission.end_date.split('T')[0] : ''}
          onChange={(e) => handleUpdateField('end_date', e.target.value)}
          className="w-full"
        />
        <Input
          type="date"
          label={renderDateWithIndicator(
            mission.deadline_application || '',
            'Remise des candidatures*'
          )}
          value={
            mission.deadline_application
              ? mission.deadline_application.split('T')[0]
              : ''
          }
          onChange={(e) =>
            handleUpdateField('deadline_application', e.target.value)
          }
          className="w-full"
        />
      </div>
      <div className="flex w-full flex-col gap-4 md:flex-row">
        <div className="flex w-full flex-col gap-4 md:w-2/3 md:flex-row">
          <Input
            type="date"
            label="Début de mission définitif"
            value={mission.start_date ? mission.start_date.split('T')[0] : ''}
            onChange={(e) => handleUpdateField('start_date', e.target.value)}
            className="w-full"
          />
          <Input
            type="date"
            label="Fin de mission définitif"
            value={mission.end_date ? mission.end_date.split('T')[0] : ''}
            onChange={(e) => handleUpdateField('end_date', e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex w-full flex-col gap-4 md:w-1/3 md:flex-row">
          <Input
            type="text"
            label="Durée de la mission"
            value={`${days} jours`}
            disabled
            className="w-full"
          />
          <Input
            type="text"
            label="soit en mois"
            value={`${months} mois`}
            disabled
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
