<template>
  <div class="home_header">
    <div>
      <img src="../../../assets/img/logo.png" alt="" class="home_logo">
      <span>工资考勤管理系统</span>
    </div>
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {useRouter} from "vue-router";

export default defineComponent({
  name: "HomeHeader",
  setup() {
    const router = useRouter();
    const logout = () => {
      window.sessionStorage.clear();
      router.push("/login");
    };
    return {
      logout
    };
  }
});
</script>

<style scoped lang="scss">


.home_logo {
  width: 50px;
  height: 50px;
}
.home_header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;

    span {
      margin-left: 10px;
    }
  }
}
</style>