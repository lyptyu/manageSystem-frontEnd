<template>
  <div>
    <!--  面包屑导航区域  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>工资管理</el-breadcrumb-item>
      <el-breadcrumb-item>基本工资管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form :model="editForm" ref="editFormRef" label-width="100px">
      <el-form-item label="id" prop="id">
        <el-input v-model="editForm.id" disabled></el-input>
      </el-form-item>
      <el-form-item label="员工id" prop="employee_id">
        <el-input v-model="editForm.employee_id" disabled></el-input>
      </el-form-item>
      <el-form-item label="基本工资" prop="basic">
        <el-input v-model="editForm.basic" disabled></el-input>
      </el-form-item>
      <el-form-item label="全勤奖" prop="full_overtime">
        <el-input v-model="editForm.full_overtime" disabled></el-input>
      </el-form-item>
      <el-form-item label="项目奖" prop="project">
        <el-input v-model="editForm.project" disabled></el-input>
      </el-form-item>
      <el-form-item label="公积金比例" prop="fiveOneRate">
        <el-input v-model="editForm.fiveOneRate" disabled></el-input>
      </el-form-item>
      <el-form-item label="出差补贴" prop="outsideMoney">
        <el-input v-model="editForm.outsideMoney" disabled></el-input>
      </el-form-item>
      <el-form-item label="加班补贴" prop="moreWorkMoney">
        <el-input v-model="editForm.moreWorkMoney" disabled></el-input>
      </el-form-item>
    </el-form>
<!--    <span class="dialog-footer">-->
<!--      <el-button @click="editDialogVisible = false">取 消</el-button>-->
<!--      <el-button type="primary" @click="editDept">确 定</el-button>-->
<!--    </span>-->
  </div>
  <!-- 修改部门对话框 -->
</template>

<script>
import {defineComponent, onBeforeMount, reactive, toRefs, ref} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";
import {
  api_getEmployeeByID,
} from "@/utils/api/employee/empolyee";

import {
  api_getOvertimeByID,
  api_editOvertime,
  api_removeOvertime
} from "@/utils/api/overtime/overtime"
import {useRouter} from "vue-router";
import {
  api_getBasicSalary,
  api_addBasicSalary,
  api_getBasicSalaryByID,
  api_editSalary,
  api_removeSalary
} from "@/utils/api/basicSalary/basicSalary"


import {checkDate, checkStatus, checkTime} from "@/subpages/overtime/checkRules/overtimeRules"
import {api_getRoleById} from "@/utils/api/dept/dept"

