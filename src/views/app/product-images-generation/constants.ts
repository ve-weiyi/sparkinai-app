/**
 * 产品套图生成页面常量配置
 */

// 平台选项
export const PLATFORM_OPTIONS = [
  { value: "xiaohongshu", label: "小红书" },
  { value: "kuaishou", label: "快手" },
  { value: "douyin", label: "抖音" },
];

// 平台标签映射
export const PLATFORM_LABELS: Record<string, string> = {
  xiaohongshu: "小红书",
  kuaishou: "快手",
  douyin: "抖音",
};

// 风格选项
export const STYLE_OPTIONS = [
  { value: "minimal_clean", label: "极简留白" },
  { value: "lifestyle_review", label: "真实评测" },
  { value: "pop_art", label: "美式波普" },
  { value: "immersive", label: "沉浸体验" },
  { value: "chinese_vintage", label: "国潮复古" },
  { value: "fresh_natural", label: "清新自然" },
];

// 分辨率选项
export const RESOLUTION_OPTIONS = [
  { value: "HD", label: "HD (1280px)" },
  { value: "2K", label: "2K (2048px)" },
  { value: "4K", label: "4K (3840px)" },
];

// 比例选项
export const RATIO_OPTIONS = [
  { value: "1:1", label: "1:1 正方形" },
  { value: "16:9", label: "16:9 横版" },
  { value: "9:16", label: "9:16 竖版" },
  { value: "4:3", label: "4:3 传统横版" },
  { value: "3:4", label: "3:4 传统竖版" },
  { value: "3:2", label: "3:2 摄影横版" },
  { value: "2:3", label: "2:3 摄影竖版" },
  { value: "21:9", label: "21:9 超宽屏" },
];

// 数量选项
export const QUANTITY_OPTIONS = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
];

// 示例图片数据
export const EXAMPLE_IMAGES = [
  {
    label: "白底主图",
    src: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&h=800&fit=crop",
  },
  {
    label: "温馨猫窝特写",
    src: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=600&h=600&fit=crop",
  },
  {
    label: "标注图",
    src: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=600&fit=crop",
  },
  {
    label: "家居美学展示图",
    src: "https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=600&h=600&fit=crop",
  },
  {
    label: "多猫派对场景图",
    src: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=600&h=600&fit=crop",
  },
  {
    label: "多猫派对场景图",
    src: "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=600&h=600&fit=crop",
  },
  {
    label: "耐磨抓柱细节图",
    src: "https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=600&h=600&fit=crop",
  },
  {
    label: "场景代入图",
    src: "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=600&h=600&fit=crop",
  },
  {
    label: "场景代入图",
    src: "https://images.unsplash.com/photo-1478098711619-5ab0b478d6e6?w=600&h=600&fit=crop",
  },
];

// 图片类型配置（用于生成）
export const IMAGE_TYPES = [
  { name: "主图", selected: true, description: "纯白背景产品主图，展现..." },
  { name: "细节特写图", selected: true, description: "微距镜头展示产品材质与..." },
  { name: "场景展示图", selected: true, description: "美式现代家居场景，体现..." },
  { name: "功能解析图", selected: true, description: "通过留白构图标注核心功..." },
  { name: "尺寸对比图", selected: true, description: "直观展示产品尺寸参数与..." },
  { name: "人群适用图", selected: true, description: "目标用户群体使用场景，..." },
  { name: "品牌背书图", selected: true, description: "极简构图展示品牌Logo与..." },
];

// 文件验证配置
export const FILE_VALIDATION = {
  maxSize: 10 * 1024 * 1024, // 10MB
  maxCount: 5,
  acceptedTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  acceptedTypesString: "image/jpeg,image/jpg,image/png,image/webp",
};

// 错误提示
export const ERROR_MESSAGES = {
  invalidFileType: "请上传 JPG、JPEG、PNG 或 WEBP 格式的图片",
  fileTooLarge: (fileName: string) => `文件 ${fileName} 超过 10MB，请选择较小的文件`,
  tooManyFiles: (remaining: number) => `最多只能上传 5 张图片，当前还可上传 ${remaining} 张`,
  selectImageType: "请至少选择一个图片类型",
};
