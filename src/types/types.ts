export enum AppStep {
  UPLOAD,
  ENHANCE,
  STYLE,
  GENERATE,
  PREVIEW,
}

export interface ImageEnhancement {
  clipPathId: string;
  clipPathSvg: string; // The full <clipPath>...</clipPath> element
  filterCss: string;
}

export interface GeneratedImage {
  id: string;
  base64Data: string;
  prompt: string;
  mimeType: string;
  objectURL: string;
}

export interface CatalogItem {
  id: string;
  file: File;
  name: string;
  objectURL: string;
  base64: string;
  isEnhancing?: boolean;
  enhancement?: ImageEnhancement;
  isGenerated?: boolean; // Flag to indicate if this is an AI-generated image
}

export type ServiceResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };
