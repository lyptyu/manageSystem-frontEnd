import service from "@/utils/request";
const api_getMenu = ()=>{
  return service.request({
    method: "GET",
    url: "menus",
  });
}

export {
  api_getMenu
}