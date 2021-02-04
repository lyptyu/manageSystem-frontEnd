import {createRouter, createWebHashHistory, RouteRecordRaw} from "vue-router";
import Login from "@/views/login/Login.vue";
import Home from "@/views/home/Home.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/Login"
  },
  {
    path: "/login",
    component: Login
  },
  {
    path: "/home",
    component: Home
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
