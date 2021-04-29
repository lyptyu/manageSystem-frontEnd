import service from "@/utils/request";
import {loginForm} from "@/utils/interface/login/login";

const api_login = (data: loginForm) => {
  return service.request({
    method: "POST",
    url: "/users/login",
    data
  });
};
export {api_login};
