<!--
 * @Author: 白亚勇
 * @Date: 2019-12-31 11:01:57
 * @LastEditors  : 白亚勇
 * @LastEditTime : 2020-04-26 10:44:43
 * @Description: 审批节点属性配置
 -->
<template>
  <div class="approvalNode">
    <div class='panelTitle'>审批节点</div>
     <div class='panelBody'>
        <el-tabs v-model="tableName" class="tabsPadding">
					<el-tab-pane label='基本信息' name='basicInfo'>
					</el-tab-pane>
					<el-tab-pane label='处理人' name='actorInfo'>
					</el-tab-pane>
					<el-tab-pane label='抄送人' name='copyToInfo' :disabled="form.copyOrNot == 'false'">
					</el-tab-pane>
          <el-tab-pane label='委派' name='delegate' :disabled="form.delegate == 'false'">
					</el-tab-pane>
					<el-tab-pane label='会签规则' name='completeInfo' :disabled='form.signatureType == "false"'>
					</el-tab-pane>
				</el-tabs>
				<div class="contentBody">
					<el-form :model="form" :rules="rules" ref="form">
						<div v-show="tableName =='basicInfo'">
              <el-form-item label="标题">
							<el-input  placeholder="请输入标题"  v-model='model.label'  @input="changeNodeName"></el-input>
							</el-form-item>
              <el-form-item label="是否抄送">
                	<el-radio-group v-model="form.copyOrNot">
                    <el-radio label="true">是</el-radio>
									<el-radio label="false">否</el-radio>
								</el-radio-group>
							</el-form-item>
              		<el-form-item label="是否委派">
								<el-radio-group v-model="form.delegate">
                  <el-radio label="true">是</el-radio>
									<el-radio label="false">否</el-radio>
								</el-radio-group>
							</el-form-item>
							<el-form-item label="是否会签">
								<el-radio-group v-model="form.signatureType">
                  <el-radio label="true">是</el-radio>
									<el-radio label="false">否</el-radio>
								</el-radio-group>
							</el-form-item>

              <el-form-item label="邮件通知">
								<el-checkbox-group v-model="form.promoter">
									<el-checkbox>发起人</el-checkbox>
								</el-checkbox-group>
								<el-checkbox-group v-model="form.pending">
									<el-checkbox>待处理人</el-checkbox>
								</el-checkbox-group>
							</el-form-item>
               <el-form-item label="是否超期设置">
								<el-radio-group v-model="form.timeLimit">
                  <el-radio label="true">是</el-radio>
									<el-radio label="false">否</el-radio>
								</el-radio-group>
							</el-form-item>
               <el-form-item label="选择天数" v-if="form.timeLimit =='true'">
								<el-input-number  v-model="form.days"  :min="1" :max="30"></el-input-number>
							</el-form-item>
						</div>
						<div v-show="tableName =='actorInfo'">
							<span class='title'>指定处理人 <el-button type="text" size="small" @click="create_getPage()">+添加</el-button></span>
							<el-table :data="actorUser">
								<el-table-column type="index" label="序号">
								</el-table-column>
								<el-table-column label="类型" width='300'>
									<template slot-scope="scope">
										{{scope.row.typeName}}
									</template>
								</el-table-column>
								<el-table-column fixed="right" label="操作">
									<template slot-scope="scope">
										<el-button type="text" size="small" @click="edit_getPage(scope.row,scope.$index)">编辑 |</el-button>
										<el-button type="text" size="small" @click="deleteRow(scope.$index)">删除</el-button>
									</template>
								</el-table-column>
							</el-table>
						</div>
						<div v-show="tableName =='copyToInfo'">
							<span class='title'>指定抄送人 <el-button type="text" size="small" @click="create_getPage()">+添加</el-button></span>
							<el-table :data="copyToUser">
								<el-table-column type="index" label="序号">
								</el-table-column>
								<el-table-column label="类型" width='300'>
									<template slot-scope="scope">
										{{scope.row.typeName}}
									</template>
								</el-table-column>
								</el-table-column>
								<el-table-column fixed="right" label="操作">
									<template slot-scope="scope">
										<el-button type="text" size="small" @click="edit_getPage(scope.row,scope.$index)">编辑 |</el-button>
										<el-button type="text" size="small" @click="deleteRow(scope.$index)">删除</el-button>
									</template>
								</el-table-column>
							</el-table>
						</div>
            	<div v-show="tableName =='delegate'">
							<span class='title'>指定委派人 <el-button type="text" size="small" @click="create_getPage()">+添加</el-button></span>
							<el-table :data="delegateUser">
								<el-table-column type="index" label="序号">
								</el-table-column>
								<el-table-column label="类型" width='300'>
									<template slot-scope="scope">
										{{scope.row.typeName}}
									</template>
								</el-table-column>
								</el-table-column>
								<el-table-column fixed="right" label="操作">
									<template slot-scope="scope">
										<el-button type="text" size="small" @click="edit_getPage(scope.row,scope.$index)">编辑 |</el-button>
										<el-button type="text" size="small" @click="deleteRow(scope.$index)">删除</el-button>
									</template>
								</el-table-column>
							</el-table>
						</div>
						<div v-show="tableName =='completeInfo'">
							<el-form-item label="节点条件" prop="type">
								<el-select v-model="form.type" placeholder="选择节点条件" filterable>
									<el-option value="1" label='按照groovy脚本计算'>
									</el-option>
									<el-option value="2" label='按照SQL计算'>
									</el-option>
									<el-option value="3" label='按照百分比计算'>
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item prop="content">
								<el-input-number v-if="form.type == '3'" v-model="form.content" controls-position="right" :min="1" :max="100"></el-input-number>
								 <div style="height:250px;" v-if="form.type != '3'" >
                     <monacoEditor language="java" v-model="form.content"/>
                  </div>
                <!-- <el-input v-if="form.type != '3'" type="textarea" placeholder="请输入" v-model="form.content"></el-input> -->
							</el-form-item>
              <el-form-item label="描述">
                <el-input placeholder="请描述" type="textarea" v-model="form.des"></el-input>
             </el-form-item>
						</div>
					</el-form>
					<div class="bottom">
						<el-button type="primary" @click='submit' :disabled="deployStatus == 'deploy'">确定</el-button>
						<el-button type="info"  @click='close'>关闭</el-button>
					</div>
				</div>
      </div>
      <actorUserForm ref="actor_user_form"></actorUserForm>
  </div>
