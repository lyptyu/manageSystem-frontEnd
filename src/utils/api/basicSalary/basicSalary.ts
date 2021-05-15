import service from "@/utils/request";

interface IParams {
  query: string,
  pagenum: number,
  pagesize: number
}

const api_getBasicSalary = (params: IParams) => {
  return service.request({
    method: "GET",
    url: "salary/basicSalary",
    params
  });
};

const api_addBasicSalary = (data: any) => {
  return service.request({
    method: "POST",
    url: "salary/basicSalary/addSalary",
    data
  });
};
const api_getBasicSalaryByID = (id: number | string) => {
  return service.request({
    method: "GET",
    url: "salary/basicSalary/getBasicByID",
    params: {
      id
    }
  });
};
const api_getBasicSalaryByEmployeeID = (employee_id: number | string) => {
  return service.request({
    method: "GET",
    url: "salary/basicSalary/getBasicByEmployeeID",
    params: {
      employee_id
    }
  });
};

const api_editSalary = (data: any) => {
  return service.request({
    method: "PUT",
    url: "salary/basicSalary/editBasic",
    data
  });
};
const api_removeSalary = (id: number) => {
  return service.request({
    method: "DELETE",
    url: "salary/basicSalary/deleteBasic",
    data:{
      id
    }
  });
};
export {
  api_getBasicSalary,
  api_addBasicSalary,
  api_getBasicSalaryByID,
  api_editSalary,
  api_removeSalary,
  api_getBasicSalaryByEmployeeID
}