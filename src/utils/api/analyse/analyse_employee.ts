import service from "@/utils/request";

const api_getEducation = ()=>{
  return service.request({
    method: "GET",
    url: "analyseEmployee/byEducation",
  });
}
const api_getGender = ()=>{
  return service.request({
    method: "GET",
    url: "analyseEmployee/byGender",
  });
}

const api_getDept = ()=>{
  return service.request({
    method: "GET",
    url: "analyseEmployee/byDept",
  });
}

const api_getExperience = ()=>{
  return service.request({
    method:'GET',
    url:'analyseEmployee/byExperience'
  })
}
export {
  api_getEducation,
  api_getGender,
  api_getDept,
  api_getExperience
}