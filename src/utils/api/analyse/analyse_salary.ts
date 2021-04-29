import service from "@/utils/request";


const api_getDept = () => {
  return service.request({
    method: "GET",
    url: "analyseSalary/byDept",
  });
};

const api_getExperience = ()=>{
  return service.request({
    method:'GET',
    url:'analyseSalary/byExperience'
  })
}
const api_getEducation = ()=>{
  return service.request({
    method:'GET',
    url:'analyseSalary/byEducation'
  })
}
const api_getSalary = ()=>{
  return service.request({
    method:'GET',
    url:'analyseSalary/bySalary'
  })
}
export {
  api_getDept,
  api_getExperience,
  api_getEducation,
  api_getSalary
}