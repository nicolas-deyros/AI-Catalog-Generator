import { GoogleGenAI, Type } from '@google/genai';
import { CatalogItem, ImageEnhancement, ServiceResponse } from '../types/types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
  throw new Error(
    'VITE_GEMINI_API_KEY environment variable not set. Please create a .env.local file and add your API key.'
  );
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const enhanceImage = async (
  base64Image: string,
  mimeType: string,
  itemId: string,
  userPrompt: string
): Promise<ServiceResponse<ImageEnhancement>> => {
  const uniqueClipPathId = `clip-path-${itemId}`;

  // Photography terminology analysis for better enhancement processing
  // cSpell:ignore hasselblad mamiya portra provia ilford
  const analyzePhotographyRequest = (userPrompt: string) => {
    const prompt = userPrompt.toLowerCase();

    const photographyTerms = {
      // Camera angles & shots
      angles: [
        'low angle',
        'high angle',
        'eye level',
        'aerial view',
        "bird's-eye",
        'ground level',
        'dutch angle',
      ],
      shots: [
        'close-up',
        'extreme close-up',
        'medium shot',
        'wide shot',
        'full shot',
        'macro shot',
        'cowboy shot',
      ],

      // Lens & focal length
      lenses: [
        '85mm',
        '50mm',
        '35mm',
        '24mm',
        '200mm',
        'telephoto',
        'fisheye',
        'anamorphic',
        'wide-angle',
        'ultra-wide',
      ],
      aperture: [
        'f/1.8',
        'f/2.8',
        'f/16',
        'shallow depth',
        'bokeh',
        'deep focus',
      ],

      // Photography styles
      styles: [
        'cinematic',
        'documentary',
        'street photography',
        'fashion',
        'editorial',
        'portrait',
        'noir',
        'vintage',
      ],
      techniques: [
        'long exposure',
        'double exposure',
        'motion blur',
        'high-speed',
        'silhouette',
        'hdr',
      ],

      // Lighting & time
      lighting: [
        'golden hour',
        'blue hour',
        'studio lighting',
        'dramatic lighting',
        'soft lighting',
        'rim light',
        'volumetric',
      ],
      quality: [
        'masterpiece',
        'photorealistic',
        'hyperrealistic',
        'ultra-detailed',
        '8k',
        '4k',
        'raw photo',
        'sharp focus',
      ],

      // Camera brands
      cameras: [
        'canon eos',
        'sony alpha',
        'nikon',
        'leica',
        'hasselblad',
        'fujifilm',
        'mamiya',
      ],

      // Film stocks
      film: [
        'kodak portra',
        'fuji provia',
        'ilford delta',
        'film grain',
        'analog',
      ],
    };

    const detectedTerms = {
      hasPhotographyTerms: false,
      categories: [] as string[],
      suggestedFilters: [] as string[],
    };

    // Check for photography terms
    Object.entries(photographyTerms).forEach(([category, terms]) => {
      const found = terms.some((term) => prompt.includes(term));
      if (found) {
        detectedTerms.hasPhotographyTerms = true;
        detectedTerms.categories.push(category);
      }
    });

    // Suggest appropriate CSS filters based on detected terms
    if (prompt.includes('cinematic') || prompt.includes('dramatic')) {
      detectedTerms.suggestedFilters.push(
        'contrast(1.2)',
        'saturate(1.1)',
        'brightness(0.95)'
      );
    }
    if (prompt.includes('golden hour') || prompt.includes('warm')) {
      detectedTerms.suggestedFilters.push(
        'hue-rotate(10deg)',
        'saturate(1.15)',
        'brightness(1.05)'
      );
    }
    if (prompt.includes('noir') || prompt.includes('black and white')) {
      detectedTerms.suggestedFilters.push('grayscale(1)', 'contrast(1.3)');
    }
    if (prompt.includes('vintage') || prompt.includes('nostalgic')) {
      detectedTerms.suggestedFilters.push(
        'sepia(0.3)',
        'contrast(0.9)',
        'brightness(1.1)'
      );
    }
    if (prompt.includes('blue hour') || prompt.includes('cool')) {
      detectedTerms.suggestedFilters.push(
        'hue-rotate(-10deg)',
        'saturate(1.1)',
        'brightness(0.9)'
      );
    }
    if (
      prompt.includes('high contrast') ||
      prompt.includes('dramatic lighting')
    ) {
      detectedTerms.suggestedFilters.push('contrast(1.4)', 'brightness(1.05)');
    }
    if (prompt.includes('soft') || prompt.includes('ethereal')) {
      detectedTerms.suggestedFilters.push(
        'brightness(1.1)',
        'contrast(0.9)',
        'saturate(1.05)'
      );
    }

    return detectedTerms;
  };

  // Detect if user is trying to generate completely new content instead of enhancing existing image
  // Only block prompts that clearly ask for new scenes/subjects, not photography enhancement techniques
  const generativeKeywords = [
    'create a',
    'generate a',
    'draw a',
    'make a picture of',
    'show a',
    'imagine a',
    'picture of a',
    'image of a',
    'photo of a woman standing',
    'woman in alley',
    'person in',
    'people in',
    'man standing',
    'woman standing',
    'create an image',
    'generate an image',
    'new image of',
  ];

  const isGenerativePrompt = generativeKeywords.some((keyword) =>
    userPrompt.toLowerCase().includes(keyword.toLowerCase())
  );

  if (isGenerativePrompt) {
    return {
      success: false,
      error:
        'This tool enhances existing product images, not generate new content. Try prompts like "remove background", "make brighter", "improve colors", "sharpen image", etc.',
    };
  }

  // Analyze photography request for better processing
  const photographyAnalysis = analyzePhotographyRequest(userPrompt);
  const isProfessionalRequest = photographyAnalysis.hasPhotographyTerms;

  const prompt = `
    As a professional image enhancement expert specializing in photography techniques, analyze the EXISTING product image and apply the user's enhancement request.
    
    User Enhancement Request: "${userPrompt}"
    
    **Photography Analysis:** ${isProfessionalRequest ? `Professional photography request detected. Categories: ${photographyAnalysis.categories.join(', ')}. Apply advanced photographic enhancement techniques.` : 'Standard enhancement request.'}
    
    **Context:** You are enhancing an EXISTING product image, not creating new content. Transform the current image using professional photography techniques.

    **Enhanced Instructions:**
    1. **SVG Path (Background Removal):**
       - Create an SVG <clipPath> element ONLY if the user requests background removal or isolation
       - ID MUST be '${uniqueClipPathId}'
       - MUST use clipPathUnits='objectBoundingBox'
       - Use single quotes for attributes
       - Create a precise, high-fidelity outline of the main subject
       - **CRITICAL:** Round coordinates to 2 decimal places for performance
       - **PERFORMANCE:** Keep paths efficient, avoid excessive detail
       - **RULE:** Never crop the subject - ensure complete outline
       - If no background removal needed, provide empty string

    2. **CSS Filter (Professional Photography Enhancement):**
       ${
         isProfessionalRequest
           ? `
       **PROFESSIONAL MODE ACTIVATED:** Apply sophisticated photography techniques:
       
       **Cinematic Enhancement:** For "cinematic" requests - use contrast(1.15-1.3), saturate(1.05-1.15), brightness adjustments
       **Golden Hour Effect:** For "golden hour" - use hue-rotate(8deg-15deg), saturate(1.1-1.2), brightness(1.05-1.1)
       **Dramatic Lighting:** For "dramatic" - use contrast(1.2-1.4), brightness(0.95-1.05), saturate(1.1)
       **Vintage/Nostalgic:** For "vintage" - use sepia(0.2-0.4), contrast(0.9-1.1), brightness(1.05-1.15)
       **Noir/B&W:** For "noir" - use grayscale(1), contrast(1.2-1.4)
       **Blue Hour:** For "blue hour" - use hue-rotate(-8deg to -15deg), saturate(1.1), brightness(0.85-0.95)
       **High Quality/Sharp:** For "masterpiece/sharp" - use contrast(1.1), saturate(1.05), brightness(1.02)
       **Soft/Ethereal:** For "soft/ethereal" - use brightness(1.1), contrast(0.9), saturate(1.05)
       
       **Lens Effects:** Consider depth simulation with subtle blur effects
       **Film Grain:** For analog requests, add subtle noise simulation
       **Color Grading:** Apply professional color correction based on request
       `
           : `
       **STANDARD MODE:** Apply basic enhancements:
       - Brightness/contrast adjustments for "brighter/darker"
       - Saturation for "vivid/muted colors"
       - Basic color corrections
       `
       }
       
       **Filter Format:** Combine multiple CSS filters: brightness() contrast() saturate() hue-rotate() sepia() grayscale()
       **Range Guidelines:** brightness(0.8-1.3), contrast(0.8-1.5), saturate(0.8-1.3), hue-rotate(-30deg to 30deg)
       If no enhancement needed, provide empty string

    3. **JSON Output:** Respond ONLY with valid JSON matching the schema. No markdown or extra text.
    
    **Expected Quality:** ${isProfessionalRequest ? 'Professional photography enhancement with cinematic quality' : 'Standard image improvement'}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            svgClipPathElement: { type: Type.STRING },
            cssFilter: { type: Type.STRING },
          },
          required: ['svgClipPathElement', 'cssFilter'],
        },
        // Allocate more tokens for the response to prevent truncation of complex SVG paths.
        maxOutputTokens: 8192,
        thinkingConfig: { thinkingBudget: 100 },
      },
    });

    const responseText = response.text?.trim();
    if (!responseText) {
      throw new Error('Empty response from AI service');
    }

    let jsonString = responseText;

    // Try to parse the response directly first (since we're using responseMimeType: 'application/json')
    let result;
    try {
      result = JSON.parse(jsonString);
    } catch {
      // If direct parsing fails, try to extract JSON from potential markdown wrapping
      const firstBrace = jsonString.indexOf('{');
      if (firstBrace === -1) {
        console.error('No JSON object found in AI response:', jsonString);
        return {
          success: false,
          error: 'AI did not return a valid JSON object.',
        };
      }

      // Find the matching closing brace by counting braces
      let braceCount = 0;
      let lastBrace = -1;
      for (let i = firstBrace; i < jsonString.length; i++) {
        if (jsonString[i] === '{') {
          braceCount++;
        } else if (jsonString[i] === '}') {
          braceCount--;
          if (braceCount === 0) {
            lastBrace = i;
            break;
          }
        }
      }

      if (lastBrace === -1) {
        const truncatedResponse =
          jsonString.length > 500
            ? jsonString.substring(0, 500) + '... [truncated]'
            : jsonString;
        console.error(
          'Invalid JSON structure in AI response:',
          truncatedResponse
        );
        return {
          success: false,
          error: 'AI did not return a valid JSON object.',
        };
      }

      jsonString = jsonString.substring(firstBrace, lastBrace + 1);

      try {
        result = JSON.parse(jsonString);
      } catch (parseError) {
        const truncatedJson =
          jsonString.length > 500
            ? jsonString.substring(0, 500) + '... [truncated]'
            : jsonString;
        console.error(
          'Failed to parse extracted JSON:',
          truncatedJson,
          parseError
        );
        return {
          success: false,
          error: 'AI did not return a valid JSON object.',
        };
      }
    }

    const svgClipPathElement = result.svgClipPathElement;
    const cssFilter = result.cssFilter;

    // Validate that the AI returned strings, not objects or other types.
    // This prevents "[object Object]" errors during rendering.
    if (
      typeof svgClipPathElement !== 'string' ||
      typeof cssFilter !== 'string'
    ) {
      console.error('AI response properties are not strings:', result);
      return {
        success: false,
        error: 'AI response has incorrect data types for schema properties.',
      };
    }

    // Validate clip path length to prevent performance issues
    if (svgClipPathElement.length > 50000) {
      console.warn('Clip path is extremely long, simplifying for performance');
      // Provide a simple fallback clip path for very complex responses
      const fallbackClipPath = `<clipPath id='${uniqueClipPathId}' clipPathUnits='objectBoundingBox'><rect x='0.05' y='0.05' width='0.9' height='0.9'/></clipPath>`;
      return {
        success: true,
        data: {
          clipPathId: uniqueClipPathId,
          clipPathSvg: fallbackClipPath,
          filterCss: cssFilter,
        },
      };
    }

    return {
      success: true,
      data: {
        clipPathId: uniqueClipPathId,
        clipPathSvg: svgClipPathElement,
        filterCss: cssFilter,
      },
    };
  } catch (error) {
    console.error('Error enhancing image:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      success: false,
      error: `Failed to enhance image with AI: ${errorMessage}`,
    };
  }
};

export const generateCatalogLayout = async (
  prompt: string,
  items: CatalogItem[]
): Promise<ServiceResponse<string>> => {
  const productList = items
    .map((item, index) => `${index + 1}. ${item.name}`)
    .join('\n');

  const detailedPrompt = `
    You are an expert web designer specializing in creating stunning, multi-page product catalogs with HTML and Tailwind CSS.
    Your task is to generate the complete HTML for a product catalog based on the user's style request and a list of products.

    **User's Style Request:**
    "${prompt}"

    **Products to Include:**
    ${productList}

    **Instructions:**
    1.  Generate only the HTML content that would go inside a single 'div' container. Do not include \`<html>\`, \`<head>\`, or \`<body>\` tags. The final output must be a series of divs.
    2.  Use ONLY Tailwind CSS classes for styling. Do not use inline styles or \`<style>\` tags.
    3.  Create a visually appealing, modern, and professional layout that reflects the user's style request.
    4.  **Structure the catalog into multiple pages.**
    5.  The very first page should be a compelling cover page with a main title and a brief, engaging introductory paragraph.
    6.  Each subsequent page should feature a few products (e.g., 2 to 4 per page) in a grid or list format.
    7.  **Crucially, wrap each individual page (including the cover) in its own \`<div class="catalog-page p-8 bg-white shadow-lg aspect-[8.5/11]">\`. This class is essential for the application to parse the pages.**
    8.  For each product, use a placeholder \`<img>\` tag. For product number N (1-indexed), the image tag MUST be structured exactly like this: \`<img src="PRODUCT_IMAGE_N_URL" alt="A descriptive alt text" PRODUCT_IMAGE_N_STYLE_PLACEHOLDER />\`. The 'PRODUCT_IMAGE_N_STYLE_PLACEHOLDER' part is crucial for applying styles later.
    9.  Do not include any external images, logos, or icons. The only \`<img>\` tags allowed are the ones for the products using the specified placeholders.
    10. For each product, generate a compelling, short (2-3 sentences) marketing description based on its name.
    11. The entire output must be a single block of clean, well-formatted HTML code, consisting of the series of page divs. Do not wrap it in markdown backticks.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: detailedPrompt,
    });
    const responseText = response.text;
    if (!responseText) {
      throw new Error('Empty response from AI service');
    }
    return { success: true, data: responseText };
  } catch (error) {
    console.error('Error generating catalog layout:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      success: false,
      error: `Sorry, an error occurred while generating the catalog: ${errorMessage}`,
    };
  }
};
