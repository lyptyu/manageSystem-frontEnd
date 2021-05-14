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
      <el-table :data="deptList" stripe>
        <el-table-column label="部门id" prop="id"></el-table-column>
        <el-table-column label="部门名称" prop="name"></el-table-column>
        <el-table-column label="部门等级" prop="grade"></el-table-column>
        <el-table-column label="创建时间" prop="created"></el-table-column>
        <el-table-column label="修改时间" prop="changed"></el-table-column>
        <el-table-column label="岗位信息">
          <template #default="scope">
            <!-- 查看 -->
            <el-button size="mini" type="warning"
                       @click="showRoleInDept(scope.row.id)">查看
            </el-button>
          </template>
        </el-table-column>
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
          :page-sizes="[10, 20, 50, 100]"
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
      <el-form :model="addForm" :rules="addFormRules" ref="addRoleFormRef" label-width="70px">
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
  <!-- 查看岗位信息 -->
  <el-dialog
      title="查看岗位信息"
      v-model="showRoleDialog"
      width="50%"
      @close="roleDialogClosed">
    <el-row :gutter="20">
      <el-col :span="4">
        <el-button type="primary" @click="addRole">添加岗位</el-button>
      </el-col>
    </el-row>
    <el-table :data="roleListInDept" stripe>
      <el-table-column label="岗位id" prop="id"></el-table-column>
      <el-table-column label="岗位名称" prop="name" width="120px"></el-table-column>
      <el-table-column label="岗位等级" prop="rank"></el-table-column>
      <el-table-column label="操作" width="120px">
        <template #default="scope">
          <!-- 修改 -->
          <el-button size="mini" type="info" icon="el-icon-edit" @click="showRoleEditDialog(scope.row.id)"></el-button>
          <!-- 删除 -->
          <el-button size="mini" type="danger" icon="el-icon-delete"
                     @click="removeRoleById(scope.row.id)"></el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
  <!-- 添加岗位 -->
  <el-dialog
      title="添加岗位"
      v-model="addRoleDialogVisible"
      width="50%"
      @close="addRoleDialogVisible = false">
    <div>
      <el-form :model="addRoleForm" :rules="addRoleFormRules" ref="addFormRef" label-width="80px">
        <el-form-item label="id" prop="id">
          <el-input v-model="addRoleForm.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="addRoleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="等级" prop="rank">
          <el-input v-model="addRoleForm.rank"></el-input>
        </el-form-item>
        <el-form-item label="来自部门" prop="from">
          <el-input v-model="addRoleForm.from" disabled></el-input>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
    <span class="dialog-footer">
      <el-button @click="addRoleDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addRoleConfirm(addRoleForm)">确 定</el-button>
    </span>
    </template>
  </el-dialog>
  <!-- 修改岗位 -->
  <el-dialog
      title="部门信息修改"
      v-model="editRoleDialogVisible"
      width="50%"
      @close="editRoleDialogVisible = false">
    <el-form :model="editRoleForm" :rules="editRoleFormRules" ref="editRoleFormRef" label-width="80px">
      <el-form-item label="id" type="number">
        <el-input v-model="editRoleForm.id" disabled></el-input>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="editRoleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="等级" prop="rank">
        <el-input v-model="editRoleForm.rank"></el-input>
      </el-form-item>
      <el-form-item label="来自部门" prop="from">
        <el-input v-model="editRoleForm.from" disabled></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
    <span class="dialog-footer">
      <el-button @click="editRoleDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="editRoleConfirm">确 定</el-button>
    </span>
    </template>
  </el-dialog>
</template>

