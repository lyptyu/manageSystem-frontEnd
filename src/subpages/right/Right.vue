<template>
  <div>
    <!--  面包屑导航区域  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>管理员权限</el-breadcrumb-item>
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
          <el-button type="primary" @click="addDialogVisible=true">添加管理员</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userList" stripe>
        <el-table-column label="id" prop="id"></el-table-column>
        <el-table-column label="管理员账号" prop="username"></el-table-column>
        <el-table-column label="密码" prop="password"></el-table-column>
        <el-table-column label="管理员权限" prop="isManagerStr"></el-table-column>
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
      title="添加权限"
      v-model="addDialogVisible"
      width="50%"
      @close="addDialogClosed">
    <div>
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="90px">
        <el-form-item label="id" prop="id">
          <el-input v-model="addForm.id"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="管理权限" prop="isManagerStr">
          <el-input v-model="addForm.isManagerStr"></el-input>
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
      <el-form-item label="id" type="number">
        <el-input v-model="editForm.id" disabled></el-input>
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="editForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="editForm.password"></el-input>
      </el-form-item>
      <el-form-item label="管理权限" prop="isManagerStr">
        <el-input v-model="editForm.isManagerStr"></el-input>
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
import {deptData} from "@/utils/interface/dept/dept";
import {ElMessage, ElMessageBox} from "element-plus";
import {api_getUserList, api_addUser, api_getUserByID, api_editUser, api_removeUser} from "@/utils/api/right/right";
import {checkIsManagerStr} from "@/subpages/right/rightRules"

export default defineComponent({
  name: "dept",
  setup() {
    const data= reactive({
      //查询
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      total: 0,
      //增加
      addDialogVisible: false,
      addForm: {
        id: "",
        username: "",
        password: "",
        isManagerStr: ""
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
            message: "权限id在1-5个字符之间",
            trigger: "blur"
          }
        ],
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          },
          {
            min: 2,
            max: 8,
            message: "用户名在2-8个字符之间",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          },
          {
            min: 1,
            max: 8,
            message: "密码在1-8个字符之间",
            trigger: "blur"
          }
        ],
        isManagerStr: [
          {
            required: true,
            message: "请输入管理权限",
            trigger: "blur"
          },
          {
            validator: checkIsManagerStr,
            trigger: "blur"
          }
        ],
      },
      //修改
      editDialogVisible: false,
      editForm: {
        id: "",
        username: "",
        password: "",
        isManagerStr: ""
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
            message: "权限id在1-5个字符之间",
            trigger: "blur"
          }
        ],
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          },
          {
            min: 2,
            max: 8,
            message: "用户名在2-8个字符之间",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          },
          {
            min: 1,
            max: 8,
            message: "密码id在1-8个字符之间",
            trigger: "blur"
          }
        ],
        isManagerStr: [
          {
            required: true,
            message: "请输入管理权限",
            trigger: "blur"
          },
          {
            validator: checkIsManagerStr,
            trigger: "blur"
          }
        ],
      },
    });
    const getUserList = async () => {
      const {data: res} = await api_getUserList(data.queryInfo);
      if (res.meta.code !== 200) {
        ElMessage({type: "error", message: "服务器开小差了", duration: 1800});
      }
      data.userList = res.data.userList;
      data.total = res.data.total;
      console.log("getUserList", data.userList);
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
      const resetFields= addFormRef.value["resetFields"];
      resetFields();
    };
    //添加部门确认按钮
    const addDept = () => {
      const resetFields= addFormRef.value["validate"];
      resetFields(async (valid) => {
        if (!valid) {
          ElMessage({
            type: "error",
            message: "请检查数据是否正确"
          });
          return;
        }
        if(data.addForm.isManagerStr==="是"){
          data.addForm.isManager = true
        }else{
          data.addForm.isManager = false
        }
        const {data: res} = await api_addUser(data.addForm);
        if (res.meta.code !== 200) {
          return ElMessage({
            type: "error",
            message: "id或用户名重复"
          });
        }
        ElMessage({
          type: "success",
          message: "添加管理员权限成功"
        });
        data.addDialogVisible = false;
        getUserList();
      });

    };
    //显示编辑部门的对话框
    const showEditDialog = async (id) => {
      data.editDialogVisible = true;
      const {data: res} = await api_getUserByID(id);
      if (res.meta.code !== 200) {
        ElMessage({
          type: "error",
          message: "请求失败"
        });
        return;
      }
      data.editForm = res.data[0];
      Object.keys(data.editForm).map(val => {
        data.editForm[val] = data.editForm[val].toString();
      });
      console.log("kkkkkkkkkkkkk", data.editForm);
    };
    //监听修改部门对话框的关闭事件
    const editFormRef = ref(null);
    //重置编辑
    const editDialogClosed = () => {
      const resetFields= editFormRef.value["resetFields"];
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
        if(data.editForm.isManagerStr==="是"){
          data.editForm.isManager = true
        }else{
          data.editForm.isManager = false
        }
        const {data: res} = await api_editUser(data.editForm);
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
          message: "修改管理员信息成功"
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
        const {data: res} = await api_removeUser(id);
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