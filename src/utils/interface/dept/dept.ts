interface deptData {
  //获取用户列表参数
  queryInfo: {
    query: string,
    pagenum: number,
    pagesize: number
  },
  deptList: Array<any>,
  total: number,
  //添加部门对话框是否可显示
  addDialogVisible:boolean,
  //表单验证数据
  addForm:{
    id:string,
    name:string,
    grade:string,
  },
  //表单验证规则
  addFormRules:{

  }
  //修改
  editDialogVisible:boolean,
  editForm:{
    id: string,
    name: string,
    grade: string,
  },
  editFormRules:{},
  showRoleDialog:boolean,
  roleListInDept:Array<any>,
  addRoleDialogVisible:boolean,
  addRoleForm:any,
  roleTotal:number,
  deptName:string,
  deptId:number
}

export {
  deptData,
};