// 应用配置
export const APP_CONFIG = {
  name: 'AI 创作工具',
  version: '1.0.0',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
} as const

// 路由配置
export const ROUTES = {
  HOME: '/',
  VIDEO_ANALYSIS: '/video-analysis',
  VIDEO_GENERATION: '/video-generation',
  IMAGE_GENERATION: '/image-generation',
} as const

// 主题配置
export const THEME_CONFIG = {
  defaultTheme: 'light',
  themes: ['light', 'dark', 'system'],
} as const
