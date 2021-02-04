//表单接口
interface loginForm {
  username: string;
  password: string;
}

//验证表单时每条数据验证内容的接口
interface singleRule {
  required?: boolean;
  message?: string;
  trigger?: string;
  min?: number;
  max?: number;
}

//表单验证接口
interface loginFormRules {
  username: Array<singleRule>;
  password: Array<singleRule>;
}

//data的接口
interface loginData {
  loginForm: loginForm,
  loginFormRules: loginFormRules,
}

export {
  loginForm,
  singleRule,
  loginFormRules,
  loginData
};