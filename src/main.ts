import { Icon, IconConfigProvider } from "@vicons/utils";
import { createPinia } from "pinia";
import { createApp } from "vue";
import "./styles.css";

import { createI18n } from "vue-i18n";
import { defaultLocale, fallbackLocale, getTranslation, Locale } from "@/locales/locales";
import router from "@/router/router";
import App from "./App.vue";

export const app = createApp(App);
const pinia = createPinia();

const i18n = createI18n({
  legacy: false,
  locale: defaultLocale,
  fallbackLocale: fallbackLocale,
  messages: {
    en: getTranslation(Locale.EN),
  },
});

app.use(i18n);

app.use(pinia);
app.use(router);

app.component("NIcon", Icon);
app.component("NIconConfigProvider", IconConfigProvider);

app.mount("#app");
