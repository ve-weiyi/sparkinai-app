<template>
  <div class="product-root flex flex-1 flex-col">
    <div class="product-shell relative flex w-full flex-col h-[calc(100vh-4rem)] overflow-hidden">
      <!-- Tabs Header -->
      <div class="tabs-wrap w-full px-6">
        <Tabs v-model="activeTab" class="w-auto mt-1">
          <TabsList class="tabs-list h-10">
            <TabsTrigger value="image-product-set" class="gap-2 px-4">
              <Package class="h-4 w-4" />
              商品套图
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <!-- Main Content -->
      <div class="flex-1 px-6 py-4 overflow-hidden">
        <Card class="product-card relative w-full h-full overflow-hidden rounded-3xl py-0">
          <div class="flex flex-col lg:flex-row h-full overflow-hidden">
            <!-- Left Panel - Form -->
            <div
              class="left-panel flex flex-col w-full h-[60%] lg:h-full overflow-auto lg:flex-shrink-0 bg-card border-b lg:border-b-0 lg:border-r lg:w-[28rem] rounded-t-2xl lg:rounded-tl-2xl lg:rounded-bl-2xl"
            >
              <div class="flex-1 min-h-0 overflow-y-auto">
                <div class="flex flex-col gap-4 p-6">
                  <!-- Image Upload -->
                  <div class="space-y-2">
                    <div class="flex items-center justify-between text-sm font-medium">
                      <span class="text-foreground">上传图片</span>
                      <span class="text-muted-foreground">
                        {{ uploadedImages.length }}/{{ FILE_VALIDATION.maxCount }}
                      </span>
                    </div>

                    <div
                      class="upload-zone flex flex-wrap items-start gap-4 p-4 rounded-2xl border"
                    >
                      <!-- Uploaded Images Preview -->
                      <div
                        v-for="(image, index) in uploadedImages"
                        :key="index"
                        class="flex flex-col gap-2 flex-shrink-0 w-[170px] p-2 rounded-2xl border bg-card"
                      >
                        <div
                          class="relative w-full aspect-square rounded-xl overflow-hidden bg-white group cursor-pointer"
                          @click="previewImage(image.preview)"
                        >
                          <img
                            :src="image.preview"
                            :alt="image.file.name"
                            class="w-full h-full object-cover"
                          />
                          <!-- Upload Status Overlay -->
                          <div
                            v-if="!image.uploaded"
                            class="absolute inset-0 bg-black/40 flex items-center justify-center"
                          >
                            <Loader2 class="animate-spin h-6 w-6 text-white" />
                          </div>
                          <!-- Upload Success Indicator -->
                          <div
                            v-else
                            class="absolute top-2 right-2 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center"
                          >
                            <Check class="h-4 w-4 text-white" stroke-width="3" />
                          </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            class="flex-1 h-7 text-xs px-2 py-1"
                            :class="
                              index === mainImageIndex
                                ? 'bg-foreground text-background hover:bg-foreground/20'
                                : ''
                            "
                            :disabled="!image.uploaded"
                            @click="mainImageIndex = index"
                          >
                            {{ index === mainImageIndex ? "主图" : "设为主图" }}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            class="flex-1 h-7 text-xs px-2 py-1"
                            @click="removeImage(index)"
                          >
                            移除
                          </Button>
                        </div>

                        <!-- Note Input -->
                        <Input
                          v-model="image.note"
                          placeholder="备注（可选）"
                          class="flex-1 h-7 text-xs px-2 py-1"
                          :disabled="!image.uploaded"
                        />
                      </div>

                      <!-- Add Button -->
                      <div
                        v-if="uploadedImages.length < FILE_VALIDATION.maxCount"
                        @click="triggerFileInput"
                        @dragover.prevent="isDragging = true"
                        @dragleave.prevent="isDragging = false"
                        @drop.prevent="handleDrop"
                        :class="[
                          'w-[170px] aspect-square rounded-2xl border-2 border-dashed flex items-center justify-center cursor-pointer transition flex-shrink-0',
                          isDragging
                            ? 'border-primary bg-primary/10'
                            : 'border-muted-foreground/40 hover:border-primary/50 hover:bg-muted/60',
                        ]"
                      >
                        <span class="text-3xl text-muted-foreground">+</span>
                        <input
                          ref="fileInputRef"
                          type="file"
                          :accept="FILE_VALIDATION.acceptedTypesString"
                          multiple
                          class="hidden"
                          @change="handleFileChange"
                        />
                      </div>
                    </div>

                    <p class="text-xs text-muted-foreground">
                      请选择主参考图，并可为每张图添加备注（如：包装/拆封/细节）
                    </p>
                  </div>

                  <!-- Target Platform -->
                  <div class="space-y-2">
                    <Label>目标平台</Label>
                    <Select v-model="formState.platform">
                      <SelectTrigger class="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          v-for="option in PLATFORM_OPTIONS"
                          :key="option.value"
                          :value="option.value"
                        >
                          {{ option.label }}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <!-- Product Name -->
                  <div class="space-y-2">
                    <Label>产品名称</Label>
                    <Input v-model="formState.productName" placeholder="请输入产品名称" />
                  </div>

                  <!-- Product Features Section - Hidden on mobile -->
                  <div class="space-y-4">
                    <div class="space-y-2">
                      <div class="flex items-center justify-between">
                        <Label class="text-sm">产品卖点</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          class="gap-1 text-xs text-primary hover:text-primary"
                          :disabled="
                            uploadedImages.length === 0 ||
                            !formState.productName ||
                            isAnalyzingSellingPoints ||
                            uploadedImages.some((img) => !img.uploaded)
                          "
                          @click="analyzeProductSellingPoints"
                        >
                          <Sparkles
                            class="h-3 w-3"
                            :class="{ 'animate-spin': isAnalyzingSellingPoints }"
                          />
                          {{ isAnalyzingSellingPoints ? "AI分析中..." : "AI生成" }}
                        </Button>
                      </div>
                      <Textarea
                        v-model="formState.sellingPoints"
                        class="resize-none rounded-xl text-sm"
                        rows="5"
                        placeholder="核心卖点：&#10;适用人群：&#10;期望场景：&#10;尺寸参数："
                      />
                    </div>
                    <div class="space-y-2">
                      <Label class="text-sm">生成内容数量</Label>
                      <Select v-model="formState.quantity">
                        <SelectTrigger class="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem
                            v-for="option in QUANTITY_OPTIONS"
                            :key="option.value"
                            :value="option.value"
                          >
                            {{ option.label }}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Footer Actions -->
              <div class="flex-shrink-0 border-t bg-card p-4 space-y-3">
                <Button
                  class="w-full generate-cta"
                  :disabled="
                    uploadedImages.length === 0 ||
                    !formState.productName ||
                    !formState.sellingPoints ||
                    isGeneratingCopy ||
                    uploadedImages.some((img) => !img.uploaded)
                  "
                  @click="generateProductCopy"
                >
                  <Loader2 v-if="isGeneratingCopy" class="mr-2 h-4 w-4 animate-spin" />
                  <Sparkles v-else class="mr-2 h-4 w-4" />
                  {{ isGeneratingCopy ? "生成中..." : "立即生成" }}
                </Button>
                <p class="text-center text-xs text-muted-foreground">
                  {{
                    uploadedImages.length === 0
                      ? "请先上传至少一张产品图片"
                      : uploadedImages.some((img) => !img.uploaded)
                        ? "请等待图片上传完成"
                        : !formState.productName
                          ? "请填写产品名称"
                          : !formState.sellingPoints
                            ? "请填写产品卖点"
                            : isGeneratingCopy
                              ? "正在生成，请稍候..."
                              : "点击生成预览"
                  }}
                </p>
              </div>
            </div>

            <!-- Right Panel - Preview -->
            <div
              class="right-panel relative flex flex-col flex-1 h-[40%] lg:h-full min-h-0 bg-muted/20 rounded-b-2xl lg:rounded-br-2xl lg:rounded-tr-2xl overflow-hidden"
            >
              <div class="flex-1 overflow-y-auto">
                <div
                  class="flex flex-col min-h-full p-6"
                  :class="{ 'justify-center': !currentTask }"
                >
                  <!-- Generated Tasks -->
                  <div v-if="currentTask" class="space-y-4">
                    <div class="bg-card rounded-2xl border p-6 space-y-4">
                      <!-- Header -->
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                          <span class="text-2xl font-bold">
                            {{ truncateProductName(currentTask.productName || "产品名称") }}
                          </span>
                          <span class="text-sm text-muted-foreground">
                            {{ currentTask.timestamp }}
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          class="rounded-lg"
                          @click="currentTask = null"
                        >
                          <Trash2 class="h-5 w-5" />
                        </Button>
                      </div>

                      <!-- Tags -->
                      <div class="flex flex-wrap gap-2">
                        <span
                          v-for="(tag, idx) in currentTaskTags"
                          :key="idx"
                          class="px-3 py-1 rounded-full bg-muted text-sm"
                        >
                          {{ tag }}
                        </span>
                      </div>

                      <!-- Uploaded Images -->
                      <div class="flex gap-2">
                        <div
                          v-for="(img, idx) in currentTask.images"
                          :key="idx"
                          class="w-16 h-16 rounded-lg overflow-hidden bg-muted"
                        >
                          <img :src="img.preview" class="w-full h-full object-cover" />
                        </div>
                      </div>

                      <!-- Generated Copy -->
                      <div class="bg-card border rounded-xl p-4 space-y-3">
                        <div class="flex items-center justify-between">
                          <div class="flex items-center gap-2">
                            <Edit class="h-5 w-5" />
                            <span class="text-base font-medium">文案内容</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            class="h-8 gap-1"
                            @click="copySelectedCopyText"
                          >
                            <Copy class="h-4 w-4" />
                            复制
                          </Button>
                        </div>

                        <div class="bg-muted/30 rounded-lg space-y-3">
                          <div class="flex gap-2">
                            <button
                              v-for="(_copy, idx) in currentTask.generatedCopies"
                              :key="idx"
                              @click="selectedCopyIndex = Number(idx)"
                              :class="[
                                'px-3 py-1 rounded-full text-xs transition-colors',
                                selectedCopyIndex === idx
                                  ? 'bg-foreground text-background'
                                  : 'border hover:bg-muted',
                              ]"
                            >
                              文案 {{ Number(idx) + 1 }}
                            </button>
                          </div>

                          <div class="space-y-3">
                            <h4 class="text-base font-medium">
                              {{ currentTask.generatedCopies[selectedCopyIndex].title }}
                            </h4>
                            <p class="text-sm leading-relaxed text-muted-foreground">
                              {{ currentTask.generatedCopies[selectedCopyIndex].content }}
                            </p>
                            <p class="text-sm text-muted-foreground">
                              {{ currentTask.generatedCopies[selectedCopyIndex].tags }}
                            </p>
                          </div>
                        </div>
                      </div>

                      <!-- Copy with Images -->
                      <div class="bg-card border rounded-xl p-4 space-y-3">
                        <div class="flex items-center justify-between">
                          <div class="flex items-center gap-2">
                            <ImageIcon class="h-5 w-5" />
                            <span class="text-base font-medium">文案配图</span>
                          </div>
                          <Button
                            v-if="currentTask.generatedImages"
                            variant="ghost"
                            size="sm"
                            class="h-8 gap-1"
                            @click="openDownloadDialog(currentTask)"
                          >
                            <Download class="h-4 w-4" />
                            批量下载
                          </Button>
                        </div>

                        <!-- Settings -->
                        <div class="flex items-end gap-3">
                          <div class="space-y-1">
                            <div class="text-xs text-muted-foreground">风格选择</div>
                            <Select v-model="currentTask.style">
                              <SelectTrigger class="h-9 text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem
                                  v-for="option in STYLE_OPTIONS"
                                  :key="option.value"
                                  :value="option.value"
                                >
                                  {{ option.label }}
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div class="space-y-1">
                            <div class="text-xs text-muted-foreground">分辨率选择</div>
                            <Select v-model="currentTask.resolution">
                              <SelectTrigger class="h-9 text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem
                                  v-for="option in RESOLUTION_OPTIONS"
                                  :key="option.value"
                                  :value="option.value"
                                >
                                  {{ option.label }}
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div class="space-y-1">
                            <div class="text-xs text-muted-foreground">图片比例</div>
                            <Select v-model="currentTask.ratio">
                              <SelectTrigger class="h-9 text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem
                                  v-for="option in RATIO_OPTIONS"
                                  :key="option.value"
                                  :value="option.value"
                                >
                                  {{ option.label }}
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <!-- Generate Button -->
                          <Button
                            size="lg"
                            :disabled="currentTask.isGeneratingImages"
                            @click="generateImageSet(currentTask)"
                          >
                            <Box class="mr-2 h-5 w-5" />
                            一键生成图片
                            <span class="ml-2">✨ 14</span>
                          </Button>
                        </div>

                        <!-- Image Types or Generated Images -->
                        <div
                          v-if="currentTask.isGeneratingImages"
                          class="flex flex-col items-center justify-center py-20"
                        >
                          <Loader2 class="animate-spin h-12 w-12 text-primary mb-4" />
                          <p class="text-sm text-muted-foreground">AI正在生成图片，请稍候...</p>
                        </div>
                        <div v-else-if="currentTask.generatedImages" class="space-y-4">
                          <div class="grid grid-cols-3 gap-4">
                            <div
                              v-for="(img, idx) in currentTask.generatedImages"
                              :key="idx"
                              class="space-y-3"
                            >
                              <div
                                class="relative aspect-square rounded-lg overflow-hidden border bg-white group"
                              >
                                <img
                                  :src="img.url"
                                  :alt="img.name"
                                  class="w-full h-full object-cover"
                                />
                                <!-- Regenerating Spinner -->
                                <div
                                  v-if="img.isRegenerating"
                                  class="absolute inset-0 bg-black/40 flex items-center justify-center"
                                >
                                  <Loader2 class="animate-spin h-8 w-8 text-white" />
                                </div>
                                <!-- Hover Overlay -->
                                <div
                                  v-else
                                  class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <div
                                    class="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer"
                                    @click="previewImage(img.url)"
                                  >
                                    <Eye class="h-6 w-6 text-white" />
                                  </div>
                                  <Button
                                    size="icon"
                                    variant="secondary"
                                    class="absolute top-2 right-2 z-10 rounded-lg bg-black/60 hover:bg-black/80 text-white h-7 w-7"
                                    @click.stop="downloadImage(img.url, img.name)"
                                  >
                                    <Download class="h-4 w-4" />
                                  </Button>
                                  <div class="absolute bottom-3 left-0 right-0 flex justify-center">
                                    <Button
                                      variant="secondary"
                                      size="sm"
                                      class="bg-white/90 hover:bg-white text-foreground h-7 text-xs px-2 gap-1"
                                      @click.stop="regenerateImage(currentTask, Number(idx))"
                                    >
                                      <RefreshCw class="h-3.5 w-3.5" />
                                      重新生成
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div v-else class="grid grid-cols-3 gap-3">
                          <div v-if="false">
                            <div
                              v-for="(type, idx) in currentTask.imageTypes"
                              :key="idx"
                              @click="type.selected = !type.selected"
                              class="relative border-2 rounded-xl p-3 space-y-2 cursor-pointer transition-colors"
                              :class="
                                type.selected
                                  ? 'border-foreground'
                                  : 'border-muted hover:border-muted-foreground'
                              "
                            >
                              <div class="flex items-center justify-between">
                                <span class="px-2 py-0.5 rounded-full border text-xs font-medium">
                                  {{ type.name }}
                                </span>
                                <div
                                  v-if="type.selected"
                                  class="w-5 h-5 rounded-full bg-foreground text-background flex items-center justify-center"
                                >
                                  <Check class="h-3 w-3" stroke-width="3" />
                                </div>
                              </div>
                              <p class="text-xs text-muted-foreground line-clamp-2">
                                {{ type.description }}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Empty State -->
                  <div v-else class="flex flex-col h-full">
                    <div class="text-center mb-6">
                      <h1 class="text-2xl font-bold text-foreground mb-2">AI商品套图</h1>
                      <p class="text-sm text-muted-foreground">
                        上传商品图，AI 即刻生成
                        <span class="text-primary font-medium">符合多电商平台规范</span>
                        的高质化商品套图
                      </p>
                    </div>

                    <!-- Mobile Layout -->
                    <div class="lg:hidden space-y-4 @container">
                      <!-- Main image on top -->
                      <div
                        class="relative rounded-3xl overflow-hidden bg-white shadow-sm aspect-square"
                      >
                        <div
                          class="absolute top-4 left-4 z-10 px-2.5 py-0.5 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center text-sm font-bold"
                        >
                          01
                        </div>
                        <img
                          alt="AI Product Set Example 1"
                          class="w-full h-full object-cover"
                          :src="EXAMPLE_IMAGES[0]?.src"
                        />
                      </div>
                      <!-- Grid items -->
                      <div class="grid grid-cols-2 gap-4">
                        <div
                          v-for="(example, index) in EXAMPLE_IMAGES.slice(1)"
                          :key="index + 1"
                          class="relative rounded-3xl overflow-hidden bg-white shadow-sm aspect-square"
                        >
                          <div
                            class="absolute top-3 left-3 z-10 px-2 py-0.5 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center text-xs font-bold"
                          >
                            {{ String(index + 2).padStart(2, "0") }}
                          </div>
                          <div
                            v-if="example.label"
                            class="absolute bottom-3 left-3 right-3 z-10 text-white text-xs font-medium drop-shadow-lg hidden @[400px]:block"
                          >
                            {{ example.label }}
                          </div>
                          <img
                            :alt="`AI Product Set Example ${index + 2}`"
                            class="w-full h-full object-cover"
                            :src="example.src"
                          />
                        </div>
                      </div>
                    </div>

                    <!-- Desktop Layout -->
                    <div class="hidden lg:grid grid-cols-4 gap-4 @container">
                      <!-- Large main image -->
                      <div
                        class="relative rounded-3xl overflow-hidden bg-white shadow-sm col-span-2 row-span-2 aspect-square"
                      >
                        <div
                          class="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center text-base font-bold"
                        >
                          01
                        </div>
                        <img
                          alt="AI Product Set Example 1"
                          class="w-full h-full object-cover"
                          :src="EXAMPLE_IMAGES[0]?.src"
                        />
                      </div>
                      <!-- Grid items -->
                      <div
                        v-for="(example, index) in EXAMPLE_IMAGES.slice(1)"
                        :key="index + 1"
                        class="relative rounded-3xl overflow-hidden bg-white shadow-sm aspect-square"
                      >
                        <div
                          class="absolute top-3 left-3 z-10 px-2.5 py-0.5 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center text-sm font-bold"
                        >
                          {{ String(index + 2).padStart(2, "0") }}
                        </div>
                        <div
                          v-if="example.label"
                          class="absolute bottom-3 left-3 right-3 z-10 text-white text-sm font-medium drop-shadow-lg hidden @[400px]:block"
                        >
                          {{ example.label }}
                        </div>
                        <img
                          :alt="`AI Product Set Example ${index + 2}`"
                          class="w-full h-full object-cover"
                          :src="example.src"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>

    <!-- Note Dialog -->
    <div
      v-if="editingImageIndex !== null"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click="cancelNote"
    >
      <div class="bg-card rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl" @click.stop>
        <h3 class="text-lg font-semibold mb-4">添加图片备注</h3>
        <Textarea
          v-model="editingNote"
          class="resize-none rounded-xl text-sm mb-4"
          rows="4"
          placeholder="请输入图片备注信息..."
          autofocus
        />
        <div class="flex gap-3 justify-end">
          <Button variant="outline" @click="cancelNote">取消</Button>
          <Button @click="saveNote">保存</Button>
        </div>
      </div>
    </div>

    <!-- Preview Dialog -->
    <div
      v-if="previewImageUrl"
      class="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
      @click="closePreview"
    >
      <div class="relative max-w-[90vw] max-h-[90vh]" @click.stop>
        <img :src="previewImageUrl" class="max-w-full max-h-[90vh] object-contain rounded-lg" />
        <button
          @click="closePreview"
          class="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-foreground flex items-center justify-center text-xl font-bold transition-colors"
        >
          ×
        </button>
      </div>
    </div>

    <!-- Regenerate Dialog -->
    <Dialog :open="showRegenerateDialog" @update:open="(val) => !val && cancelRegenerate()">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>重新生成图片</DialogTitle>
          <DialogDescription>请描述您想要的图片效果，AI 将根据您的描述重新生成</DialogDescription>
        </DialogHeader>
        <div class="py-4">
          <Textarea
            v-model="regenerationPrompt"
            placeholder="例如：调整光线更明亮，背景更简洁..."
            class="resize-none"
            rows="4"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" @click="cancelRegenerate">取消</Button>
          <Button @click="regenerateSingleImage">确认生成</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Download Dialog -->
    <div
      v-if="showDownloadDialog"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click="closeDownloadDialog"
    >
      <div
        class="bg-card rounded-2xl p-6 w-full max-w-2xl mx-4 shadow-xl max-h-[80vh] overflow-y-auto"
        @click.stop
      >
        <h3 class="text-lg font-semibold mb-4">选择要下载的图片</h3>
        <div class="grid grid-cols-3 gap-4 mb-6">
          <div
            v-for="(img, idx) in currentTask.generatedImages"
            :key="idx"
            @click="toggleImageSelection(Number(idx))"
            class="relative aspect-square rounded-lg overflow-hidden border cursor-pointer transition-all"
            :class="
              selectedImageIndexes.includes(Number(idx))
                ? 'border-primary ring-1 ring-primary'
                : 'border-muted hover:border-primary/50'
            "
          >
            <img :src="img.url" :alt="img.name" class="w-full h-full object-cover" />
            <div
              class="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium"
            >
              {{ String(Number(idx) + 1).padStart(2, "0") }} {{ img.name }}
            </div>
            <div
              v-if="selectedImageIndexes.includes(Number(idx))"
              class="absolute inset-0 bg-primary/20 flex items-center justify-center"
            >
              <div
                class="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
              >
                <Check class="h-6 w-6" stroke-width="3" />
              </div>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm text-muted-foreground">
            已选择 {{ selectedImageIndexes.length }} / {{ currentTask.generatedImages.length }} 张
          </span>
          <div class="flex gap-3">
            <Button variant="outline" @click="closeDownloadDialog">取消</Button>
            <Button @click="downloadSelectedImages" :disabled="selectedImageIndexes.length === 0">
              确认下载 ({{ selectedImageIndexes.length }})
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from "vue";
import { toast } from "vue-sonner";
import {
  Package,
  Sparkles,
  Trash2,
  Edit,
  Copy,
  Image as ImageIcon,
  Download,
  Box,
  RefreshCw,
  Eye,
  Check,
  Loader2,
} from "lucide-vue-next";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  PLATFORM_OPTIONS,
  PLATFORM_LABELS,
  STYLE_OPTIONS,
  RESOLUTION_OPTIONS,
  RATIO_OPTIONS,
  QUANTITY_OPTIONS,
  EXAMPLE_IMAGES,
  FILE_VALIDATION,
  ERROR_MESSAGES,
} from "./constants";
import { UploadAPI } from "@/api/upload";
import { GenerateAPI } from "@/api/generate";
import type { GeneratedCopy, GenerationTask, UploadedImage } from "./types";

