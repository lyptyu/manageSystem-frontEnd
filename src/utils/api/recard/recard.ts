import service from "@/utils/request";


const api_getRecardApply = (params: any) => {
  return service.request({
    method: "GET",
    url: "/recardApply",
    params
  });
};
const api_getRecardApplyByID = (id: number | string) => {
  return service.request({
    method: "GET",
    url: "recardApply/getRecardApplyByID",
    params: {
      id
    }
  });
};

const api_editRecardApply = (data: any) => {
  return service.request({
    method: "PUT",
    url: "recardApply/editRecardApply",
    data
  });
};

const api_removeRecardApply = (id: any) => {
  return service.request({
    method: "DELETE",
    url: "recardApply/removeRecardApply",
    data: {
      id
    }
  });
};
const api_addRecardApply = (data: any) => {
  return service.request({
    method: "POST",
    url: "recardApply/addRecardApply",
    data
  });
};
export {api_getRecardApply, api_getRecardApplyByID, api_editRecardApply, api_removeRecardApply,api_addRecardApply};
