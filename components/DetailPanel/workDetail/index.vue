<!--
 * @Author: 白亚勇
 * @Date: 2019-12-31 11:01:57
 * @LastEditors  : 白亚勇
 * @LastEditTime : 2020-04-29 16:37:41
 * @Description: 工作流节点属性配置
 -->
<template>
  <div
    class="detailPanel"
    :class="{
      active: model.clazz,
      detailWidth:
        model.clazz == 'db_insert' ||
        model.clazz == 'db_update' ||
        model.clazz == 'db_delete' ||
        model.clazz == 'db_findById' ||
        model.clazz == 'db_findByPage' ||
        model.clazz == 'db_findByWhere' ||
        model.clazz == 'db_findBySQLPage' ||
        model.clazz == 'db_findBySQLWhere'
    }"
  >
    <startAndEnd
      :vars="vars"
      :model="model"
      :inAndOutvar="inAndOutvar"
      v-if="model.clazz == 'start' || model.clazz == 'end'"
    />
    <db_common
      :vars="vars"
      :model="model"
      :backList="backList"
      :inAndOutvar="inAndOutvar"
      @changeNodeName="onChangeName"
      v-if="
        model.clazz == 'db_insert' ||
          model.clazz == 'db_update' ||
          model.clazz == 'db_delete' ||
          model.clazz == 'db_findById' ||
          model.clazz == 'db_findByPage' ||
          model.clazz == 'db_findByWhere' ||
          model.clazz == 'db_findBySQLPage' ||
          model.clazz == 'db_findBySQLWhere'
      "
    />
    <restful_getAndPost
      :vars="vars"
      :model="model"
      :backList="backList"
      :inAndOutvar="inAndOutvar"
      @changeNodeName="onChangeName"
      v-if="model.clazz == 'restful_get' || model.clazz == 'restful_post'"
    />
    <rule_java
      :vars="vars"
      :model="model"
      :backList="backList"
      :inAndOutvar="inAndOutvar"
      @changeNodeName="onChangeName"
      v-if="model.clazz == 'rule_java'"
    />
    <rule_moudule
      :model="model"
      :flowId="flowId"
      @changeNodeName="onChangeName"
      v-if="model.clazz == 'rule_moudule'"
    />
    <bpm_detail
      :vars="vars"
      :model="model"
      :backList="backList"
      :inAndOutvar="inAndOutvar"
      @changeNodeName="onChangeName"
      v-if="
        model.clazz == 'bpm_start' ||
          model.clazz == 'bpm_pause' ||
          model.clazz == 'bpm_active' ||
          model.clazz == 'bpm_destroy' ||
          model.clazz == 'bpm_approve' ||
          model.clazz == 'bpm_addUser' ||
          model.clazz == 'bpm_commissionTask' ||
          model.clazz == 'bpm_perform' ||
          model.clazz == 'bpm_workflowInstDetail' ||
          model.clazz == 'bpm_taskAppoint'
      "
    />
    <line_detail
      :model="model"
      :flowId="flowId"
      @changeNodeName="onChangeName"
      v-if="model.clazz == 'flow'"
    />
  </div>
</template>

<script>
import {
  save, // 保存
  queryBack // 回填
} from "./service";
import startAndEnd from "./startAndEnd";
import db_common from "./db_common";
import restful_getAndPost from "./restful_getAndPost";
import rule_java from "./rule_java";
import rule_moudule from "./rule_moudule";
import bpm_detail from "./bpm_detail";
import line_detail from "./line_detail";

export default {
  components: {
    startAndEnd,
    db_common,
    restful_getAndPost,
    rule_java,
    rule_moudule,
    bpm_detail,
    line_detail
  },
  props: ["model", "flowId", "vars"],
  data() {
    return {
      backList: {},
      inAndOutvar: {}
    };
  },
  watch: {
    model(val) {
      if (val.clazz) {
        this.queryBack();
      }
    }
  },
  created() {},
  methods: {
    // 传递节点名称给父组件
    onChangeName(key, value) {
      this.$emit("onChangeName", key, value);
    },
    // 页面回填
    async queryBack() {
      const data = {
        serviceId: this.flowId,
        pluginId: this.model.id
      };
      const res = await queryBack(data);
      if (res.status == "success") {
        this.inAndOutvar = res.content[0];
        if (res.content.length > 0 && res.content[0].pluginJson != null) {
          this.backList = JSON.parse(res.content[0].pluginJson);
        }
      }
    },
    //流程属性配置保存
    async save(data) {
      const param = {};
      const obj = {
        restfulId: this.flowId,
        pluginId: this.model.id,
        pluginName: this.model.label,
        type: this.model.clazz
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
