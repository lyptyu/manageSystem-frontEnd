import axios from "axios";

//创建axios
const service = axios.create(
  {
    baseURL: `http://127.0.0.1:8888/api/private/v1/`
  }
);

//请求拦截器
service.interceptors.request.use(config => config,
  error => Promise.reject(error));

//响应拦截器
service.interceptors.request.use(
  response => {
    console.log("res:", response);
    return response;
  },
  error => Promise.reject(error)
);

export default service;