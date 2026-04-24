<template>
  <div class="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
    <!-- Message List -->
    <div ref="scrollRef" class="flex-1 overflow-y-auto px-4 py-6">
      <div class="max-w-4xl mx-auto space-y-6">
        <!-- Empty state -->
        <div
          v-if="!activeSession || activeSession.messages.length === 0"
          class="flex flex-col items-center justify-center h-full min-h-[40vh] text-center gap-3"
        >
          <div
            class="w-14 h-14 rounded-2xl flex items-center justify-center"
            style="background: linear-gradient(135deg, #ff6a3d, #ffb07a)"
          >
            <Sparkles class="h-7 w-7 text-white" />
          </div>
          <h2 class="text-xl font-semibold">开始创作</h2>
          <p class="text-sm text-muted-foreground">描述你想生成的图片，AI 将为你创作</p>
        </div>

        <!-- Messages -->
        <template v-else>
          <div v-for="msg in activeSession.messages" :key="msg.id">
            <!-- User message -->
            <div v-if="msg.role === 'user'" class="flex justify-end gap-3">
              <div class="max-w-[70%] space-y-2">
                <!-- Uploaded images -->
                <div v-if="msg.uploadedImages?.length" class="flex gap-2 justify-end flex-wrap">
                  <img
                    v-for="(url, i) in msg.uploadedImages"
                    :key="i"
                    :src="url"
                    class="h-20 w-20 rounded-xl object-cover border"
                  />
                </div>
                <div
                  v-if="msg.content"
                  class="bg-foreground text-background rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm"
                >
                  {{ msg.content }}
                </div>
                <!-- Params badge -->
                <div v-if="msg.params" class="flex gap-1.5 justify-end">
                  <span class="text-xs text-muted-foreground border rounded-full px-2 py-0.5">
                    {{ msg.params.ratio }}
                  </span>
                  <span class="text-xs text-muted-foreground border rounded-full px-2 py-0.5">
                    {{ msg.params.resolution }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Assistant message -->
            <div v-else class="flex gap-3">
              <div
                class="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center mt-1"
                style="background: linear-gradient(135deg, #ff6a3d, #ffb07a)"
              >
                <Sparkles class="h-4 w-4 text-white" />
              </div>
              <div class="flex-1 space-y-3">
                <!-- Loading -->
                <div v-if="msg.isLoading" class="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 class="h-4 w-4 animate-spin" />
                  <span>AI 正在思考...</span>
                </div>
                <!-- Text content -->
                <p v-else-if="msg.content && !msg.generatedImages?.length && !msg.isImageGenerating" class="text-sm whitespace-pre-wrap">
                  {{ msg.content }}<span v-if="isSending && msg.id === activeSession?.messages.at(-1)?.id" class="inline-block w-0.5 h-4 bg-current align-middle ml-0.5 animate-blink" />
                </p>
                <!-- Generated images grid -->
                <template v-else-if="msg.generatedImages?.length || msg.isImageGenerating">
                  <p v-if="msg.content" class="text-sm whitespace-pre-wrap">{{ msg.content }}</p>
                  <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <!-- Actual images -->
                    <div
                      v-for="(img, idx) in msg.generatedImages"
                      :key="idx"
                      class="relative aspect-square rounded-xl overflow-hidden border bg-muted group"
                    >
                      <img v-if="!img.isRegenerating" :src="img.url" class="w-full h-full object-cover" />
                      <div v-if="img.isRegenerating" class="absolute inset-0 flex items-center justify-center bg-muted">
                        <Loader2 class="h-6 w-6 animate-spin text-muted-foreground" />
                      </div>
                      <!-- Hover actions -->
                      <div
                        v-else
                        class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2"
                      >
                        <button class="p-1.5 rounded-lg bg-white/90 hover:bg-white" @click="previewUrl = img.url">
                          <Eye class="h-4 w-4" />
                        </button>
                        <button class="p-1.5 rounded-lg bg-white/90 hover:bg-white" @click="downloadImage(img.url, `image_${idx + 1}`)">
                          <Download class="h-4 w-4" />
                        </button>
                        <button class="p-1.5 rounded-lg bg-white/90 hover:bg-white" @click="openRegenerate(msg.id, idx)">
                          <RefreshCw class="h-4 w-4" />
                        </button>
                        <button class="p-1.5 rounded-lg bg-white/90 hover:bg-white" @click="favoriteImage(img.url)">
                          <Heart class="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <!-- Generating indicator -->
                  <div v-if="msg.isImageGenerating" class="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 class="h-4 w-4 animate-spin" />
                    <span>AI 正在生成图片...</span>
                  </div>
                </template>
                <p class="text-xs text-muted-foreground">以上内容由AI生成</p>
                <!-- Actions -->
                <div v-if="!msg.isLoading" class="flex gap-2">
                  <Button variant="outline" size="sm" class="h-7 text-xs rounded-full" @click="regenerateAll(msg.id)">
                    <RefreshCw class="h-3 w-3 mr-1" />重新生成
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- Input Bar -->
    <div class="shrink-0 border-t bg-background px-4 py-3">
      <div class="max-w-4xl mx-auto">
        <div class="border rounded-2xl bg-card shadow-sm overflow-hidden">
          <!-- Uploaded image previews -->
          <div v-if="pendingImages.length" class="flex gap-2 px-4 pt-3 flex-wrap">
            <div
              v-for="(img, i) in pendingImages"
              :key="i"
              class="relative w-14 h-14 rounded-lg overflow-hidden border group"
            >
              <img :src="img.preview" class="w-full h-full object-cover" />
              <button
                class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center"
                @click="removePendingImage(i)"
              >
                <X class="h-4 w-4 text-white" />
              </button>
            </div>
          </div>

          <!-- Text input -->
          <div class="flex items-end gap-2 px-4 py-3">
            <button
              class="shrink-0 w-9 h-9 rounded-xl border flex items-center justify-center hover:bg-muted transition-colors"
              @click="triggerUpload"
            >
              <Plus class="h-5 w-5 text-muted-foreground" />
            </button>
            <input type="file" ref="fileInputRef" class="hidden" accept="image/*" multiple @change="handleFileChange" />
            <textarea
              v-model="inputText"
              rows="1"
              placeholder="输入要生成的设计..."
              class="flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground min-h-[36px] max-h-32 py-2"
              @keydown.enter.exact.prevent="send"
              @input="autoResize"
              ref="textareaRef"
            />
          </div>

          <!-- Toolbar -->
          <div class="flex items-center justify-between px-4 pb-3">
            <div class="flex items-center gap-2">
              <!-- Ratio -->
              <select
                v-model="params.ratio"
                class="text-xs border rounded-full px-2.5 py-1 bg-background cursor-pointer"
              >
                <option value="1:1">1:1</option>
                <option value="4:3">4:3</option>
                <option value="16:9">16:9</option>
                <option value="9:16">9:16</option>
              </select>
              <!-- Resolution -->
              <select
                v-model="params.resolution"
                class="text-xs border rounded-full px-2.5 py-1 bg-background cursor-pointer"
              >
                <option value="标清">标清</option>
                <option value="高清 2K">高清 2K</option>
                <option value="超清 4K">超清 4K</option>
              </select>
              <!-- AI Write -->
              <Button
                variant="ghost"
                size="sm"
                class="h-7 text-xs rounded-full gap-1"
                :disabled="!inputText || isAiWriting"
                @click="aiWrite"
              >
                <Sparkles class="h-3 w-3" :class="{ 'animate-spin': isAiWriting }" />
                AI帮写
              </Button>
            </div>
            <!-- Send -->
            <Button
              size="sm"
              class="rounded-xl px-4"
              :disabled="(!inputText.trim() && !pendingImages.length) || isSending"
              @click="send"
            >
              <Loader2 v-if="isSending" class="h-4 w-4 animate-spin" />
              <span v-else>发送</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Preview dialog -->
  <div
    v-if="previewUrl"
    class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
    @click="previewUrl = ''"
  >
    <img :src="previewUrl" class="max-w-[90vw] max-h-[90vh] object-contain rounded-xl" @click.stop />
  </div>

  <!-- Regenerate dialog -->
  <Dialog :open="!!regenerateTarget" @update:open="(v) => !v && (regenerateTarget = null)">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>重新生成图片</DialogTitle>
        <DialogDescription>描述你想要的效果，AI 将重新生成这张图片</DialogDescription>
      </DialogHeader>
      <Textarea v-model="regeneratePrompt" placeholder="例如：调整光线更明亮，背景更简洁..." rows="3" class="resize-none" />
      <DialogFooter>
        <Button variant="outline" @click="regenerateTarget = null">取消</Button>
        <Button @click="confirmRegenerate">确认生成</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, watch } from "vue";
