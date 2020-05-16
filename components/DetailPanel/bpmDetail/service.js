import fetch from "@/utils/fetch";
// 插件节点保存
export const save = data => fetch("/bpm/processNodeDefinition/creating", data, "POST", true);
// 插件配置回填
export const queryBack = data => fetch("/bpm/processNodeDefinition/byCondition", data, "POST");

// 获取部门
export const getDepartment = data =>
  fetch("/bpm/workflowDefinition/findDepartmentInfoByAppId", data, "GET");
// 获取岗位
export const getstation = data =>
  fetch("/bpm/workflowDefinition/findPositionInfoByAppId", data, "GET");
// 获取业务账号
export const getUsers = data =>
  fetch("/bpm/workflowDefinition/findBussinessAccountInfoByAppId", data, "GET");

// 获取所有调用流程
export const getProcess = () => fetch("/processmanager/processDefinition/getDetailAll", {}, "GET");
