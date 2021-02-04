<template>
  <div>
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script lang="ts">
import {} from "vue";
import {useRouter} from "vue-router";

export default {
  name: "Home",
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
};
</script>

<style scoped lang="scss">

</style>