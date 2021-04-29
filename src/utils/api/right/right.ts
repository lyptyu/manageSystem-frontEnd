import service from "@/utils/request";

interface IParams {
  query: string,
  pagenum: number,
  pagesize: number
}

const api_getUserList = (params: IParams) => {
  return service.request({
    method: "GET",
    url: "users",
    params
  });
};
const api_addUser = (data: any) => {
  return service.request({
    method: "POST",
    url: "users/addUser",
    data
  });
};

const api_getUserByID = (id: number | string) => {
  return service.request({
    method: "GET",
    url: "users/getUserByID",
    params: {
      id
    }
  });
};

const api_editUser = (data: any) => {
  return service.request({
    method: "PUT",
    url: "users/editUser",
    data
  });
};


const api_removeUser = (id: any) => {
  return service.request({
    method: "DELETE",
    url: "users/removeUser",
    data: {
      id
    }
  });
};

export {
  api_getUserList,
  api_addUser,
  api_getUserByID,
  api_editUser,
  api_removeUser
};