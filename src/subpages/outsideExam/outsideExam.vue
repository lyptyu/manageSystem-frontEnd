<template>
  <div>
    <!--  面包屑导航区域  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>审批管理</el-breadcrumb-item>
      <el-breadcrumb-item>出差审批</el-breadcrumb-item>
    </el-breadcrumb>
    <!--  卡片视图区域  -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="9">
          <!--  搜索框和添加区域  -->
          <el-input placeholder="请输入内容" v-model="filterName" clearable @clear="getUserList">
            <template #append>
              <el-button icon="el-icon-search" @click="filterByName(filterName)"></el-button>
            </template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <!--          <el-button type="primary" @click="addDialogVisible=true">添加状态</el-button>-->
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="outsideApplyList" stripe>
        <el-table-column label="id" prop="id"></el-table-column>
        <el-table-column label="员工id" prop="employee_id"></el-table-column>
        <el-table-column label="员工姓名" prop="employee_name"></el-table-column>
        <el-table-column label="开始时间" prop="startDate"></el-table-column>
        <el-table-column label="结束时间" prop="endDate"></el-table-column>
        <el-table-column label="出差天数" prop="days"></el-table-column>
        <el-table-column label="出发地" prop="fromArea"></el-table-column>
        <el-table-column label="目的地" prop="toArea"></el-table-column>
        <el-table-column label="出差津贴" prop="extraMoney"></el-table-column>
        <el-table-column label="审批状态" prop="isExam"></el-table-column>
        <el-table-column label="操作" width="120px">
          <template #default="scope">
            <!-- 修改 -->
            <el-button size="mini" type="warning" @click="showEditDialog(scope.row.id)">审批/查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
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
        <el-form-item label="迟到早退" prop="later">
          <el-input v-model="addForm.later"></el-input>
        </el-form-item>
        <el-form-item label="缺勤旷工" prop="absent">
          <el-input v-model="addForm.absent"></el-input>
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
      title="出差审批/查看"
      v-model="editDialogVisible"
      width="50%"
      @close="editDialogClosed">
    <el-form :model="editForm" ref="editFormRef" label-width="70px">
      <el-form-item label="id" prop="id">
        <el-input v-model="editForm.id" disabled></el-input>
      </el-form-item>
      <el-form-item label="员工id" prop="employee_id">
        <el-input v-model="editForm.employee_id" disabled></el-input>
      </el-form-item>
      <el-form-item label="出发时间" prop="startTime">
        <el-input v-model="editForm.startDate" disabled></el-input>
      </el-form-item>
      <el-form-item label="返程时间" prop="endTime">
        <el-input v-model="editForm.endDate" disabled></el-input>
      </el-form-item>
      <el-form-item label="出差天数" prop="days">
        <el-input v-model="editForm.days" disabled></el-input>
      </el-form-item>
      <el-form-item label="出发地" prop="fromArea">
        <el-input v-model="editForm.fromArea" disabled></el-input>
      </el-form-item>
      <el-form-item label="目的地" prop="toArea">
        <el-input v-model="editForm.toArea" disabled></el-input>
      </el-form-item>
      <el-form-item label="审批状态" prop="toArea">
        <el-input v-model="editForm.isExam" disabled></el-input>
      </el-form-item>

      <el-form-item label="出差津贴" prop="extraMoney">
        <el-input v-model="editForm.extraMoney" disabled></el-input>
      </el-form-item>

    </el-form>
    <template #footer>
    <span class="dialog-footer">
      <el-button @click="editDialogVisible = false">取 消</el-button>
      <el-button type="success" @click="examPass">审批通过</el-button>
      <el-button type="danger" @click="examDeny">审批拒绝</el-button>
    </span>
    </template>
  </el-dialog>
</template>

<script>
import {defineComponent, onBeforeMount, reactive, toRefs, ref} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";
import {
  api_getEmployeeByID,
} from "@/utils/api/employee/empolyee";


import {
  api_getStatusList,
  api_addStatus,
  api_getStatusByID,
  api_editStatus,
  api_removeStatus
} from "@/utils/api/status/status"
import {api_getOutsideApply, api_getOutsideApplyByID, api_editOutsideApply} from "@/utils/api/outside/outside"
import {
  api_editSalary,
  api_getBasicSalaryByEmployeeID,
  api_getBasicSalaryByID
} from "@/utils/api/basicSalary/basicSalary"

