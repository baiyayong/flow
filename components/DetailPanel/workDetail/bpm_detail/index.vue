<!--
 * @Author: 白亚勇
 * @Date: 2019-12-31 11:01:57
 * @LastEditors  : 白亚勇
 * @LastEditTime : 2020-04-29 17:03:45
 * @Description: bpm节点属性配置
 -->
<template>
  <div class="bpm_detail">
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
          <el-form-item label="选择流程" prop="flowId">
            <el-cascader
              v-model="form.flowId"
              :options="flowList"
              :props="cascaderProp"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="输入变量" prop="dataInVar">
            <el-select v-model="form.dataInVar" placeholder="输入变量" clearable>
              <el-option
                v-for="item in vars"
                :key="item.name"
                :label="item.name + '(' + item.defaultValue + ')'"
                :value="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="输出变量" prop="dataOutVar">
            <el-select v-model="form.dataOutVar" placeholder="输出变量" clearable>
              <el-option
                v-for="item in vars"
                :key="item.name"
                :label="item.name + '(' + item.defaultValue + ')'"
                :value="item.name"
              ></el-option>
            </el-select>
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
import {
  getBpmWorkflow // 查询本模块下BPM流程
} from "../service";
import { indianred } from "color-name";

export default {
  props: ["model", "backList", "inAndOutvar", "vars"],
  data() {
    return {
      form: {
        flowId: "", //流程id
        dataInVar: "", //输入变量
        dataOutVar: "" //输出变量
      },
      flowList: [], //流程列表
      cascaderProp: {
        value: "id",
        label: "name",
        children: "children"
      },
      rules: {
        flowId: [
          {
            required: true,
            message: "请选择流程"
          }
        ],
        dataInVar: [
          {
            required: true,
            message: "请输入"
          }
        ],
        dataOutVar: [
          {
            required: true,
            message: "请输入"
          }
        ]
      }
    };
  },
  watch: {
    backList(val) {
      this.form.flowId = val.flowId;
    },
    inAndOutvar(val) {
      this.form.dataInVar = val.dataInVar;
      this.form.dataOutVar = val.dataOutVar;
    }
  },
  mounted() {
    this.getBpmWorkflow();
  },
  methods: {
    // 传递节点名称给父组件
    changeNodeName(value) {
      this.$emit("changeNodeName", "label", value);
    },
    async getBpmWorkflow() {
      var data = {
        appId: this.$parent.$parent.$parent.$parent.selectNode.appId,
        isDeploy: true
      };
      let res = await getBpmWorkflow(data);
      if (res.status == "success") {
        this.flowList = res.content;
      } else {
        this.flowList = [];
      }
    },

    submit() {
      var data = {
        dataInVar: this.form.dataInVar,
        dataOutVar: this.form.dataOutVar,
        pluginJson: JSON.stringify({
          flowId: this.form.flowId,
          workflowId: this.form.flowId[1]
        })
      };
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.$parent.save(data);
          this.close();
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
