# 项目目录结构说明

本项目采用 Vue 3 + shadcn-vue 的主流目录结构，遵循最佳实践。

## 📁 目录结构

```
shadcn-vue-demo/
├── public/                    # 静态资源目录
│   ├── images/               # 图片资源（已从根目录移入）
│   └── favicon.ico           # 网站图标
│
├── src/                      # 源代码目录
│   ├── assets/              # 编译时资源（图片、字体等）
│   │
│   ├── components/          # 组件目录
│   │   ├── ui/             # shadcn-vue UI 组件库
│   │   │   ├── avatar/
│   │   │   ├── button/
│   │   │   ├── dropdown-menu/
│   │   │   ├── sidebar/
│   │   │   └── ...
│   │   │
│   │   ├── AppSidebar.vue   # 应用侧边栏（业务组件）
│   │   ├── NavMain.vue      # 主导航（业务组件）
│   │   ├── NavProjects.vue  # 项目导航（业务组件）
│   │   ├── NavUser.vue      # 用户导航（业务组件）
│   │   ├── TeamSwitcher.vue # 团队切换器（业务组件）
│   │   └── UserMenu.vue     # 用户菜单（业务组件）
│   │
│   ├── composables/         # Vue 组合式函数（Composition API）
│   │   └── useUser.ts       # 用户相关逻辑
│   │
│   ├── config/              # 配置文件
│   │   └── app.ts           # 应用配置
│   │
│   ├── constants/           # 常量定义
│   │   └── mockData.ts      # 模拟数据（已从 data/ 移入）
│   │
│   ├── lib/                 # 工具函数库
│   │   └── utils.ts         # 通用工具函数
│   │
│   ├── router/              # 路由配置
│   │   └── index.ts         # 路由定义
│   │
│   ├── stores/              # 状态管理（Pinia）
│   │
│   ├── styles/              # 全局样式
│   │   └── style.css        # 主样式文件（含 Tailwind）
│   │
│   ├── types/               # TypeScript 类型定义
│   │   └── index.ts         # 全局类型
│   │
│   ├── views/               # 页面组件
│   │   ├── HomePage.vue
│   │   ├── ImageGenerationPage.vue
│   │   ├── Sora2Page.vue
│   │   └── VideoDetailPage.vue
│   │
│   ├── App.vue              # 根组件
│   └── main.ts              # 应用入口
│
├── e2e/                     # E2E 测试
├── test-results/            # 测试结果
├── playwright-report/       # Playwright 测试报告
│
├── components.json          # shadcn-vue 配置
├── vite.config.ts           # Vite 配置
├── tsconfig.json            # TypeScript 配置
├── tailwind.config.js       # Tailwind CSS 配置
├── eslint.config.ts         # ESLint 配置
├── playwright.config.ts     # Playwright 配置
├── vitest.config.ts         # Vitest 配置
└── package.json             # 项目依赖
```

## 📝 目录说明

### `/src/components/`
- **ui/**: shadcn-vue 的 UI 组件，通过 CLI 自动生成，不建议手动修改
- **业务组件**: 直接放在 components 根目录，如 AppSidebar.vue、UserMenu.vue

### `/src/composables/`
存放可复用的组合式函数（Composition API），用于封装和复用有状态的逻辑。

**命名规范**: 使用 `use` 前缀，如 `useUser.ts`、`useAuth.ts`

**示例**:
```typescript
// composables/useUser.ts
export function useUser() {
  const user = ref(null)
  const isLoggedIn = computed(() => user.value !== null)
  return { user, isLoggedIn }
}
```

### `/src/config/`
存放应用配置文件，如 API 地址、主题配置、路由配置等。

### `/src/constants/`
存放常量定义，如枚举值、固定配置、模拟数据等。

### `/src/lib/`
存放纯函数工具库，不依赖 Vue 的响应式系统。

### `/src/types/`
存放 TypeScript 类型定义和接口。

**命名规范**: 使用 PascalCase，如 `User`、`VideoData`

### `/src/views/`
存放页面级组件，通常与路由一一对应。

**命名规范**: 使用 PascalCase + Page 后缀，如 `HomePage.vue`

### `/src/stores/`
存放 Pinia 状态管理文件。

**命名规范**: 使用 `use` 前缀 + Store 后缀，如 `useUserStore.ts`

## 🔧 路径别名

项目配置了以下路径别名（在 `vite.config.ts` 和 `components.json` 中）：

```typescript
{
  '@': './src',
  '@/components': './src/components',
  '@/ui': './src/components/ui',
  '@/lib': './src/lib',
  '@/composables': './src/composables',
  '@/types': './src/types',
  '@/config': './src/config',
  '@/constants': './src/constants'
}
```

**使用示例**:
```typescript
import { Button } from '@/components/ui/button'
import { useUser } from '@/composables/useUser'
import type { User } from '@/types'
import { APP_CONFIG } from '@/config/app'
import { mockData } from '@/constants/mockData'
```

## 📦 组件组织原则

1. **UI 组件** (`components/ui/`): 由 shadcn-vue CLI 管理，保持原样
2. **业务组件** (`components/`): 可复用的业务逻辑组件
3. **页面组件** (`views/`): 页面级组件，与路由对应
4. **布局组件**: 如需要，可创建 `layouts/` 目录

## 🎯 最佳实践

1. **单一职责**: 每个文件只负责一个功能
2. **命名规范**: 
   - 组件: PascalCase (如 `UserMenu.vue`)
   - 文件夹: kebab-case (如 `dropdown-menu/`)
   - Composables: camelCase with `use` prefix (如 `useUser.ts`)
3. **导入顺序**: 
   - Vue 核心
   - 第三方库
   - 项目内部模块（按 UI 组件 → 业务组件 → 工具函数 → 类型）
4. **类型安全**: 充分利用 TypeScript，为函数和组件定义类型

## 🔄 重构变更

本次重构主要变更：

1. ✅ 将 `images/` 移至 `public/images/`
2. ✅ 将 `src/data/` 重命名为 `src/constants/`
3. ✅ 创建 `src/composables/` 目录
4. ✅ 创建 `src/types/` 目录
5. ✅ 创建 `src/config/` 目录
6. ✅ 更新所有导入路径
7. ✅ 更新 `components.json` 配置

## 📚 参考资源

- [Vue 3 官方文档](https://vuejs.org/)
- [shadcn-vue 文档](https://www.shadcn-vue.com/)
- [Vite 配置参考](https://vitejs.dev/config/)
- [TypeScript 最佳实践](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
