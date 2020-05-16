<!--
 * @Author: 白亚勇
 * @Date: 2019-12-31 11:01:57
 * @LastEditors  : 白亚勇
 * @LastEditTime : 2020-04-29 17:04:12
 * @Description: rule_java节点属性配置
 -->
<template>
  <div class="rule_java">
    <div class="panelTitle">JavaFn</div>
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
          <el-form-item label="脚本" prop="script">
            <div style="height:300px;margin-top:50px">
              <monacoEditor language="java" v-model="form.script" />
            </div>
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
export default {
  props: ["model", "backList", "inAndOutvar", "vars"],
  data() {
    return {
      form: {
        // 输入变量
        dataInVar: "",
        // 输出变量
        dataOutVar: "",
        script: "" //脚本
      },
      rules: {
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
        ],
        script: [
          {
            required: true,
            message: "请输入脚本"
          }
        ]
      }
    };
  },
  watch: {
    backList(val) {
      this.form.script = val.script;
    },
    inAndOutvar(val) {
      this.form.dataInVar = val.dataInVar;
      this.form.dataOutVar = val.dataOutVar;
    }
  },
  mounted() {},
  methods: {
    // 传递节点名称给父组件
    changeNodeName(value) {
      this.$emit("changeNodeName", "label", value);
    },
    submit() {
      var data = {
        dataInVar: this.form.dataInVar,
        dataOutVar: this.form.dataOutVar,
        pluginJson: JSON.stringify({
          script: this.form.script
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
