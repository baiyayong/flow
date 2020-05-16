<!--
 * @Author: 白亚勇
 * @Date: 2019-12-31 11:01:57
 * @LastEditors  : 白亚勇
 * @LastEditTime : 2020-04-24 11:03:28
 * @Description: rule_sql节点属性配置
 -->
<template>
  <div class="rule_sql">
    <div class="panelTitle">{{ model.label }}</div>
    <div class="panelBody">
      <div class="contentBody">
        <el-form :model="form" :rules="rules" ref="form">
          <el-form-item label="标题">
            <el-input
              placeholder="请输入标题"
              v-model="model.label"
              @input="changeNodeName"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="bottom">
          <el-button type="primary" @click="submit">确定</el-button>
          <el-button type="info" @click="close">关闭</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {} from "../service";

export default {
  props: ["model", "flowId"],
  data() {
    return {
      rules: {}
    };
  },
  mounted() {},
  methods: {
    // 传递节点名称给父组件
    changeNodeName(value) {
      this.$emit("changeNodeName", "label", value);
    },
    close() {
      this.model.clazz = "";
    }
  }
};
</script>

<style lang="less" rel="stylesheet/less"></style>
