import { createApp } from "vue";
import "./styles/style.css";
import "./permission";

import App from "./App.vue";
import router, { setupRouter } from "./router";
import { setupStore } from "@/store";
import i18n from "./i18n";

const app = createApp(App);

setupRouter(app);
setupStore(app);
app.use(i18n);

app.mount("#app");
