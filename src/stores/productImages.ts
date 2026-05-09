import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { UploadedImage, GenerationTask, VisualStyleOption } from "@/views/app/product-images-generation/types";

export interface ProductImagesCache {
  // 表单数据
  productName: string;
  sellingPoints: string;
  platform: string;
  quantity: string;
  
  // 上传的图片
  uploadedImages: UploadedImage[];
  mainImageIndex: number;
  
  // 分析结果
  analysisResult: { product_name: string; selling_points: string } | null;
  
  // 当前任务
  currentTask: GenerationTask | null;
  selectedCopyIndex: number;
  
  // 视觉风格选项
  visualStyleOptions: VisualStyleOption[];
}

export const useProductImagesStore = defineStore("productImages", () => {
  // 缓存数据
  const cache = ref<ProductImagesCache>({
    productName: "",
    sellingPoints: "",
    platform: "xiaohongshu",
    quantity: "1",
    uploadedImages: [],
    mainImageIndex: 0,
    analysisResult: null,
    currentTask: null,
    selectedCopyIndex: 0,
    visualStyleOptions: [],
  });

  // 缓存最后更新时间（用于过期判断）
  const lastUpdateTime = ref<number>(Date.now());

  // 是否有有效缓存
  const hasValidCache = computed(() => {
    // 缓存有效期为1小时
    const cacheExpiry = 60 * 60 * 1000;
    return Date.now() - lastUpdateTime.value < cacheExpiry;
  });

  // 是否有数据
  const hasData = computed(() => {
    return cache.value.productName || 
           cache.value.sellingPoints || 
           cache.value.uploadedImages.length > 0 ||
           cache.value.currentTask;
  });

  // 保存表单数据
  const saveFormData = (data: {
    productName: string;
    sellingPoints: string;
    platform: string;
    quantity: string;
  }) => {
    cache.value.productName = data.productName;
    cache.value.sellingPoints = data.sellingPoints;
    cache.value.platform = data.platform;
    cache.value.quantity = data.quantity;
    lastUpdateTime.value = Date.now();
  };

  // 保存上传的图片
  const saveUploadedImages = (images: UploadedImage[], mainIndex: number = 0) => {
    cache.value.uploadedImages = images;
    cache.value.mainImageIndex = mainIndex;
    lastUpdateTime.value = Date.now();
  };

  // 保存分析结果
  const saveAnalysisResult = (result: { product_name: string; selling_points: string }) => {
    cache.value.analysisResult = result;
    lastUpdateTime.value = Date.now();
  };

  // 保存当前任务
  const saveCurrentTask = (task: GenerationTask) => {
    cache.value.currentTask = task;
    // 如果任务包含视觉风格选项，也保存
    if (task.visualStyleOptions) {
      cache.value.visualStyleOptions = task.visualStyleOptions;
    }
    lastUpdateTime.value = Date.now();
  };

  // 保存选中的文案索引
  const saveSelectedCopyIndex = (index: number) => {
    cache.value.selectedCopyIndex = index;
    lastUpdateTime.value = Date.now();
  };

  // 清除缓存
  const clearCache = () => {
    cache.value = {
      productName: "",
      sellingPoints: "",
      platform: "xiaohongshu",
      quantity: "1",
      uploadedImages: [],
      mainImageIndex: 0,
      analysisResult: null,
      currentTask: null,
      selectedCopyIndex: 0,
      visualStyleOptions: [],
    };
    lastUpdateTime.value = 0;
  };

  // 重置任务相关数据（保留图片和基础信息）
  const resetTask = () => {
    cache.value.currentTask = null;
    cache.value.selectedCopyIndex = 0;
    cache.value.visualStyleOptions = [];
    lastUpdateTime.value = Date.now();
  };

  return {
    cache,
    lastUpdateTime,
    hasValidCache,
    hasData,
    saveFormData,
    saveUploadedImages,
    saveAnalysisResult,
    saveCurrentTask,
    saveSelectedCopyIndex,
    clearCache,
    resetTask,
  };
});
