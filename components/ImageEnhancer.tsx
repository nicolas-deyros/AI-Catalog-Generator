import React, { useState, useEffect } from 'react';
import { CatalogItem, ImageEnhancement } from '../types';
import { enhanceImage } from '../services/geminiService';
import Icon from './Icon';

interface ImageEnhancerProps {
  items: CatalogItem[];
  onItemsChange: (items: CatalogItem[]) => void;
}

const ImageEnhancer: React.FC<ImageEnhancerProps> = ({ items, onItemsChange }) => {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);

  const selectedItem = items.find(item => item.id === selectedItemId);

  useEffect(() => {
    // Select the first item by default if no item is selected
    if (!selectedItemId && items.length > 0) {
      setSelectedItemId(items[0].id);
    }
    // If the selected item is removed, reset selection
    if (selectedItemId && !items.find(item => item.id === selectedItemId)) {
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
    try {
      const enhancement = await enhanceImage(selectedItem.base64, selectedItem.file.type, selectedItem.id, prompt);
      const updatedItems = items.map(item => 
        item.id === selectedItemId ? { ...item, enhancement: enhancement } : item
      );
      onItemsChange(updatedItems);
    } catch (error) {
      console.error("Failed to enhance item:", error);
      alert("Sorry, there was an error enhancing the image. Please try again.");
    } finally {
      setIsEnhancing(false);
    }
  };
  
  const handleRevert = () => {
    if (!selectedItemId) return;
     const updatedItems = items.map(item => 
      item.id === selectedItemId ? { ...item, enhancement: undefined } : item
    );
    onItemsChange(updatedItems);
  }

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
            Select an image and tell the AI how to improve it. Good prompts lead to great results!
        </p>
        <div className="flex flex-col md:flex-row gap-8">
            {/* Item List */}
            <div className="md:w-1/4 space-y-2">
                <h3 className="font-semibold text-gray-600">Products</h3>
                {items.map(item => (
                    <button 
                        key={item.id}
                        onClick={() => setSelectedItemId(item.id)}
                        className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition ${selectedItemId === item.id ? 'bg-indigo-100 ring-2 ring-indigo-500' : 'hover:bg-gray-100'}`}
                    >
                        <img src={item.objectURL} alt={item.name} className="w-12 h-12 object-contain bg-white border rounded-md" />
                        <span className="flex-grow text-sm font-medium text-gray-800 truncate">{item.name}</span>
                        {item.enhancement && <Icon icon="check" className="w-5 h-5 text-green-500 flex-shrink-0" />}
                    </button>
                ))}
            </div>

            {/* Enhancer UI */}
            <div className="md:w-3/4">
              {selectedItem ? (
                <div className="bg-gray-50 p-4 rounded-lg border">
                    <h3 className="font-semibold text-lg text-gray-800 mb-4">Editing: {selectedItem.name}</h3>
                    {/* Before/After View */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <h4 className="font-semibold text-center text-gray-600 mb-2">Original</h4>
                            <div className="aspect-square w-full bg-white border rounded-lg flex items-center justify-center overflow-hidden">
                                <img src={selectedItem.objectURL} alt="Original" className="max-h-full max-w-full" />
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-center text-gray-600 mb-2">Enhanced Preview</h4>
                            <div className="aspect-square w-full bg-white border rounded-lg flex items-center justify-center overflow-hidden">
                                {isEnhancing ? (
                                    <div className="flex flex-col items-center gap-2 text-gray-500">
                                        <span className="w-8 h-8 border-4 border-t-transparent border-indigo-500 rounded-full animate-spin"></span>
                                        <span>Enhancing...</span>
                                    </div>
                                ) : (
                                    <img 
                                        src={selectedItem.objectURL} 
                                        alt="Enhanced" 
                                        className="max-h-full max-w-full"
                                        style={{
                                            filter: enhancementToShow?.filterCss,
                                            clipPath: enhancementToShow ? `url(#${enhancementToShow.clipPathId})` : 'none',
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                    {/* Prompt and Actions */}
                    <div>
                         <label htmlFor="enhancement-prompt" className="block text-sm font-medium text-gray-700 mb-1">Enhancement Instructions</label>
                         <textarea 
                            id="enhancement-prompt"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            rows={2}
                            className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            placeholder="e.g., Remove background, make colors more vibrant..."
                         />
                         <div className="mt-3 flex items-center justify-end gap-3">
                            {selectedItem.enhancement && (
                                <button 
                                    onClick={handleRevert}
                                    className="px-4 py-2 text-sm font-semibold text-red-600 bg-red-100 hover:bg-red-200 rounded-lg transition">
                                    Revert to Original
                                </button>
                            )}
                            <button 
                                onClick={handleEnhance}
                                disabled={isEnhancing || !prompt}
                                className="flex items-center justify-center gap-2 text-sm text-white font-semibold py-2 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition disabled:bg-gray-400">
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
    </div>
  );
};

export default ImageEnhancer;