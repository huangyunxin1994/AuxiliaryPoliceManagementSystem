<template>
  <a-modal
    v-model="visible"
    :title="title"
    on-ok="handleOk"
    :width="900"
    @cancel="handleCancel"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <template slot="footer">
      <a-button v-show="current === 0" @click="nextStep">下一页</a-button>
      <a-button
        v-show="current === 1"
        style="margin-left: 8px"
        @click="prevStep"
        >上一页</a-button
      >
      <a-button
        v-show="current === 1"
        :loading="loading"
        type="primary"
        @click="handleSubmit"
        >提交</a-button
      >
    </template>
    <a-steps class="steps" :current="current">
      <a-step
        :title="item.title"
        v-for="(item, index) in stepTitle"
        :key="index"
      />
    </a-steps>
    <div class="content">
      <step1 ref="person" :filter="filter" v-show="current === 0" @nextStep="nextStep"></step1>
      <step2
        ref="form"
        v-show="current === 1"
        :submitFun="submitFun"
        :formTitle="nowFormTitle"
        :record="selcetPersonName"
        :rules="rules"
        @nextStep="nextStep"
        @prevStep="prevStep"
        @handleOk="handleOk"
      ></step2>
    </div>
  </a-modal>
</template>

<script>
import Step1 from "./Step1";
import Step2 from "./Step2";

export default {
  name: "StepForm",
  components: { Step1, Step2 },
  props: {
    title: {
      type: String,
      default: "Title",
    },
    stepTitle: {
      type: Array,
      default: () => [{ title: "第一步" }, { title: "第二步" }],
    },
    formTitle: {
      type: Array,
      default: () => [],
    },
    filter:{
      type:Object,
      default:undefined
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
    formTitleName: {
      type: String,
      default: "name",
    },
    formTitleId: {
      type: String,
      default: "userId",
    },
  },
  data() {
    return {
      visible: false,
      current: 0,
      loading: false,
      selcetPersonName: {},
      nowFormTitle: [],
      file: "",
    };
  },
  created() {
    this.nowFormTitle = this.formTitle;
  },
  methods: {
    nextStep() {
      const columnData = this.$refs.person.rightColumnsData;
      if (columnData.length > 0) {
        let arrName = "";
        columnData.forEach((item) => {
          arrName += item.name + ",";
        });
        this.selcetPersonName[this.formTitleName] = arrName.slice(
          0,
          arrName.length - 1
        );
        this.selcetPersonName = Object.assign(this.selcetPersonName,this.record)
        this.$refs.form.loadData()
        if (columnData.length > 1) {//选择多个人时，不能上传
          this.nowFormTitle.forEach((item) => {
            if (item.type == "upload") {
              item.disabled = true;
            }
          });
        }else{
          this.nowFormTitle.forEach((item) => { //选单个人时，允许上传
            if (item.type == "upload") {
              item.disabled = false;
            }
          });
        }
        if (this.current < 2) {
          this.current += 1;
        }
      } else {
        this.$message.warning("请先选择至少一位人员");
      }
    },
    prevStep() {
      if (this.current > 0) {
        this.current -= 1;
      }
    },
    handleSubmit() {
      this.$refs.form.nextStep();
    },
    handleOk(params) {
      this.loading=true
      params.police = this.$refs.person.rightColumnsData;
      setTimeout(() => {
        const result = this.submitFun(params);
        result
          .then((res) => {
            if(res.code==0){
              this.$message.success(res.msg);
              this.$emit('refreshTable')
              this.handleCancel();
            }else{
              this.$message.error(res.msg);
              this.handleCancel();
            }
            
          })
          .catch(() => {
            this.loading = false;
          });
      }, 1000);
    },
    handleCancel() {
      this.loading = false;
      this.current = 0;
      this.visible = false;
    },
  },
  watch:{
    formTitle(){
      this.nowFormTitle = this.formTitle
    }
  }
};
</script>

<style lang="less" scoped>
.steps {
  max-width: 500px;
  margin: 16px auto;
}
</style>
