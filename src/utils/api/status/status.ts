import service from "@/utils/request";
interface IParams {
  query: string,
  pagenum: number,
  pagesize: number
}

const api_getStatusList = (params: IParams) => {
  return service.request({
    method: "GET",
    url: "status",
    params
  });
};
const api_addStatus = (data: any) => {
  return service.request({
    method: "POST",
    url: "status/addStatus",
    data
  });
};
const api_getStatusByID = (id: number | string) => {
  return service.request({
    method: "GET",
    url: "status/getStatusByID",
    params: {
      id
    }
  });
};
const api_editStatus = (data: any) => {
  return service.request({
    method: "PUT",
    url: "status/editStatus",
    data
  });
};


const api_removeStatus = (id: any) => {
  return service.request({
    method: "DELETE",
    url: "status/removeStatus",
    data: {
      id
    }
  });
};

export {
  api_getStatusList,
  api_addStatus,
  api_getStatusByID,
  api_editStatus,
  api_removeStatus
}