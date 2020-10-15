<template>
<a-modal v-model="visible" :title="title" on-ok="handleOk" :width="900" @cancel="handleCancel" :maskClosable="false" :destroyOnClose="true">
      <template slot="footer">
        <a-button v-show="current === 0"  @click="nextStep">下一页</a-button>
        <a-button v-show="current === 1"  style="margin-left: 8px" @click="prevStep">上一页</a-button>
        <a-button v-show="current === 1" :loading="loading" type="primary" @click="handleSubmit">提交</a-button>
      </template>
        <a-steps class="steps" :current="current">
          <a-step :title="item.title" v-for="(item,index) in stepTitle" :key="index"/>
        </a-steps>
        <div class="content">
          <step1 ref="person" v-show="current === 0" @nextStep="nextStep"></step1>
          <step2 ref="form" v-show="current === 1" :submitFun="submitFun" :formTitle="formTitle" :record="record" :rules="rules" @nextStep="nextStep" @prevStep="prevStep" @handleOk="handleOk"></step2>
        </div>
    </a-modal>
</template>

<script>
import Step1 from './Step1'
import Step2 from './Step2'

export default {
  name: 'StepForm',
  components: {Step1, Step2},
  props: {
    title:{
      type: String,
      default: "Title",
    },
    stepTitle:{
      type: Array,
      default: () => [{title:'第一步'},{title:'第二步'}],
    },
    formTitle: {
      type: Array,
      default: () => [],
    },
    submitFun: {
      type: Function,
      default: null,
    },
    rules: {
      type: Object,
      default: null,
    },
    record: {
      type: Object,
      default: null,
    },
    replaceFields: {
      type: Object,
      default() {
        return {
          children: "children",
          title: "title",
          key: "key",
          value: "value",
        };
      },
    },
    layout: {
      type: String,
      default: "horizontal",
    },
  },
  data () {
    return {
      visible:false,
      current: 0,
      loading:false
    }
  },
  methods: {
    nextStep () {
      if (this.current < 2) {
        this.current += 1
      }
    },
    prevStep () {
      if (this.current > 0) {
        this.current -= 1
      }
    },
    handleSubmit() {
      console.log("监听了 modal submit 事件")
       this.$refs.form.nextStep()
    },
    handleOk(params) {
      this.loading=true
      this.$refs.person.selectedRows
      let form = {
        personData:this.$refs.person.selectedRows,
        formData:params
      }
      console.log(params)
      console.log("1监听了 modal ok 事件");
      if(params.fileList){
        const formData = new FormData();
        params.fileList.forEach(file => {
          formData.append('files[]', file);
        });
        console.log(formData)
        form.fileData = formData
      }
      setTimeout(()=>{
        const result = this.submitFun(form);
          result
            .then((res) => {
              console.log(form)
              console.log(res);
              this.$message.success('成功');
              this.handleCancel()
            })
            .catch((err) => {
              this.loading=false
              console.log(err);
            });
      },3000)
      
    },
    handleCancel () {
      console.log('监听了 modal cancel 事件')
      this.loading=false
      this.current=0
      this.visible=false
    },
  }
}
</script>

<style lang="less" scoped>
  .steps{
    max-width: 500px;
    margin: 16px auto;
  }
</style>