const activeTab = ref("image-product-set");
const uploadedImages = ref<UploadedImage[]>([]);
const mainImageIndex = ref(0);
const fileInputRef = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);
const editingImageIndex = ref<number | null>(null);
const editingNote = ref("");
const currentTask = ref<GenerationTask | null>(null);
const selectedCopyIndex = ref(0);
const isAnalyzingSellingPoints = ref(false);
const isGeneratingCopy = ref(false);
const showDownloadDialog = ref(false);
const selectedImageIndexes = ref<number[]>([]);
const previewImageUrl = ref("");
const showRegenerateDialog = ref(false);
const regenerationPrompt = ref("");
const regenerationImageIndex = ref<number | null>(null);
const regenerationTask = ref<GenerationTask | null>(null);

const currentTaskTags = computed(() => {
  if (!currentTask.value) return [];
  return [
    PLATFORM_LABELS[currentTask.value.platform] || currentTask.value.platform,
    currentTask.value.style,
    currentTask.value.resolution,
    currentTask.value.ratio,
  ];
});

const formState = ref({
  platform: "xiaohongshu",
  productName: "",
  market: "us",
  language: "en",
  sellingPoints: "",
  quantity: "1",
});

const triggerFileInput = () => {
  fileInputRef.value?.click();
};

const validateFile = (file: File): boolean => {
  if (!FILE_VALIDATION.acceptedTypes.includes(file.type)) {
    toast.error(ERROR_MESSAGES.invalidFileType);
    return false;
  }

  if (file.size > FILE_VALIDATION.maxSize) {
    toast.error(ERROR_MESSAGES.fileTooLarge(file.name));
    return false;
  }

  return true;
};

