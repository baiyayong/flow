<!--
 * @Author: 白亚勇
 * @Date: 2020-01-02 16:52:25
 * @LastEditors  : 白亚勇
 * @LastEditTime : 2020-05-07 16:31:59
 * @Description: 工作流主页面
 -->
<template>
  <div class="root">
    <!-- 头部工具栏 -->
    <ToolbarPanel
      ref="toolBar"
      @saveData="save"
      @deleteNode="deleteNode"
      @configVar="configVar"
      @exit="exit"
      :type="type"
      v-if="mode == 'edit'"
      :deployStatus="deployStatus"
    />
    <div class="content">
      <!-- 左侧 -->
      <ItemPanel ref="itemPanel" :type="type" v-if="mode == 'edit'" />
      <!-- 画布 -->
      <div
        :id="pageId"
        class="canvasPanel"
        :class="{ canvasPanelWidth: type == 'workFow' }"
        ref="canvasPanel"
      ></div>
      <!-- bpm流程属性配置 -->
      <bpmDetailPanel
        v-if="type == 'bpmFlow' && mode == 'edit'"
        :model="selectedModel"
        @onChangeName="onItemCfgChange"
        ref="bpmDetailPanel"
        :flowId="flowId"
        :deployStatus="deployStatus"
      />
      <!-- 工作流属性配置 -->
      <workDetailPanel
        v-if="type == 'workFow' && mode == 'edit'"
        :model="selectedModel"
        ref="workDetailPanel"
        @onChangeName="onItemCfgChange"
        :flowId="flowId"
        :vars="vars"
      />
    </div>
  </div>
</template>

<script>
import G6 from "@antv/g6/src";
import { getShapeName } from "./util/clazz"; // 左侧节点名称定义
import Command from "./plugins/command"; // 公共方法
import Toolbar from "./plugins/toolbar"; // 工具栏
import AddItemPanel from "./plugins/addItemPanel"; // 左侧节点
import CanvasPanel from "./plugins/canvasPanel"; // 画布
import { exportXML } from "./util/bpmn"; // xml
import ToolbarPanel from "./components/ToolbarPanel"; // 引入工具栏组件
import ItemPanel from "./components/ItemPanel"; // 引入左侧列表组件
import bpmDetailPanel from "./components/DetailPanel/bpmDetail"; // 引入Bpm右侧配置组件
import workDetailPanel from "./components/DetailPanel/workDetail"; // 引入工作流右侧配置组件
import registerShape from "./shape"; // 定义线及结点形状等的一些方法
import registerBehavior from "./behavior"; // 定义线及结点的一些拖拽等行为

registerShape(G6);
registerBehavior(G6);

export default {
  name: "G6Editor",
  components: {
    ToolbarPanel,
    ItemPanel,
    bpmDetailPanel,
    workDetailPanel
  },
  props: ["isView", "mode", "vars", "data", "flowId", "flowName", "type", "deployStatus"],
  created() {},
  mounted() {
    this.componentDidMount();
  },
  data() {
    return {
      pageId: "canvasPanel",
      graph: null,
      selectedModel: {},
      processModel: {
        id: "",
        name: "",
        clazz: ""
      }
    };
  },
  methods: {
    // 初始化页面布局
    componentDidMount() {
      const height = $(".canvasPanel").height();
      const width = $(".canvasPanel").width();
      let plugins = [],
        toolbar = {},
        addItemPanel = {};
      if (this.isView) {
        const cmdPlugin = new Command();
        const canvasPanel = new CanvasPanel({ container: this.$refs.canvasPanel });
        if (this.mode == "edit") {
          toolbar = new Toolbar({ container: this.$refs.toolBar.$el });
          addItemPanel = new AddItemPanel({ container: this.$refs.itemPanel.$el });
        }
        plugins = [cmdPlugin, toolbar, addItemPanel, canvasPanel];
      }
      this.graph = new G6.Graph({
        plugins,
        container: "canvasPanel",
        // renderer: "svg",
        height,
        width,
        modes: {
          default: ["drag-canvas", "clickSelected"],
          view: [],
          edit: [
            "drag-canvas",
            "hoverNodeActived",
            "hoverAnchorActived",
            "dragNode",
            "dragEdge",
            "dragPanelItemAddNode",
            "clickSelected",
            "deleteItem",
            "itemAlign",
            "dragPoint"
          ]
        },
        defaultEdge: {
          shape: "flow-polyline-round"
        }
      });
      // 保存XML
      this.graph.saveXML = (createFile = true) =>
        exportXML(this.graph.save(), { id: this.flowId, name: this.flowName }, createFile);
      this.graph.setMode(this.mode); // 设置编辑模式edit 或设置预览模式view
      // 流程数据回填
      this.graph.data(this.data ? this.initShape(this.data) : { nodes: [], edges: [] });
      this.graph.render();
      // if (this.isView) {
      //   this.graph.fitView(5);
      // } //预览模式，禁止视图操作

      this.initEvents();
    },
    // 初始化点和线
    initShape(data) {
      if (data && data.nodes) {
        return {
          nodes: data.nodes.map(node => ({
            shape: getShapeName(node.clazz),
            ...node
          })),
          edges: data.edges
        };
      }
      return data;
    },
    // 初始化事件
    initEvents() {
      this.graph.on("afteritemselected", items => {
        if (items && items.length > 0) {
          let item = this.graph.findById(items[0]);
          if (!item) {
            item = this.getNodeInSubProcess(items[0]); // 处理子流程
          }
          this.selectedModel = { ...item.getModel() };
          console.log(this.selectedModel);
        } else {
          this.selectedModel = this.processModel; // 至回空面板
        }
      });
    },
    // 属性配置change方法
    onItemCfgChange(key, value) {
      const items = this.graph.get("selectedItems");
      if (items && items.length > 0) {
        let item = this.graph.findById(items[0]);
        if (!item) {
          item = this.getNodeInSubProcess(items[0]);
        }
        if (this.graph.executeCommand) {
          this.graph.executeCommand("update", {
            itemId: items[0],
            updateModel: { [key]: value }
          });
        } else {
          this.graph.updateItem(item, { [key]: value });
        }
        // this.selectedModel = { ...item.getModel() };
      } else {
        const canvasModel = { ...this.processModel, [key]: value };
        // this.selectedModel = canvasModel;
        this.processModel = canvasModel;
      }
    },
    // 获取到子流程节点数据
    getNodeInSubProcess(itemId) {
      const subProcess = this.graph.find("node", node => {
        if (node.get("model")) {
          const { clazz } = node.get("model");
          if (clazz === "subProcess" || clazz === "pool") {
            // 子流程处理逻辑
            const containerGroup = node.getContainer();
            const { subGroup } = containerGroup;
            const item = subGroup.findById(itemId);
            return subGroup.contain(item);
          }
          return false;
        }
        return false;
      });
      if (subProcess) {
        const group = subProcess.getContainer();
        return group.getItem(subProcess, itemId);
      }
      return null;
    },
    // 保存数据
    save() {
      this.$emit("save", {
        structure: this.graph.save(),
        bpmXml: this.graph.saveXML()
      });
    },
    // 删除节点
    deleteNode() {
      this.$emit("deleteNode", this.selectedModel.id);
      this.selectedModel = ""; // 删除节点时将配置面板隐藏
    },
    // 流程变量
    configVar() {
      this.$emit("configVar");
    },
    exit() {
      this.$emit("exit");
    }
  }
};
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./style.less";
</style>
