<template>
  <div class="flex flex-1 flex-col">
    <div class="relative flex w-full flex-col h-[calc(100vh-4rem)] overflow-hidden">
      <!-- Tabs Header -->
      <div class="w-full px-6">
        <!--        <div class="space-y-2">-->
        <!--          <h1 class="text-2xl font-semibold">AI商品套图</h1>-->
        <!--          <p class="text-sm text-muted-foreground">-->
        <!--            上传商品图，AI 即刻生成 符合多电商平台规范 的高质化商品套图-->
        <!--          </p>-->
        <!--        </div>-->

        <Tabs v-model="activeTab" class="w-auto mt-1">
          <TabsList class="h-10">
            <!--            <TabsTrigger value="image-generator" class="gap-2 px-4">-->
            <!--              <FileImage class="h-4 w-4" />-->
            <!--              图片生成-->
            <!--            </TabsTrigger>-->
            <TabsTrigger value="image-product-set" class="gap-2 px-4">
              <Package class="h-4 w-4" />
              商品套图
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <!-- Main Content -->
      <div class="flex-1 px-6 py-4 overflow-hidden">
        <Card class="relative w-full h-full overflow-hidden rounded-2xl py-0">
          <div class="flex flex-col lg:flex-row h-full overflow-hidden">
            <!-- Left Panel - Form -->
            <div
              class="flex flex-col w-full h-[60%] lg:h-full overflow-auto lg:flex-shrink-0 bg-card border-b lg:border-b-0 lg:border-r lg:w-[28rem] rounded-t-2xl lg:rounded-tl-2xl lg:rounded-bl-2xl"
            >
              <div class="flex-1 min-h-0 overflow-y-auto">
                <div class="flex flex-col gap-4 p-6">
                  <!-- Image Upload -->
                  <div class="space-y-2">
                    <div class="flex items-center justify-between text-sm font-medium">
                      <span class="text-foreground">上传图片</span>
                      <span class="text-muted-foreground">{{ uploadedImages.length }}/{{ FILE_VALIDATION.maxCount }}</span>
                    </div>

                    <div
                      class="flex flex-wrap items-start gap-4 p-4 rounded-2xl border bg-muted/20"
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
                            @click="mainImageIndex = index"
                          >
                            {{ index === mainImageIndex ? '主图' : '设为主图' }}
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
                    <Select v-model="formData.platform">
                      <SelectTrigger class="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          v-for="option in PLATFORM_OPTIONS"
                          :key="option.value"
                          :value="option.value"
                          >{{ option.label }}</SelectItem
                        >
                      </SelectContent>
                    </Select>
                  </div>

                  <!-- Product Name -->
                  <div class="space-y-2">
                    <Label>产品名称</Label>
                    <Input v-model="formData.productName" placeholder="请输入产品名称" />
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
                          :disabled="uploadedImages.length === 0 || isGeneratingAI"
                          @click="handleAIGenerate"
                        >
                          <Sparkles class="h-3 w-3" :class="{ 'animate-spin': isGeneratingAI }" />
                          {{ isGeneratingAI ? 'AI分析中...' : 'AI生成' }}
                        </Button>
                      </div>
                      <Textarea
                        v-model="formData.sellingPoints"
                        class="resize-none rounded-xl text-sm"
                        rows="5"
                        placeholder="产品名：&#10;核心卖点：&#10;适用人群：&#10;期望场景：&#10;尺寸参数："
                      />
                    </div>
                    <div class="space-y-2">
                      <Label class="text-sm">生成内容数量</Label>
                      <Select v-model="formData.quantity">
                        <SelectTrigger class="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem
                            v-for="option in QUANTITY_OPTIONS"
                            :key="option.value"
                            :value="option.value"
                            >{{ option.label }}</SelectItem
                          >
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Footer Actions -->
              <div class="flex-shrink-0 border-t bg-card p-4 space-y-3">
                <Button
                  class="w-full"
                  :disabled="
                    uploadedImages.length === 0 || !formData.productName || !formData.sellingPoints || isGenerating
                  "
                  @click="handleGenerate"
                >
                  <Loader2 v-if="isGenerating" class="mr-2 h-4 w-4 animate-spin" />
                  <Sparkles v-else class="mr-2 h-4 w-4" />
                  {{ isGenerating ? '生成中...' : '立即生成' }}
                </Button>
                <p class="text-center text-xs text-muted-foreground">
                  {{
                    uploadedImages.length === 0
                      ? '请先上传至少一张产品图片'
                      : !formData.productName
                        ? '请填写产品名称'
                        : !formData.sellingPoints
                          ? '请填写产品卖点'
                          : isGenerating
                            ? '正在生成，请稍候...'
                            : '点击生成预览'
                  }}
                </p>
              </div>
            </div>

            <!-- Right Panel - Preview -->
            <div
              class="relative flex flex-col flex-1 h-[40%] lg:h-full min-h-0 bg-muted/20 rounded-b-2xl lg:rounded-br-2xl lg:rounded-tr-2xl overflow-hidden"
            >
              <div class="flex-1 overflow-y-auto">
                <div class="flex flex-col min-h-full p-6" :class="{ 'justify-center': !generatedTask }">
                  <!-- Generated Tasks -->
                  <div v-if="generatedTask" class="space-y-4">
                    <div class="bg-card rounded-2xl border p-6 space-y-4">
                      <!-- Header -->
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                          <span class="text-2xl font-bold">{{
                            truncateProductName(generatedTask.productName || '产品名称')
                          }}</span>
                          <span class="text-sm text-muted-foreground">{{
                            generatedTask.timestamp
                          }}</span>
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          class="rounded-lg"
                          @click="generatedTask = null"
                        >
                          <Trash2 class="h-5 w-5" />
                        </Button>
                      </div>

                      <!-- Tags -->
                      <div class="flex flex-wrap gap-2">
                        <span
                          v-for="(tag, idx) in taskTags"
                          :key="idx"
                          class="px-3 py-1 rounded-full bg-muted text-sm"
                          >{{ tag }}</span
                        >
                      </div>

                      <!-- Uploaded Images -->
                      <div class="flex gap-2">
                        <div
                          v-for="(img, idx) in generatedTask.images"
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
                          <Button variant="ghost" size="sm" class="h-8 gap-1" @click="copyCopyText">
                            <Copy class="h-4 w-4" />
                            复制
                          </Button>
                        </div>

                        <div class="bg-muted/30 rounded-lg space-y-3">
                          <div class="flex gap-2">
                            <button
                              v-for="(_copy, idx) in generatedTask.generatedCopies"
                              :key="idx"
                              @click="activeCopyIndex = idx"
                              :class="[
                                'px-3 py-1 rounded-full text-xs transition-colors',
                                activeCopyIndex === idx
                                  ? 'bg-foreground text-background'
                                  : 'border hover:bg-muted',
                              ]"
                            >
                              文案 {{ idx + 1 }}
                            </button>
                          </div>

                          <div class="space-y-3">
                            <h4 class="text-base font-medium">
                              {{ generatedTask.generatedCopies[activeCopyIndex].title }}
                            </h4>
                            <p class="text-sm leading-relaxed text-muted-foreground">
                              {{ generatedTask.generatedCopies[activeCopyIndex].content }}
                            </p>
                            <p class="text-sm text-muted-foreground">
                              {{ generatedTask.generatedCopies[activeCopyIndex].tags }}
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
                            v-if="generatedTask.generatedImages"
                            variant="ghost"
                            size="sm"
                            class="h-8 gap-1"
                            @click="downloadAllImages(generatedTask)"
                          >
                            <Download class="h-4 w-4" />
                            批量下载
                          </Button>
                        </div>

                        <!-- Settings -->
                        <div class="flex items-end gap-3">
                          <div class="space-y-1">
                            <div class="text-xs text-muted-foreground">风格选择</div>
                            <Select v-model="generatedTask.style">
                              <SelectTrigger class="h-9 text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem
                                  v-for="option in STYLE_OPTIONS"
                                  :key="option.value"
                                  :value="option.value"
                                  >{{ option.label }}</SelectItem
                                >
                              </SelectContent>
                            </Select>
                          </div>
                          <div class="space-y-1">
                            <div class="text-xs text-muted-foreground">分辨率选择</div>
                            <Select v-model="generatedTask.resolution">
                              <SelectTrigger class="h-9 text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem
                                  v-for="option in RESOLUTION_OPTIONS"
                                  :key="option.value"
                                  :value="option.value"
                                  >{{ option.label }}</SelectItem
                                >
                              </SelectContent>
                            </Select>
                          </div>
                          <div class="space-y-1">
                            <div class="text-xs text-muted-foreground">图片比例</div>
                            <Select v-model="generatedTask.ratio">
                              <SelectTrigger class="h-9 text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem
                                  v-for="option in RATIO_OPTIONS"
                                  :key="option.value"
                                  :value="option.value"
                                  >{{ option.label }}</SelectItem
                                >
                              </SelectContent>
                            </Select>
                          </div>
                          <!-- Generate Button -->
                          <Button size="lg" @click="handleGenerateImages(generatedTask)">
                            <Box class="mr-2 h-5 w-5" />
                            一键生成图片
                            <span class="ml-2">✨ 14</span>
                          </Button>
                        </div>

                        <!-- Image Types or Generated Images -->
                        <div
                          v-if="generatedTask.isGenerating"
                          class="flex flex-col items-center justify-center py-20"
                        >
                          <Loader2 class="animate-spin h-12 w-12 text-primary mb-4" />
                          <p class="text-sm text-muted-foreground">AI正在生成图片，请稍候...</p>
                        </div>
                        <div v-else-if="generatedTask.generatedImages" class="space-y-4">
                          <div class="grid grid-cols-3 gap-4">
                            <div
                              v-for="(img, idx) in generatedTask.generatedImages"
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
                                      @click.stop="regenerateImage(generatedTask, idx)"
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
                              v-for="(type, idx) in generatedTask.imageTypes"
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
                                <span class="px-2 py-0.5 rounded-full border text-xs font-medium">{{
                                  type.name
                                }}</span>
                                <div
                                  v-if="type.selected"
                                  class="w-5 h-5 rounded-full bg-foreground text-background flex items-center justify-center"
                                >
                                  <Check class="h-3 w-3" stroke-width="3" />
                                </div>
                              </div>
                              <p class="text-xs text-muted-foreground line-clamp-2">
                                {{ type.desc }}
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
                        上传商品图，AI 即刻生成 <span class="text-primary font-medium">
                          符合多电商平台规范 </span
                        >的高质化商品套图
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
                            {{ String(index + 2).padStart(2, '0') }}
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
                          {{ String(index + 2).padStart(2, '0') }}
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
            v-model="regeneratePrompt"
            placeholder="例如：调整光线更明亮，背景更简洁..."
            class="resize-none"
            rows="4"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" @click="cancelRegenerate">取消</Button>
          <Button @click="confirmRegenerate">确认生成</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Download Dialog -->
    <div
      v-if="showDownloadDialog"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click="cancelDownload"
    >
      <div
        class="bg-card rounded-2xl p-6 w-full max-w-2xl mx-4 shadow-xl max-h-[80vh] overflow-y-auto"
        @click.stop
      >
        <h3 class="text-lg font-semibold mb-4">选择要下载的图片</h3>
        <div class="grid grid-cols-3 gap-4 mb-6">
          <div
            v-for="(img, idx) in generatedTask.generatedImages"
            :key="idx"
            @click="toggleImageSelection(idx)"
            class="relative aspect-square rounded-lg overflow-hidden border cursor-pointer transition-all"
            :class="
              selectedImages.includes(idx)
                ? 'border-primary ring-1 ring-primary'
                : 'border-muted hover:border-primary/50'
            "
          >
            <img :src="img.url" :alt="img.name" class="w-full h-full object-cover" />
            <div
              class="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium"
            >
              {{ String(idx + 1).padStart(2, '0') }} {{ img.name }}
            </div>
            <div
              v-if="selectedImages.includes(idx)"
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
          <span class="text-sm text-muted-foreground"
            >已选择 {{ selectedImages.length }} /
            {{ generatedTask.generatedImages.length }} 张</span
          >
          <div class="flex gap-3">
            <Button variant="outline" @click="cancelDownload">取消</Button>
            <Button @click="confirmDownload" :disabled="selectedImages.length === 0">
              确认下载 ({{ selectedImages.length }})
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { toast } from 'vue-sonner'
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
} from 'lucide-vue-next'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
} from './constants'
import {
  generateProductSet,
  generateProductImages,
  regenerateProductImage,
  analyzeProductImages,
} from '@/services/imageGeneration'

