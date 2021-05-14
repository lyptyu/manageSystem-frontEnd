<template>
  <div>
    <!--  面包屑导航区域  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>信息管理</el-breadcrumb-item>
      <el-breadcrumb-item>考勤信息管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!--  卡片视图区域  -->
    <el-card>
      <div>
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
          <el-form-item label="id" prop="id">
            <el-input v-model="addForm.id" disabled></el-input>
          </el-form-item>
          <el-form-item label="员工id" prop="employee_id">
            <el-input v-model="addForm.employee_id" disabled></el-input>
          </el-form-item>
          <el-form-item label="考勤日期" prop="date">
            <el-input v-model="addForm.date" disabled></el-input>
          </el-form-item>
          <el-form-item label="上班时间" prop="morning">
            <el-input v-model="addForm.morning"></el-input>
          </el-form-item>
          <el-form-item label="下班时间" prop="afternoon">
            <el-input v-model="addForm.afternoon"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-input v-model="addForm.status"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span class="dialog-footer">
      <el-button @click="addDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addDept">确 定</el-button>
    </span>
    </el-card>
  </div>
</template>

<script>
import {defineComponent, onBeforeMount, reactive, toRefs, ref} from "vue";
import {api_getDeptByID} from "@/utils/api/dept/dept";
import {ElMessage, ElMessageBox} from "element-plus";
import {
  api_removeEmployee,
  api_getEmployeeByID,
  api_getRoleByID
} from "@/utils/api/employee/empolyee";

import {
  api_getOvertime,
  api_addOvertime,
  api_getOvertimeByID,
  api_editOvertime,
  api_removeOvertime
} from "@/utils/api/overtime/overtime"
import {useRouter} from "vue-router";
import {checkDate, checkStatus, checkTime} from "@/subpages/overtime/checkRules/overtimeRules"

export default defineComponent({
  name: "dept",
  setup() {
    const router = useRouter();
    const data = reactive({
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10000
      },
      //增加
      addDialogVisible: false,
      addForm: {
        id: "",
        employee_id: router.currentRoute.value.query.id,
        date: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`,
        morning: "",
        afternoon: "",
        status: "",
      },
      addFormRules: {
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
        date: [
          {
            required: true,
            message: "请输入日期",
            trigger: "blur"
          },
          {
            validator: checkDate,
            trigger: "blur"
          }
        ],
        morning: [
          {
            required: true,
            message: "请输入员工上午打卡时间",
            trigger: "blur"
          },
          {
            validator: checkTime,
            trigger: "blur"
          }
        ],
        afternoon: [
          {
            required: true,
            message: "请输入员工下午打卡时间",
            trigger: "blur"
          },
          {
            validator: checkTime,
            trigger: "blur"
          }
        ],
        status: [
          {
            required: true,
            message: "请输入员工考勤状态",
            trigger: "blur"
          },
          {
            validator: checkStatus,
            trigger: "blur"
          }
        ],
      },
      total: 0
    });
    onBeforeMount(async () => {
      await getUserList();
      console.log(data.total)
      let num = data.total + 1
      data.addForm.id = num.toString()
    });
    const getUserList = async () => {
      const {data: res} = await api_getOvertime(data.queryInfo);
      if (res.meta.code !== 200) {
        ElMessage({type: "error", message: "服务器开小差了", duration: 1800});
      }
      data.total = res.data.total;
    };
    const addFormRef = ref(null);
    //重置
    const addDialogClosed = () => {
      const resetFields = addFormRef.value["resetFields"];
      resetFields();
    };
    //添加部门确认按钮
    const addDept = async () => {
      const validate = addFormRef.value["validate"];
      validate(valid => {
        if (!valid) {
          ElMessage({
            type: "error",
            message: "请检查数据是否正确"
          });
          return;
        }
      });

      const {data: res} = await api_addOvertime(data.addForm);
      if (res.meta.code !== 200) {
        return ElMessage({
          type: "error",
          message: "考勤记录id重复"
        });
      }
      ElMessage({
        type: "success",
        message: "添加考勤状态成功"
      });
      data.addDialogVisible = false;
      getUserList();
    };
    return {
      ...toRefs(data),
      addDialogClosed,
      addFormRef,
      addDept,
    };

  }

});
</script>

<style scoped lang="scss">

</style>