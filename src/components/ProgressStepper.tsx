import React from 'react';
import { AppStep } from '@types';
import Icon from '@components/Icon';

interface StepperProps {
  currentStep: AppStep;
  onStepClick: (step: AppStep) => void;
}

const steps = [
  { id: AppStep.UPLOAD, name: 'Upload' },
  { id: AppStep.ENHANCE, name: 'Enhance' },
  { id: AppStep.STYLE, name: 'Style' },
  { id: AppStep.PREVIEW, name: 'Preview' },
];

const ProgressStepper: React.FC<StepperProps> = ({
  currentStep,
  onStepClick,
}) => {
  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);
  // Treat GENERATE step as visually being part of the transition from STYLE
  const visualStepIndex =
    currentStep === AppStep.GENERATE
      ? steps.findIndex((s) => s.id === AppStep.STYLE)
      : currentStepIndex;

  return (
    <nav aria-label="Progress">
      <ol className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li
            key={step.name}
            className={`relative ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}
          >
            {stepIdx < visualStepIndex ? (
              // Completed Step
              <>
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="h-0.5 w-full bg-indigo-600" />
                </div>
                <button
                  onClick={() => onStepClick(step.id)}
                  className="relative w-8 h-8 flex items-center justify-center bg-indigo-600 rounded-full hover:bg-indigo-900 transition-colors"
                  aria-label={`Go to ${step.name} step`}
                >
                  <Icon icon="check" className="w-5 h-5 text-white" />
                </button>
                <span className="absolute top-10 left-1/2 -translate-x-1/2 text-sm font-medium text-gray-900">
                  {step.name}
                </span>
              </>
            ) : stepIdx === visualStepIndex ? (
              // Current Step
              <>
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="h-0.5 w-full bg-gray-200" />
                </div>
                <button
                  onClick={() => onStepClick(step.id)}
                  className="relative w-8 h-8 flex items-center justify-center bg-white border-2 border-indigo-600 rounded-full"
                  aria-current="step"
                >
                  <span
                    className="h-2.5 w-2.5 bg-indigo-600 rounded-full"
                    aria-hidden="true"
                  />
                  <span className="sr-only">{step.name}</span>
                </button>
                <span className="absolute top-10 left-1/2 -translate-x-1/2 text-sm font-semibold text-indigo-600">
                  {step.name}
                </span>
              </>
            ) : (
              // Upcoming Step
              <>
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="h-0.5 w-full bg-gray-200" />
                </div>
                <div className="relative w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-300 rounded-full cursor-not-allowed">
                  <span className="sr-only">{step.name}</span>
                </div>
                <span className="absolute top-10 left-1/2 -translate-x-1/2 text-sm font-medium text-gray-500">
                  {step.name}
                </span>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default ProgressStepper;