import { toast } from "vue-sonner";
import {
  Sparkles, Loader2, Eye, Download, RefreshCw, Heart, Plus, X,
} from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { useChatStore } from "@/store/modules/chat";
import type { Message } from "@/store/modules/chat";
import { AgentAPI } from "@/api/agent";
import { GenerateAPI } from "@/api/generate";
import { UploadAPI } from "@/api/upload";
import { APP_NAME, AuthStorage } from "@/utils/preferencesStorage";
import MD5 from "crypto-js/md5";
import { storeToRefs } from "pinia";

const chatStore = useChatStore();
const { activeSession } = storeToRefs(chatStore);

const scrollRef = ref<HTMLElement>();
const textareaRef = ref<HTMLTextAreaElement>();
const fileInputRef = ref<HTMLInputElement>();

const inputText = ref("");
const isSending = ref(false);
const isAiWriting = ref(false);
const previewUrl = ref("");
const params = ref({ ratio: "1:1", resolution: "高清 2K" });

const pendingImages = ref<{ file: File; preview: string; url?: string }[]>([]);

const regenerateTarget = ref<{ messageId: string; imageIndex: number } | null>(null);
const regeneratePrompt = ref("");

onMounted(async () => {
  const pending = chatStore.pendingMessage;
  if (pending) {
    chatStore.pendingMessage = null;
    inputText.value = pending.text;
    if (pending.imageUrls.length) {
      pendingImages.value = pending.imageUrls.map((url) => ({
        file: new File([], ""),
        preview: url,
        url,
      }));
    }
    await nextTick();
    autoResize();
    await send();
  } else {
    chatStore.ensureActiveSession();
  }
});

