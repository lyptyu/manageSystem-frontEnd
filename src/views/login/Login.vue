<template>
  <div class="container">
    <div class="login_title">工资考勤管理系统</div>
    <div class="box">
      <!--头像区域-->
      <div class="avatar">
        <img src="../../assets/img/logo.png" alt="">
      </div>
      <!-- 登录表单区域 -->
      <login-form/>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent,reactive,toRefs} from "vue";
import LoginForm from "@/views/login/components/LoginForm.vue";

export default defineComponent({
  name: "Login",
  components: {
    LoginForm,

  },
  setup(){


  }
});
</script>

<style scoped lang="scss">
.container {
  background-color: #616161;
  background-image: url("../../assets/img/loginBGIMG.jpg");
  background-size: 100% 100%;
  height: 100%;
  position: relative;
}

.box {
  width: 450px;
  height: 300px;
  background-color: rgba(0, 0, 0, .6);
  border-radius: 5px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar {
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 120px;
    width: 120px;
    border: 1px solid #ddd;
    border-radius: 50%;
    padding: 5px;
    box-shadow: 0 0 10px #ddd;
    background-color: #fff;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #fff;
    }
  }
}
.login_title{
  color: white;
  font-size: 80px;
  width: 100%;
  text-align: center;
}
</style>