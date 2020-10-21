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
          <step2 ref="form" v-show="current === 1" :submitFun="submitFun" :formTitle="nowFormTitle" :record="selcetPersonName" :rules="rules" @nextStep="nextStep" @prevStep="prevStep" @handleOk="handleOk"></step2>
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
    formTitleName:{
      type: String,
      default: "name",
    }
  },
  data () {
    return {
      visible:false,
      current: 0,
      loading:false,
      selcetPersonName:{},
      selcetPersonId:[],
      nowFormTitle:[],
      file:''
    }
  },
  created(){
this.nowFormTitle = this.formTitle
  },
  methods: {
    nextStep () {
      if(this.$refs.person.rightColumnsData.length>1){
        let arrName = ''
        let arrId = []
        this.$refs.person.rightColumnsData.forEach((item,index)=>{
          // arrName.push(item.name)
          if(index == 0){
            arrName = item.name
          }else{
            arrName = arrName.concat("," + item.name)
          }
          // arrName = item.name + "," 
          arrId.push(item.id)
        })
        this.selcetPersonName[this.formTitleName] = arrName.slice(0,arrName.length-1)
        this.selcetPersonId = arrId
        
        this.nowFormTitle.forEach((item)=>{
          if(item.type == 'upload'){
            item.disabled = true
          }
        })
        console.log(this.nowFormTitle)
        if (this.current < 2) {
          this.current += 1
        }
        this.$refs.form.loadData()
      }else if(this.$refs.person.rightColumnsData.length == 1){
        let arrName = ''
        let arrId = []
        this.$refs.person.rightColumnsData.forEach((item)=>{
          // arrName.push(item.name)
          arrName = item.name + "," 
          arrId.push(item.id)
        })
        this.selcetPersonName.name = arrName
        this.selcetPersonId = arrId
        if (this.current < 2) {
          this.current += 1
        }
        this.nowFormTitle = this.formTitle
        this.nowFormTitle.forEach((item)=>{
          if(item.type == 'upload'){
            item.disabled = false
          }
        })
        console.log(this.nowFormTitle)
         this.$refs.form.loadData()
      }
      else{
        this.$message.warning('请先选择至少一位人员');
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
      // let form = {
      //   personData:this.$refs.person.rightColumnsData,
      //   formData:params
      // }
      console.log(params)
      
      // let newparams = {
      //   startDate:params.startDate,
      //   probation:params.probation,
      //   contractPeriod:params.contractPeriod,
      //   endDate:params.probation
      // }
      params.endDate = '2020-16-15'
      params.policeId = this.selcetPersonId 
      console.log("1监听了 modal ok 事件");
      if(params.fileList){
        const formData = new FormData();
        params.fileList.forEach(file => {
          formData.append('files[]', file);
        });
        console.log(formData)
        // form.fileData = formData
        this.file = formData
      }
      console.log(this.file)
      setTimeout(()=>{
        const result = this.submitFun(params,this.file);
          result
            .then((res) => {
              this.$message.success(res.msg);
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
