import service from "@/utils/request";
interface IParams {
  query: string,
  pagenum: number,
  pagesize: number
}


const api_getReal = (params: IParams) => {
  return service.request({
    method: "GET",
    url: "real",
    params
  });
};
export {
  api_getReal
}
