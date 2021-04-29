<template>
  <div id="app">
    <!--路由占位符-->
    <router-view/>
  </div>
</template>

<script lang="ts">
import {defineComponent , provide } from 'vue'
import * as echarts from 'echarts'
export default defineComponent({
  name: "App",
  setup(){
    provide('ec',echarts)
  },
  components: {}
})
</script>

<style>
</style>