interface UploadedImage {
  file: File
  preview: string
  note?: string
}

const taskTags = computed(() => {
  if (!generatedTask.value) return []
  return [
    PLATFORM_LABELS[generatedTask.value.platform] || generatedTask.value.platform,
    generatedTask.value.style,
    generatedTask.value.resolution,
    generatedTask.value.ratio,
  ]
})

const activeTab = ref('image-product-set')
const uploadedImages = ref<UploadedImage[]>([])
const mainImageIndex = ref(0)
const fileInputRef = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const editingImageIndex = ref<number | null>(null)
const editingNote = ref('')
const generatedTask = ref<any>(null)
const activeCopyIndex = ref(0)
const isGeneratingAI = ref(false)
const isGenerating = ref(false)
const showDownloadDialog = ref(false)
const selectedImages = ref<number[]>([])
const previewImageUrl = ref('')
const showRegenerateDialog = ref(false)
const regeneratePrompt = ref('')
const regeneratingImageIndex = ref<number | null>(null)
const regeneratingTask = ref<any>(null)

const formData = ref({
  platform: 'xiaohongshu',
  productName: '',
  market: 'us',
  language: 'en',
  sellingPoints: '',
  quantity: '1',
})

const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const validateFile = (file: File): boolean => {
  if (!FILE_VALIDATION.acceptedTypes.includes(file.type)) {
    toast.error(ERROR_MESSAGES.invalidFileType)
    return false
  }

  if (file.size > FILE_VALIDATION.maxSize) {
    toast.error(ERROR_MESSAGES.fileTooLarge(file.name))
    return false
  }

  return true
}

