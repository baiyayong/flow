<!--
 * @Author: 白亚勇
 * @Date: 2019-12-30 16:18:20
 * @LastEditors  : 白亚勇
 * @LastEditTime : 2020-04-23 16:26:26
 * @Description:新建编辑
 -->

<template>
  <el-dialog
    v-drag
    :title="dialogTitle"
    :type="dialogType"
    :visible.sync="show"
    size="tiny"
    :close-on-click-modal="false"
    :append-to-body="true"
  >
    <el-form :model="actorForm" :rules="rules" ref="actorForm">
      <el-form-item label="添加规则" prop="type">
        <el-select
          v-model="actorForm.type"
          placeholder="选择规则"
          style="width: 100%;"
          @change="selectType"
        >
          <el-option-group
            v-for="group in ruleList"
            :key="group.id"
            :value="group.id"
            :label="group.name"
          >
            <el-option
              v-for="item in group.children"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            >
            </el-option>
          </el-option-group>
        </el-select>
      </el-form-item>
      <el-form-item
        label="部门"
        prop="department"
        v-if="actorForm.type == 'withDepartment' || actorForm.type == 'withDepartmentStation'"
      >
        <el-select v-model="actorForm.department" filterable style="width: 100%;">
          <el-option
            v-for="item in departmentData"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="岗位"
        prop="station"
        v-if="actorForm.type == 'withStation' || actorForm.type == 'withDepartmentStation'"
      >
        <el-select v-model="actorForm.station" filterable style="width: 100%;">
          <el-option
            v-for="item in stationData"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户" prop="companyUser" v-if="actorForm.type == 'withCompanyUser'">
        <el-select
          v-model="actorForm.companyUser"
          placeholder="选择用户"
          filterable
          style="width: 100%;"
        >
          <el-option v-for="item in userData" :key="item.id" :value="item.id" :label="item.name">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submit()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Vue from "vue";
import {
  getDepartment, // 部门
  getstation, // 岗位
  getUsers // 业务账号
} from "../service";

