<!--
 * @Author: 白亚勇
 * @Date: 2019-12-31 11:01:57
 * @LastEditors  : 白亚勇
 * @LastEditTime : 2020-04-16 17:01:25
 * @Description: 泳道属性配置
 -->
<template>
  <div class="pool">
     <div class='panelTitle'>泳道</div>
     <div class='panelBody'>
				<div class="contentBody">
         	<el-form :model="form" :rules="rules" ref="form">
              <el-form-item label="标题">
							<el-input  placeholder="请输入标题"  v-model='model.label'  @input="changeNodeName"></el-input>
							</el-form-item>
					</el-form>
					<div class="bottom">
						<!-- <el-button type="primary" @click='submit'>确定</el-button> -->
						<el-button type="info"  @click='close'>关闭</el-button>
					</div>
				</div>
      </div>
  </div>
</template>

<script>

export default {
  props: ['model'],
  data() {
    return {
      form: {

      },
      rules: {},
    };
  },
  mounted() {

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