const addFiles = (files: FileList | File[]) => {
  const fileArray = Array.from(files)
  const remainingSlots = FILE_VALIDATION.maxCount - uploadedImages.value.length

  if (fileArray.length > remainingSlots) {
    toast.error(ERROR_MESSAGES.tooManyFiles(remainingSlots))
    return
  }

  fileArray.forEach((file) => {
    if (validateFile(file) && uploadedImages.value.length < FILE_VALIDATION.maxCount) {
      const preview = URL.createObjectURL(file)
      uploadedImages.value.push({ file, preview })
    }
  })
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    addFiles(target.files)
    target.value = ''
  }
}

const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  if (event.dataTransfer?.files) {
    addFiles(event.dataTransfer.files)
  }
}

const removeImage = (index: number) => {
  URL.revokeObjectURL(uploadedImages.value[index].preview)
  uploadedImages.value.splice(index, 1)

  // 调整主图索引
  if (mainImageIndex.value === index) {
    mainImageIndex.value = 0
  } else if (mainImageIndex.value > index) {
    mainImageIndex.value--
  }
}

const previewImage = (url: string) => {
  previewImageUrl.value = url
}

const closePreview = () => {
  previewImageUrl.value = ''
}

const saveNote = () => {
  if (editingImageIndex.value !== null && uploadedImages.value[editingImageIndex.value]) {
    uploadedImages.value[editingImageIndex.value].note = editingNote.value
    editingImageIndex.value = null
    editingNote.value = ''
  }
}

