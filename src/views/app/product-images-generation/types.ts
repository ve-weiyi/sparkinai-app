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
  comment_guide?: string;
}

export interface VisualStyleOption {
  name: string;                // 风格名称（用于显示）
  key: string;                 // 风格唯一标识（用于传给后端）
  description: string;         // 风格视觉描述
  reason: string;              // 推荐理由
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
  styleKey: string;             // 选中的风格key（用于传给后端image_set/reimagine模块）
  resolution: string;
  ratio: string;
  generatedCopies: GeneratedCopy[];
  imageTypes: ImageTypeOption[];
  generatedImages?: GeneratedImage[];
  isGeneratingImages?: boolean;
  visualStyleOptions?: VisualStyleOption[];  // 从copy模块获取的视觉风格选项
}
