# SparkInAI

一个基于 Vue 3 + TypeScript 的 AI 图片生成 SaaS 平台

## 主要路由

- `/` - 首页
- `/login` - 登录页面
- `/register` - 注册页面
- `/pricing` - 定价页面
- `/app/dashboard` - 图片生成（登录后首页）
- `/app/favorites` - 我的收藏
- `/app/user-center` - 用户中心
- `/app/customer-service` - 客服中心
- `/payment/checkout` - 支付确认页面
- `/payment/process` - 支付处理页面
- `/payment/result` - 支付结果页面

## 功能说明

### 认证功能
- ✅ 邮箱密码登录
- ✅ 邮箱验证码注册
- ✅ OAuth登录（Apple、Google）
- ✅ 路由守卫（未登录自动跳转登录页）
- ✅ 登录状态持久化（localStorage）

### 支付功能
- ✅ 支持支付宝、微信支付、Stripe三种支付方式
- ✅ 完整的支付流程：定价页面 → 支付确认 → 支付处理 → 支付结果
- ✅ 用户中心可查看订单历史和订阅状态
- ✅ Mock数据模拟真实支付流程

### 图片生成功能
- ✅ 上传商品图片（最多5张）
- ✅ 设置主图和图片备注
- ✅ AI自动分析产品信息
- ✅ 生成符合电商平台规范的商品套图
- ✅ 支持单张或批量下载生成的图片

### 收藏功能
- ✅ 收藏图片和视频
- ✅ 按类型筛选（全部/图片/视频）
- ✅ 批量管理收藏
- ✅ 下载和删除收藏

### 客服功能
- ✅ 企业微信客服二维码
- ✅ 多种联系方式展示
- ✅ 常见问题列表

## 技术栈

- **框架**: Vue 3 + TypeScript
- **路由**: Vue Router
- **状态管理**: Pinia + Composables
- **UI组件**: shadcn-vue (基于 Reka UI)
- **样式**: Tailwind CSS v4
- **图标**: Lucide Vue Next
- **构建工具**: Vite
- **Mock服务**: vite-plugin-mock-dev-server

## 开发说明

### API调用方式

目前所有API调用都使用Mock数据实现，真实API调用已注释。Mock数据写在 `src/services/` 中，方便部署后继续使用。

**示例**：
```typescript
// src/services/auth.ts
export const authService = {
  login: async (email: string, password: string) => {
    // TODO: 真实API调用（暂时注释）
    // return api.post('/auth/login', { email, password })

    // Mock数据实现
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, data: { ... } })
      }, 800)
    })
  }
}
```

### UI组件使用

优先使用 shadcn-vue 组件库。安装新组件：

```bash
pnpm dlx shadcn-vue@latest add [component-name]
```

### 用户数据管理

- 登录/注册成功后，用户信息和token存储在localStorage
- `useUserData` composable 从localStorage读取用户信息
- 退出登录时清空localStorage

### 路由守卫

- `/app/*` 路由需要认证
- 未登录访问会重定向到 `/login?redirect=原路径`
- 已登录访问 `/login` 或 `/register` 会重定向到 `/app/dashboard`

## 开发命令

```bash
# 安装依赖
pnpm install

# 启动开发服务器（带mock）
pnpm dev

# 构建生产版本
pnpm build

# 类型检查
pnpm type-check

# 代码格式化
pnpm format

# 代码检查
pnpm lint
```

## 项目结构

```
src/
├── components/        # 可复用组件
│   ├── ui/           # shadcn-vue UI组件
│   ├── LoginForm.vue
│   └── SignupForm.vue
├── composables/      # Vue组合式函数
│   ├── useUser.ts
│   ├── useUserData.ts
│   ├── useImages.ts
│   └── useVideos.ts
├── layouts/          # 布局组件
│   └── AppLayout.vue
├── router/           # 路由配置
│   ├── index.ts
│   └── routes.ts
├── services/         # API服务层（含Mock数据）
│   ├── auth.ts
│   ├── payment.ts
│   ├── user.ts
│   └── ...
├── types/            # TypeScript类型定义
│   └── index.ts
├── views/            # 页面组件
│   ├── landing/
│   ├── login/
│   ├── register/
│   ├── pricing/
│   ├── payment/
│   └── app/
│       ├── dashboard/
│       ├── favorites/
│       ├── user-center/
│       └── customer-service/
└── main.ts
```

## 待办事项

- [ ] 接入真实后端API
- [ ] 完善图片生成AI功能
- [ ] 添加视频生成功能
- [ ] 完善用户中心功能
- [ ] 添加邀请好友功能
- [ ] 优化移动端体验

## 注意事项

1. **Mock数据**: 当前所有接口都使用Mock数据，部署后仍可正常运行
2. **UI组件**: 优先使用shadcn-vue组件库
3. **代码规范**: 使用ESLint和Prettier保持代码风格一致
4. **类型安全**: 充分利用TypeScript类型系统
