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
                        :submitFun="submitFun"
                    >
                    </from-model>
                </a-col>
            </a-row>
        </a-card>
  </div>
</template>

<script>
import fromModel from '@/components/formModel/formModel'
export default {
  name: 'Step2',
  components:{
    fromModel
  },
  props: {
    formTitle: {
      type: Array,
      default: () => [],
    },
    rules: {
      type: Object,
      default: null,
    },
    record: {
      type: Object,
      default: null,
    },
    submitFun: {
      type: Function,
      default: null,
    },
  },
  methods: {
    nextStep () {
      console.log(this.$refs.form.form)
      console.log(this.$refs.form.onSubmit())
      this.$refs.form.onSubmit().then(res=>{
        console.log(res)
        if(res){
          this.$emit('handleOk',this.$refs.form.form)
        }
      })
      // 
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
