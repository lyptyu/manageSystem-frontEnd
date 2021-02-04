import {createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw} from "vue-router";
import Login from "@/views/login/Login.vue";
import Home from "@/views/home/Home.vue";
import Welcome from "@/subpages/welcome/Welcome.vue";

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
    component: Home,
    redirect:'/welcome',
    children:[
      {
        path:'/welcome',
        component:Welcome
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});
//路由导航验证是否有token,没有跳转回到登录页
router.beforeEach((to, from, next) => {
  if (to.path === "/login") return next();
  //获取token
  const token = window.sessionStorage.getItem("token");
  if (!token) return next("/login");
  next();
});
export default router;