export default {
  data() {
    return {
      dialogTitle: "新建指定处理人", // 指定处理人弹出框默认标题
      dialogType: "createActorUser",
      show: false,
      companyData: [], // 组织机构
      departmentData: [], //部门
      stationData: [], //岗位
      userData: [], //用户
      // 处理人新建
      actorForm: {
        type: "", // 处理人指定类型，按照岗位、按部门、交集、sql等
        typeName: "",
        // authority: [], // 权限类型，1-查看、2-审批、3-委派、4-退回
        company: [], // 企业id
        department: [], // 部门id
        station: [], // 岗位id
        companyUser: [], // 业务账号id
        union: [], // 并集
        intersection: [] // 交集
      },
      rules: {},
      // 规则List
      ruleList: require("../../../../util/rule_list.json")
    };
  },
  created() {},
  methods: {
    getPage(dialogType, data, index) {
      this.dialogType = dialogType;
      // 判断弹出框类型，create-添加-清空输入框，edit-编辑-回显内容
      if (dialogType == "edit") {
        if (this.$parent.tableName == "actorInfo") {
          this.dialogTitle = "编辑指定处理人";
        } else if (this.$parent.tableName == "copyToInfo") {
          this.dialogTitle = "编辑指定抄送人";
        } else {
          this.dialogTitle = "编辑指定委派人";
        }
        let formEditData = {};
        if (data.type == "withUnion") {
          formEditData = JSON.parse(JSON.stringify(data.content.union[0]));
        } else if (data.type == "withIntersection") {
          formEditData = JSON.parse(JSON.stringify(data.content.intersection[0]));
        } else {
          formEditData = data.content;
        }
        this.actorForm = {
          type: data.type, // 处理人指定类型，按照岗位、按部门、交集、sql等
          typeName: data.typeName, // 类型名称回显
          // authority: data.authority, // 权限类型，1-查看、2-审批、3-委派、4-退回
          company: formEditData.company, // 部门id
          department: formEditData.department, // 部门岗位id
          station: formEditData.station, // 用户组id
          companyUser: formEditData.companyUser // 用户id
        };
        this.indexRow = index;
      } else {
        if (this.$parent.tableName == "actorInfo") {
          this.dialogTitle = "新建指定处理人";
        } else if (this.$parent.tableName == "copyToInfo") {
          this.dialogTitle = "新建指定抄送人";
        } else {
          this.dialogTitle = "新建指定委派人";
        }
        this.actorForm = {
          type: "", // 处理人指定类型，按照岗位、按部门、交集、sql等
          typeName: "",
          // authority: [], // 权限类型，1-查看、2-审批、3-委派、4-退回
          company: [], // 部门id
          department: [], // 部门岗位id
          station: [], // 用户组id
          companyUser: [], // 用户id
          union: [], // 并集
          intersection: [] // 交集
        };
      }
      $(".el-dialog").css("height", "auto"); // 弹框高度问题
      this.show = true;
      this.getDepartment(); //查询部门
      this.getstation(); //查询岗位
      this.getUsers(); //查询业账号
    },
    //  规则下拉切换获取规则名称
    selectType() {
      this.ruleList.forEach(val => {
        if (val.children) {
          val.children.forEach(item => {
            if (item.id == this.actorForm.type) {
              this.actorForm.typeName = item.name;
            }
          });
        }
      });
    },
    // 获取部门
    async getDepartment() {
      let data = {
        appId: this.$.localStorage.get("systemParam").id
      };
      const res = await getDepartment(data);
      if (res.status == "success") {
        this.departmentData = res.content;
      }
    },
    // 获取岗位
    async getstation() {
      let data = {
        appId: this.$.localStorage.get("systemParam").id
      };
      const res = await getstation(data);
      if (res.status == "success") {
        this.stationData = res.content;
      }
    },
    // 获取业务账号
    async getUsers() {
      let data = {
        appId: this.$.localStorage.get("systemParam").id
      };
      const res = await getUsers(data);
      if (res.status == "success") {
        this.userData = res.content;
      }
    },
    // getChildren(data) {
    //   for (let i = 0; i < data.length; i++) {
    //     if (data[i].children) {
    //       if (data[i].data == "company") {
    //         this.companyData.push(data[i]);
    //       } else if (data[i].data == "department") {
    //         this.departmentData.push(data[i]);
    //       } else if (data[i].data == "station") {
    //         this.stationData.push(data[i]);
    //       }
    //       if (data[i] && data[i].children.length > 0) {
    //         // 如果还有子节点，执行递归
    //         this.getChildren(data[i].children);
    //       }
    //     } else {
    //       this.userData.push(data[i]);
    //     }
    //   }
    // },
    /** 获取指定处理人dialog中的数据内容并格式化返回 */
    getSubmitData() {
      /* 交集并集单独以数组形式存放，方便后续交集并集混合情况扩展 */
      const initFromData = {
        type: this.actorForm.type, // 处理人指定类型，按照岗位、按部门、交集、sql等
        // authority: this.actorForm.authority, // 权限类型，1-查看、2-审批、3-委派、4-退回
        typeName: this.actorForm.typeName, // 类型名称
        content: {
          company: this.actorForm.company, // 部门id
          department: this.actorForm.department, // 部门岗位id
          station: this.actorForm.station, // 用户组id
          // role: this.actorForm.role, // 用户组岗位id
          companyUser: this.actorForm.companyUser, // 用户id
          union: [], // 并集内容
          intersection: [] // 交集内容
        }
      };
      if (this.actorForm.type == "withUnion") {
        initFromData.content.union.push(JSON.parse(JSON.stringify(initFromData.content)));
      } else if (this.actorForm.type == "withIntersection") {
        initFromData.content.intersection.push(JSON.parse(JSON.stringify(initFromData.content)));
      }
      if (this.actorForm.type == "withUnion" || this.actorForm.type == "withIntersection") {
        initFromData.content.company = [];
        initFromData.content.department = [];
        initFromData.content.station = [];
        // initFromData.content.role = [];
        initFromData.content.companyUser = [];
      }
      return initFromData;
    },
    submit() {
      if (this.$parent.tableName == "actorInfo") {
        this.$refs.actorForm.validate(valid => {
          if (valid) {
            this.show = false;
            if (this.dialogType == "edit") {
              Vue.set(this.$parent.actorUser, this.indexRow, this.getSubmitData()); // 直接使用数组赋值，无法触发视图更新
            } else {
              this.$parent.actorUser.push(this.getSubmitData());
            }
          } else {
            return false;
          }
        });
      } else if (this.$parent.tableName == "copyToInfo") {
        this.$refs.actorForm.validate(valid => {
          if (valid) {
            this.show = false;
            if (this.dialogType == "edit") {
              Vue.set(this.$parent.copyToUser, this.indexRow, this.getSubmitData()); // 直接使用数组赋值，无法触发视图更新
            } else {
              this.$parent.copyToUser.push(this.getSubmitData());
            }
          } else {
            return false;
          }
        });
      } else {
        this.$refs.actorForm.validate(valid => {
          if (valid) {
            this.show = false;
            if (this.dialogType == "edit") {
              Vue.set(this.$parent.delegateUser, this.indexRow, this.getSubmitData()); // 直接使用数组赋值，无法触发视图更新
            } else {
              this.$parent.delegateUser.push(this.getSubmitData());
            }
          } else {
            return false;
          }
        });
      }
    }
  }
};
</script>

<style lang="less" rel="stylesheet/less"></style>
