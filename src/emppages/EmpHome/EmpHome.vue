<template>
  <el-container class="home_container">
    <!--头部区域-->
    <el-header>
      <home-header/>
    </el-header>
    <!--页面主体区域-->
    <el-container>
      <!--侧边栏区域-->
      <el-aside :width="isCollapse?'64px':'200px'">
        <!--控制菜单折叠隐藏的小按钮-->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!--菜单内容-->
        <home-aside :is-collapse="isCollapse"/>
      </el-aside>
      <!--主体内容-->
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import {reactive, toRefs, defineComponent} from "vue";
import HomeHeader from "@/emppages/EmpHome/components/HomeHeader.vue";
import HomeAside from "@/emppages/EmpHome/components/HomeAside.vue";
import {homeDate} from "@/utils/interface/home/home";
import { useRouter } from "vue-router";//引入路由
export default defineComponent({
  name: "Home",
  components: {
    HomeHeader,
    HomeAside
  },
  setup() {
    const router = useRouter();
    const data: homeDate = reactive({
      //是否折叠
      isCollapse: false,
      id:router.currentRoute.value.query.id
    });
    const toggleCollapse = () => {
      data.isCollapse = !data.isCollapse;
    };
    return {
      ...toRefs(data),
      toggleCollapse
    };
  }
});
</script>

<style scoped lang="scss">

.el-aside {
  background-color: #333744;
}

.el-main {
  background-color: #eaedf1;
}

.el-header {
  display: flex;
  background-color: #373d41;
  padding-left: 8px;
  color: #fff;
  align-items: center;
}

.home_container {
  height: 100%;
}

.toggle-button {
  background-color: #4a5060;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>