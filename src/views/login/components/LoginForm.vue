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
  <!-- 验证码区域 -->
  <div class="testCode">
    <s-identify :identifyCode="identifyCode" @click="refreshCode"/>
    <input v-model="inputCode" class="testCode_input" maxlength="4"/>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  nextTick,
  ref
} from "vue";
import SIdentify from "@/views/login/components/identify.vue";
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
  components: {
    SIdentify
  },
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

    //验证码区域
    let myData = reactive({
      identifyCode: "",
      identifyCodes: "1234567890ABCDEFGHIGKLMNoPQRSTUVWXYZ",
      inputCode: ''
    });
    // 生成随机数
    let randomNum = (min: number, max: number) => {
      return Math.floor(Math.random() * (max - min) + min);
    };
    // 生成四位随机验证码
    let makeCode = (o: string, l: number) => {
      for (let i = 0; i < l; i++) {
        myData.identifyCode += myData.identifyCodes[randomNum(0, myData.identifyCodes.length)];
      }
      console.log(myData.identifyCode);
    };
    // 切换验证码
    let refreshCode = () => {
      myData.identifyCode = "";
      makeCode(myData.identifyCodes, 4);
    };
    //重置方法
    const reset = async () => {
      await nextTick();
      //element-plus上的form有resetFields方法,用于重置
      const resetFields: () => void = loginFormRef.value!["resetFields"];
      resetFields();
    };
    const login = async () => {
      if(myData.identifyCode.toLowerCase() !== myData.inputCode.toLowerCase()){
        ElMessage({type: "error", message: "验证码错误", duration: 1800});
        return
      }
      await nextTick();
      //element-plus的form上有validate方法
      const validate: (callback?: (valid: boolean) => void) => void = loginFormRef.value!["validate"];
      validate(async valid => {
        if (!valid) return;
        //发送登录网络请求
        const {data: res} = await api_login(data.loginForm);
        console.log('login:',res);
        if (res.meta.code !== 200) return ElMessage({type: "error", message: "登录失败", duration: 1800});
        ElMessage({type: "success", message: "登录成功", duration: 1800});
        //登录成功后将token保存到session
        window.sessionStorage.setItem("token", res.data.token);
        setTimeout(() => {
          router.push("/home");
        }, 2000);


      });
    };


    refreshCode();
    return {
      ...toRefs(data),
      loginFormRef,
      reset,
      login,
      ...toRefs(myData),
      makeCode,
      refreshCode
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
  flex-wrap: nowrap;
}
.testCode{
  display: flex;
  position: absolute;
  bottom: 17px;
  left: 18px;
  .testCode_input{
    position: relative;
    left: 10px;
    width: 105px;
    height: 32px;
  }
}

</style>