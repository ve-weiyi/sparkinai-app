# CreatOK Platform - Quick Reference Guide

## 🗂️ Project Structure

```
src/
├── assets/              # Static assets (images, fonts)
├── components/          # Reusable components
│   ├── ui/             # shadcn-vue UI components
│   └── LoginForm.vue   # Custom components
├── composables/         # Vue composables (hooks)
│   ├── useImages.ts    # Image data management
│   ├── useUser.ts      # User authentication
│   ├── useUserData.ts  # User profile data
│   └── useVideos.ts    # Video data management
├── config/             # App configuration
│   └── app.ts          # App-wide settings
├── layouts/            # Layout components
│   ├── components/     # Layout-specific components
│   │   ├── header/    # Header components
│   │   └── sidebar/   # Sidebar components
│   └── AppLayout.vue   # Main app layout
├── lib/                # Utility libraries
│   ├── api.ts         # API client
│   └── utils.ts       # Helper functions
├── router/             # Vue Router configuration
│   └── index.ts       # Route definitions
├── services/           # API services
│   ├── auth.ts        # Authentication service
│   ├── image.ts       # Image service
│   ├── user.ts        # User service
│   └── video.ts       # Video service
├── stores/             # Pinia stores (state management)
├── styles/             # Global styles
│   └── style.css      # Main stylesheet
├── types/              # TypeScript type definitions
│   └── index.ts       # Global types
├── views/              # Page components
│   ├── dashboard/     # Dashboard page
│   ├── image-generation/  # Image generation page
│   ├── landing/       # Landing page
│   ├── login/         # Login page
│   ├── video-analysis/    # Video analysis page
│   └── video-generation/  # Video generation pages
│       ├── index.vue      # Main generation page
│       └── records.vue    # Records page
├── App.vue             # Root component
└── main.ts             # App entry point
```

## 🎨 Key Components

### Layout Components

#### AppLayout.vue
Main application layout with sidebar and header.
```vue
<SidebarProvider>
  <AppSidebar />
  <SidebarInset>
    <AppHeader />
    <RouterView />
  </SidebarInset>
</SidebarProvider>
```

#### AppSidebar.vue
Navigation sidebar with sections:
- Main navigation (首页, 视频分析)
- Creation tools (视频生成)
- Sora 2 features
- Tools (图片生成, 水印去除, etc.)
- Conversation history
- User profile

#### AppHeader.vue
Top header with:
- Sidebar toggle
- Breadcrumb navigation
- Help and messages icons
- Upgrade button
- Credits display
- User menu

### Page Components

#### Dashboard (`/app/dashboard`)
- Dual-mode interface (Video Generation / Video Analysis)
- Quick action buttons
- Text input with multiple options
- Inspiration gallery

#### Video Generation Records (`/app/video-generation/records`)
- Filter system
- Batch operations
- Empty state
- Search functionality

#### Video Generation (`/app/video-generation`)
- File upload
- Prompt replication
- Results display
- History tracking

#### Image Generation (`/app/image-generation`)
- Image upload (up to 5 images)
- Platform selection
- Market and language settings
- Product details form
- AI-powered generation
- 9-grid preview

## 🔧 Composables

### useUserData()
```typescript
const { currentUser, creditOptions, loading, error } = useUserData()
```
Returns:
- `currentUser`: Current user object
- `creditOptions`: Available credit options
- `loading`: Loading state
- `error`: Error state

### useVideos()
```typescript
const { videos } = useVideos()
```
Returns:
- `videos`: Array of video objects

### useImages()
```typescript
const { images } = useImages()
```
Returns:
- `images`: Array of image generation objects

## 🎯 Common Patterns

### File Upload
```vue
<input
  type="file"
  accept="video/*"
  class="hidden"
  id="video-upload"
  @change="handleFileUpload"
/>
<label for="video-upload" class="cursor-pointer">
  <!-- Upload UI -->
</label>
```

