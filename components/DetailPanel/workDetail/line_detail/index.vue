<!--
 * @Author: 白亚勇
 * @Date: 2019-12-31 11:01:57
 * @LastEditors  : 白亚勇
 * @LastEditTime : 2020-04-10 16:00:16
 * @Description: 线上属性配置
 -->
<template>
  <div class="line_detail">
     <div class='panelTitle'>连接线</div>
     <div class='panelBody'>
				<div class="contentBody">
         	<el-form :model="form" :rules="rules" ref="form">
              <el-form-item label="标题">
							<el-input  placeholder="请输入标题"  v-model='model.label'  @input="changeNodeName"></el-input>
							</el-form-item>
              <el-form-item label="表达式类型">
						     <el-select v-model="form.conditionType" size="mini" style="width:100%">
                  <el-option
                    v-for="item in typeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
              </el-select>
							</el-form-item>
               <el-form-item label="表达式">
                  <div style="height:250px;margin-top:34px">
                     <monacoEditor :language="'java'"/>
                  </div>
							</el-form-item>
					</el-form>
					<div class="bottom">
						<el-button type="primary" @click='submit'>确定</el-button>
						<el-button type="info"  @click='close'>关闭</el-button>
					</div>
				</div>
      </div>
  </div>
</template>

<script>
import {

} from '../service';

export default {
  props: ['model', 'flowId'],
  data() {
    return {
      form: {
        conditionType: '',
      },
      rules: {},
      des: '',
      typeList: [
        { name: 'java语言', id: 'java' },
        { name: 'juel', id: 'juel' },
      ],
    };
  },
  mounted() {
    console.log(this.model, 'xian');
  },
  methods: {
    // 传递节点名称给父组件
    changeNodeName(value) {
      this.$emit('changeNodeName', 'label', value);
    },
    close() {
      this.model.clazz = '';
    },
  },
};
</script>

<style lang="less" rel="stylesheet/less">

</style>
