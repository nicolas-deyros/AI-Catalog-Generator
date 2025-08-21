import React from 'react';
import Icon from '@components/Icon';

interface StylePromptProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
}

const StylePrompt: React.FC<StylePromptProps> = ({ prompt, setPrompt }) => {
  const examplePrompts = [
    'A modern, minimalist catalog for a high-end watch collection. Use a clean font, lots of white space, and a black and gold color scheme.',
    "A vibrant and playful catalog for children's toys. Use bright colors, fun fonts, and a scrapbook-like layout.",
    'An elegant and rustic catalog for artisanal home goods. Use earthy tones, serif fonts, and include hand-drawn elements in the design.',
  ];

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-2">
        <Icon icon="style" className="w-6 h-6 text-gray-700" />
        <label
          htmlFor="style-prompt"
          className="text-lg font-medium text-gray-800"
        >
          Describe Your Catalog&apos;s Style
        </label>
      </div>
      <p className="text-sm text-gray-500 mb-4">
        Tell the AI how you want your catalog to look and feel. The more detail,
        the better!
      </p>
      <textarea
        id="style-prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g., 'A sleek, futuristic catalog for tech gadgets with dark mode and neon blue accents...'"
        rows={6}
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
      />
      <div className="mt-4">
        <h4 className="font-semibold text-gray-600">
          Need inspiration? Try one of these:
        </h4>
        <div className="mt-2 space-y-2">
          {examplePrompts.map((p, index) => (
            <button
              key={index}
              onClick={() => setPrompt(p)}
              className="w-full text-left p-3 bg-gray-100 hover:bg-indigo-100 border border-gray-200 rounded-lg text-sm text-gray-700 transition"
            >
              &quot;{p}&quot;
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StylePrompt;