### Empty State
```vue
<div class="border-2 border-dashed rounded-lg p-16 text-center">
  <div class="w-20 h-20 rounded-full bg-muted mx-auto mb-4">
    <Icon class="w-10 h-10 text-muted-foreground" />
  </div>
  <h3 class="text-lg font-semibold mb-2">Empty State Title</h3>
  <Button>Call to Action</Button>
</div>
```

### Filter Dropdown
```vue
<select v-model="filterValue" class="border rounded-md px-3 py-2 text-sm">
  <option value="all">All</option>
  <option value="option1">Option 1</option>
</select>
```

## 🎨 Styling Guidelines

### Spacing
- Use Tailwind spacing scale: `p-4`, `m-6`, `gap-3`
- Consistent spacing: 4px increments (1 = 4px)

### Colors
```css
/* Primary Actions */
bg-primary text-primary-foreground

/* Secondary/Muted */
bg-muted text-muted-foreground

/* Borders */
border border-border

/* Cards */
bg-card text-card-foreground

/* Success */
text-green-600 bg-green-50

/* Warning */
text-orange-600 bg-orange-50
```

### Typography
```css
/* Headings */
text-3xl font-bold  /* Page title */
text-2xl font-bold  /* Section title */
text-xl font-semibold  /* Subsection */

/* Body */
text-base  /* Normal text */
text-sm    /* Small text */
text-xs    /* Extra small */

/* Muted */
text-muted-foreground
```

### Buttons
```vue
<!-- Primary -->
<Button>Action</Button>

<!-- Secondary -->
<Button variant="outline">Action</Button>

<!-- Ghost -->
<Button variant="ghost">Action</Button>

<!-- Link -->
<Button variant="link">Action</Button>

<!-- With Icon -->
<Button>
  <Icon class="w-4 h-4 mr-2" />
  Action
</Button>
```

## 🔌 API Integration

### Service Pattern
```typescript
// services/example.ts
export const exampleService = {
  async getData() {
    const response = await fetch('/api/data')
    return response.json()
  }
}
```

### Composable Pattern
```typescript
// composables/useExample.ts
export function useExample() {
  const data = ref([])
  const loading = ref(false)
  
  const fetchData = async () => {
    loading.value = true
    try {
      data.value = await exampleService.getData()
    } finally {
      loading.value = false
    }
  }
  
  onMounted(fetchData)
  
  return { data, loading, fetchData }
}
```

## 🧪 Testing

### Unit Tests
```bash
pnpm test:unit
```

### E2E Tests
```bash
pnpm test:e2e
```

## 🚀 Development

### Start Dev Server
```bash
pnpm dev
```

### Build for Production
```bash
pnpm build
```

### Preview Production Build
```bash
pnpm preview
```

### Lint Code
```bash
pnpm lint
```

## 📱 Responsive Breakpoints

```css
/* Mobile First */
default: 0-640px

/* Tablet */
md: 768px

/* Desktop */
lg: 1024px

/* Large Desktop */
xl: 1280px

/* Extra Large */
2xl: 1536px
```

## 🎯 Best Practices

1. **Component Size**: Keep components under 300 lines
2. **Composables**: Extract reusable logic into composables
3. **Types**: Always define TypeScript types
4. **Props**: Use defineProps with TypeScript
5. **Emits**: Use defineEmits for events
6. **Naming**: Use PascalCase for components, camelCase for functions
7. **Imports**: Use @ alias for src imports
8. **Styling**: Prefer Tailwind classes over custom CSS
9. **Icons**: Use lucide-vue-next icons
10. **State**: Use ref/reactive for local state, Pinia for global state

## 🔗 Useful Links

- [Vue 3 Docs](https://vuejs.org/)
- [Vite Docs](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn-vue](https://www.shadcn-vue.com/)
- [Lucide Icons](https://lucide.dev/)
- [Vue Router](https://router.vuejs.org/)
- [Pinia](https://pinia.vuejs.org/)