const cancelNote = () => {
  editingImageIndex.value = null
  editingNote.value = ''
}

const handleGenerate = async () => {
  if (isGenerating.value) return

  isGenerating.value = true

  try {
    const response = await generateProductSet({
      images: uploadedImages.value.map((img) => img.file),
      platform: formData.value.platform,
      productName: formData.value.productName,
      sellingPoints: formData.value.sellingPoints,
      quantity: parseInt(formData.value.quantity),
    })

    const task = {
      ...response,
      isGenerating: false,
      generatedImages: null,
    }

    activeCopyIndex.value = 0
    generatedTask.value = task
    toast.success('文案生成成功！')
  } catch (error) {
    console.error('生成失败:', error)
    toast.error('生成失败，请稍后重试')
  } finally {
    isGenerating.value = false
  }
}

const truncateProductName = (name: string) => {
  return name.length > 20 ? name.substring(0, 20) + '...' : name
}

const downloadImage = (url: string, name: string) => {
  const link = document.createElement('a')
  link.href = url
  link.download = `${name}.jpg`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const regenerateImage = (task: any, index: number) => {
  regeneratingTask.value = task
  regeneratingImageIndex.value = index
  regeneratePrompt.value = ''
  showRegenerateDialog.value = true
}

const confirmRegenerate = async () => {
  if (!regeneratingTask.value || regeneratingImageIndex.value === null) return

  showRegenerateDialog.value = false

  const task = regeneratingTask.value
  const index = regeneratingImageIndex.value

  task.generatedImages[index].isRegenerating = true

  try {
    const response = await regenerateProductImage({
      taskId: task.id,
      imageIndex: index,
      prompt: regeneratePrompt.value,
      style: task.style,
      resolution: task.resolution,
      ratio: task.ratio,
    })

    task.generatedImages[index].url = response.url
    toast.success('图片重新生成成功！')
  } catch (error) {
    console.error('重新生成失败:', error)
    toast.error('重新生成失败，请稍后重试')
  } finally {
    task.generatedImages[index].isRegenerating = false
    regeneratingTask.value = null
    regeneratingImageIndex.value = null
    regeneratePrompt.value = ''
  }
}

const cancelRegenerate = () => {
  showRegenerateDialog.value = false
  regeneratingTask.value = null
  regeneratingImageIndex.value = null
  regeneratePrompt.value = ''
}

const handleGenerateImages = async (task: any) => {
  const selectedTypes = task.imageTypes.filter((type: any) => type.selected)
  if (selectedTypes.length === 0) {
    toast.error(ERROR_MESSAGES.selectImageType)
    return
  }

  task.isGenerating = true

  try {
    const response = await generateProductImages({
      taskId: task.id,
      style: task.style,
      resolution: task.resolution,
      ratio: task.ratio,
      imageTypes: selectedTypes,
    })

    task.generatedImages = response.images
    toast.success('配图生成成功！')
  } catch (error) {
    console.error('生成图片失败:', error)
    toast.error('生成图片失败，请稍后重试')
  } finally {
    task.isGenerating = false
  }
}

const downloadAllImages = (task: any) => {
  if (!task.generatedImages) return

  selectedImages.value = task.generatedImages.map((_: any, idx: number) => idx)
  showDownloadDialog.value = true
}

const toggleImageSelection = (index: number) => {
  const idx = selectedImages.value.indexOf(index)
  if (idx > -1) {
    selectedImages.value.splice(idx, 1)
  } else {
    selectedImages.value.push(index)
  }
}

const confirmDownload = () => {
  if (!generatedTask.value?.generatedImages || selectedImages.value.length === 0) return

  selectedImages.value.forEach((imgIndex: number, index: number) => {
    setTimeout(() => {
      const img = generatedTask.value.generatedImages[imgIndex]
      downloadImage(img.url, `${generatedTask.value.productName}_${img.name}`)
    }, index * 200)
  })

  showDownloadDialog.value = false
  selectedImages.value = []
}

const cancelDownload = () => {
  showDownloadDialog.value = false
  selectedImages.value = []
}

const handleAIGenerate = async () => {
  if (uploadedImages.value.length === 0) return

  isGeneratingAI.value = true

  try {
    const result = await analyzeProductImages(uploadedImages.value.map((img) => img.file))
    formData.value.productName = result.productName
    formData.value.sellingPoints = result.sellingPoints
    toast.success('AI 分析完成！')
  } catch (error) {
    console.error('AI分析失败:', error)
    toast.error('AI分析失败，请稍后重试')
  } finally {
    isGeneratingAI.value = false
  }
}

// 复制文案内容
const copyCopyText = async () => {
  if (!generatedTask.value?.generatedCopies?.[activeCopyIndex.value]) return

  const copy = generatedTask.value.generatedCopies[activeCopyIndex.value]
  const text = `${copy.title}\n\n${copy.content}\n\n${copy.tags}`

  try {
    await navigator.clipboard.writeText(text)
    toast.success('复制成功！')
  } catch (error) {
    console.error('复制失败:', error)
    toast.error('复制失败，请稍后重试')
  }
}

// 组件卸载时清理 URL
onUnmounted(() => {
  uploadedImages.value.forEach((img) => {
    URL.revokeObjectURL(img.preview)
  })
})
</script>
