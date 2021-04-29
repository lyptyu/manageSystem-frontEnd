import service from "@/utils/request";

interface IParams {
  query: string,
  pagenum: number,
  pagesize: number
}

interface EParams {
  id: string,
  name: string,
  dept_id: string,
  education: string,
  email: string,
  experience: string,
  gender: string,
  phone: string,
  position_id: string,
  role_id: string
}


const api_getEmployee = (params: IParams) => {
  return service.request({
    method: "GET",
    url: "employee",
    params
  });
};
const api_addEmployee = (data: EParams) => {
  return service.request({
    method: "POST",
    url: "employee/AddEmployee",
    data
  });
};
const api_getEmployeeByID = (id: number | string) => {
  return service.request({
    method: "GET",
    url: "employee/getEmployeeByID",
    params: {
      id
    }
  });
};

const api_removeEmployee = (id: number) => {
  return service.request({
    method: "DELETE",
    url: "/employee/removeEmployee",
    data: {
      id
    }
  });
};
const api_editEmployee = (data: EParams) => {
  return service.request({
    method: "PUT",
    url: "employee/editEmployee",
    data
  });
};

const api_getRoleByID = (id: number) => {
  return service.request({
    method:'GET',
    url:'role/getRoleByID',
    params:{
      id
    }
  })
};
export {
  api_getEmployee,
  api_addEmployee,
  api_removeEmployee,
  api_getEmployeeByID,
  api_editEmployee,
  api_getRoleByID
};