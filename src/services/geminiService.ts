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
  const prompt = `
    As an SVG expert, your task is to analyze the image and the user's request to create a JSON object.
    User Request: "${userPrompt}"

    **Instructions:**
    1.  **SVG Path:** If the user asks to "remove background" or similar, create an SVG <clipPath> element.
        *   ID MUST be '${uniqueClipPathId}'.
        *   MUST use clipPathUnits='objectBoundingBox'.
        *   Use single quotes for attributes.
        *   The 'd' path data must be a precise, high-fidelity outline of the subject.
        *   **CRITICAL:** Round all path coordinates to 2 decimal places for efficiency.
        *   **RULE:** The path MUST NOT crop the subject.
        *   If no background removal is needed, provide an empty string for the element.
    2.  **CSS Filter:** If the user requests quality changes (e.g., "brighter"), provide a CSS filter string. Otherwise, empty string.
    3.  **JSON Output:** Respond ONLY with a valid JSON object matching the required schema. No extra text or markdown.
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
        console.error('Invalid JSON structure in AI response:', jsonString);
        return {
          success: false,
          error: 'AI did not return a valid JSON object.',
        };
      }

      jsonString = jsonString.substring(firstBrace, lastBrace + 1);

      try {
        result = JSON.parse(jsonString);
      } catch (parseError) {
        console.error(
          'Failed to parse extracted JSON:',
          jsonString,
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
