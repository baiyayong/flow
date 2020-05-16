import fetch from "@/utils/fetch";
// 插件节点保存
export const save = data => fetch("/develop/pluginParam/creating", data, "POST", true);
// 插件配置回填
export const queryBack = data => fetch("/develop/pluginParam/byCondition", data, "POST");

// 获取本系统下所有bpm流程
export const getBpmWorkflow = data => fetch("/bpm/workflowType/getWorkflowTree", data, "GET");
// 获取所有服务
export const getAllRestful = data => fetch("/develop/apiRestful/getRestfulTree", data, "GET");
//获取可导入表
export const getTable = data => fetch("/sgw/d2aTable/byCondition", data, "POST");
//业务表选择查询对应表下字段
export const checkField = data => fetch("/sgw/d2aFields/byCondition", data, "POST");
