import React, { useState, useEffect } from 'react';
import { CatalogItem } from '@types';
import {
  enhanceImage,
  generateImage,
  convertGeneratedImageToCatalogItem,
} from '@services/geminiService';
import Icon from '@components/Icon';
import Dialog from '@components/Dialog';

interface ImageEnhancerProps {
  items: CatalogItem[];
  onItemsChange: (items: CatalogItem[]) => void;
}

const ImageEnhancer: React.FC<ImageEnhancerProps> = ({
  items,
  onItemsChange,
}) => {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'error' | 'warning' | 'info' | 'success';
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
  });

  // Preset photography prompts
  const presetPrompts = [
    {
      name: 'High-Fashion Editorial',
      prompt:
        'editorial photography, masterpiece quality, ultra-detailed, sharp focus',
    },
    {
      name: 'Cinematic Drama',
      prompt: 'cinematic lighting, dramatic shadows, volumetric lighting',
    },
    {
      name: 'Soft Portraiture',
      prompt:
        'portrait photography, shallow depth of field, f/1.8 aperture, soft lighting',
    },
    {
      name: 'Golden Hour Glow',
      prompt: 'golden hour lighting effect, ethereal glow, crepuscular rays',
    },
    {
      name: 'Vintage Film Look',
      prompt:
        'vintage photography, Kodak Portra 400, analog film photo, film grain', // cSpell:ignore Portra
    },
    {
      name: 'Street Style Candid',
      prompt: 'candid street photography, motion blur, dynamic lighting',
    },
    {
      name: 'Sleek Studio Shot',
      prompt: 'studio lighting, rim light, ultra-detailed, 8K resolution',
    },
    {
      name: 'Macro Details',
      prompt: 'macro shot, intricate details, textured skin',
    },
    {
      name: 'Leica Look', // cSpell:ignore Leica
      prompt: 'shot on Leica M11, high contrast, documentary photo', // cSpell:ignore Leica
    },
    {
      name: 'Dynamic Movement',
      prompt: 'high-speed photography, light trails, panning shot',
    },
    {
      name: 'Minimalist Aesthetic',
      prompt: 'masterpiece quality, sharp focus, f/16 aperture',
    },
    {
      name: 'Dreamy and Ethereal',
      prompt: 'ethereal glow, soft focus, double exposure',
    },
    {
      name: 'High Contrast Noir',
      prompt:
        'noir photography, black and white photography, dramatic lighting',
    },
    {
      name: 'Retro Point-and-Shoot',
      prompt:
        'shot on a point-and-shoot camera, nostalgic mood, polaroid photo',
    },
    {
      name: 'Anamorphic Effect',
      prompt: 'anamorphic lens, lens flare, cinematic photo',
    },
    {
      name: 'Architectural Fashion',
      prompt: 'architectural photography, wide-angle lens, deep focus',
    },
    {
      name: 'Reflective Surface',
      prompt: 'HDR, dramatic lighting, subtle lens flare',
    },
    {
      name: 'Steadicam Movement',
      prompt: 'steadicam shot, tracking shot, dynamic lighting, high quality',
    },
    {
      name: 'Cinematic Close-Up',
      prompt: 'close-up shot, 85mm lens, f/1.8 aperture, cinematic photo',
    },
    {
      name: 'Classic Mamiya', // cSpell:ignore Mamiya
      prompt: 'shot on Mamiya RZ67, high quality, soft lighting', // cSpell:ignore Mamiya
    },
    {
      name: 'Cinematic',
      prompt: 'cinematic lighting with dramatic shadows',
    },
    {
      name: 'Golden Hour',
      prompt: 'golden hour lighting effect, warm tones',
    },
    {
      name: 'Professional',
      prompt: 'shot with 85mm lens, shallow depth of field',
    },
    {
      name: 'Vintage',
      prompt: 'vintage film look with kodak portra style', // cSpell:ignore kodak portra
    },
    {
      name: 'High-End',
      prompt: 'masterpiece quality, ultra-detailed, sharp focus',
    },
  ];

  const selectedItem = items.find((item) => item.id === selectedItemId);

  useEffect(() => {
    // Select the first item by default if no item is selected
    if (!selectedItemId && items.length > 0) {
      setSelectedItemId(items[0].id);
    }
    // If the selected item is removed, reset selection
    if (selectedItemId && !items.find((item) => item.id === selectedItemId)) {
      setSelectedItemId(items.length > 0 ? items[0].id : null);
    }
  }, [items, selectedItemId]);

  useEffect(() => {
    // When selected item changes, reset state
    setPrompt('Remove background and improve image quality.');
    setIsEnhancing(false);
  }, [selectedItemId]);

  const handleEnhance = async () => {
    if (!selectedItem) return;
    setIsEnhancing(true);

    const result = await enhanceImage(
      selectedItem.base64,
      selectedItem.file.type,
      selectedItem.id,
      prompt
    );

    if (result.success) {
      const updatedItems = items.map((item) =>
        item.id === selectedItemId
          ? { ...item, enhancement: result.data }
          : item
      );
      onItemsChange(updatedItems);
    } else {
      const errorMessage = (result as { success: false; error: string }).error;
      console.error('Failed to enhance item:', errorMessage);
      setDialogState({
        isOpen: true,
        title: 'Enhancement Error',
        message: `Sorry, there was an error enhancing the image: ${errorMessage}`,
        type: 'error',
      });
    }

    setIsEnhancing(false);
  };

  const handleRevert = () => {
    if (!selectedItemId) return;
    const updatedItems = items.map((item) => {
      if (item.id === selectedItemId) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { enhancement, ...itemWithoutEnhancement } = item;
        return itemWithoutEnhancement;
      }
      return item;
    });
    onItemsChange(updatedItems);
  };

  // Handle smart preset actions - enhance existing or generate new
  const handlePresetAction = async (presetPrompt: string) => {
    if (selectedItem) {
      // If an image is selected, enhance it
      setPrompt(presetPrompt);
    } else {
      // If no image selected, generate a new one
      await handleSmartGenerate(presetPrompt);
    }
  };

  const handleSmartGenerate = async (promptText: string) => {
    setIsGenerating(true);

    // Generate unique ID for the new image
    const newItemId = `generated-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const result = await generateImage(promptText, newItemId);

    if (result.success) {
      try {
        // Convert generated image to catalog item
        const newCatalogItem = await convertGeneratedImageToCatalogItem(
          result.data
        );

        // Add to items list
        const updatedItems = [...items, newCatalogItem];
        onItemsChange(updatedItems);

        // Select the newly generated item
        setSelectedItemId(newCatalogItem.id);

        // Show success message
        setDialogState({
          isOpen: true,
          title: 'Image Generated!',
          message:
            'Your AI-generated image has been added to your catalog items.',
          type: 'success',
        });
      } catch (error) {
        console.error('Failed to convert generated image:', error);
        setDialogState({
          isOpen: true,
          title: 'Conversion Error',
          message: 'Generated image successfully but failed to add to catalog.',
          type: 'error',
        });
      }
    } else {
      const errorMessage = (result as { success: false; error: string }).error;
      console.error('Failed to generate image:', errorMessage);
      setDialogState({
        isOpen: true,
        title: 'Generation Error',
        message: `Sorry, there was an error generating the image: ${errorMessage}`,
        type: 'error',
      });
    }

    setIsGenerating(false);
  };

  const enhancementToShow = selectedItem?.enhancement;

  return (
    <div className="w-full space-y-8">
      {/* Unified AI Image Studio */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Icon icon="sparkles" className="w-6 h-6 text-indigo-600" />
          <h2 className="text-lg font-medium text-gray-800">
            🍌 AI Image Studio - Enhance & Generate
          </h2>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Select an image to enhance it, or use our smart presets to generate
          brand new images when no image is selected. Use professional
          photography prompts like: &ldquo;Remove background&rdquo;,
          &ldquo;Cinematic lighting&rdquo;, &ldquo;Golden hour effect&rdquo;,
          &ldquo;High contrast&rdquo;, &ldquo;Professional color grading&rdquo;,
          &ldquo;Sharpen image&rdquo;.
        </p>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Item List */}
          <div className="md:w-1/4 space-y-2">
            <h3 className="font-semibold text-gray-600">Products</h3>
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedItemId(item.id)}
                className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition ${selectedItemId === item.id ? 'bg-indigo-100 ring-2 ring-indigo-500' : 'hover:bg-gray-100'}`}
              >
                <img
                  src={item.objectURL}
                  alt={item.name}
                  className="w-12 h-12 object-contain bg-white border rounded-md"
                />
                <span className="flex-grow text-sm font-medium text-gray-800 truncate">
                  {item.name}
                </span>
                {item.enhancement && (
                  <Icon
                    icon="check"
                    className="w-5 h-5 text-green-500 flex-shrink-0"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Enhancer UI */}
          <div className="md:w-3/4">
            {selectedItem ? (
              <div className="bg-gray-50 p-4 rounded-lg border">
                <h3 className="font-semibold text-lg text-gray-800 mb-4">
                  Editing: {selectedItem.name}
                </h3>
                {/* Before/After View */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-semibold text-center text-gray-600 mb-2">
                      Original
                    </h4>
                    <div className="aspect-square w-full bg-white border rounded-lg flex items-center justify-center overflow-hidden">
                      <img
                        key={`original-${selectedItem.id}`}
                        src={selectedItem.objectURL}
                        alt="Original"
                        className="max-h-full max-w-full"
                      />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-center text-gray-600 mb-2">
                      Enhanced Preview
                    </h4>
                    <div className="aspect-square w-full bg-white border rounded-lg flex items-center justify-center overflow-hidden">
                      {isEnhancing ? (
                        <div className="flex flex-col items-center gap-2 text-gray-500">
                          <span className="w-8 h-8 border-4 border-t-transparent border-indigo-500 rounded-full animate-spin"></span>
                          <span>Enhancing...</span>
                        </div>
                      ) : (
                        <img
                          key={`enhanced-${selectedItem.id}`}
                          src={selectedItem.objectURL}
                          alt="Enhanced"
                          className="max-h-full max-w-full"
                          style={{
                            filter: enhancementToShow?.filterCss,
                            clipPath: enhancementToShow
                              ? `url(#${enhancementToShow.clipPathId})`
                              : 'none',
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
                {/* Prompt and Actions */}
                <div>
                  <label
                    htmlFor="enhancement-prompt"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Enhancement Instructions
                  </label>
                  <textarea
                    id="enhancement-prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={2}
                    className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    placeholder="Try professional photography styles: 'cinematic lighting', 'golden hour effect', 'vintage film look', 'remove background', 'make brighter'..."
                  />

                  {/* Smart Preset Buttons - Enhance or Generate */}
                  <div className="mt-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      🍌 Smart Presets:{' '}
                      {selectedItem ? 'Enhance Selected' : 'Generate New Image'}
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                      {presetPrompts.map((preset, index) => (
                        <button
                          key={index}
                          onClick={() => handlePresetAction(preset.prompt)}
                          disabled={isEnhancing || isGenerating}
                          className={`text-xs px-2 py-1.5 border border-gray-200 rounded-md transition-colors text-left truncate ${
                            selectedItem
                              ? 'bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-800'
                              : 'bg-purple-50 hover:bg-purple-100 text-purple-700 hover:text-purple-800'
                          } disabled:opacity-50`}
                          title={`${selectedItem ? 'Enhance with:' : 'Generate:'} ${preset.prompt}`}
                        >
                          {selectedItem ? '🔧' : '✨'} {preset.name}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {selectedItem
                        ? '🔧 Blue buttons will enhance the selected image'
                        : '✨ Purple buttons will generate new images'}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-end gap-3">
                    {selectedItem.enhancement && (
                      <button
                        onClick={handleRevert}
                        className="px-4 py-2 text-sm font-semibold text-red-600 bg-red-100 hover:bg-red-200 rounded-lg transition"
                      >
                        Revert to Original
                      </button>
                    )}
                    <button
                      onClick={
                        selectedItem
                          ? handleEnhance
                          : () => handleSmartGenerate(prompt)
                      }
                      disabled={
                        (selectedItem ? isEnhancing : isGenerating) || !prompt
                      }
                      className="flex items-center justify-center gap-2 text-sm text-white font-semibold py-2 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition disabled:bg-gray-400"
                    >
                      <Icon icon="sparkles" className="w-4 h-4" />
                      {selectedItem
                        ? isEnhancing
                          ? 'Enhancing...'
                          : 'Enhance with AI'
                        : isGenerating
                          ? 'Generating...'
                          : '🍌 Generate New Image'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-8 rounded-lg border border-purple-200 text-center">
                <Icon
                  icon="sparkles"
                  className="w-12 h-12 text-purple-500 mx-auto mb-4"
                />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  🍌 Ready to Generate AI Images!
                </h3>
                <p className="text-gray-600 mb-4">
                  No image selected. Use the presets above or enter a custom
                  prompt to generate brand new images with Gemini&apos;s
                  nano-banana model.
                </p>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <label
                    htmlFor="custom-prompt"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Custom Generation Prompt
                  </label>
                  <textarea
                    id="custom-prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="e.g., 'Professional headphone product shot, white background, studio lighting, high-end commercial photography'"
                    disabled={isGenerating}
                  />
                  <button
                    onClick={() => handleSmartGenerate(prompt)}
                    disabled={isGenerating || !prompt.trim()}
                    className="mt-3 w-full flex items-center justify-center gap-2 text-sm text-white font-semibold py-2 px-4 rounded-lg bg-purple-600 hover:bg-purple-700 transition disabled:bg-gray-400"
                  >
                    <Icon icon="sparkles" className="w-4 h-4" />
                    {isGenerating ? 'Generating...' : '🍌 Generate New Image'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog
        isOpen={dialogState.isOpen}
        onClose={() => setDialogState((prev) => ({ ...prev, isOpen: false }))}
        title={dialogState.title}
        message={dialogState.message}
        type={dialogState.type}
      />
    </div>
  );
};

export default ImageEnhancer;
