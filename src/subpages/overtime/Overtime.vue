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
          <el-button type="primary" @click="addDialogVisible=true">添加考勤</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="overtimeList" stripe>
        <el-table-column label="id" prop="id"></el-table-column>
        <el-table-column label="员工id" prop="employee_id"></el-table-column>
        <el-table-column label="员工姓名" prop="employee_name"></el-table-column>
        <el-table-column label="打卡日期" prop="date"></el-table-column>
        <el-table-column label="上午打卡" prop="morning"></el-table-column>
        <el-table-column label="下午打卡" prop="afternoon"></el-table-column>
        <el-table-column label="考勤状态" prop="status"></el-table-column>
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
      title="添加考勤"
      v-model="addDialogVisible"
      width="50%"
      @close="addDialogClosed">
    <div>
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="id" prop="id">
          <el-input v-model="addForm.id"></el-input>
        </el-form-item>
        <el-form-item label="员工id" prop="employee_id">
          <el-input v-model="addForm.employee_id"></el-input>
        </el-form-item>
        <el-form-item label="考勤日期" prop="date">
          <el-input v-model="addForm.date"></el-input>
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
      <el-form-item label="员工id" prop="employee_id">
        <el-input v-model="editForm.employee_id" disabled></el-input>
      </el-form-item>
      <el-form-item label="考勤日期" prop="date">
        <el-input v-model="editForm.date"></el-input>
      </el-form-item>
      <el-form-item label="上班时间" prop="morning">
        <el-input v-model="editForm.morning"></el-input>
      </el-form-item>
      <el-form-item label="下班时间" prop="afternoon">
        <el-input v-model="editForm.afternoon"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-input v-model="editForm.status"></el-input>
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

import {checkDate, checkStatus, checkTime} from "@/subpages/overtime/checkRules/overtimeRules"

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
      overtimeList: [],
      total: 0,
      //增加
      addDialogVisible: false,
      addForm: {
        id: "",
        employee_id: "",
        date: "",
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
            validator:checkDate,
            trigger:'blur'
          }
        ],
        morning: [
          {
            required: true,
            message: "请输入员工上午打卡时间",
            trigger: "blur"
          },
          {
            validator:checkTime,
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
            validator:checkTime,
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
            validator:checkStatus,
            trigger: "blur"
          }
        ],
      },
      //修改
      editDialogVisible: false,
      editForm: {
        id: "",
        employee_id: "",
        date: "",
        morning: "",
        afternoon: "",
        status: "",
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
        date: [
          {
            required: true,
            message: "请输入日期",
            trigger: "blur"
          },
          {
            validator:checkDate,
            trigger:'blur'
          }
        ],
        morning: [
          {
            required: true,
            message: "请输入员工上午打卡时间",
            trigger: "blur"
          },
          {
            validator:checkTime,
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
            validator:checkTime,
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
            validator:checkStatus,
            trigger: "blur"
          }
        ],
      },
    });
    const getUserList = async () => {
      const {data: res} = await api_getOvertime(data.queryInfo);
      if (res.meta.code !== 200) {
        ElMessage({type: "error", message: "服务器开小差了", duration: 1800});
      }
      data.overtimeList = res.data.overtimeList;
      data.total = res.data.total;
      data.overtimeList.map(async val => {

        const {data: res2} = await api_getEmployeeByID(val.employee_id)
        val.employee_name = res2.data[0].name
      })
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
    //显示编辑部门的对话框
    const showEditDialog = async (id) => {
      data.editDialogVisible = true;
      const {data: res} = await api_getOvertimeByID(id);
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
        const {data: res} = await api_editOvertime(data.editForm);
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
        const {data: res} = await api_removeOvertime(id);
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