watch(
  () => activeSession.value?.messages.length,
  () => nextTick(() => {
    if (scrollRef.value) scrollRef.value.scrollTop = scrollRef.value.scrollHeight;
  })
);

const autoResize = () => {
  if (!textareaRef.value) return;
  textareaRef.value.style.height = "auto";
  textareaRef.value.style.height = textareaRef.value.scrollHeight + "px";
};

const triggerUpload = () => fileInputRef.value?.click();

const handleFileChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files;
  if (!files) return;
  Array.from(files).forEach((file) => {
    pendingImages.value.push({ file, preview: URL.createObjectURL(file) });
  });
  (e.target as HTMLInputElement).value = "";
};

const removePendingImage = (i: number) => {
  URL.revokeObjectURL(pendingImages.value[i].preview);
  pendingImages.value.splice(i, 1);
};

const uploadPendingImages = async (): Promise<string[]> => {
  const urls: string[] = [];
  for (const img of pendingImages.value) {
    try {
      const tokenResp = await UploadAPI.getUploadToken({ file_base: "chat", file_name: img.file.name });
      const t = tokenResp.data;
      const form = new FormData();
      form.append("token", t.token);
      form.append("key", t.file_key);
      form.append("file", img.file);
      const res = await fetch(t.upload_url, { method: "POST", credentials: "omit", body: form });
      if (res.ok) urls.push(t.access_url);
    } catch {
      toast.error(`图片上传失败: ${img.file.name}`);
    }
  }
  return urls;
};

const buildHistory = (messages: Message[], excludeId?: string) =>
  messages
    .filter((m) => m.id !== excludeId && !m.isLoading)
    .map((m) => ({
      role: m.role,
      content: [
        ...(m.uploadedImages?.map((url) => ({ type: "image_url", text: "", image_url: { url } })) ?? []),
        ...(m.content ? [{ type: "text", text: m.content, image_url: undefined }] : []),
      ],
    }));

