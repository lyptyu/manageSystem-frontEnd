import service from "@/utils/request";
const api_getMenu = ()=>{
  return service.request({
    method: "GET",
    url: "menus",
  });
}
const api_getEmpMenu = ()=>{
  return service.request({
    method: "GET",
    url: "empmenus",
  });
}
export {
  api_getMenu,
  api_getEmpMenu
}