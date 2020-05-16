<!--
 * @Author: 白亚勇
 * @Date: 2019-12-31 11:01:57
 * @LastEditors  : 白亚勇
 * @LastEditTime : 2020-04-22 16:00:40
 * @Description: 线上属性配置
 -->
<template>
  <div class="line_detail">
    <div class="panelTitle">连接线</div>
    <div class="panelBody">
      <div class="contentBody">
        <el-form :model="form" :rules="rules" ref="form">
          <el-form-item label="条件">
            <el-input
              placeholder="请输入条件"
              v-model="model.rules"
              @input="changeNodeName(model.rules, 'rules')"
            ></el-input>
          </el-form-item>
          <!-- <el-form-item label="选择脚本">
            <el-select v-model="form.type" placeholder="选择脚本" filterable>
              <el-option value="1" label="按照groovy脚本计算"> </el-option>
              <el-option value="2" label="按照SQL计算"> </el-option>
              <el-option value="3" label="按照百分比计算"> </el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="描述">
            <el-input
              placeholder="请描述"
              type="textarea"
              v-model="model.label"
              @input="changeNodeName(model.label, 'label')"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="bottom">
          <!-- <el-button type="primary" @click='submit'>确定</el-button> -->
          <el-button type="info" @click="close">关闭</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["model"],
  data() {
    return {
      form: {},
      rules: {}
    };
  },
  mounted() {},
  methods: {
    // 传递节点名称给父组件
    changeNodeName(value, type) {
      this.$emit("changeNodeName", type, value);
    },
    close() {
      this.model.clazz = "";
    }
  }
};
</script>

<style lang="less" rel="stylesheet/less"></style>
