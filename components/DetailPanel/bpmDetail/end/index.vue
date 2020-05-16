<!--
 * @Author: 白亚勇
 * @Date: 2019-12-31 11:01:57
 * @LastEditors  : 白亚勇
 * @LastEditTime : 2020-04-24 10:49:25
 * @Description: 结束节点属性配置
 -->
<template>
  <div class="end">
    <div class="panelTitle">结束</div>
    <div class="panelBody">
      <el-tabs v-model="tableName" class="tabsPadding">
        <el-tab-pane label="通知" name="01"> </el-tab-pane>
      </el-tabs>
      <div class="contentBody">
        <el-form :model="form" :rules="rules" ref="form">
          <div v-show="tableName == '01'">
            <el-form-item label="邮件通知">
              <el-checkbox-group v-model="form.promoter">
                <el-checkbox>发起人</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>
        </el-form>
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
export default {
  props: ["model", "deployStatus", "backList"],
  data() {
    return {
      // 页签切换标识
      tableName: "01",
      form: {
        promoter: "", // 处理-发起人
        pending: "" // 处理-待处理人
      },
      rules: {}
    };
  },
  watch: {
    backList(val) {
      // 通知回填
      this.form.promoter = !!val.noticeInfo[0].to[0];
      this.form.pending = !!val.noticeInfo[0].to[1];
    }
  },
  methods: {
    async submit() {
      const data = {
        structure: JSON.stringify({
          // 通知
          noticeInfo: [
            {
              type: "email",
              to: [this.form.promoter ? "start" : "", this.form.pending ? "next" : ""]
            }
          ]
        })
      };
      this.$parent.save(data);
      this.close();
    },
    close() {
      this.model.clazz = "";
    }
  }
};
</script>

<style lang="less" rel="stylesheet/less"></style>
