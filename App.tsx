import React, { useState, useEffect, useCallback } from 'react';
import { AppStep, CatalogItem } from './types';
import { generateCatalogLayout } from './services/geminiService';
import { ErrorBoundary } from 'react-error-boundary';
import { useAppSteps } from './hooks/useAppSteps';

import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ImageEnhancer from './components/ImageEnhancer';
import StylePrompt from './components/StylePrompt';
import CatalogPreview from './components/CatalogPreview';
import Loader from './components/Loader';
import Icon from './components/Icon';
import ProgressStepper from './components/ProgressStepper';

const ErrorFallback = ({ error }: { error: Error }) => (
  <div
    className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md"
    role="alert"
  >
    <h3 className="font-bold text-lg mb-2">Something went wrong</h3>
    <p className="mb-4">
      We encountered an unexpected error. Please try refreshing the page.
    </p>
    <pre className="bg-red-50 p-2 rounded text-sm whitespace-pre-wrap">
      <code>{error.message}</code>
    </pre>
  </div>
);

const App: React.FC = () => {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [stylePrompt, setStylePrompt] = useState<string>('');
  const [generatedHtml, setGeneratedHtml] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const { step, highestStepReached, goToStep } = useAppSteps({
    onStepChange: (prevStep, nextStep) => {
      if (prevStep === AppStep.PREVIEW && nextStep < AppStep.PREVIEW) {
        setGeneratedHtml('');
      }
    },
  });

  useEffect(() => {
    // Only cleanup on unmount - don't try to be smart about individual URL cleanup
    // This prevents accidentally revoking URLs that are still in use
    return () => {
      items.forEach((item) => URL.revokeObjectURL(item.objectURL));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run on mount/unmount

  const handleNextStep = () => {
    if (step === AppStep.UPLOAD && items.length > 0) {
      goToStep(AppStep.ENHANCE);
    } else if (step === AppStep.ENHANCE) {
      goToStep(AppStep.STYLE);
    } else if (step === AppStep.STYLE && stylePrompt.trim().length > 0) {
      handleGenerate();
    }
  };

  const handleBackStep = () => {
    if (step === AppStep.ENHANCE) {
      goToStep(AppStep.UPLOAD);
    } else if (step === AppStep.STYLE) {
      goToStep(AppStep.ENHANCE);
    } else if (step === AppStep.PREVIEW) {
      goToStep(AppStep.STYLE);
    }
  };

  const handleStepClick = (clickedStep: AppStep) => {
    if (clickedStep <= highestStepReached) {
      if (clickedStep === AppStep.PREVIEW && !generatedHtml) return;
      goToStep(clickedStep);
    }
  };

  const handleGenerate = useCallback(async () => {
    if (items.length === 0 || stylePrompt.trim() === '') return;

    setError(null);
    goToStep(AppStep.GENERATE); // Show loading state

    const result = await generateCatalogLayout(stylePrompt, items);

    if (result.success) {
      setGeneratedHtml(result.data);
      goToStep(AppStep.PREVIEW); // Move to final step
    } else {
      setError(result.error);
      goToStep(AppStep.STYLE); // Go back to the style step to allow re-trying
    }
  }, [stylePrompt, items, goToStep]);

  const renderStep = () => {
    switch (step) {
      case AppStep.UPLOAD:
        return <ImageUploader items={items} onItemsChange={setItems} />;
      case AppStep.ENHANCE:
        return <ImageEnhancer items={items} onItemsChange={setItems} />;
      case AppStep.STYLE:
        return <StylePrompt prompt={stylePrompt} setPrompt={setStylePrompt} />;
      case AppStep.GENERATE:
        return (
          <div className="flex flex-col items-center justify-center bg-indigo-600 text-white p-12 rounded-lg shadow-xl">
            <Loader message="Crafting your stunning catalog..." />
            <p className="mt-4 text-indigo-200">
              The AI is designing the layout and writing copy...
            </p>
          </div>
        );
      case AppStep.PREVIEW:
        return (
          <CatalogPreview
            htmlContent={generatedHtml}
            items={items}
            onBack={handleBackStep}
          />
        );
      default:
        return null;
    }
  };

  const canGoNext =
    (step === AppStep.UPLOAD && items.length > 0) ||
    step === AppStep.ENHANCE ||
    (step === AppStep.STYLE && stylePrompt.trim().length > 0);

  const canGoBack =
    step === AppStep.ENHANCE ||
    step === AppStep.STYLE ||
    step === AppStep.PREVIEW;

  const nextButtonText = () => {
    switch (step) {
      case AppStep.UPLOAD:
        return 'Enhance Images';
      case AppStep.ENHANCE:
        return 'Define Style';
      case AppStep.STYLE:
        return 'Generate Catalog';
      default:
        return 'Next';
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* SVG definitions for clip-path to be available globally */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          {items.map((item) =>
            item.enhancement ? (
              <g
                key={item.id}
                dangerouslySetInnerHTML={{
                  __html: item.enhancement.clipPathSvg,
                }}
              />
            ) : null
          )}
        </defs>
      </svg>
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <div className="max-w-7xl mx-auto">
            {/* New Stepper Component */}
            <div className="mb-8 flex justify-center pt-4 px-4">
              <ProgressStepper
                currentStep={step}
                onStepClick={handleStepClick}
              />
            </div>
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-200">
              {error && (
                <div
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6"
                  role="alert"
                >
                  <strong className="font-bold">Error:</strong>
                  <span className="block sm:inline ml-2">{error}</span>
                  <button
                    onClick={() => setError(null)}
                    className="absolute top-0 bottom-0 right-0 px-4 py-3"
                  >
                    <Icon icon="close" className="w-5 h-5" />
                  </button>
                </div>
              )}
              {renderStep()}
              {step !== AppStep.GENERATE && step !== AppStep.PREVIEW && (
                <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center">
                  <button
                    onClick={handleBackStep}
                    disabled={!canGoBack}
                    className="flex items-center gap-2 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Icon icon="arrow-left" className="w-5 h-5" />
                    Back
                  </button>
                  <button
                    onClick={handleNextStep}
                    disabled={!canGoNext}
                    className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:bg-indigo-300 disabled:cursor-not-allowed"
                  >
                    {nextButtonText()}
                    <Icon icon="arrow-right" className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </ErrorBoundary>
      </main>
    </div>
  );
};

export default App;
