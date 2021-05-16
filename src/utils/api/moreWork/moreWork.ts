import service from "@/utils/request";


const api_getMoreWorkApply = (params: any) => {
  return service.request({
    method: "GET",
    url: "/moreWorkApply",
    params
  });
};
const api_getMoreWorkApplyByID = (id: number | string) => {
  return service.request({
    method: "GET",
    url: "moreWorkApply/getMoreWorkApplyByID",
    params: {
      id
    }
  });
};

const api_editMoreWorkApply = (data: any) => {
  return service.request({
    method: "PUT",
    url: "moreWorkApply/editMoreWorkApply",
    data
  });
};

const api_removeMoreWorkApply = (id: any) => {
  return service.request({
    method: "DELETE",
    url: "moreWorkApply/removeMoreWorkApply",
    data: {
      id
    }
  });
};
const api_addMoreWorkApply = (data: any) => {
  return service.request({
    method: "POST",
    url: "moreWorkApply/addMoreWorkApply",
    data
  });
};
export {api_getMoreWorkApply, api_getMoreWorkApplyByID, api_editMoreWorkApply, api_removeMoreWorkApply,api_addMoreWorkApply};
