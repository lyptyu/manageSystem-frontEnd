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
          <el-input placeholder="请输入内容" v-model="searchTime" clearable @clear="getUserList">
            <template #append>
              <el-button icon="el-icon-search" @click="filterByTime(searchTime)"></el-button>
            </template>
          </el-input>
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

      </el-table>
      <!-- 分页区域 -->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[100, 200, 500, 1000]"
          :page-size="queryInfo.pagesize"
          layout=""
          :total="total">
      </el-pagination>
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

import {checkDate, checkStatus, checkTime} from "@/subpages/overtime/checkRules/overtimeRules"
import {useRouter} from "vue-router";

export default defineComponent({
  name: "dept",
  setup() {
    const router = useRouter();
    const data = reactive({
      id: router.currentRoute.value.query.id,
      searchTime: "",
      //查询
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10000
      },
      //展示

      overtimeList: [],
      total: 0,
    });
    const getUserList = async () => {
      const {data: res2} = await api_getEmployeeByID(data.id)
      data.queryInfo.query = res2.data[0].name
      const {data: res} = await api_getOvertime(data.queryInfo);
      if (res.meta.code !== 200) {
        ElMessage({type: "error", message: "服务器开小差了", duration: 1800});
      }
      data.overtimeList = res.data.overtimeList;
      data.total = res.data.total;
      data.overtimeList.map(async val => {

        const {data: res2} = await api_getEmployeeByID(data.id)
        val.employee_name = res2.data[0].name
        data.queryInfo.query = res2.data[0].name
      })
    };
    onBeforeMount(async () => {
      await getUserList();
      initSearchTime()
    });
    //初始化searchTime
    const initSearchTime = ()=>{
      let year = new Date().getFullYear()
      let month = new Date().getMonth()+1
      data.searchTime = `${year}.${month}`
      filterByTime(data.searchTime)
    }
    //监听 pageSize 改变的事件
    const handleSizeChange = (newSize) => {
      // console.log(newSize);
      data.queryInfo.pagesize = newSize;
      getUserList();
      filterByTime(data.searchTime)
    };
    //监听页码值改变的事件
    const handleCurrentChange = (newPage) => {
      // console.log(newPage);
      data.queryInfo.pagenum = newPage;
      getUserList();
      filterByTime(data.searchTime)
    };
    const filterByTime = async (time) => {
      const regDate = /^\d{4}(\-|\/|\.)\d{1,2}$/
      if (regDate.test(time)) {
        await getUserList();
        let devide = ""
        if (time.indexOf(".") >= 0) {
          devide = "."
        } else if (time.indexOf("/") > 0) {
          devide = "/"
        } else {
          devide = "-"
        }
        let year = time.split(devide)[0];
        let month = time.split(devide)[1];
        console.log(year, month)
        let overtimeList = data.overtimeList.filter(item => {
          let itemYear = item.date.split("-")[0]
          let itemMonth = item.date.split("-")[1]
          return itemYear === year && itemMonth === month
        })
        console.log("overtimeList", overtimeList)
        data.overtimeList = overtimeList
      } else {
        ElMessage({
          type: "error",
          message: "请输入正确的年月"
        })
      }
      console.log(data.overtimeList)
    }
    return {
      ...toRefs(data),
      handleSizeChange,
      handleCurrentChange,
      getUserList,
      filterByTime
    };

  }

});
</script>

<style scoped lang="scss">

</style>