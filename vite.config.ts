import { fileURLToPath, URL } from 'node:url'

import { type ConfigEnv, type UserConfig, loadEnv, defineConfig, PluginOption } from 'vite'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import AutoImport from "unplugin-auto-import/vite";
import { mockDevServerPlugin } from 'vite-plugin-mock-dev-server'

// https://vite.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const env = loadEnv(mode, process.cwd())
  return {
    base: env.VITE_APP_BASE_PATH,
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      host: '0.0.0.0',
      port: Number(env.VITE_APP_PORT),
      open: true,
      proxy: {
        '^/api': {
          changeOrigin: true,
          target: 'http://localhost:5173',
          rewrite: (path) => path.replace("", ""),
        },
      },
    },
    plugins: [
      vue(),
      vueJsx(),
      vueDevTools(),
      tailwindcss(),
      // 自动导入配置 https://github.com/sxzz/element-plus-best-practices/blob/main/vite.config.ts
      AutoImport({
        imports: ["vue", "@vueuse/core", "pinia", "vue-router"],
        // 导入函数类型声明文件路径 (false:关闭自动生成)
        dts: true,
      }),
      env.VITE_MOCK_DEV_SERVER === 'true' ? mockDevServerPlugin() : null,
    ],
    // 构建配置
    build: {
      chunkSizeWarningLimit: 2000, // 消除打包大小超过500kb警告
      outDir: env.VITE_APP_DIST_NAME,
      rollupOptions: {
        output: {
          // 用于从入口点创建的块的打包输出格式[name]表示文件名,[hash]表示该文件内容hash值
          entryFileNames: 'js/[name].[hash].js',
          // 用于命名代码拆分时创建的共享块的输出命名
          chunkFileNames: 'js/[name].[hash].js',
          // 用于输出静态资源的命名，[ext]表示文件扩展名
          assetFileNames: (assetInfo: any) => {
            if (!assetInfo.name) return 'assets/[name].[hash].[ext]'
            const info = assetInfo.name.split('.')
            let extType = info[info.length - 1]
            // console.log('文件信息', assetInfo.name)
            if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(assetInfo.name)) {
              extType = 'media'
            } else if (/\.(png|jpe?g|gif|svg)(\?.*)?$/.test(assetInfo.name)) {
              extType = 'img'
            } else if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(assetInfo.name)) {
              extType = 'fonts'
            }
            return `${extType}/[name].[hash].[ext]`
          },
        },
      },
    },
  }
})
