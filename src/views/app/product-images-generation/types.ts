export interface UploadedFileInfo {
  fileUrl: string;
  fileName: string;
  fileKey: string;
}

export interface UploadedImage {
  file: File;
  preview: string;
  note?: string;
  uploaded: boolean;
  fileInfo?: UploadedFileInfo;
}

export interface GeneratedCopy {
  title: string;
  content: string;
  tags: string;
}

export interface GeneratedImage {
  name: string;
  url: string;
  isRegenerating: boolean;
}

export interface ImageTypeOption {
  name: string;
  selected: boolean;
  description: string;
}

export interface PreviewImage {
  preview: string;
}

export interface GenerationTask {
  id: number;
  timestamp: string;
  platform: string;
  productName: string;
  images: PreviewImage[];
  style: string;
  resolution: string;
  ratio: string;
  generatedCopies: GeneratedCopy[];
  imageTypes: ImageTypeOption[];
  generatedImages?: GeneratedImage[];
  isGeneratingImages?: boolean;
}
