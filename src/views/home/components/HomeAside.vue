<template>
  <!--菜单-->
  <el-menu
      :uniqueOpened="true"
      background-color="#333744"
      text-color="#fff"
      active-text-color="#4af"
      :collapse="isCollapse"
      :collapse-transition="false"
      :router="true"
  >
    <!--一级菜单-->
    <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
      <template #title>
        <i :class="iconsObj[item.id]"></i>
        <span>{{ item.authName }}</span>
      </template>
      <!--二级菜单-->
      <el-menu-item :index="`/${subitem.path}`" v-for="subitem in item.children" :key="subitem.id">
        <template #title>
          <i class="el-icon-menu"></i>
          <span>{{ subitem.authName }}</span>
        </template>
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs, onBeforeMount, computed} from "vue";
import {api_getMenu} from "@/utils/api/home/homeApi";
import {ElMessage} from "element-plus";
import {homeAsideDate} from "@/utils/interface/home/home";

export default defineComponent({
  name: "HomeAside",
  props: {
    isCollapse: Boolean
  },
  setup(props) {
    const data: homeAsideDate = reactive({
      menuList: [],
      iconsObj: {
        "125": "iconfont icon-user",
        "103": "iconfont icon-tijikongjian",
        "101": "iconfont icon-shangpin",
        "102": "iconfont icon-danju",
        "145": "iconfont icon-baobiao"
      },
    });
    onBeforeMount(async () => {
      const {data: res} = await api_getMenu();
      console.log(res);
      if (res.meta.status !== 200) return ElMessage.error(res.meta.msg);
      data.menuList = res.data;
    });
    //控制侧边栏折叠展开方法
    const isCollapse = computed(() => props.isCollapse);
    console.log(isCollapse.value);
    return {
      ...toRefs(data),
      isCollapse
    };
  }
});
</script>

<style scoped>
.el-menu {
  border-right: none;
}

.iconfont {
  margin-right: 10px;
}

</style>