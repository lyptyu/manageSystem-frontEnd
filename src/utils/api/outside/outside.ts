import service from "@/utils/request";


const api_getOutsideApply = (params: any) => {
  return service.request({
    method: "GET",
    url: "/outsideApply",
    params
  });
};
const api_getOutsideApplyByID = (id: number | string) => {
  return service.request({
    method: "GET",
    url: "outsideApply/getOutsideApplyByID",
    params: {
      id
    }
  });
};

const api_editOutsideApply = (data: any) => {
  return service.request({
    method: "PUT",
    url: "outsideApply/editOutsideApply",
    data
  });
};

const api_removeOutsideApply = (id: any) => {
  return service.request({
    method: "DELETE",
    url: "outsideApply/removeOutsideApply",
    data: {
      id
    }
  });
};
const api_addOutsideApply = (data: any) => {
  return service.request({
    method: "POST",
    url: "outsideApply/addOutsideApply",
    data
  });
};
export {api_getOutsideApply, api_getOutsideApplyByID, api_editOutsideApply, api_removeOutsideApply,api_addOutsideApply};
