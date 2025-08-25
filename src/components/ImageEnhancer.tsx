import React, { useState, useEffect } from 'react';
import { CatalogItem } from '@types';
import { enhanceImage } from '@services/geminiService';
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
        'vintage photography, Kodak Portra 400, analog film photo, film grain',
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
      name: 'Leica Look',
      prompt: 'shot on Leica M11, high contrast, documentary photo',
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
      name: 'Classic Mamiya',
      prompt: 'shot on Mamiya RZ67, high quality, soft lighting',
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

  const enhancementToShow = selectedItem?.enhancement;

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-2">
        <Icon icon="sparkles" className="w-6 h-6 text-gray-700" />
        <h2 className="text-lg font-medium text-gray-800">
          Enhance Product Images
        </h2>
      </div>
      <p className="text-sm text-gray-500 mb-4">
        Select an image and tell the AI how to enhance it. Use professional
        photography prompts like: &ldquo;Remove background&rdquo;,
        &ldquo;Cinematic lighting&rdquo;, &ldquo;Golden hour effect&rdquo;,
        &ldquo;High contrast&rdquo;, &ldquo;Professional color grading&rdquo;,
        &ldquo;Sharpen image&rdquo;. This tool applies enhancements to your
        existing product images.
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

                {/* Preset Prompt Buttons */}
                <div className="mt-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Quick Presets:
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                    {presetPrompts.map((preset, index) => (
                      <button
                        key={index}
                        onClick={() => setPrompt(preset.prompt)}
                        className="text-xs px-2 py-1.5 bg-gray-100 hover:bg-indigo-100 border border-gray-200 rounded-md text-gray-700 hover:text-indigo-700 transition-colors text-left truncate"
                        title={preset.prompt}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Professional Photography Examples */}
                <div className="mt-2 mb-3">
                  <details className="text-xs text-gray-600">
                    <summary className="cursor-pointer hover:text-gray-800 font-medium">
                      💡 Professional Photography Examples
                    </summary>
                    <div className="mt-2 p-2 bg-gray-100 rounded text-xs space-y-1">
                      <div>
                        <strong>Cinematic:</strong> &ldquo;cinematic lighting
                        with dramatic shadows&rdquo;
                      </div>
                      <div>
                        <strong>Golden Hour:</strong> &ldquo;golden hour
                        lighting effect, warm tones&rdquo;
                      </div>
                      <div>
                        <strong>Professional:</strong> &ldquo;shot with 85mm
                        lens, shallow depth of field&rdquo;
                      </div>
                      <div>
                        <strong>Vintage:</strong> &ldquo;vintage film look with
                        kodak portra style&rdquo;
                      </div>{' '}
                      {/* cSpell:ignore portra */}
                      <div>
                        <strong>High-End:</strong> &ldquo;masterpiece quality,
                        ultra-detailed, sharp focus&rdquo;
                      </div>
                      <div>
                        <strong>Basic:</strong> &ldquo;remove background&rdquo;,
                        &ldquo;make brighter&rdquo;, &ldquo;enhance
                        colors&rdquo;
                      </div>
                    </div>
                  </details>
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
                    onClick={handleEnhance}
                    disabled={isEnhancing || !prompt}
                    className="flex items-center justify-center gap-2 text-sm text-white font-semibold py-2 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition disabled:bg-gray-400"
                  >
                    <Icon icon="sparkles" className="w-4 h-4" />
                    {isEnhancing ? 'Processing...' : 'Enhance with AI'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center text-gray-500 h-full">
              <p>Upload some images to begin the enhancement process.</p>
            </div>
          )}
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
