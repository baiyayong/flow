<!--
 * @Author: 白亚勇
 * @Date: 2019-12-31 11:01:57
 * @LastEditors  : 白亚勇
 * @LastEditTime : 2020-04-29 17:04:27
 * @Description: 开始结束节点属性配置
 -->
<template>
  <div class="bpm_detail">
    <div class="panelTitle">{{ model.label }}</div>
    <div class="panelBody">
      <div class="contentBody">
        <el-form :model="form" :rules="rules" ref="form">
          <el-form-item label="输入变量" prop="dataInVar" v-if="model.clazz == 'end'">
            <el-select v-model="form.dataInVar" placeholder="输入变量" clearable>
              <el-option
                v-for="item in vars"
                :key="item.name"
                :label="item.name + '(' + item.defaultValue + ')'"
                :value="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="输出变量" prop="dataOutVar" v-if="model.clazz == 'start'">
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
export default {
  props: ["model", "inAndOutvar", "vars"],
  data() {
    return {
      form: {
        dataInVar: "", //输入变量
        dataOutVar: "" //输出变量
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
        ]
      }
    };
  },
  watch: {
    inAndOutvar(val) {
      this.form.dataInVar = val.dataInVar;
      this.form.dataOutVar = val.dataOutVar;
    }
  },
  mounted() {},
  methods: {
    submit() {
      var data = {
        dataInVar: this.form.dataInVar,
        dataOutVar: this.form.dataOutVar
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
