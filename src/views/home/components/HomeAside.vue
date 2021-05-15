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
      :default-active="activePath"
  >
    <!--一级菜单-->
    <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
      <template #title>
        <i :class="iconsObj[item.id]"></i>
        <span>{{ item.authName }}</span>
      </template>
      <!--二级菜单-->
      <el-menu-item :index="`/${subitem.path}`" v-for="subitem in item.children" :key="subitem.id" @click="saveNavState(`/${subitem.path}`)">
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
        "101": "iconfont icon-user",
        "102": "iconfont icon-tijikongjian",
        "103": "iconfont icon-danju",
        "104": "iconfont icon-shangpin",
        "105": "iconfont icon-baobiao",
        "106": "el-icon-s-custom",
        "107": "iconfont icon-shangpin"
      },
      activePath:''  //被激活的链接地址
    });

    onBeforeMount(async () => {
      const {data: res} = await api_getMenu();
      // console.log('homeAside',res);
      if (res.meta.status !== 200) return ElMessage.error(res.meta.msg);
      data.activePath=window.sessionStorage.getItem('activePath')!
      data.menuList = res.data;


    });
    //控制侧边栏折叠展开方法
    const isCollapse = computed(() => props.isCollapse);
    console.log(isCollapse.value);
    //保存链接激活状态
    const saveNavState=(activePath:string)=>{
      window.sessionStorage.setItem('activePath',activePath)
      data.activePath=activePath
    }
    return {
      ...toRefs(data),
      isCollapse,
      saveNavState
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