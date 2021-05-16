import service from "@/utils/request";


const api_getProjectApply = (params: any) => {
  return service.request({
    method: "GET",
    url: "/projectApply",
    params
  });
};
const api_getProjectApplyByID = (id: number | string) => {
  return service.request({
    method: "GET",
    url: "projectApply/getProjectApplyByID",
    params: {
      id
    }
  });
};

const api_editProjectApply = (data: any) => {
  return service.request({
    method: "PUT",
    url: "projectApply/editProjectApply",
    data
  });
};

const api_removeProjectApply = (id: any) => {
  return service.request({
    method: "DELETE",
    url: "projectApply/removeProjectApply",
    data: {
      id
    }
  });
};
const api_addProjectApply = (data: any) => {
  return service.request({
    method: "POST",
    url: "projectApply/addProjectApply",
    data
  });
};
export {api_getProjectApply, api_getProjectApplyByID, api_editProjectApply, api_removeProjectApply,api_addProjectApply};
