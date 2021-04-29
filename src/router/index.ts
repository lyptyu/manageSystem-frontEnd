import {createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw} from "vue-router";
import Login from "@/views/login/Login.vue";
import Home from "@/views/home/Home.vue";
import Welcome from "@/subpages/welcome/Welcome.vue";
import Dept from "@/subpages/dept/Dept.vue";
import Employee from "@/subpages/employee/Employee.vue";
import Overtime from "@/subpages/overtime/Overtime.vue";
import basicSalary from "@/subpages/basicSalary/basicSalary.vue";
import Right from "@/subpages/right/Right.vue";
import Status from "@/subpages/status/status.vue";
import RealSalary from "@/subpages/realSalary/RealSalary.vue"
import AnalyseEmployee from "@/subpages/analyse/analyse_employee/analyseEmployee.vue"
import AnalyseSalary from "@/subpages/analyse/analyse_salary/analyseSalary.vue"
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
    children: [
      {
        path: "/welcome",
        component: Welcome
      },
      {
        path: "/dept",
        component: Dept
      },
      {
        path: "/employee",
        component: Employee
      },
      {
        path: "/overtime",
        component: Overtime
      },
      {
        path: "/basic_salary",
        component: basicSalary
      },
      {
        path: "/right",
        component: Right
      },
      {
        path: "/status",
        component: Status
      },
      {
        path: "/real_salary",
        component:RealSalary
      },
      {
        path: "/analyse_employee",
        component:AnalyseEmployee
      },
      {
        path: "/analyse_salary",
        component:AnalyseSalary
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
