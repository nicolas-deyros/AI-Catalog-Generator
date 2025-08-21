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

export interface CatalogItem {
  id: string;
  file: File;
  name: string;
  objectURL: string;
  base64: string;
  isEnhancing?: boolean;
  enhancement?: ImageEnhancement;
}

export type ServiceResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };
