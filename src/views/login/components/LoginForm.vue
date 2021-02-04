<template>
  <el-form
      ref="loginFormRef"
      label-width="0px"
      class="login_form"
      :model="loginForm"
      :rules="loginFormRules">
    <!--用户名-->
    <el-form-item prop="username">
      <el-input
          v-model="loginForm.username"
          prefix-icon="iconfont icon-user">
      </el-input>
    </el-form-item>
    <!--密码-->
    <el-form-item prop="password">
      <el-input
          v-model="loginForm.password"
          type="password"
          prefix-icon="iconfont icon-3702mima"></el-input>
    </el-form-item>
    <!--按钮区域-->
    <el-form-item class="btns">
      <el-button @click="login">登录</el-button>
      <el-button type="info" @click="reset">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  nextTick,
  ref
} from "vue";
import {useRouter} from "vue-router";
import {
  loginForm,
  singleRule,
  loginFormRules,
  loginData
} from "@/utils/interface/login/login";

import {api_login} from "@/utils/api/login/loginApi";
import {ElMessage} from "element-plus";

export default defineComponent({
  setup() {
    const router = useRouter();
    const data: loginData = reactive({
      loginForm: {
        username: "admin",
        password: "123456"
      },
      //表单验证规则
      loginFormRules: {
        username: [
          {required: true, message: "请输入用户名", trigger: "blur"},
          {min: 3, max: 10, message: "用户名长度在 3 到 10 个字符之间", trigger: "blur"}
        ],
        password: [
          {required: true, message: "请输入密码", trigger: "blur"},
          {min: 6, max: 15, message: "密码长度在 6 到 15 个字符之间", trigger: "blur"}
        ]
      }
    });
    const loginFormRef = ref(null);
    //重置方法
    const reset = async () => {
      await nextTick();
      //element-plus上的form有resetFields方法,用于重置
      const resetFields: () => void = loginFormRef.value!["resetFields"];
      resetFields();
    };
    const login = async () => {
      await nextTick();
      //element-plus的form上有validate方法
      const validate: (callback?: (valid: boolean) => void) => void = loginFormRef.value!["validate"];
      validate(async valid => {
        if (!valid) return;
        //发送登录网络请求
        const {data: res} = await api_login(data.loginForm);
        console.log(res);
        if (res.meta.status !== 200) return ElMessage({type: "error", message: "登录失败", duration: 1800});
        ElMessage({type: "success", message: "登录成功", duration: 1800});
        //登录成功后将token保存到session
        window.sessionStorage.setItem("token", res.data.token);
        setTimeout(() => {
          router.push("/home");
        }, 2000);


      });
    };
    return {
      ...toRefs(data),
      loginFormRef,
      reset,
      login
    };
  }
});
</script>

<style scoped lang="scss">
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box
}

.btns {
  display: flex;
  justify-content: flex-end;
}

</style>