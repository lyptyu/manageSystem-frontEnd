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
      <el-row :gutter="20">
        <el-col :span="9">
          <!--  搜索框和添加区域  -->
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <template #append>
              <el-button icon="el-icon-search" @click="getUserList"></el-button>
            </template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加员工</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="employeeList" stripe>
        <el-table-column label="员工id" prop="id"></el-table-column>
        <el-table-column label="员工姓名" prop="name"></el-table-column>
        <el-table-column label="员工部门" prop="dept"></el-table-column>
        <el-table-column label="员工岗位" prop="role"></el-table-column>
        <el-table-column label="员工学历" prop="education"></el-table-column>
        <el-table-column label="员工邮箱" prop="email"></el-table-column>
        <el-table-column label="员工电话" prop="phone"></el-table-column>
        <el-table-column label="工作经验" prop="experience"></el-table-column>
        <el-table-column label="员工性别" prop="gender_show"></el-table-column>
        <el-table-column label="操作" width="120px">
          <template #default="scope">
            <!-- 修改 -->
            <el-button size="mini" type="info" icon="el-icon-edit" @click="showEditDialog(scope.row.id)"></el-button>
            <!-- 删除 -->
            <el-button size="mini" type="danger" icon="el-icon-delete"
                       @click="removeDeptById(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </el-card>
  </div>
  <!--添加部门对话框-->
  <el-dialog
      title="添加员工"
      v-model="addDialogVisible"
      width="50%"
      @close="addDialogClosed">
    <div>
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="id" prop="id">
          <el-input v-model="addForm.id"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="部门id" prop="dept_id">
          <el-input v-model="addForm.dept_id"></el-input>
        </el-form-item>
        <el-form-item label="学历" prop="education">
          <el-input v-model="addForm.education"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="经验" prop="experience">
          <el-input v-model="addForm.experience"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-input v-model="addForm.gender"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="addForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="岗位" prop="role_id">
          <el-input v-model="addForm.role_id"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
    <span class="dialog-footer">
      <el-button @click="addDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addDept">确 定</el-button>
    </span>
    </template>
  </el-dialog>
  <!-- 修改部门对话框 -->
  <el-dialog
      title="部门信息修改"
      v-model="editDialogVisible"
      width="50%"
      @close="editDialogClosed">
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
    <template #footer>
    <span class="dialog-footer">
      <el-button @click="editDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="editDept">确 定</el-button>
    </span>
    </template>
  </el-dialog>
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

export default defineComponent({
  name: "dept",
  setup() {

    const data = reactive({

      //查询
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2
      },
      employeeList: [],
      total: 0,
      //增加
      addDialogVisible: false,
      addForm: {
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
      addFormRules: {
        id: [ 
          {required: true, message: "请输入id", trigger: "blur"},
          {min: 1,max: 5,message: "员工id在1-5个字符之间",trigger: "blur"}
          ],
        name: [  
          {required: true, message: "请输入员工名称", trigger: "blur" },
          { min: 2, max: 8,message: "员工姓名在2-8个字符之间", trigger: "blur" }
        ],
        dept_id: [
          { required: true, message: "请输入部门id", trigger: "blur" },
          { min: 1, max: 3, message: "部门id在1-3个字符之间", trigger: "blur" }
        ],
        education: [
          {required: true, message: "请输入学历",  trigger: "blur" },
          { validator:checkEducation, trigger:'blur'  }
        ],
        email: [
          { required: true,  message: "请输入邮箱",trigger: "blur" },
          { validator:checkEmail,   trigger:'blur'  }
        ],
        experience: [
          {  required: true, message: "请输入工作经验",  trigger: "blur"   },
          {  validator:checkExperience,   trigger:'blur'   }
        ],
        gender: [
          {  required: true,     message: "请输入性别",    trigger: "blur"  },
          { validator:checkGender, trigger:'blur'}
        ],
        phone: [
          {   required: true,  message: "请输入手机号", trigger: "blur"  },
          { validator:checkMobile, trigger:'blur' }
        ],
        role_id: [
          {  required: true,  message: "请输入岗位id", trigger: "blur" },
          {  min: 1, max: 3, message: "岗位id在1-3个字符自减",   trigger: "blur" }
        ],
      },
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
    const getUserList = async () => {
      const {data: res} = await api_getEmployee(data.queryInfo);
      if (res.meta.code !== 200) {
        ElMessage({type: "error", message: "服务器开小差了", duration: 1800});
      }
      data.employeeList = res.data.employeeList;
      data.total = res.data.total;
      // console.log(res);
      data.employeeList.map(async val => {
        console.log("beforename");
        const deptInfo = await api_getDeptByID(val.dept_id);
        const {name: deptname} = deptInfo.data.data[0]
        const roleInfo = await api_getRoleByID(val.role_id)
        const {name: rolename} = roleInfo.data.data[0]
        val.role = rolename;
        val.dept = deptname;
        val.gender_show = val.gender == 1 ? "男" : "女";
      });
    };
    onBeforeMount(async () => {
      await getUserList();
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
    //监听添加部门对话框的关闭时间
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
      const checkRolrDept = await isRoleAndDept(data.addForm.dept_id, data.addForm.role_id)
      if (checkRolrDept.code !== 100) {
        return ElMessage({
          type: "error",
          message: checkRolrDept.msg
        });
      }
      const {data: res} = await api_addEmployee(data.addForm);
      if (res.meta.code !== 200) {
        return ElMessage({
          type: "error",
          message: "员工id重复"
        });
      }
      ElMessage({
        type: "success",
        message: "添加员工成功"
      });
      data.addDialogVisible = false;
      getUserList();
    };
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
        getUserList();
        ElMessage({
          type: "success",
          message: "修改员工信息成功"
        });
      });
    };
    //根据id删除对应部门信息
    const removeDeptById = async (id) => {
      //弹框询问用户是否删除数据
      // data.deleteDialogVisible = true;
      const confirmResult = await ElMessageBox.confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).catch(err => err);
      if (confirmResult !== "confirm") {
        return ElMessage({
          type: "info",
          message: "已取消删除"
        });
      } else {
        const {data: res} = await api_removeEmployee(id);
        if (res.meta.code !== 200) {
          return ElMessage({
            type: "error",
            message: "删除失败"
          });
        }
        getUserList();
        return ElMessage({
          type: "success",
          message: "删除成功"
        });
      }
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
      handleSizeChange,
      handleCurrentChange,
      getUserList,
      addDialogClosed,
      addFormRef,
      addDept,
      showEditDialog,
      editFormRef,
      editDialogClosed,
      editDept,
      removeDeptById
    };

  }

});
</script>

<style scoped lang="scss">

</style>