<script>
import {defineComponent, onBeforeMount, reactive, toRefs, ref} from "vue";
import {
  api_getDept,
  api_addDept,
  api_getDeptByID,
  api_editPlus,
  api_removeDept,
  api_getRole, api_addRole, api_getRoleById, api_editRole, api_removeRole
} from "@/utils/api/dept/dept";
import {deptData} from "@/utils/interface/dept/dept";
import {ElMessage, ElMessageBox} from "element-plus";
import moment from "moment";

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
            message: "部门名称在2-8个字符之间",
            trigger: "blur"
          }
        ],
        rank: [
          {
            required: true,
            message: "请输入岗位等级",
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
      showRoleDialog: false,
      roleListInDept: [],
      addRoleDialogVisible: false,
      addRoleForm: {
        id: "",
        from: "",
        rank: "",
        name: ""
      },
      addRoleFormRules: {
        id: [
          {
            required: true,
            message: "请输入id",
            trigger: "blur"
          },
          {
            min: 1,
            max: 5,
            message: "岗位id在1-5个字符之间",
            trigger: "blur"
          }
        ],
        name: [
          {
            required: true,
            message: "请输入岗位名称",
            trigger: "blur"
          },
          {
            min: 2,
            max: 8,
            message: "部门蒙城在2-8个字符之间",
            trigger: "blur"
          }
        ],
        rank: [
          {
            required: true,
            message: "请输入岗位等级",
            trigger: "blur"
          },
          {
            min: 1,
            max: 3,
            message: "部门id在1-3个字符之间",
            trigger: "blur"
          }
        ],
        from: [

          {
            required: true,
            message: "请输入岗位等级",
            trigger: "blur"
          },

        ]
      },
      roleTotal: 0,
      deptName: "",
      deptId: 0,
      editRoleDialogVisible: false,
      editRoleForm: {
        id: "",
        from: "",
        rank: "",
        name: ""
      },
      editRoleFormRules: {
        id: [
          {
            required: true,
            message: "请输入id",
            trigger: "blur"
          },
          {
            min: 1,
            max: 5,
            message: "岗位id在1-5个字符之间",
            trigger: "blur"
          }
        ],
        name: [
          {
            required: true,
            message: "请输入岗位名称",
            trigger: "blur"
          },
          {
            min: 2,
            max: 8,
            message: "岗位名称在2-8个字符之间",
            trigger: "blur"
          }
        ],
        rank: [
          {
            required: true,
            message: "请输入岗位等级",
            trigger: "blur"
          },
          {
            min: 0,
            max: 3,
            message: "岗位等级在1-3个字符之间",
            trigger: "blur"
          }
        ],
        from: [

          {
            required: true,
            message: "请输入岗位等级",
            trigger: "blur"
          },

        ]
      },
    });
    const getUserList = async () => {
      const {data: res} = await api_getDept(data.queryInfo);
      if (res.meta.code !== 200) {
        ElMessage({type: "error", message: "服务器开小差了", duration: 1800});
      }
      data.deptList = res.data.deptList;
      data.total = res.data.total;
      data.deptList.map((val) => {
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
    const addDept = () => {
      const resetFields = addFormRef.value["validate"];
      resetFields(async (valid) => {
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
    const showEditDialog = async (id) => {
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
      data.editForm.grade = data.editForm.grade.toString();
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
    //查看岗位信息
    const showRoleInDept = async (id) => {
      data.showRoleDialog = true;
      let deptName = "";
      data.deptList.map(item => {
        if (item.id === id) {
          deptName = item.name;
        }
      });
      data.deptName = deptName
      data.deptId = id
      console.log(id, deptName);
      const res = await api_getRole();
      let roleList = res.data.data.roleList;
      let roleTotal = res.data.data.total
      console.log("res", res);
      let roleListInDept = roleList.filter((item) => {
        console.log("from", item.from, deptName)
        return item.from === deptName;
      });

      data.roleTotal = roleTotal
      data.roleListInDept = roleListInDept
      console.log("roleListInDept", roleListInDept, roleTotal);
    };
    //关闭岗位信息
    const roleDialogClosed = () => {
      data.showRoleDialog = false;
    };
    const editRole = () => {
      data.showRoleDialog = false;
    };
    //添加岗位按钮
    const addRole = () => {
      data.addRoleDialogVisible = true
      let total = data.roleTotal
      data.addRoleForm.id = total + 1
      data.addRoleForm.from = data.deptName
    }
    //确认添加岗位
    const addRoleConfirm = async () => {
      const res = await api_addRole(data.addRoleForm);
      console.log("addRoleConfirmRes", res)
      await showRoleInDept(data.deptId)
      data.addRoleDialogVisible = false
    }
    //编辑岗位
    const showRoleEditDialog = async (id) => {
      data.editRoleDialogVisible = true;
      const res = await api_getRoleById(id);
      let editRes = res.data.data[0]
      console.log("showRoleEditDialogRes", editRes.id)
      data.editRoleForm.id = editRes.id
      data.editRoleForm.name = editRes.name
      data.editRoleForm.rank = editRes.rank.toString()
      data.editRoleForm.from = editRes.from
    }
    const editRoleConfirm = async () => {
      const res = await api_editRole(data.editRoleForm)
      console.log("editRoleConfirm", res)
      await showRoleInDept(data.deptId)
      data.editRoleDialogVisible = false
    }
    //删除岗位
    const removeRoleById = async (id)=>{
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
        const {data: res} = await api_removeRole(id);
        if (res.meta.code !== 200) {
          return ElMessage({
            type: "error",
            message: "删除失败"
          });
        }
        await showRoleInDept(data.deptId)
        return ElMessage({
          type: "success",
          message: "删除成功"
        });
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
      removeDeptById,
      showRoleInDept,
      roleDialogClosed,
      editRole,
      addRole,
      addRoleConfirm,
      showRoleEditDialog,
      editRoleConfirm,
      removeRoleById
    };
  }

});
</script>

<style scoped lang="scss">

</style>