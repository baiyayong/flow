<!--
 * @Author: 白亚勇
 * @Date: 2019-12-30 16:18:20
 * @LastEditors  : 白亚勇
 * @LastEditTime : 2020-04-28 15:11:22
 * @Description: 左侧组件
 -->

<template>
  <div class="itempanel" :class="{ itempanellWidth: type == 'workFow' }">
    <el-scrollbar style="height: 100%">
      <el-menu default-active="1-1" mode="vertical" :unique-opened="true">
        <el-submenu v-for="group in list" :index="group.id" :key="group.id">
          <template slot="title"
            ><span>{{ group.name }}</span></template
          >
          <el-menu-item v-for="item in group.children" :index="item.id" :key="item.id">
            <div
              class="dataItem"
              onselectstart="return false;"
              :data-item="JSON.stringify({ clazz: item.type, size: item.size, label: item.name })"
            >
              <img :src="require('../../assets/flow/' + item.icon + '.svg')" />
              <div class="nodeName" :class="{ itemWidth: type == 'workFow' }" :title="item.name">
                {{ item.name }}
              </div>
            </div>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
export default {
  props: ["type"],
  data() {
    return {
      list:
        this.type == "bpmFlow"
          ? require("../../util/bpmItem.json")
          : require("../../util/workItem.json")
    };
  },
  created() {},
  methods: {}
};
</script>

<style lang="less" rel="stylesheet/less">
@import "./style.less";
</style>
