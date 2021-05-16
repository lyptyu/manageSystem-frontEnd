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
import RealSalary from "@/subpages/realSalary/RealSalary.vue";
import AnalyseEmployee from "@/subpages/analyse/analyse_employee/analyseEmployee.vue";
import AnalyseSalary from "@/subpages/analyse/analyse_salary/analyseSalary.vue";
import OutsideExam from "@/subpages/outsideExam/outsideExam.vue";
import ProjectExam from "@/subpages/projectExam/projectExam.vue";
import MoreWorkExam from "@/subpages/moreWorkExam/moreWorkExam.vue";
import EmpHome from "@/emppages/EmpHome/EmpHome.vue";
import EmpInfo from "@/emppages/EmpInfo/EmpInfo.vue";
import EmpTodayOvertime from "@/emppages/EmpTodayOvertime/empTodayOvertime.vue";
import EmpMonthOvertime from "@/emppages/EmpMonthOvertime/EmpMonthOvertime.vue";
import EmpBasicSalary from "@/emppages/EmpBasicSalary/EmpBasicSalary.vue";
import EmpRealSalary from "@/emppages/EmpRealSalary/EmpRealSalary.vue";
import EmpOutSideApply from "@/emppages/EmpOutSideApply/EmpOutSideApply.vue";
import EmpProjectApply from "@/emppages/EmpProjectApply/EmpProjectApply.vue";

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
    name: "home",
    redirect: "/welcome",
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
        component: AnalyseEmployee
      },
      {
        path: "/analyse_salary",
        component: AnalyseSalary
      },
      {
        path: "/outsideExam",
        component: OutsideExam
      },
      {
        path: "/projectExam",
        component: ProjectExam
      },
      {
        path: "/moreWorkExam",
        component: MoreWorkExam
      }
    ]
  },
  {
    path: "/emphome",
    component: EmpHome,
    name: "emphome",
    children: [
      {
        path: "/empInfo",
        component: EmpInfo
      },
      {
        path: "/empTodayOvertime",
        component: EmpTodayOvertime
      },
      {
        path:"/empMonthOvertime",
        component: EmpMonthOvertime
      },
      {
        path:"/empBasicSalary",
        component: EmpBasicSalary
      },
      {
        path: "/empRealSalary",
        component: EmpRealSalary
      },
      {
        path: "/empOutSideApply",
        component: EmpOutSideApply
      },
      {
        path: "/empProjectApply",
        component: EmpProjectApply
      }
    ]
  },
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