const addFiles = async (files: FileList | File[]) => {
  const fileArray = Array.from(files);
  const remainingSlots = FILE_VALIDATION.maxCount - uploadedImages.value.length;

  if (fileArray.length > remainingSlots) {
    toast.error(ERROR_MESSAGES.tooManyFiles(remainingSlots));
    return;
  }

  for (const file of fileArray) {
    if (validateFile(file) && uploadedImages.value.length < FILE_VALIDATION.maxCount) {
      const preview = URL.createObjectURL(file);
      // Push to array and get the reactive item reference
      const length = uploadedImages.value.push({ file, preview, uploaded: false });
      const uploadedImage = uploadedImages.value[length - 1];

      try {
        // Get upload token
        const tokenResponse = await UploadAPI.getUploadToken({
          file_path: "product",
          file_name: file.name,
        });

        const tokenData = tokenResponse.data;

        // Upload directly to storage service
        const uploadFormData = new FormData();
        uploadFormData.append("token", tokenData.token);
        uploadFormData.append("key", tokenData.file_key);
        uploadFormData.append("file", file);

        const uploadResponse = await fetch(tokenData.upload_url, {
          method: "POST",
          credentials: "omit",
          body: uploadFormData,
        });

        if (uploadResponse.ok) {
          uploadedImage.uploaded = true;
          uploadedImage.fileInfo = {
            fileUrl: tokenData.access_url,
            fileName: file.name,
            fileKey: tokenData.file_key,
          };
          toast.success(`${file.name} 上传成功`);
        } else {
          throw new Error("Upload failed");
        }
      } catch (error) {
        console.error("文件上传失败:", error);
        toast.error(`${file.name} 上传失败`);
        const index = uploadedImages.value.indexOf(uploadedImage);
        if (index > -1) {
          URL.revokeObjectURL(uploadedImage.preview);
          uploadedImages.value.splice(index, 1);
        }
      }
    }
  }
};

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    addFiles(target.files);
    target.value = "";
  }
};

