import { useState } from 'react';
import { AppStep } from '../types';

interface UseAppStepsProps {
  initialStep?: AppStep;
  onStepChange?: (prevStep: AppStep, nextStep: AppStep) => void;
}

export const useAppSteps = ({
  initialStep = AppStep.UPLOAD,
  onStepChange,
}: UseAppStepsProps = {}) => {
  const [step, setStep] = useState<AppStep>(initialStep);
  const [highestStepReached, setHighestStepReached] =
    useState<AppStep>(initialStep);

  const goToStep = (targetStep: AppStep) => {
    onStepChange?.(step, targetStep);
    setStep(targetStep);
    if (targetStep > highestStepReached) {
      setHighestStepReached(targetStep);
    }
  };

  return {
    step,
    highestStepReached,
    goToStep,
    setStep, // Exposing setStep for more direct control if needed
  };
};
