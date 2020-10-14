<template>
  <div>
    <a-card :bordered="false">
            <a-row :gutter="24">
                <a-col :xl="24">
                    <from-model
                        ref="form"
                        :formTitle="formTitle"
                        :rules="rules"
                        :record="record"
                    >
                    </from-model>
                </a-col>
            </a-row>
            <a-row :gutter="24">
                <a-col :xl="24" class="nextPage">
                    <a-button :loading="loading" type="primary" @click="nextStep">提交</a-button>
                    <a-button type="primary" style="margin-left: 8px" @click="prevStep">上一页</a-button>
                </a-col>
            </a-row>
        </a-card>
  </div>
</template>

<script>
import fromModel from '@/components/formModel/formModel'
export default {
  name: 'Step2',
  i18n: require('./i18n'),
  components:{
    fromModel
  },
  data () {
    return {
      loading: false,
      formTitle:[
          {label:'姓名',name:'name',type:'input',refName:'name',placeholder:'请输入所在单位'},
          {label:'合同起始日期',name:'startDate',type:'picker',refName:'startDate',placeholder:'请选择工作起始日期'},
          {label:'合同期限(月)',name:'deadline',type:'input',refName:'deadline',placeholder:'请输入合同期限'},
          {label:'试用结束日期',name:'endData',type:'picker',refName:'endData',placeholder:'请选择工作结束日期'},
          {label:'合同附件',name:'uploadFile',type:'upload',refName:'uploadFile'}
          
      ],
      rules:{
          name: [{ required: false, message: '请输入名字', trigger: 'blur',disabled:true }],
          startDate: [{ required: true, message: '请选择合同起始日期', trigger: 'change' }],
          deadline: [{ required: true, message: '请输入合同期限', trigger: 'blur' }],
      },
      record:{}
    }
  },
  methods: {
    nextStep () {
      let _this = this
      _this.loading = true
      console.log(this.$refs.form.form)
      // setTimeout(function () {
      //   _this.$emit('nextStep')
      // }, 1500)
    },
    prevStep () {
      this.$emit('prevStep')
    }
  }
}
</script>

<style lang="less" scoped>
  .stepFormText {
    margin-bottom: 24px;
    :global {
      .ant-form-item-label,
      .ant-form-item-control {
        line-height: 22px;
      }
    }
  }
  .nextPage{
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin-top: 20px;

        .lastBtn{
            margin-right: 20px;
        }
    }
</style>