const handleDrop = (event: DragEvent) => {
  isDragging.value = false;
  if (event.dataTransfer?.files) {
    addFiles(event.dataTransfer.files);
  }
};

const removeImage = (index: number) => {
  URL.revokeObjectURL(uploadedImages.value[index].preview);
  uploadedImages.value.splice(index, 1);

  // 调整主图索引
  if (mainImageIndex.value === index) {
    mainImageIndex.value = 0;
  } else if (mainImageIndex.value > index) {
    mainImageIndex.value--;
  }
};

const previewImage = (url: string) => {
  previewImageUrl.value = url;
};

const closePreview = () => {
  previewImageUrl.value = "";
};

const saveNote = () => {
  if (editingImageIndex.value !== null && uploadedImages.value[editingImageIndex.value]) {
    uploadedImages.value[editingImageIndex.value].note = editingNote.value;
    editingImageIndex.value = null;
    editingNote.value = "";
  }
};

const cancelNote = () => {
  editingImageIndex.value = null;
  editingNote.value = "";
};

const truncateProductName = (name: string) => {
  return name.length > 20 ? name.substring(0, 20) + "..." : name;
};

const downloadImage = (url: string, name: string) => {
  const link = document.createElement("a");
  link.href = url;
  link.download = `${name}.jpg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const regenerateImage = (task: GenerationTask, index: number) => {
  if (!task.generatedImages || !task.generatedImages[index]) return;
  const currentImage = task.generatedImages[index];
  if (currentImage.isRegenerating) return;

  regenerationTask.value = task;
  regenerationImageIndex.value = index;
  regenerationPrompt.value = "";
  showRegenerateDialog.value = true;
};

const cancelRegenerate = () => {
  showRegenerateDialog.value = false;
  regenerationTask.value = null;
  regenerationImageIndex.value = null;
  regenerationPrompt.value = "";
};

const openDownloadDialog = (task: GenerationTask) => {
  if (!task.generatedImages) return;

  selectedImageIndexes.value = task.generatedImages.map((_, idx) => idx);
  showDownloadDialog.value = true;
};

const toggleImageSelection = (index: number) => {
  const idx = selectedImageIndexes.value.indexOf(index);
  if (idx > -1) {
    selectedImageIndexes.value.splice(idx, 1);
  } else {
    selectedImageIndexes.value.push(index);
  }
};

const downloadSelectedImages = () => {
  if (!currentTask.value?.generatedImages || selectedImageIndexes.value.length === 0) return;

  selectedImageIndexes.value.forEach((imgIndex: number, index: number) => {
    setTimeout(() => {
      const img = currentTask.value.generatedImages[imgIndex];
      downloadImage(img.url, `${currentTask.value.productName}_${img.name}`);
    }, index * 200);
  });

  showDownloadDialog.value = false;
  selectedImageIndexes.value = [];
};

const closeDownloadDialog = () => {
  showDownloadDialog.value = false;
  selectedImageIndexes.value = [];
};

// 复制文案内容
const copySelectedCopyText = async () => {
  if (!currentTask.value?.generatedCopies?.[selectedCopyIndex.value]) return;

  const copy = currentTask.value.generatedCopies[selectedCopyIndex.value];
  const text = `${copy.title}\n\n${copy.content}\n\n${copy.tags}`;

  try {
    await navigator.clipboard.writeText(text);
    toast.success("复制成功！");
  } catch (error) {
    console.error("复制失败:", error);
    toast.error("复制失败，请稍后重试");
  }
};

// ============ AI模型调用方法 ============

// AI分析产品卖点
const analyzeProductSellingPoints = async () => {
  if (uploadedImages.value.length === 0) return;

  if (!formState.value.productName) {
    toast.error("请先填写产品名称");
    return;
  }

  const unuploadedImages = uploadedImages.value.filter((img) => !img.uploaded);
  if (unuploadedImages.length > 0) {
    toast.error("请等待所有图片上传完成");
    return;
  }

  isAnalyzingSellingPoints.value = true;
  try {
    // 获取主图URL
    const mainImage = uploadedImages.value[mainImageIndex.value];
    const imageUrl = mainImage?.fileInfo?.fileUrl || "";

    // 获取默认的分析卖点引擎
    const enginesResp = await GenerateAPI.getAvailableEngines({ engine_type: "analysis" });
    const defaultEngine =
      enginesResp.data?.list?.find((e) => e.is_default) || enginesResp.data?.list?.[0];

    if (!defaultEngine) {
      throw new Error("未找到可用的AI引擎");
    }

    // 调用 Chat API 分析卖点
    const response = await GenerateAPI.chatCompletion({
      engine_id: defaultEngine.id,
      variables: {
        product_name: formState.value.productName,
        image_url: imageUrl,
        response_format: "text",
      },
    });

    if (response.data?.choices && response.data.choices.length > 0) {
      formState.value.sellingPoints = response.data.choices[0].message.content;
      toast.success("AI分析完成");
    } else {
      throw new Error("AI分析返回结果为空");
    }
  } catch (error: any) {
    console.error("生成失败:", error);
    toast.error("生成失败: " + (error.message || "请稍后重试"));
  } finally {
    isAnalyzingSellingPoints.value = false;
  }
};

// 生成文案
const generateProductCopy = async () => {
  if (isGeneratingCopy.value) return;

  const unuploadedImages = uploadedImages.value.filter((img) => !img.uploaded);
  if (unuploadedImages.length > 0) {
    toast.error("请等待所有图片上传完成");
    return;
  }

  isGeneratingCopy.value = true;

  try {
    const mainImage = uploadedImages.value[mainImageIndex.value];
    if (!mainImage) {
      throw new Error("未找到主图");
    }

    // 使用上传后的URL
    const imageUrl = mainImage.fileInfo?.fileUrl;
    if (!imageUrl) {
      throw new Error("图片尚未上传完成");
    }

    // 获取默认的文案生成引擎
    const enginesResp = await GenerateAPI.getAvailableEngines({ engine_type: "copy" });
    const defaultEngine =
      enginesResp.data?.list?.find((e) => e.is_default) || enginesResp.data?.list?.[0];

    if (!defaultEngine) {
      throw new Error("未找到可用的AI引擎");
    }

    // 调用 Chat API 生成文案
    const response = await GenerateAPI.chatCompletion({
      engine_id: defaultEngine.id,
      variables: {
        product_name: formState.value.productName,
        selling_points: formState.value.sellingPoints,
        platform: formState.value.platform,
        image_url: imageUrl,
        quantity: parseInt(formState.value.quantity),
        response_format: "json",
      },
    });

    if (!response.data?.choices || response.data.choices.length === 0) {
      throw new Error("AI生成返回结果为空");
    }

    // 解析生成的文案 - API返回格式: [{title, content, tags}, ...]
    const generatedCopies: GeneratedCopy[] = [];

    // 尝试从每个choice中解析文案
    for (const choice of response.data.choices) {
      try {
        let content = choice.message.content;
        // 去除markdown代码块标签
        content = content
          .replace(/^```(?:json)?\n?/g, "")
          .replace(/\n?```$/g, "")
          .trim();
        // 尝试解析JSON
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          generatedCopies.push(...parsed);
        } else if (parsed.title && parsed.content) {
          generatedCopies.push(parsed);
        }
      } catch (e) {
        // 如果不是JSON格式，直接使用文本内容
        generatedCopies.push({
          title: formState.value.productName,
          content: choice.message.content,
          tags: "",
        });
      }
    }

    if (generatedCopies.length === 0) {
      throw new Error("未能解析出有效的文案");
    }

    // 创建任务数据
    const task: GenerationTask = {
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      platform: formState.value.platform,
      productName: formState.value.productName,
      images: uploadedImages.value.map((img) => ({ preview: img.preview })),
      style: "极简留白",
      resolution: "2K ✨ 2",
      ratio: "1:1",
      generatedCopies: generatedCopies,
      imageTypes: [],
      isGeneratingImages: false,
      generatedImages: [], // 文案生成阶段还没有图片
    };

    selectedCopyIndex.value = 0;
    currentTask.value = task;
    toast.success('文案生成成功！请选择文案后点击"生成套图"');
    isGeneratingCopy.value = false;
  } catch (error: any) {
    console.error("生成文案失败:", error);
    toast.error("生成文案失败: " + (error.message || "请稍后重试"));
    isGeneratingCopy.value = false;
  }
};

// 生成套图
const generateImageSet = async (task: GenerationTask) => {
  // 检查是否正在生成中
  if (task.isGeneratingImages) {
    toast.info("图片正在生成...");
    return;
  }

  // 检查是否选择了文案
  if (!task.generatedCopies || task.generatedCopies.length === 0) {
    toast.error("请先生成文案");
    return;
  }

  // 获取选中的文案
  const selectedCopy = task.generatedCopies[selectedCopyIndex.value];
  if (!selectedCopy) {
    toast.error("请选择一条文案");
    return;
  }

  task.isGeneratingImages = true;

  try {
    // 获取主图URL
    const mainImage = uploadedImages.value[mainImageIndex.value];
    const imageUrl = mainImage?.fileInfo?.fileUrl || "";

    // 获取默认的图片生成引擎
    const enginesResp = await GenerateAPI.getAvailableEngines({ engine_type: "image_set" });
    const defaultEngine =
      enginesResp.data?.list?.find((e) => e.is_default) || enginesResp.data?.list?.[0];

    if (!defaultEngine) {
      throw new Error("未找到可用的图片生成引擎");
    }

    // 调用 Images API 生成套图
    const response = await GenerateAPI.imageGeneration({
      engine_id: defaultEngine.id,
      variables: {
        product_name: task.productName,
        copy_title: selectedCopy.title,
        copy_content: selectedCopy.content,
        image_url: imageUrl,
        style: task.style,
        resolution: task.resolution,
        ratio: task.ratio,
        response_format: "json",
      },
    });

    if (!response.data?.data || response.data.data.length === 0) {
      throw new Error("图片生成返回结果为空");
    }

    // 将生成的图片添加到任务中
    task.generatedImages = response.data.data.map((img, idx) => ({
      name: `图片${idx + 1}`,
      url: img.url || img.b64_json,
      isRegenerating: false,
    }));

    toast.success("套图生成成功！");
  } catch (error: any) {
    console.error("生成图片失败:", error);
    toast.error("生成图片失败: " + (error.message || "请稍后重试"));
  } finally {
    task.isGeneratingImages = false;
  }
};

// 重新生成单张图片
const regenerateSingleImage = async () => {
  if (!regenerationTask.value || regenerationImageIndex.value === null) return;

  const task = regenerationTask.value;
  const index = regenerationImageIndex.value;
  if (!task.generatedImages) return;
  const currentImage = task.generatedImages[index];

  currentImage.isRegenerating = true;
  showRegenerateDialog.value = false;

  try {
    // 获取默认的图片生成引擎
    const enginesResp = await GenerateAPI.getAvailableEngines({ engine_type: "image" });
    const defaultEngine =
      enginesResp.data?.list?.find((e) => e.is_default) || enginesResp.data?.list?.[0];

    if (!defaultEngine) {
      throw new Error("未找到可用的图片生成引擎");
    }

    // 获取选中的文案
    const selectedCopy = task.generatedCopies?.[selectedCopyIndex.value];

    // 获取主图URL
    const mainImage = uploadedImages.value[mainImageIndex.value];
    const imageUrl = mainImage?.fileInfo?.fileUrl || "";

    // 调用 Images API 重新生成单张图片
    const response = await GenerateAPI.imageGeneration({
      engine_id: defaultEngine.id,
      variables: {
        product_name: task.productName,
        copy_title: selectedCopy?.title || "",
        copy_content: selectedCopy?.content || "",
        image_url: imageUrl,
        style: task.style,
        resolution: task.resolution,
        ratio: task.ratio,
        custom_prompt: regenerationPrompt.value,
        response_format: "json",
      },
    });

    if (!response.data?.data || response.data.data.length === 0) {
      throw new Error("图片生成返回结果为空");
    }

    // 替换原图片
    const newImageData = response.data.data[0];
    currentImage.url = newImageData.url || newImageData.b64_json;

    toast.success("图片重新生成成功！");
  } catch (error: any) {
    console.error("重新生成失败:", error);
    toast.error("重新生成失败: " + (error.message || "请稍后重试"));
  } finally {
    currentImage.isRegenerating = false;
    regenerationTask.value = null;
    regenerationImageIndex.value = null;
  }
};

// 组件卸载时清理 URL
onUnmounted(() => {
  uploadedImages.value.forEach((img) => {
    URL.revokeObjectURL(img.preview);
  });
});
</script>

<style scoped>
.product-root {
  --accent-1: #ff6a3d;
  --accent-2: #ffb07a;
  --accent-3: #2dd4bf;
  background: radial-gradient(circle at top left, #fff5ec 0%, #ffffff 45%, #fef6e8 100%);
  border-radius: 24px;
}

.tabs-list {
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 999px;
  padding: 2px;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
}

.product-card {
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(148, 163, 184, 0.2);
  box-shadow: 0 22px 45px rgba(15, 23, 42, 0.12);
}

.left-panel {
  background: rgba(255, 255, 255, 0.82);
  border-color: rgba(148, 163, 184, 0.2);
}

.right-panel {
  background: rgba(255, 244, 236, 0.4);
}

.upload-zone {
  background: rgba(255, 255, 255, 0.7);
  border-color: rgba(148, 163, 184, 0.25);
}

.generate-cta {
  border: none;
  background: linear-gradient(135deg, var(--accent-1), var(--accent-2));
  color: #fff;
  box-shadow: 0 18px 40px rgba(255, 106, 61, 0.3);
  transition:
    transform 0.2s ease,
    filter 0.2s ease;
}

.generate-cta:hover {
  filter: brightness(1.05);
  transform: translateY(-1px);
}
</style>
