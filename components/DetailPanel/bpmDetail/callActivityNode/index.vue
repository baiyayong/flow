<!--
 * @Author: 白亚勇
 * @Date: 2019-12-31 11:01:57
 * @LastEditors  : 白亚勇
 * @LastEditTime : 2020-04-24 10:50:04
 * @Description: 流程调用节点属性配置
 -->
<template>
  <div class="callActivityNode">
    <div class="panelTitle">流程调用</div>
    <div class="panelBody">
      <el-tabs v-model="tableName" class="tabsPadding">
        <el-tab-pane label="调用流程" name="01"> </el-tab-pane>
      </el-tabs>
      <div class="contentBody">
        <div v-show="tableName == '01'">
          <el-form :model="form" :rules="rules" ref="form">
            <el-form-item label="标题">
              <el-input
                placeholder="请输入标题"
                v-model="model.label"
                @input="changeNodeName"
              ></el-input>
            </el-form-item>
            <el-form-item label="调用流程" prop="subProcessId">
              <el-select v-model="form.subProcessId" placeholder="选择调用流程" filterable>
                <el-option-group
                  v-for="group in processList"
                  :key="group.id"
                  :value="group.id"
                  :label="group.name"
                >
                  <el-option
                    v-for="item in group.children"
                    :key="item.id"
                    :value="item.id"
                    :label="item.status ? item.name : item.name + '(未部署)'"
                    :disabled="item.status == false"
                  >
                  </el-option>
                </el-option-group>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-form-item label="输入" prop="inVariable">
                <el-input type="text" placeholder="请输入" v-model="form.inVariable"></el-input>
              </el-form-item>
            </el-form-item>
            <el-form-item>
              <el-form-item label="输出" prop="outVariable">
                <el-input type="text" placeholder="请输入" v-model="form.outVariable"></el-input>
              </el-form-item>
            </el-form-item>
          </el-form>
        </div>
        <div class="bottom">
          <el-button type="primary" @click="submit" :disabled="deployStatus == 'deploy'"
            >确定</el-button
          >
          <el-button type="info" @click="close">关闭</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getProcess // 获取调用数据
} from "../service";

export default {
  props: ["model", "deployStatus", "backList"],
  data() {
    return {
      // 页签切换标识
      tableName: "01",
      // 调用流程校验规则
      form: {
        subProcessId: "", // 调用流程
        inVariable: "", // 输入
        outVariable: "" // 输出
      },
      rules: {
        subProcessId: [
          {
            required: true,
            message: "请选择调用流程"
          }
        ],
        inVariable: [
          {
            required: true,
            message: "请输入"
          }
        ],
        outVariable: [
          {
            required: true,
            message: "请输入"
          }
        ]
      },
      // 调用流程List
      processList: []
    };
  },
  mounted() {
    // this.getProcess();
    // 数据回填
    // this.queryBack();
  },
  watch: {
    backList(val) {
      // 调用流程回填
      this.form.subProcessId = val.subProcessId;
      this.form.inVariable = val.inVariable;
      this.form.outVariable = val.outVariable;
    }
  },
  methods: {
    // 传递节点名称给父组件
    changeNodeName(value) {
      this.$emit("changeNodeName", "label", value);
    },
    // 获取所有调用流程
    async getProcess() {
      const res = await getProcess();
      this.processList = res.content;
    },
    async submit() {
      const data = {
        structure: JSON.stringify({
          subProcessId: this.form.subProcessId,
          inVariable: this.form.inVariable,
          outVariable: this.form.outVariable
        })
      };
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$parent.save(data);
          this.close();
        } else {
          return false;
        }
      });
    },
    close() {
      this.model.clazz = "";
    }
  }
};
</script>

<style lang="less" rel="stylesheet/less"></style>
