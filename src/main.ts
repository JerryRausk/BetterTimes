import { firebaseApp } from '@/firebase';
import Home from "@/views/Home.vue";
import Landing from "@/views/Landing.vue";
import Login from "@/views/Login.vue";
import Report from "@/views/Report.vue";
import User from "@/views/User.vue";
import Organization from "@/views/orgAdmin/Organization.vue";
import TimeCodes from "@/views/orgAdmin/TimeCodes.vue";
import Users from '@/views/orgAdmin/Users.vue';
import '@mdi/font/css/materialdesignicons.css';
import { createPinia } from "pinia";
import { createApp } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import { VueFire, VueFireAuth } from 'vuefire';
import App from "./App.vue";

// Vuetify
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { aliases, mdi } from "vuetify/iconsets/mdi";
import 'vuetify/styles';

const vuetify = createVuetify({
  theme: {defaultTheme: "dark"},
  components,
  directives,
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi
    }
  }
})

const routes = [
  {name: "Landing", path: "/", component: Landing},
  {name: "Home", path: "/home", component: Home},
  {name: "Login", path: "/login", component: Login},
  {name: "Report", path: "/report", component: Report},
  {name: "User", path: "/me", component: User},
  {name: "TimeCodes", path: "/admin/timecodes", component: TimeCodes},
  {name: "Organization", path: "/admin/organization", component: Organization},
  {name: "Users", path: "/admin/users", component: Users}
];

const router = createRouter({
  history: createWebHashHistory(),
  routes: routes,
});

const pinia = createPinia();

const app = createApp(App)
app.use(VueFire, {
  firebaseApp,
  modules: [VueFireAuth()],
});
app.use(router);
app.use(pinia);
app.use(vuetify);
app.mount("#app");
