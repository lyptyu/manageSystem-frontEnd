<template>
  <div>
    <!--  面包屑导航区域  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>信息管理</el-breadcrumb-item>
      <el-breadcrumb-item>员工信息管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!--  卡片视图区域  -->
    <el-card>
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="id" prop="id">
          <el-input v-model="editForm.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="部门id" prop="dept_id">
          <el-input v-model="editForm.dept_id"></el-input>
        </el-form-item>
        <el-form-item label="学历" prop="education">
          <el-input v-model="editForm.education"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="经验" prop="experience">
          <el-input v-model="editForm.experience"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-input v-model="editForm.gender"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="editForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="岗位" prop="role_id">
          <el-input v-model="editForm.role_id"></el-input>
        </el-form-item>

      </el-form>
      <span class="dialog-footer">
      <el-button @click="showEditDialog(id)">重 置</el-button>
      <el-button type="primary" @click="editDept">保 存</el-button>
    </span>
    </el-card>

  </div>

</template>

<script>
import {defineComponent, onBeforeMount, reactive, toRefs, ref} from "vue";
import {api_getDeptByID} from "@/utils/api/dept/dept";
import {ElMessage, ElMessageBox} from "element-plus";
import {
  api_getEmployee,
  api_addEmployee,
  api_removeEmployee,
  api_getEmployeeByID,
  api_editEmployee,
  api_getRoleByID
} from "@/utils/api/employee/empolyee";
import {
  checkEmail,
  checkMobile,
  checkGender,
  checkEducation,
  checkExperience
} from "@/subpages/employee/checkRules/EmployeeRules"
import {useRouter} from "vue-router";
export default defineComponent({
  name: "dept",
  setup() {
    const router = useRouter();
    const data = reactive({
      id:router.currentRoute.value.query.id,
      //修改
      editDialogVisible: false,
      editForm: {
        id: "",
        name: "",
        dept_id: "",
        education: "",
        email: "",
        experience: "",
        gender: "",
        phone: "",
        role_id: ""
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
            message: "员工id在1-5个字符之间",
            trigger: "blur"
          }
        ],
        name: [
          {
            required: true,
            message: "请输入员工名称",
            trigger: "blur"
          },
          {
            min: 2,
            max: 8,
            message: "员工姓名在2-8个字符之间",
            trigger: "blur"
          }
        ],
        dept_id: [
          {
            required: true,
            message: "请输入部门id",
            trigger: "blur"
          },
          {
            min: 1,
            max: 3,
            message: "部门id在1-3个字符之间",
            trigger: "blur"
          }
        ],
        education: [
          {
            required: true,
            message: "请输入学历",
            trigger: "blur"
          },
          {
            validator:checkEducation,
            trigger:'blur'
          }
        ],
        email: [
          {
            required: true,
            message: "请输入邮箱",
            trigger: "blur"
          },
          {
            validator:checkEmail,
            trigger:'blur'
          }
        ],
        experience: [
          {
            required: true,
            message: "请输入工作经验",
            trigger: "blur"
          },
          {
            validator:checkExperience,
            trigger:'blur'
          }
        ],
        gender: [
          {
            required: true,
            message: "请输入性别",
            trigger: "blur"
          },
          {
            validator:checkGender,
            trigger:'blur'
          }
        ],
        phone: [
          {
            required: true,
            message: "请输入手机号",
            trigger: "blur"
          },
          {
            validator:checkMobile,
            trigger:'blur'
          }
        ],
        role_id: [
          {
            required: true,
            message: "请输入岗位id",
            trigger: "blur"
          },
          {
            min: 1,
            max: 3,
            message: "岗位id在1-3个字符自减",
            trigger: "blur"
          }
        ],
      },
    });
    onBeforeMount(async () => {
      await showEditDialog(data.id);
    });
    //显示编辑部门的对话框
    const showEditDialog = async (id) => {
      data.editDialogVisible = true;
      const {data: res} = await api_getEmployeeByID(id);
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
        const checkRolrDept = await isRoleAndDept(data.editForm.dept_id, data.editForm.role_id)
        if (checkRolrDept.code !== 100) {
          return ElMessage({
            type: "error",
            message: checkRolrDept.msg
          });
        }
        const {data: res} = await api_editEmployee(data.editForm);
        if (res.meta.code !== 200) {
          ElMessage({
            type: "error",
            message: "修改失败"
          });
          return;
        }
        data.editDialogVisible = false;
        ElMessage({
          type: "success",
          message: "修改员工信息成功"
        });
      });
    };
    //查询部门id或岗位id是否存在
    const isRoleAndDept = async (dept_id, role_id) => {

      const deptInfo = await api_getDeptByID(dept_id)
      const roleInfo = await api_getRoleByID(role_id)
      const res1 = deptInfo.data.data
      const res2 = roleInfo.data.data
      console.log("res1---------------------------", res1);
      console.log("res2---------------------------", res2);
      if (res1.length === 0 || res2.length === 0) {
        return {
          code: 101,
          msg: "部门id或岗位id不存在"
        }
      }
      if (res1[0].name !== res2[0].from) {
        return {
          code: 102,
          msg: "该岗位不属于该部门"
        }
      }
      return {
        code: 100,
        msg: "校验无误"
      }
    }
    return {
      ...toRefs(data),
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