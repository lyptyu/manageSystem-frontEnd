<template>
  <div>
    <!--  面包屑导航区域  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>工资管理</el-breadcrumb-item>
      <el-breadcrumb-item>实发工资管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!--  卡片视图区域  -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="9">
          <!--  搜索框和添加区域  -->
          <el-input
              placeholder="请输入内容"
              v-model="queryInfo.query"
              clearable
              @clear="getUserList"
          >
            <template #append>
              <el-button icon="el-icon-search" @click="getUserList"></el-button>
            </template>
          </el-input>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="realList" stripe>
        <el-table-column label="员工id" prop="id"></el-table-column>
        <el-table-column label="员工姓名" prop="name"></el-table-column>
        <el-table-column label="迟到早退" prop="later"></el-table-column>
        <el-table-column label="缺勤旷工" prop="absent"></el-table-column>
        <el-table-column label="实发工资" prop="real"></el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import {defineComponent, onBeforeMount, reactive, toRefs} from "vue";
import {api_getReal} from "@/utils/api/real/real"
import {api_getEmployeeByID} from "@/utils/api/employee/empolyee"
import {ElMessage} from "element-plus";

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
      realList: [],
      total: 0,
    });
    const getUserList = async () => {
      const {data: res} = await api_getReal(data.queryInfo);
      if (res.meta.code !== 200) {
        ElMessage({type: "error", message: "服务器开小差了", duration: 1800});
      }
      data.realList = res.data.realList;
      data.total = res.data.total;
      data.realList.map(async val => {
        const employeeInfo = await api_getEmployeeByID(val.employee_id)
        const name = employeeInfo.data.data[0].name
        val.name = name
      })
      // console.log(res);
    };
    onBeforeMount(async () => {
      await getUserList();
    });
    //监听 pageSize 改变的事件
    const handleSizeChange = newSize => {
      // console.log(newSize);
      data.queryInfo.pagesize = newSize;
      getUserList();
    };
    //监听页码值改变的事件
    const handleCurrentChange = newPage => {
      // console.log(newPage);
      data.queryInfo.pagenum = newPage;
      getUserList();
    };

    return {
      ...toRefs(data),
      handleSizeChange,
      handleCurrentChange,
      getUserList,

    };
  }
});
</script>

<style scoped lang="scss">
</style>