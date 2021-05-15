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
              v-model="searchTime"
              clearable
              @clear="getUserList"
          >
            <template #append>
              <el-button icon="el-icon-search" @click="filterByTime(searchTime)"></el-button>
            </template>
          </el-input>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="realList" stripe>
        <el-table-column label="时间" prop="date"></el-table-column>
        <el-table-column label="员工id" prop="id"></el-table-column>
        <el-table-column label="员工姓名" prop="name"></el-table-column>
        <el-table-column label="基础工资" prop="basic"></el-table-column>
        <el-table-column label="迟到早退" prop="later"></el-table-column>
        <el-table-column label="缺勤旷工" prop="absent"></el-table-column>
        <el-table-column label="公积金比例" prop="fiveOneRate"></el-table-column>
        <el-table-column label="全勤奖金" prop="full_overtime"></el-table-column>
        <el-table-column label="是否全勤" prop="isFull_OvertimeStr"></el-table-column>
        <el-table-column label="项目奖金" prop="project"></el-table-column>
        <el-table-column label="出差津贴" prop="outsideMoney"></el-table-column>
        <el-table-column label="加班津贴" prop="moreWorkMoney"></el-table-column>
        <el-table-column label="个人所得税" prop="tax"></el-table-column>
        <el-table-column label="实发工资" prop="real"></el-table-column>
      </el-table>
      <!-- 分页区域 -->
    </el-card>
  </div>
</template>

<script>
import {defineComponent, onBeforeMount, reactive, toRefs} from "vue";
import {api_getReal} from "@/utils/api/real/real"
import {api_getEmployeeByID} from "@/utils/api/employee/empolyee"
import {ElMessage} from "element-plus";
import {useRouter} from "vue-router";

export default defineComponent({
  name: "dept",
  setup() {
    const router = useRouter()
    const data = reactive({
      //查询
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10000
      },
      realList: [],
      total: 0,
      id: router.currentRoute.value.query.id,
      searchTime:"2021.5"
    });
    const getUserList = async () => {
      const {data: res} = await api_getReal(data.queryInfo);
      if (res.meta.code !== 200) {
        ElMessage({type: "error", message: "服务器开小差了", duration: 1800});
      }
      data.realList = res.data.realList;
      data.total = res.data.total;
      let mypromise = data.realList.map(async val => {
        const employeeInfo = await api_getEmployeeByID(val.employee_id)
        const name = employeeInfo.data.data[0].name
        val.name = name
        val.isFull_OvertimeStr = val.isFull_Overtime ? "是" : "否"

      })
      await Promise.all(mypromise)
      data.realList = data.realList.filter(item => item.id === +data.id)
      console.log("realList", data.realList);
    };
    onBeforeMount(async () => {
      await getUserList();
      await filterByTime(data.searchTime)
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
    const filterByTime = async (time)=>{
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
        let realList = data.realList.filter(item => {
          let itemYear = item.date.split("-")[0]
          let itemMonth = item.date.split("-")[1]
          return itemYear === year && itemMonth === month
        })
        console.log("overtimeList", realList)
        data.realList = realList
      } else {
        ElMessage({
          type: "error",
          message: "请输入正确的年月"
        })
      }
      console.log(data.realList)

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