import service from "@/utils/request";

interface IParams {
  query: string,
  pagenum: number,
  pagesize: number
}


const api_getOvertime = (params: IParams) => {
  return service.request({
    method: "GET",
    url: "overtime",
    params
  });
};

const api_addOvertime = (data: any) => {
  return service.request({
    method: "POST",
    url: "overtime/addOvertime",
    data
  });
};

const api_getOvertimeByID = (id: number | string) => {
  return service.request({
    method: "GET",
    url: "overtime/getOvertimeByID",
    params: {
      id
    }
  });
};

const api_editOvertime = (data: any) => {
  return service.request({
    method: "PUT",
    url: "overtime/editOvertime",
    data
  });
};

const api_removeOvertime = (id: any) => {
  return service.request({
    method: "DELETE",
    url: "overtime/removeOvertime",
    data: {
      id
    }
  });
};

export {
  api_getOvertime,
  api_addOvertime,
  api_getOvertimeByID,
  api_editOvertime,
  api_removeOvertime
};