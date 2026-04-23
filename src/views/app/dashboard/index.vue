<template>
  <div class="flex flex-col h-[calc(100vh-4rem)] overflow-y-auto">
    <!-- Chat Section -->
    <div class="flex flex-col items-center justify-center flex-shrink-0 px-4 pt-16 pb-8">
      <h1 class="text-3xl font-bold mb-8">一键生成商用爆款图文</h1>

      <div class="w-full max-w-3xl border rounded-2xl bg-card shadow-sm overflow-hidden">
        <!-- Main input area: image upload + text -->
        <div class="flex gap-3 px-4 pt-4">
          <!-- Image upload block -->
          <div
            class="shrink-0 w-28 h-28 rounded-xl border-2 border-dashed border-muted-foreground/30 flex items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-muted/40 transition-colors relative overflow-hidden"
            @click="triggerUpload"
          >
            <template v-if="pendingImages.length">
              <img :src="pendingImages[0].preview" class="w-full h-full object-cover" />
              <div v-if="pendingImages[0].uploading" class="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Loader2 class="h-5 w-5 text-white animate-spin" />
              </div>
              <div v-if="pendingImages.length > 1" class="absolute bottom-1 right-1 bg-black/60 text-white text-xs rounded px-1">
                +{{ pendingImages.length - 1 }}
              </div>
            </template>
            <Plus v-else class="h-6 w-6 text-muted-foreground" />
          </div>
          <input type="file" ref="fileInputRef" class="hidden" accept="image/*" multiple @change="handleFileChange" />

          <!-- Text input -->
          <textarea
            v-model="inputText"
            rows="5"
            placeholder="输入要生成的产品..."
            class="flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground py-1"
            @keydown.enter.exact.prevent="send"
            ref="textareaRef"
          />
        </div>

        <!-- Toolbar -->
        <div class="flex items-center gap-2 px-4 py-3 mt-1 flex-wrap">
          <!-- Model selector -->
          <select class="text-xs border rounded-full px-2.5 py-1 bg-background cursor-pointer">
            <option>gemini-3-pro</option>
          </select>

          <!-- Mode selector: 图文 / 图片 -->
          <select v-model="mode" class="text-xs border rounded-full px-2.5 py-1 bg-background cursor-pointer">
            <option value="copy">图文</option>
            <option value="image">图片</option>
          </select>

          <!-- Ratio -->
          <div class="flex items-center gap-1 text-xs border rounded-full px-2.5 py-1 cursor-pointer">
            <Square class="h-3 w-3" />
            <span>1:1</span>
          </div>

          <!-- Resolution -->
          <select v-model="params.resolution" class="text-xs border rounded-full px-2.5 py-1 bg-background cursor-pointer">
            <option value="标清">标清</option>
            <option value="高清 2K">高清 2K</option>
            <option value="超清 4K">超清 4K</option>
          </select>

          <!-- AI润色 -->
          <button class="text-xs border rounded-full px-2.5 py-1 hover:bg-muted transition-colors">
            AI润色
          </button>

          <!-- Send -->
          <Button
            size="sm"
            class="ml-auto rounded-xl px-5"
            :disabled="(!inputText.trim() && !pendingImages.length) || isSending"
            @click="send"
          >
            <Loader2 v-if="isSending" class="h-4 w-4 animate-spin" />
            <span v-else>发送</span>
          </Button>
        </div>
      </div>
    </div>

    <!-- Inspiration Section -->
    <div class="px-4 pb-8 max-w-3xl mx-auto w-full">
      <h2 class="text-sm font-semibold mb-3 text-muted-foreground">灵感广场</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        <div
          v-for="(img, i) in EXAMPLE_IMAGES"
          :key="i"
          class="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group"
          @click="goToProductImages"
        >
          <img :src="img.src" :alt="img.label" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
          <div class="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200 flex items-end p-2">
            <span v-if="img.label" class="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity drop-shadow">
              {{ img.label }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Plus, Square, Loader2 } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { toast } from "vue-sonner";
import { EXAMPLE_IMAGES } from "@/views/app/product-images-generation/constants";
import { useChatStore } from "@/store/modules/chat";
import { UploadAPI } from "@/api/upload";

const router = useRouter();
const chatStore = useChatStore();
const textareaRef = ref<HTMLTextAreaElement>();
const fileInputRef = ref<HTMLInputElement>();
const inputText = ref("");
const mode = ref<"copy" | "image">("copy");
const params = ref({ resolution: "高清 2K" });
const pendingImages = ref<{ file: File; preview: string; url?: string; uploading: boolean }[]>([]);
const isSending = ref(false);

const triggerUpload = () => fileInputRef.value?.click();

const handleFileChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files;
  if (!files) return;
  Array.from(files).forEach((file) => {
    const item = { file, preview: URL.createObjectURL(file), url: undefined, uploading: true };
    pendingImages.value.push(item);
    uploadFile(item);
  });
  (e.target as HTMLInputElement).value = "";
};

const uploadFile = async (item: typeof pendingImages.value[0]) => {
  try {
    const tokenResp = await UploadAPI.getUploadToken({ file_base: "chat", file_name: item.file.name });
    const t = tokenResp.data;
    const form = new FormData();
    form.append("token", t.token);
    form.append("key", t.file_key);
    form.append("file", item.file);
    const res = await fetch(t.upload_url, { method: "POST", credentials: "omit", body: form });
    const idx = pendingImages.value.indexOf(item);
    if (res.ok) {
      if (idx > -1) {
        pendingImages.value[idx].url = t.access_url;
        pendingImages.value[idx].uploading = false;
      }
    } else {
      throw new Error("上传失败");
    }
  } catch {
    toast.error(`图片上传失败: ${item.file.name}`);
    const idx = pendingImages.value.indexOf(item);
    if (idx > -1) {
      URL.revokeObjectURL(item.preview);
      pendingImages.value.splice(idx, 1);
    }
  } finally {
    const idx = pendingImages.value.indexOf(item);
    if (idx > -1) pendingImages.value[idx].uploading = false;
  }
};

const send = async () => {
  const text = inputText.value.trim();
  if (!text && !pendingImages.value.length) return;
  if (isSending.value) return;

  const uploading = pendingImages.value.filter((i) => i.uploading);
  if (uploading.length) {
    toast.info("请等待图片上传完成");
    return;
  }

  isSending.value = true;
  const imageUrls = pendingImages.value.filter((i) => i.url).map((i) => i.url as string);

  if (mode.value === "copy") {
    router.push({ name: "image-generation", query: { imageUrls: imageUrls, productName: text } });
    isSending.value = false;
    return;
  }

  chatStore.createSession();
  chatStore.pendingMessage = { text: inputText.value.trim(), imageUrls };

  router.push({ name: "image-generation-chat" });
  isSending.value = false;
};

const goToProductImages = () => {
  router.push({ name: "image-generation" });
};
</script>
