interface employeeData {
  //获取用户列表参数
  queryInfo: {
    query: string,
    pagenum: number,
    pagesize: number
  },
  employeeList: Array<any>,
  total: number,
  //添加部门对话框是否可显示
  addDialogVisible:boolean,
  //表单验证数据
  addForm:{
    id:number,
    name:string,
    dept_id:number,
    education:string,
    email:string,
    experience:number,
    gender:number,
    phone:number,
    role_id:number,

  },
  //表单验证规则
  addFormRules:{

  }
  //修改
  editDialogVisible:boolean,
  editForm:{
    id:number,
    name:string,
    dept_id:number,
    education:string,
    email:string,
    experience:number,
    gender:number,
    phone:number,
    role_id:number,
  },
  editFormRules:{}
}

export {
  employeeData,
};