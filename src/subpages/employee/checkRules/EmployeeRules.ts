//验证邮箱的规则
const checkEmail = (rules:any, value:any, cb:any) => {
  const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
  if (regEmail.test(value) === true) {
    return cb()
  }

  cb(new Error("请输入合法邮箱"))
}
//验证手机号的规则
const checkMobile = (rules:any, value:any, cb:any) => {
  const regMobile = /^(0|86|17951)?(13[0-9]|15[12356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
  if (regMobile.test(value) === true) {
    return cb()
  }

  cb(new Error("请输入合法手机号"))
}
//验证性别规则
const checkGender = (rules:any, value:any, cb:any) => {
  if (value==1 || value==0) {
    return cb()
  }

  cb(new Error("请输入: 男性->1 | 女性->0"))
}
//验证学历规则
const checkEducation = (rules:any, value:any, cb:any) => {
  if (value==='中专' ||value==='大专' ||value==='本科' ||value==='硕士' ||value==='博士') {
    return cb()
  }

  cb(new Error("请输入正确学历:[中专,大专,本科,硕士,博士] "))
}
//验证工作经验规则
const checkExperience = (rules:any, value:any, cb:any) => {
  const regex= /^[0-9]+(.[0-9])?$/
  if (regex.test(value)===true) {
    return cb()
  }

  cb(new Error("请输入工作经验(年),结果为整数或者以为小数"))
}
export {
  checkGender,
  checkMobile,
  checkEmail,
  checkEducation,
  checkExperience
}