export default defineComponent({
  name: "dept",
  setup() {
    const router = useRouter();
    const data = reactive({

      //查询
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      basicSalaryList: [],
      total: 0,
      //修改
      editDialogVisible: false,
      editForm: {
        id: "",
        employee_id: "",
        basic: "",
        full_overtime: "",
        project: "",
        fiveOneRate: "",
        outsideMoney: "",
        moreWorkMoney: ""
      },
      editFormRules: {
        id: [
          {
            required: true,
            message: "请输入id",
            trigger: "blur"
          },
          {
            min: 1,
            max: 5,
            message: "考勤记录id在1-5个字符之间",
            trigger: "blur"
          }
        ],
        employee_id: [
          {
            required: true,
            message: "请输入员工id",
            trigger: "blur"
          },
          {
            min: 1,
            max: 8,
            message: "员工姓名在1-5个字符之间",
            trigger: "blur"
          }
        ],
        basic: [
          {
            required: true,
            message: "请输入基本工资",
            trigger: "blur"
          },
          {
            min: 1,
            max: 6,
            message: "员工基本工资在1-6个字符之间",
            trigger: "blur"
          }
        ],
        full_overtime: [
          {
            required: true,
            message: "请输入员工全勤奖金",
            trigger: "blur"
          },
          {
            min: 1,
            max: 6,
            message: "员工全勤奖金在1-6个字符之间",
            trigger: "blur"
          }
        ],
        project: [
          {
            required: true,
            message: "请输入员工项目奖金",
            trigger: "blur"
          },
          {
            min: 1,
            max: 6,
            message: "员工项目奖金在1-6个字符之间",
            trigger: "blur"
          }
        ],
        fiveOneRate: [
          {
            required: true,
            message: "请输入五险一金比例",
            trigger: "blur"
          },
          {
            min: 1,
            max: 2,
            message: "五险一金比例在0-12之间",
            trigger: "blur"
          }
        ],
        outsideMoney: [
          {
            required: true,
            message: "请输入出差补贴",
            trigger: "blur"
          },
          {
            min: 1,
            max: 5,
            message: "出差补贴在1-5位数之间",
            trigger: "blur"
          }
        ],
        moreWorkMoney: [
          {
            required: true,
            message: "请输入加班津贴",
            trigger: "blur"
          },
          {
            min: 1,
            max: 5,
            message: "加班补贴在1-5位数之间",
            trigger: "blur"
          }
        ],
      },
      id:router.currentRoute.value.query.id
    });
    const getUserList = async () => {
      const {data: res} = await api_getBasicSalary(data.queryInfo);
      if (res.meta.code !== 200) {
        ElMessage({type: "error", message: "服务器开小差了", duration: 1800});
      }
      data.basicSalaryList = res.data.basicSalaryList;
      console.log("data.basicSalaryList", data.basicSalaryList)
      data.total = res.data.total;
      let mypromise = data.basicSalaryList.map(async val => {

        const {data: res2} = await api_getEmployeeByID(val.employee_id)
        val.employee_name = res2.data[0].name
        const {data: res3} = await api_getRoleById(val.role_id)
        val.rank = res3.data[0].rank
        const {data: res4} = await api_editSalary(
            {
              id: val.id,
              basic: val.rank * 3000,
              employee_id: val.employee_id,
              full_overtime: val.full_overtime,
              project: val.project,
              isFull_Overtime: val.isFull_Overtime,
              fiveOneRate: val.fiveOneRate,
              outsideMoney: val.outsideMoney,
              moreWorkMoney: val.moreWorkMoney
            }
        )
      })
      await Promise.all(mypromise)
      console.log("gogogo", data.basicSalaryList)
    };
    onBeforeMount(async () => {
      await showEditDialog(data.id);
    });
    //监听 pageSize 改变的事件
    const handleSizeChange = (newSize) => {
      // console.log(newSize);
      data.queryInfo.pagesize = newSize;
      getUserList();
    };
    //监听页码值改变的事件
    const handleCurrentChange = (newPage) => {
      // console.log(newPage);
      data.queryInfo.pagenum = newPage;
      getUserList();
    };
    //显示编辑部门的对话框
    const showEditDialog = async (id) => {
      data.editDialogVisible = true;
      const {data: res} = await api_getBasicSalaryByID(id);
      if (res.meta.code !== 200) {
        ElMessage({
          type: "error",
          message: "请求失败"
        });
        return;
      }
      data.editForm = res.data[0];
      Object.keys(res.data[0]).map(val => {
        console.log(data.editForm[val]);
        data.editForm[val] = data.editForm[val].toString();
      });
      console.log();
      console.log("xxx", res.data[0]);
    };
    //监听修改部门对话框的关闭事件
    const editFormRef = ref(null);
    //重置编辑
    const editDialogClosed = () => {
      const resetFields = editFormRef.value["resetFields"];
      resetFields();
    };
    //修改部门信息并提交
    const editDept = () => {
      const validate = editFormRef.value["validate"];
      validate(async (valid) => {
        if (!valid) {
          ElMessage({
            type: "error",
            message: "请检查数据是否正确"
          });
          return;
        }
        const {data: res} = await api_editSalary(data.editForm);
        if (res.meta.code !== 200) {
          ElMessage({
            type: "error",
            message: "修改失败"
          });
          return;
        }
        data.editDialogVisible = false;
        getUserList();
        ElMessage({
          type: "success",
          message: "修改考勤信息成功"
        });
      });
    };
    return {
      ...toRefs(data),
      handleSizeChange,
      handleCurrentChange,
      getUserList,
      showEditDialog,
      editFormRef,
      editDialogClosed,
      editDept,
    };

  }

});
</script>

<style scoped lang="scss">

</style>