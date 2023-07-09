import { firebaseApp } from '@/firebase';
import Admin from "@/views/Admin.vue";
import Home from "@/views/Home.vue";
import Landing from "@/views/Landing.vue";
import Login from "@/views/Login.vue";
import { createPinia } from "pinia";
import { createApp } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import { VueFire, VueFireAuth } from 'vuefire';
import App from "./App.vue";
import "./style.css";

const routes = [
  {name: "Landing", path: "/", component: Landing},
  {name: "Admin", path: "/admin", component: Admin},
  {name: "Home", path: "/home", component: Home},
  {name: "Login", path: "/login", component: Login},
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
app.mount("#app");
