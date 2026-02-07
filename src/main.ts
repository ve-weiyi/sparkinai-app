import { createApp } from 'vue'
import "./styles/style.css"
import "./permission"

import App from './App.vue'
import router, { setupRouter } from './router'
import { setupStore } from '@/store'

const app = createApp(App)

setupRouter(app);
setupStore(app);

app.mount('#app')
