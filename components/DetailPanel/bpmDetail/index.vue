<!--
 * @Author: 白亚勇
 * @Date: 2019-12-31 11:01:57
 * @LastEditors  : 白亚勇
 * @LastEditTime : 2020-04-26 14:47:01
 * @Description: 节点属性配置
 -->
<template>
  <div class="detailPanel" :class="{ active: model.clazz }">
    <start
      :model="model"
      :backList="backList"
      :deployStatus="deployStatus"
      v-if="model.clazz == 'start'"
    />
    <end
      :model="model"
      :backList="backList"
      :deployStatus="deployStatus"
      v-if="model.clazz == 'end'"
    />
    <userTask
      :model="model"
      :backList="backList"
      :deployStatus="deployStatus"
      @changeNodeName="onChangeName"
      v-if="model.clazz == 'userTask'"
    />
    <autoNode
      :model="model"
      :backList="backList"
      :deployStatus="deployStatus"
      @changeNodeName="onChangeName"
      v-if="model.clazz == 'mailTask'"
    />
    <callActivityNode
      :model="model"
      :backList="backList"
      :deployStatus="deployStatus"
      @changeNodeName="onChangeName"
      v-if="model.clazz == 'receiveTask'"
    />
    <line_detail :model="model" @changeNodeName="onChangeName" v-if="model.clazz == 'flow'" />
    <pool :model="model" @changeNodeName="onChangeName" v-if="model.clazz == 'pool'" />
  </div>
</template>

<script>
import {
  save, // 保存
  queryBack // 回填
} from "./service";
import start from "./start";
import end from "./end";
import userTask from "./userTask";
import autoNode from "./autoNode";
import callActivityNode from "./callActivityNode";
import pool from "./pool";
import line_detail from "./line_detail";

export default {
  components: {
    start,
    end,
    userTask,
    autoNode,
    callActivityNode,
    pool,
    line_detail
  },
  props: ["model", "flowId", "deployStatus"],
  data() {
    return {
      backList: {}
    };
  },
  watch: {
    model(val) {
      if (val.clazz) {
        this.queryBack();
      }
    }
  },
  methods: {
    // 传递节点名称给父组件
    onChangeName(key, value) {
      this.$emit("onChangeName", key, value);
    },
    // 页面回填
    async queryBack() {
      const data = {
        workflowId: this.flowId,
        nodeId: this.model.id
      };
      const res = await queryBack(data);
      if (res.status == "success" && res.content.length > 0) {
        this.backList = JSON.parse(res.content[0].structure);
      }
    },
    //流程属性配置保存
    async save(data) {
      const param = {};
      const obj = {
        workflowId: this.flowId,
        nodeId: this.model.id,
        nodeName: this.model.label
      };
      Object.assign(param, obj, data);
      const res = await save(param);
    }
  }
};
</script>

<style lang="less" rel="stylesheet/less">
@import "./style.less";
</style>
