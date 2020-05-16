<!--
 * @Author: 白亚勇
 * @Date: 2019-12-31 11:01:57
 * @LastEditors  : 白亚勇
 * @LastEditTime : 2020-04-29 17:04:02
 * @Description: restful_get 和 restful_post节点属性配置
 -->
<template>
  <div class="restful_getAndPost">
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
          <el-form-item label="选择服务" prop="restfulId">
            <el-cascader
              :options="restfulList"
              v-model="form.restfulId"
              :props="cascaderProp"
              placeholder="服务选择"
              :show-all-levels="false"
              filterable
              clearable
              multiple
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
import { getAllRestful } from "../service";

export default {
  props: ["model", "backList", "inAndOutvar", "vars"],
  data() {
    return {
      form: {
        restfulId: "",
        dataInVar: "",
        dataOutVar: ""
      },
      restfulList: [],
      rules: {
        restfulId: [
          {
            required: true,
            message: "请选择服务"
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
      },
      cascaderProp: {
        label: "name",
        value: "id",
        children: "children"
      }
    };
  },
  watch: {
    backList(val) {
      this.form.restfulId = val.allId;
    },
    inAndOutvar(val) {
      this.form.dataInVar = val.dataInVar;
      this.form.dataOutVar = val.dataOutVar;
    }
  },
  mounted() {
    this.getAllRestful();
  },
  methods: {
    // 传递节点名称给父组件
    changeNodeName(value) {
      this.$emit("changeNodeName", "label", value);
    },
    async getAllRestful() {
      var data = {
        method: this.model.clazz == "restful_get" ? "GET" : "POST",
        appId: this.$parent.$parent.$parent.$parent.selectNode.appId
      };
      let res = await getAllRestful(data);
      if (res.status == "success") {
        this.restfulList = res.content;
      } else {
        this.restfulList = [];
      }
    },

    submit() {
      var data = {
        dataInVar: this.form.dataInVar,
        dataOutVar: this.form.dataOutVar,
        pluginJson: JSON.stringify({
          restfulId: this.form.restfulId[this.form.restfulId.length - 1],
          allId: this.form.restfulId,
          type: this.form.restfulId[0]
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
