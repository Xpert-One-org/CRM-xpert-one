import Input from '@/components/inputs/Input';
import { useEditMissionStore } from '../../../editMissionStore';

export function MissionEvaluation() {
  const {
    openedMissionNotSaved: mission,
    handleUpdateXpertEvaluation,
    loading,
  } = useEditMissionStore();

  if (!mission || !mission.xpert) return null;

  const handleEvaluationChange = (value: string) => {
    const evaluationScore = value ? parseInt(value, 10) : null;
    handleUpdateXpertEvaluation(evaluationScore, undefined);
  };

  const handleSelfEvaluationChange = (value: string) => {
    const selfEvaluationScore = value ? parseInt(value, 10) : null;
    handleUpdateXpertEvaluation(undefined, selfEvaluationScore);
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg bg-[#D0DDE1] px-spaceMediumContainer py-[10px] text-black shadow-container">
      <h3 className="text-lg font-medium text-black">Évaluation XPERT</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          className="w-full"
          label="Évaluation (1-10)"
          type="number"
          min={1}
          max={10}
          value={mission.xpert.evaluation_score ?? ''}
          onChange={(e) => handleEvaluationChange(e.target.value)}
          disabled={loading}
        />
        <Input
          className="w-full"
          label="Auto Évaluation (1-10)"
          type="number"
          min={1}
          max={10}
          value={mission.xpert.self_evaluation_score ?? ''}
          onChange={(e) => handleSelfEvaluationChange(e.target.value)}
          disabled={loading}
        />
      </div>
    </div>
  );
}
