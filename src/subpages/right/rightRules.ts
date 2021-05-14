//验证日期的规则
const checkIsManagerStr = (rules:any, value:any, cb:any) => {
  if (value==="是" || value==="否") {
    return cb()
  }

  cb(new Error("请输入是或者否"))
}



export {
  checkIsManagerStr
}