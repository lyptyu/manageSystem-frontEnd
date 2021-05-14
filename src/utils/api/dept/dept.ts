import service from "@/utils/request";

interface IParams {
  query: string,
  pagenum: number,
  pagesize: number
}


interface EParams {
  id: string,
  name: string,
  grade: string,
}

const api_getDept = (params: IParams) => {
  return service.request({
    method: "GET",
    url: "dept",
    params
  });
};
const api_addDept = (data: EParams) => {
  return service.request({
    method: "POST",
    url: "dept/addDept",
    data
  });
};
const api_getDeptByID = (id: number | string) => {
  return service.request({
    method: "GET",
    url: "dept/getDeptByID",
    params: {
      id
    }
  });
};
const api_editPlus = (data: EParams) => {
  return service.request({
    method: "PUT",
    url: "dept/editDept",
    data
  });
};
const api_removeDept = (id: number) => {
  return service.request({
    method: "DELETE",
    url: "/dept/removeDept",
    data:{
      id
    }
  });
};
const api_getRole = () => {
  return service.request({
    method: "GET",
    url: "role",
  });
};

const api_addRole = (data:any)=>{
  return service.request({
    method: "POST",
    url: "role/addRole",
    data
  });
}

const api_getRoleById = (id:number)=>{
  return service.request({
    method: "GET",
    url: "role/getRoleByID",
    params:{
      id
    }
  });
}

const api_editRole = (data:any) =>{
  return service.request({
    method: "PUT",
    url: "role/editRole",
    data
  });
}
const api_removeRole = (id: number) => {
  return service.request({
    method: "DELETE",
    url: "/role/removeRole",
    data:{
      id
    }
  });
};
export {
  api_getDept,
  api_addDept,
  api_getDeptByID,
  api_editPlus,
  api_removeDept,
  api_getRole,
  api_addRole,
  api_getRoleById,
  api_editRole,
  api_removeRole
};