</template>

<script>
import actorUserForm from './actorUserForm.vue';

export default {
  props: ['model','deployStatus', 'backList'],
  components: {
    actorUserForm,
  },
  data() {
    return {
      // 页签切换标识
      tableName: 'basicInfo',
      // 基本信息校验规则
      form: {
        signatureType: 'false', // 会签属性, true-会签、false-非会签
        copyOrNot: 'false', // 是否抄送
        delegate:'false',//是否委派
        timeLimit:'false',//是否超期设置
        type: '', // 完成条件
        days:'1',//超期天数
        content: '',
        des:'',
        promoter: '', // 处理-发起人
        pending: '', // 处理-待处理人
      },
      rules: {

      },
      actorUser: [], // 处理人集合
      copyToUser: [], // 抄送人集合
      delegateUser:[],//委派人集合
      // 调用流程List
      processList: [],
    };
  },
  watch: {
    backList(val) {
      // 基本信息回填
      this.form.signatureType = val.basicInfo.signatureType;
      this.form.copyOrNot = val.basicInfo.copyOrNot;
      this.form.delegate = val.basicInfo.delegate
      this.form.timeLimit = val.basicInfo.timeLimit;
      this.form.days = val.basicInfo.days;
      // 处理人回填
      this.actorUser = val.actorUser;
      // 抄送人回填
      this.copyToUser = val.copyToUser;
      // 委派人回填
      this.delegateUser = val.delegateUser;
      // 完成条件回填
      this.form.type = val.completeCondition.type;
      this.form.content = val.completeCondition.content;
      this.form.des = val.completeCondition.des;
      // 通知回填
      this.form.promoter = !!val.noticeInfo[0].to[0];
      this.form.pending = !!val.noticeInfo[0].to[1];
    },
  },
  methods: {
    // 传递节点名称给父组件
    changeNodeName(value) {
      this.$emit('changeNodeName', 'label', value);
    },
    // 格式化表格参数显示
    formatter(row, column) {
      let result = '';
      if (row && row.authority) {
        row.authority.forEach((auth) => {
          result += (`${auth},`);
        });
      }
      return result.substring(0, result.length - 1);
    },
    // 处理人新建（及抄送人）
    create_getPage() {
      if (this.tableName == 'actorInfo' && this.form.signatureType == 'false' && this.actorUser.length >= 1) {
        this.$message({
          message: '非会签属性仅允许添加一组处理人',
          type: 'warning',
        });
        return;
      }
      this.$refs.actor_user_form.getPage('create');
    },
    // 处理人编辑（及抄送人）
    edit_getPage(data, index) {
      this.$refs.actor_user_form.getPage('edit', data, index);
    },
    // 处理人删除（及抄送人）
    deleteRow(index) {
      if (this.tableName == 'actorInfo') {
        this.$.delete('此操作将永久删除该项数据, 是否继续?', () => {
          this.actorUser.splice(index, 1);
        });
      } else if(this.tableName == 'copyToInfo'){
        this.$.delete('此操作将永久删除该项数据, 是否继续?', () => {
          this.copyToUser.splice(index, 1);
        });
      }else{
        this.$.delete('此操作将永久删除该项数据, 是否继续?', () => {
          this.delegateUser.splice(index, 1);
        });
      }
    },
    async submit() {
      if (!this.validataApprovalConfig()) {
        return;
      }
      const data = {
        structure: JSON.stringify({
          // 基本信息
          basicInfo: {
            signatureType: this.form.signatureType,
            copyOrNot: this.form.copyOrNot,
            delegate: this.form.delegate,
            timeLimit:this.form.timeLimit,
            days:this.form.days
          },
          // 处理人
          actorUser: this.actorUser,
          // 抄送人
          copyToUser: this.copyToUser,
          //委派人
          delegateUser:this.delegateUser,
          // 完成条件
          completeCondition: {
            type: this.form.type,
            content: this.form.content,
            des:this.form.des
          },
          // 通知
          noticeInfo: [{
            type: 'email',
            to: [this.form.promoter ? 'start' : '', this.form.pending ? 'next' : ''],
          }],
        }),
      };
      this.$parent.save(data);
      this.close();
    },
    validataApprovalConfig() {
      /**
                     * 处理人配置非空校验
                     */
      if (this.actorUser == null || this.actorUser.length < 1) {
        this.$message({
          message: '无法保存，处理人配置不能为空',
          type: 'warning',
        });
        return false;
      }
      /**
                     * 勾选抄送人，抄送人配置校验非空
                     * 未勾选抄送人，清空相关数据
                     */
      if (this.form.copyOrNot == 'true') {
        if (this.copyToUser == null || this.copyToUser.length < 1) {
          this.$message({
            message: '无法保存，抄送人配置不能为空',
            type: 'warning',
          });
          return false;
        }
      } else {
        this.copyToUser = [];
      }
      /**
                     * 勾选会签，完成条件必须非空
                     * 未勾选，清空对应数据
                     */
      if (this.form.signatureType == 'true') {
        if (!this.form.type || !this.form.content) {
          this.$message({
            message: '无法保存，会签规则配置不能为空',
            type: 'warning',
          });
          return false;
        }
      } else {
        this.form.type = '';
        this.form.content = '';
        this.form.des = '';
      }
      return true;
    },
    close() {
      this.model.clazz = '';
    },
  },
};
</script>

<style lang="less" rel="stylesheet/less">

</style>
