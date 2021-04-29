//验证日期的规则
const checkDate = (rules:any, value:any, cb:any) => {
  const regEmail = /^\d{4}(\-|\/|\.)\d{1,2}\1\d{1,2}$/
  if (regEmail.test(value) === true) {
    return cb()
  }

  cb(new Error("请输入合法日期:YYYY-MM-DD"))
}

//验证上下班的规则
const checkTime = (rules:any, value:any, cb:any) => {
  const regEmail = /^\d{1,2}(\:)\d{1,2}$/
  if (regEmail.test(value) === true || value==='-') {
    return cb()
  }

  cb(new Error("请输入合法考勤时间:HH:MM"))
}

//验证状态的规则
const checkStatus = (rules:any, value:any, cb:any) => {

  if (value==='正常考勤'||value==='迟到早退'||value==='旷工') {
    return cb()
  }

  cb(new Error("请输入合法考勤状态:['正常考勤','迟到早退','旷工']"))
}

export {
  checkDate,
  checkTime,
  checkStatus
}