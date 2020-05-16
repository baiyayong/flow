<!--
 * @Author: 白亚勇
 * @Date: 2019-12-31 11:01:57
 * @LastEditors  : 白亚勇
 * @LastEditTime : 2020-04-24 10:49:55
 * @Description: 自动节点属性配置
 -->
<template>
  <div class="autoNode">
    <div class="panelTitle">自动节点</div>
    <div class="panelBody">
      <el-tabs v-model="tableName" class="tabsPadding">
        <el-tab-pane label="邮件" name="01"> </el-tab-pane>
        <el-tab-pane label="短信" name="02"> </el-tab-pane>
      </el-tabs>
      <div class="contentBody">
        <el-form :model="form" :rules="rules" ref="form">
          <div v-show="tableName == '01'">
            <el-form-item label="标题">
              <el-input
                placeholder="请输入标题"
                v-model="model.label"
                @input="changeNodeName"
              ></el-input>
            </el-form-item>
            <el-form-item label="收件人" prop="messageAddressee">
              <el-input
                type="text"
                placeholder="请输入收件人"
                v-model="form.messageAddressee"
              ></el-input>
            </el-form-item>
            <el-form-item label="抄送人" prop="messageRecipient">
              <el-input
                type="text"
                placeholder="请输入抄送人"
                v-model="form.messageRecipient"
              ></el-input>
            </el-form-item>
            <el-form-item label="密送人" prop="secretSendOff">
              <el-input
                type="text"
                placeholder="请输入密送人"
                v-model="form.secretSendOff"
              ></el-input>
            </el-form-item>
            <!-- <el-form-item label="发送地址" prop="sendAddress">
								<el-input type="text" placeholder="请输入发送地址" v-model="form.sendAddress"></el-input>
							</el-form-item> -->
            <el-form-item label="主题" prop="subject">
              <el-input type="text" placeholder="请输入主题" v-model="form.subject"></el-input>
            </el-form-item>
            <el-form-item label="正文" prop="mainBody">
              <el-input type="textarea" placeholder="请输入正文" v-model="form.mainBody"></el-input>
            </el-form-item>
          </div>
          <div v-show="tableName == '02'">
            <el-form-item label="收信人" prop="letterAddressee">
              <el-input
                type="text"
                placeholder="请输入收信人"
                v-model="form.letterAddressee"
              ></el-input>
            </el-form-item>
            <el-form-item label="短信内容" prop="shortMessage">
              <el-input
                type="textarea"
                placeholder="请输入短信内容"
                v-model="form.shortMessage"
              ></el-input>
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
      // 邮件校验规则
      form: {
        // 收件人
        messageAddressee: "",
        // 抄送人
        messageRecipient: "",
        // 密送人
        secretSendOff: "",
        // 					//发送地址
        // 					sendAddress: '',
        // 主题
        subject: "",
        // 正文
        mainBody: "",
        // 收信人
        letterAddressee: "",
        // 短信内容
        shortMessage: ""
      },
      rules: {
        messageAddressee: [
          {
            required: true,
            message: "请输入收件人"
          }
        ],
        // 					sendAddress: [{
        // 						required: true,
        // 						message: "请输入发送地址",
        // 					}],
        subject: [
          {
            required: true,
            message: "请输入主题"
          }
        ],
        mainBody: [
          {
            required: true,
            message: "请输入正文"
          }
        ]
      }
    };
  },
  watch: {
    backList(val) {
      // 邮件回填
      this.form.messageAddressee = val.mail.messageAddressee;
      this.form.messageRecipient = val.mail.messageRecipient;
      this.form.secretSendOff = val.mail.secretSendOff;
      // this.form.sendAddress = backList.mail.sendAddress
      this.form.subject = val.mail.subject;
      this.form.mainBody = val.mail.mainBody;
      // 短信回填
      this.form.letterAddressee = val.message.letterAddressee;
      this.form.shortMessage = val.message.shortMessage;
    }
  },
  methods: {
    // 传递节点名称给父组件
    changeNodeName(value) {
      this.$emit("changeNodeName", "label", value);
    },
    // 表单提交
    async submit() {
      const data = {
        structure: JSON.stringify({
          // 邮件字段
          mail: {
            messageAddressee: this.form.messageAddressee,
            messageRecipient: this.form.messageRecipient,
            secretSendOff: this.form.secretSendOff,
            // sendAddress: this.form.sendAddress,
            subject: this.form.subject,
            mainBody: this.form.mainBody
          },
          message: {
            // 短信字段
            letterAddressee: this.form.letterAddressee,
            shortMessage: this.form.shortMessage
          }
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
