<template>
  <div>
    <!--  面包屑导航区域  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>信息管理</el-breadcrumb-item>
      <el-breadcrumb-item>部门信息管理</el-breadcrumb-item>
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
          <el-button type="primary" @click="addDialogVisible=true">添加部门</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="deptList"  stripe>
        <el-table-column label="部门id" prop="id"></el-table-column>
        <el-table-column label="部门名称" prop="name"></el-table-column>
        <el-table-column label="部门等级" prop="grade"></el-table-column>
        <el-table-column label="创建时间" prop="created"></el-table-column>
        <el-table-column label="修改时间" prop="changed"></el-table-column>
        <el-table-column label="版本号" prop="version"></el-table-column>
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
      title="添加部门"
      v-model="addDialogVisible"
      width="50%"
      @close="addDialogClosed">
    <div>
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="id" prop="id">
          <el-input v-model="addForm.id"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="等级" prop="grade">
          <el-input v-model="addForm.grade"></el-input>
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
      <el-form-item label="名称" prop="name">
        <el-input v-model="editForm.name"></el-input>
      </el-form-item>
      <el-form-item label="等级" prop="grade">
        <el-input v-model="editForm.grade"></el-input>
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

<script lang="ts">
import {defineComponent, onBeforeMount, reactive, toRefs, ref} from "vue";
import {api_getDept, api_addDept, api_getDeptByID, api_editPlus, api_removeDept} from "@/utils/api/dept/dept";
import {deptData} from "@/utils/interface/dept/dept";
import {ElMessage, ElMessageBox} from "element-plus";
import moment from "moment";

export default defineComponent({
  name: "dept",
  setup() {
    const data: deptData = reactive({
      //查询
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2
      },
      deptList: [],
      total: 0,
      //增加
      addDialogVisible: false,
      addForm: {
        id: "",
        name: "",
        grade: "",
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
            message: "部门id在1-5个字符之间",
            trigger: "blur"
          }
        ],
        name: [
          {
            required: true,
            message: "请输入部门名称",
            trigger: "blur"
          },
          {
            min: 2,
            max: 8,
            message: "部门蒙城在2-8个字符之间",
            trigger: "blur"
          }
        ],
        grade: [
          {
            required: true,
            message: "请输入部门等级",
            trigger: "blur"
          },
          {
            min: 1,
            max: 3,
            message: "部门id在1-3个字符之间",
            trigger: "blur"
          }
        ],
      },
      //修改
      editDialogVisible: false,
      editForm: {
        id: "",
        name: "",
        grade: "",
      },
      editFormRules: {},
    });
    const getUserList = async () => {
      const {data: res} = await api_getDept(data.queryInfo);
      if (res.meta.code !== 200) {
        ElMessage({type: "error", message: "服务器开小差了", duration: 1800});
      }
      data.deptList = res.data.deptList;
      data.total = res.data.total;
      data.deptList.map(val => {
        const created = moment(val.created).format("YYYY/MM/DD");
        const changed = moment(val.changed).format("YYYY/MM/DD");
        val.created = created;
        val.changed = changed;
      });
      console.log(res);
    };
    onBeforeMount(async () => {
      await getUserList();
    });
    //监听 pageSize 改变的事件
    const handleSizeChange = (newSize: any) => {
      // console.log(newSize);
      data.queryInfo.pagesize = newSize;
      getUserList();
    };
    //监听页码值改变的事件
    const handleCurrentChange = (newPage: any) => {
      // console.log(newPage);
      data.queryInfo.pagenum = newPage;
      getUserList();
    };
    //监听添加部门对话框的关闭时间
    const addFormRef = ref(null);
    //重置
    const addDialogClosed = () => {
      const resetFields: () => void = addFormRef.value!["resetFields"];
      resetFields();
    };
    //添加部门确认按钮
    const addDept = () => {
      const resetFields: (valid: any) => void = addFormRef.value!["validate"];
      resetFields(async (valid: boolean) => {
        if (!valid) {
          ElMessage({
            type: "error",
            message: "请检查数据是否正确"
          });
          return;
        }
        const {data: res} = await api_addDept(data.addForm);
        if (res.meta.code !== 200) {
          return ElMessage({
            type: "error",
            message: "部门id或部门名重复"
          });
        }
        ElMessage({
          type: "success",
          message: "添加部门成功"
        });
        data.addDialogVisible = false;
        getUserList();
      });

    };
    //显示编辑部门的对话框
    const showEditDialog = async (id: any) => {
      data.editDialogVisible = true;
      const {data: res} = await api_getDeptByID(id);
      if (res.meta.code !== 200) {
        ElMessage({
          type: "error",
          message: "请求失败"
        });
        return;
      }
      data.editForm = res.data[0];
      data.editForm.grade! = data.editForm.grade!.toString();
      console.log("xxx", res.data[0]);
    };
    //监听修改部门对话框的关闭事件
    const editFormRef = ref(null);
    //重置编辑
    const editDialogClosed = () => {
      const resetFields: () => void = editFormRef.value!["resetFields"];
      resetFields();
    };
    //修改部门信息并提交
    const editDept = () => {
      const validate: (valid: any) => void = editFormRef.value!["validate"];
      validate(async (valid: boolean) => {
        if (!valid) {
          ElMessage({
            type: "error",
            message: "请检查数据是否正确"
          });
          return;
        }
        const {data: res} = await api_editPlus(data.editForm);
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
          message: "修改部门信息成功"
        });
      });
    };
    //根据id删除对应部门信息
    const removeDeptById = async (id: number) => {
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
        const {data: res} = await api_removeDept(id);
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