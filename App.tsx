import React, { useState, useEffect, useCallback } from 'react';
import { AppStep, CatalogItem } from './types';
import { generateCatalogLayout } from './services/geminiService';

import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ImageEnhancer from './components/ImageEnhancer';
import StylePrompt from './components/StylePrompt';
import CatalogPreview from './components/CatalogPreview';
import Loader from './components/Loader';
import Icon from './components/Icon';
import ProgressStepper from './components/ProgressStepper';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.UPLOAD);
  const [highestStepReached, setHighestStepReached] = useState<AppStep>(AppStep.UPLOAD);
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [stylePrompt, setStylePrompt] = useState<string>('');
  const [generatedHtml, setGeneratedHtml] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Cleanup object URLs when component unmounts or items change
    return () => {
      items.forEach(item => URL.revokeObjectURL(item.objectURL));
    };
  }, []);

  // Centralized function to manage step transitions and track progress
  const goToStep = (targetStep: AppStep) => {
    // When navigating back from preview, clear the generated content
    if (step === AppStep.PREVIEW && targetStep < AppStep.PREVIEW) {
        setGeneratedHtml('');
    }
    setStep(targetStep);
    if (targetStep > highestStepReached) {
      setHighestStepReached(targetStep);
    }
  };

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
      goToStep(AppStep.STYLE); // This will clear HTML via goToStep logic
    }
  };

  const handleStepClick = (clickedStep: AppStep) => {
    // Allow navigation to any step that has been reached before
    if (clickedStep <= highestStepReached) {
        // Prevent jumping to preview if it hasn't been generated yet.
        // This is a safeguard; highestStepReached should already prevent this.
        if (clickedStep === AppStep.PREVIEW && !generatedHtml) return;
        goToStep(clickedStep);
    }
  };

  const handleGenerate = useCallback(async () => {
    if (items.length === 0 || stylePrompt.trim() === '') return;

    goToStep(AppStep.GENERATE); // Show loading state
    setIsLoading(true);

    const html = await generateCatalogLayout(stylePrompt, items);
    setGeneratedHtml(html);

    setIsLoading(false);
    goToStep(AppStep.PREVIEW); // Move to final step
  }, [stylePrompt, items, highestStepReached]);

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
             <p className="mt-4 text-indigo-200">The AI is designing the layout and writing copy...</p>
          </div>
        );
      case AppStep.PREVIEW:
        return <CatalogPreview htmlContent={generatedHtml} items={items} onBack={handleBackStep} />;
      default:
        return null;
    }
  };
  
  const canGoNext = 
    (step === AppStep.UPLOAD && items.length > 0) ||
    (step === AppStep.ENHANCE) || 
    (step === AppStep.STYLE && stylePrompt.trim().length > 0);
  
  const canGoBack = step === AppStep.ENHANCE || step === AppStep.STYLE || step === AppStep.PREVIEW;

  const nextButtonText = () => {
      switch(step) {
          case AppStep.UPLOAD: return 'Enhance Images';
          case AppStep.ENHANCE: return 'Define Style';
          case AppStep.STYLE: return 'Generate Catalog';
          default: return 'Next';
      }
  }

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* SVG definitions for clip-path to be available globally */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
          <defs>
              {items.map(item => item.enhancement ? (
                  <g key={item.id} dangerouslySetInnerHTML={{ __html: item.enhancement.clipPathSvg }} />
              ) : null)}
          </defs>
      </svg>
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
             {/* New Stepper Component */}
            <div className="mb-8 flex justify-center pt-4 px-4">
              <ProgressStepper currentStep={step} onStepClick={handleStepClick} />
            </div>
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-200">
                {renderStep()}
                {step !== AppStep.GENERATE && step !== AppStep.PREVIEW && (
                    <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center">
                        <button
                            onClick={handleBackStep}
                            disabled={!canGoBack}
                            className="flex items-center gap-2 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Icon icon="arrow-left" className="w-5 h-5"/>
                            Back
                        </button>
                        <button
                            onClick={handleNextStep}
                            disabled={!canGoNext}
                            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:bg-indigo-300 disabled:cursor-not-allowed"
                        >
                        {nextButtonText()}
                        <Icon icon="arrow-right" className="w-5 h-5"/>
                        </button>
                    </div>
                )}
            </div>
        </div>
      </main>
    </div>
  );
};

export default App;