export default defineComponent({
  name: "dept",
  setup() {

    const data = reactive({

      //查询
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10000
      },
      outsideApplyList: [],
      total: 0,
      //增加
      addDialogVisible: false,
      addForm: {
        id: "",
        employee_id: "",
        later: "",
        absent: "",
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
        later: [
          {
            required: true,
            message: "请输入员工迟到早退次数",
            trigger: "blur"
          },
          {
            min: 1,
            max: 2,
            message: "请输入1-30之间的数字",
            trigger: "blur"
          }
        ],
        absent: [
          {
            required: true,
            message: "请输入缺勤旷工次数",
            trigger: "blur"
          },
          {
            min: 1,
            max: 8,
            message: "请输入1-30之间的数字",
            trigger: "blur"
          }
        ],
      },
      //修改
      editDialogVisible: false,
      editForm: {
        id: "",
        employee_id: "",
        later: "",
        absent: "",
        startDate: "",
        endDate: "",
        days: "",
        fromArea: "",
        toArea: "",
        isExam: "",
        extraMoney: ""
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
        later: [
          {
            required: true,
            message: "请输入迟到早退次数",
            trigger: "blur"
          },
          {
            min: 1,
            max: 2,
            message: "请输入1-30之间的数字",
            trigger: "blur"
          }
        ],
        absent: [
          {
            required: true,
            message: "请输入缺勤旷工次数",
            trigger: "blur"
          },
          {
            min: 1,
            max: 2,
            message: "员工姓名在1-30个字符之间",
            trigger: "blur"
          }
        ],
      },
      filterName: ""
    });
    const getUserList = async () => {
      const {data: res} = await api_getOutsideApply(data.queryInfo);
      if (res.meta.code !== 200) {
        ElMessage({type: "error", message: "服务器开小差了", duration: 1800});
      }
      data.outsideApplyList = res.data.outsideApplyList;
      data.total = res.data.total;
      let promiseList = data.outsideApplyList.map(async val => {

        const {data: res2} = await api_getEmployeeByID(val.employee_id)
        val.employee_name = res2.data[0].name
      })
      await Promise.all(promiseList)
    };
    onBeforeMount(async () => {
      await getUserList();
      console.log("data.outsideApplyList", data.outsideApplyList)
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

      const {data: res} = await api_addStatus(data.addForm);
      if (res.meta.code !== 200) {
        return ElMessage({
          type: "error",
          message: "员工id或id重复"
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
      const {data: res} = await api_getOutsideApplyByID(id);
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
      console.log("data.editForm1", data.editForm)
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
        const {data: res} = await api_editStatus(data.editForm);
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
        const {data: res} = await api_removeStatus(id);
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
    const examPass = async () => {
      if (data.editForm.isExam !== "未审批") {
        ElMessage({
          type:'error',
          message: "您已经审批过啦~",
          duration: 1500
        })
        return
      }
      data.editForm.isExam = "审批通过"
      await api_editOutsideApply(data.editForm)
      const res = await api_getBasicSalaryByEmployeeID(data.editForm.employee_id)
      console.log("examPass", res.data.data[0])
      let newSalary = JSON.parse(JSON.stringify(res.data.data[0]));
      newSalary.outsideMoney += Number(data.editForm.extraMoney);
      console.log("newSalary", newSalary, "xx", data.editForm.extraMoney)
      await api_editSalary(newSalary)
      data.editDialogVisible = false
      await getUserList()

    }
    const examDeny = async () => {
      if (data.editForm.isExam !== "未审批") {
        ElMessage({
          type:'error',
          message: "您已经审批过啦~",
          duration: 1500
        })
        return
      }
      data.editForm.isExam = "审批拒绝"
      await api_editOutsideApply(data.editForm)
      data.editDialogVisible = false
      await getUserList()
    }
    const filterByName = async (name) => {
      await getUserList()
      let filterList = data.outsideApplyList.filter(item => item.employee_name.indexOf(name) >= 0)
      data.outsideApplyList = filterList
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
      examPass,
      examDeny,
      filterByName
    };

  }

});
</script>

<style scoped lang="scss">

</style>