const streamChatMessage = async (
  messages: ReturnType<typeof buildHistory>,
  onChunk: (type: string, text: string) => void,
  onDone: () => void,
  onError: (e: Error) => void
) => {
  const uid = AuthStorage.getUid();
  const accessToken = AuthStorage.getAccessToken();
  const terminalId = AuthStorage.getTerminalId() || "";
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const terminalToken = MD5(terminalId + timestamp).toString();

  let resp: Response;
  try {
    resp = await fetch(`/api/v1/agent/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "App-Name": APP_NAME,
        "Timestamp": timestamp,
        "X-Terminal-Id": terminalId,
        "X-Terminal-Token": terminalToken,
        "Uid": uid || "",
        "Token": accessToken || "",
      },
      body: JSON.stringify({ messages }),
    });
  } catch (e) {
    onError(e as Error);
    return;
  }

  if (!resp.ok || !resp.body) {
    onError(new Error(`请求失败: ${resp.status}`));
    return;
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) { onDone(); break; }
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.startsWith("data:")) continue;
      const payload = line.slice(5).trim();
      try {
        const chunk = JSON.parse(payload);
        const choice = chunk.choices?.[0];
        if (!choice) continue;
        if (choice.finish_reason === "stop") { onDone(); return; }
        if (choice.finish_reason === "error") {
          const errText = choice.delta?.content?.[0]?.text || "生成失败";
          onError(new Error(errText));
          return;
        }
        const part = choice.delta?.content?.[0];
        if (part?.type && part.text) onChunk(part.type, part.text);
      } catch { /* skip malformed lines */ }
    }
  }
};

const send = async () => {
  const text = inputText.value.trim();
  console.log("[send] called, isSending:", isSending.value, "text:", text);
  if (!text && !pendingImages.value.length) return;
  if (isSending.value) return;
  console.log("[send] start", text);

  isSending.value = true;
  const sessionId = activeSession.value!.id;

  // Upload images first
  const uploadedUrls = await uploadPendingImages();
  pendingImages.value.forEach((img) => URL.revokeObjectURL(img.preview));
  pendingImages.value = [];

  // Add user message
  const userMsgId = crypto.randomUUID();
  chatStore.addMessage(sessionId, {
    id: userMsgId,
    role: "user",
    content: text,
    uploadedImages: uploadedUrls,
    params: { ...params.value },
    timestamp: Date.now(),
  });
  inputText.value = "";
  if (textareaRef.value) textareaRef.value.style.height = "auto";

  // Add loading assistant message
  const asstMsgId = crypto.randomUUID();
  chatStore.addMessage(sessionId, {
    id: asstMsgId,
    role: "assistant",
    content: "",
    isLoading: true,
    timestamp: Date.now(),
  });

  try {
    const history = buildHistory(activeSession.value!.messages, asstMsgId);
    let accumulatedText = "";
    const collectedImages: { url: string; revised_prompt?: string }[] = [];

    await streamChatMessage(
      history,
      (type, text) => {
        if (type === "text") {
          accumulatedText += text;
          chatStore.updateMessage(sessionId, asstMsgId, { isLoading: false, content: accumulatedText });
        } else if (type === "image") {
          collectedImages.push({ url: text });
          chatStore.updateMessage(sessionId, asstMsgId, {
            isLoading: false,
            isImageGenerating: true,
            content: accumulatedText,
            generatedImages: collectedImages.map((i) => ({ url: i.url })),
          });
        }
      },
      () => {
        chatStore.updateMessage(sessionId, asstMsgId, {
          isLoading: false,
          isImageGenerating: false,
          content: accumulatedText,
          generatedImages: collectedImages.length ? collectedImages.map((i) => ({ url: i.url })) : undefined,
        });
        isSending.value = false;
      },
      (e) => {
        chatStore.updateMessage(sessionId, asstMsgId, { isLoading: false, isImageGenerating: false, content: "生成失败，请重试" });
        toast.error(e.message || "生成失败");
        isSending.value = false;
      }
    );
  } catch (e: any) {
    chatStore.updateMessage(sessionId, asstMsgId, { isLoading: false, content: "生成失败，请重试" });
    toast.error(e.message || "生成失败");
    isSending.value = false;
  }
};

const regenerateAll = async (messageId: string) => {
  const session = activeSession.value;
  if (!session) return;
  const msgIndex = session.messages.findIndex((m) => m.id === messageId);
  if (msgIndex < 1) return;
  const userMsg = session.messages[msgIndex - 1];

  chatStore.updateMessage(session.id, messageId, { isImageGenerating: true, generatedImages: [] });

  try {
    const history = buildHistory(session.messages);
    let accumulatedText = "";
    const collectedImages: { url: string }[] = [];
    await streamChatMessage(
      history,
      (type, text) => {
        if (type === "text") {
          accumulatedText += text;
          chatStore.updateMessage(session.id, messageId, { content: accumulatedText });
        } else if (type === "image") {
          collectedImages.push({ url: text });
          chatStore.updateMessage(session.id, messageId, {
            content: accumulatedText,
            generatedImages: collectedImages.map((i) => ({ url: i.url })),
          });
        }
      },
      () => {
        chatStore.updateMessage(session.id, messageId, {
          isImageGenerating: false,
          content: accumulatedText,
          generatedImages: collectedImages.length ? collectedImages.map((i) => ({ url: i.url })) : undefined,
        });
      },
      (e) => {
        chatStore.updateMessage(session.id, messageId, { isImageGenerating: false });
        toast.error(e.message || "重新生成失败");
      }
    );
  } catch (e: any) {
    chatStore.updateMessage(session.id, messageId, { isLoading: false });
    toast.error(e.message || "重新生成失败");
  }
};

const openRegenerate = (messageId: string, imageIndex: number) => {
  regenerateTarget.value = { messageId, imageIndex };
  regeneratePrompt.value = "";
};

const confirmRegenerate = async () => {
  if (!regenerateTarget.value || !activeSession.value) return;
  const { messageId, imageIndex } = regenerateTarget.value;
  const session = activeSession.value;
  const msg = session.messages.find((m) => m.id === messageId);
  if (!msg?.generatedImages) return;

  regenerateTarget.value = null;
  msg.generatedImages[imageIndex].isRegenerating = true;
  chatStore.updateMessage(session.id, messageId, { generatedImages: [...msg.generatedImages] });

  try {
    const history = buildHistory(session.messages);
    const originalPrompt = msg.content || "";
    const userText = originalPrompt
      ? regeneratePrompt.value
        ? `原始提示词：${originalPrompt}\n修改要求：${regeneratePrompt.value}`
        : `原始提示词：${originalPrompt}`
      : regeneratePrompt.value;
    if (userText) {
      history.push({ role: "user", content: [{ type: "text", text: userText, image_url: undefined }] });
    }
    const collectedImages: { url: string }[] = [];
    await streamChatMessage(
      history,
      (type, text) => {
        if (type === "image") collectedImages.push({ url: text });
      },
      () => {
        const newUrl = collectedImages[0]?.url || "";
        msg.generatedImages![imageIndex] = { url: newUrl, isRegenerating: false };
        chatStore.updateMessage(session.id, messageId, { generatedImages: [...msg.generatedImages!] });
        toast.success("重新生成成功");
      },
      (e) => {
        msg.generatedImages![imageIndex].isRegenerating = false;
        chatStore.updateMessage(session.id, messageId, { generatedImages: [...msg.generatedImages!] });
        toast.error(e.message || "重新生成失败");
      }
    );
  } catch (e: any) {
    msg.generatedImages![imageIndex].isRegenerating = false;
    chatStore.updateMessage(session.id, messageId, { generatedImages: [...msg.generatedImages!] });
    toast.error(e.message || "重新生成失败");
  }
};

const aiWrite = async () => {
  if (!inputText.value.trim() || isAiWriting.value) return;
  isAiWriting.value = true;
  try {
    const resp = await AgentAPI.agentRun({
      agent_name: "copy",
      variables: { prompt: inputText.value },
    });
    const result = resp.data?.choices?.[0]?.message?.content;
    if (result) inputText.value = result[0].text;
  } catch (e: any) {
    toast.error(e.message || "AI帮写失败");
  } finally {
    isAiWriting.value = false;
  }
};

const downloadImage = (url: string, name: string) => {
  const a = document.createElement("a");
  a.href = url;
  a.download = `${name}.jpg`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const favoriteImage = (url: string) => {
  // TODO: call favorites API
  toast.success("已收藏");
};
</script>
