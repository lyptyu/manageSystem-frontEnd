<template>
  <div>
    <span class="welcome_title">欢迎使用本系统</span>

  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "welcome"
});
</script>

<style scoped lang="scss">
.welcome_title {
  font-size: 18px;
  font-weight: 500;
  color: rgba(0, 0, 0, .5);
}
</style>