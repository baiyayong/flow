<!--
 * @Author: 白亚勇
 * @Date: 2019-12-31 11:01:57
 * @LastEditors  : 白亚勇
 * @LastEditTime : 2020-04-24 11:24:49
 * @Description: 工具栏
 -->
<template>
  <div class="toolbar">
    <el-tooltip effect="dark" content="撤销" placement="bottom">
      <div class="command" data-command="undo">
        <img src="../../assets/tool/revoke.svg" />
        <!-- <span class="el-icon-refresh-left" /> -->
      </div>
    </el-tooltip>
    <el-tooltip effect="dark" content="重复" placement="bottom">
      <div class="command" data-command="redo">
        <img src="../../assets/tool/repeat.svg" />
        <!-- <span class="el-icon-refresh-right" /> -->
      </div>
    </el-tooltip>
    <div class="separator"></div>
    <el-tooltip effect="dark" content="复制" placement="bottom">
      <div class="command" data-command="copy">
        <img src="../../assets/tool/copy.svg" />
        <!-- <span class="el-icon-document-copy" /> -->
      </div>
    </el-tooltip>
    <el-tooltip effect="dark" content="粘贴" placement="bottom">
      <div class="command" data-command="paste">
        <img src="../../assets/tool/paste.svg" />
        <!-- <span class="el-icon-folder-add" /> -->
      </div>
    </el-tooltip>
    <el-tooltip effect="dark" content="删除" placement="bottom">
      <div
        class="command"
        data-command="delete"
        @click="deleteNode"
        :class="deployStatus == 'deploy' ? 'disableSave' : ''"
      >
        <img src="../../assets/tool/delete.svg" />
        <!-- <span class="el-icon-delete" /> -->
      </div>
    </el-tooltip>
    <div class="separator"></div>
    <el-tooltip effect="dark" content="放大" placement="bottom">
      <div class="command" data-command="zoomIn">
        <img src="../../assets/tool/enlarge.svg" />
        <!-- <span class="el-icon-zoom-in" /> -->
      </div>
    </el-tooltip>
    <el-tooltip effect="dark" content="缩小" placement="bottom">
      <div class="command" data-command="zoomOut">
        <img src="../../assets/tool/narrow.svg" />
        <!-- <span class="el-icon-zoom-out" /> -->
      </div>
    </el-tooltip>
    <el-tooltip effect="dark" content="实际大小" placement="bottom">
      <div class="command" data-command="resetZoom">
        <img src="../../assets/tool/actualSize.svg" />
        <!-- <span class="el-icon-postcard" /> -->
      </div>
    </el-tooltip>
    <el-tooltip effect="dark" content="适应屏幕" placement="bottom">
      <div class="command" data-command="autoFit">
        <img src="../../assets/tool/adaptiveScreen.svg" />
        <!-- <span class="el-icon-full-screen" /> -->
      </div>
    </el-tooltip>
    <div class="separator"></div>
    <el-tooltip effect="dark" content="移到上一层" placement="bottom">
      <div class="command" data-command="toFront">
        <!-- <span class="el-icon-money" /> -->
        <img src="../../assets/tool/upperStory.svg" />
      </div>
    </el-tooltip>
    <el-tooltip effect="dark" content="移到下一层" placement="bottom">
      <div class="command" data-command="toBack">
        <!-- <span class="el-icon-tickets" /> -->
        <img src="../../assets/tool/nextFloor.svg" />
      </div>
    </el-tooltip>
    <el-tooltip
      effect="dark"
      :content="type == 'bpmFlow' ? '流程变量' : '全局变量'"
      placement="bottom"
    >
      <div class="command" data-command="toBack" @click="configVar">
        <!-- <span class="el-icon-tickets" /> -->
        <img src="../../assets/tool/inlatformSet.svg" />
      </div>
    </el-tooltip>
    <el-tooltip effect="dark" content="保存" placement="bottom">
      <div
        class="command save"
        @click="save"
        :class="deployStatus == 'deploy' ? 'disableSave' : ''"
      >
        <img src="../../assets/tool/save.svg" class="icon" />保存
      </div>
    </el-tooltip>
    <el-tooltip effect="dark" content="退出" placement="bottom">
      <div class="command back" @click="exit">
        <img src="../../assets/tool/back.svg" class="icon" />退出
      </div>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  props: ["type", "deployStatus"],
  data() {
    return {};
  },
  created() {},
  methods: {
    // 关闭弹框
    exit() {
      this.$emit("exit");
    },
    // 流程变量
    configVar() {
      this.$emit("configVar");
    },
    // 删除节点
    deleteNode() {
      this.$emit("deleteNode");
    },
    // 保存数据
    save() {
      this.$emit("saveData");
    }
  }
};
</script>

<style lang="less" rel="stylesheet/less">
@import "./style.less";
</style>
