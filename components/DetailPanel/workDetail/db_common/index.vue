<!--
 * @Author: 白亚勇
 * @Date: 2019-12-31 11:01:57
 * @LastEditors  : 白亚勇
 * @LastEditTime : 2020-04-29 17:03:54
 * @Description: db 插件属性配置
 -->
<template>
  <div class="db_common">
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
          <el-form-item
            label="选择业务表"
            prop="tableId"
            v-if="model.clazz !== 'db_findBySQLWhere' && model.clazz !== 'db_findBySQLPage'"
          >
            <el-select
              v-model="form.tableId"
              placeholder="请选择业务表"
              filterable
              clearable
              @change="selectTable"
            >
              <el-option
                v-for="item in tableList"
                :key="item.id"
                :label="item.nameEn"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="template-tab">
          <commonPage
            v-if="
              model.clazz != 'db_update' &&
                model.clazz !== 'db_findBySQLWhere' &&
                model.clazz !== 'db_findBySQLPage'
            "
            :loading="loading"
            :filedList="fieldList"
            :valueList="valueList"
            :interfaceCode="model.clazz.split('_')[1]"
          />
          <editPage
            v-if="model.clazz == 'db_update'"
            :loading="loading"
            :filedList="fieldList"
            :valueList="valueList"
            :filedListUp="fieldListUp"
          />
          <d2aRequestParam
            ref="d2aRequestParam"
            :interfaceCode="model.clazz.split('_')[1]"
            v-if="model.clazz == 'db_findBySQLWhere' || model.clazz == 'db_findBySQLPage'"
            id="d2aRequestParam"
            style="padding:20px;"
          ></d2aRequestParam>
        </div>
        <div class="bottom">
          <el-button type="primary" @click="submit">确定</el-button>
          <el-button type="info" @click="close">关闭</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getTable, checkField } from "../service";
import commonPage from "@/components/interfaceDesign/baseApiConfig/commonPage";
import editPage from "@/components/interfaceDesign/baseApiConfig/editPage";
import d2aRequestParam from "@/components/interfaceDesign/d2aRequestParam";
export default {
  props: ["model", "backList", "inAndOutvar", "vars"],
  components: {
    commonPage,
    editPage,
    d2aRequestParam
  },
  data() {
    return {
      form: {
        tableId: "",
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
        ],
        tableId: [
          {
            required: true,
            message: "请选择业务表"
          }
        ]
      },
      tableList: [], // 业务表list
      fieldList: [], //字段
      fieldListUp: [], //编辑新增条件字段
      valueList: [], //值
      loading: false
    };
  },
  mounted() {
    this.getTable();
  },
  watch: {
    backList(val) {
      if (this.model.clazz == "db_update") {
        this.fieldList = val.pluginJson.set;
        this.fieldListUp = val.pluginJson.condition;
      } else if (this.model.clazz == "db_insert") {
        this.fieldList = val.pluginJson.set;
      } else {
        this.fieldList = val.pluginJson.condition;
      }
      this.form.tableId = val.tableId;
      this.valueList = this.fieldList.map(val => val.fieldNameCn || val.fieldNameEn);
      if (this.model.clazz == "db_findBySQLPage" || this.model.clazz == "db_findBySQLWhere") {
        this.$refs.d2aRequestParam.customList = val.pluginJson.condition;
        this.$refs.d2aRequestParam.sql = val.pluginJson.sql;
      }
    },
    inAndOutvar(val) {
      this.form.dataInVar = val.dataInVar;
      this.form.dataOutVar = val.dataOutVar;
    }
  },
  methods: {
    // 传递节点名称给父组件
    changeNodeName(value) {
      this.$emit("changeNodeName", "label", value);
    },
    //获取导入表
    async getTable() {
      let data = {
        dbId: this.$.localStorage.get("systemParam").dbId
      };
      let res = await getTable(data);
      if (res.status == "success") {
        this.tableList = res.content;
      } else {
        this.tableList = [];
      }
    },
    //选择表
    selectTable() {
      this.getFields();
      this.loading = true;
    },
    // 查询默认字段
    async getFields() {
      const data = {
        tableId: this.form.tableId
      };
      const res = await checkField(data);
      res.content.forEach(item => {
        item.operation = "";
        item.flag = false;
        item.value = "";
      });
      this.fieldList = res.content;
      this.fieldListUp = JSON.parse(JSON.stringify(res.content));
      this.valueList = this.fieldList.map(val => val.fieldNameCn || val.fieldNameEn);
      this.loading = false;
    },
    submit() {
      let pluginJson;
      if (this.model.clazz != "db_findBySQLPage" || this.model.clazz != "db_findBySQLWhere") {
        if (this.model.clazz == "db_update") {
          pluginJson = {
            set: this.fieldList.map(val => ({
              flag: val.flag,
              fieldNameCn: val.fieldNameCn,
              fieldNameEn: val.fieldNameEn,
              type: val.type,
              operation: val.operation,
              value: val.value
            })),
            condition: this.fieldListUp.map(val => ({
              flag: val.flag,
              fieldNameCn: val.fieldNameCn,
              fieldNameEn: val.fieldNameEn,
              type: val.type,
              operation: val.operation,
              value: val.value
            }))
          };
        } else if (this.model.clazz == "db_insert") {
          pluginJson = {
            set: this.fieldList.map(val => ({
              flag: val.flag,
              fieldNameCn: val.fieldNameCn,
              fieldNameEn: val.fieldNameEn,
              type: val.type,
              operation: val.operation,
              value: val.value
            }))
          };
        } else {
          pluginJson = {
            condition: this.fieldList.map(val => ({
              flag: val.flag,
              fieldNameCn: val.fieldNameCn,
              fieldNameEn: val.fieldNameEn,
              type: val.type,
              operation: val.operation,
              value: val.value
            }))
          };
        }
      } else {
        pluginJson = {
          condition: this.$refs.d2aRequestParam.customList,
          sql: this.$refs.d2aRequestParam.sql
        };
      }
      const editData = {
        dataInVar: this.form.dataInVar,
        dataOutVar: this.form.dataOutVar,
        pluginJson: JSON.stringify({
          tableId: this.form.tableId,
          pluginJson: pluginJson
        })
      };
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.$parent.save(editData);
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
