<template>
  <div>
    <a-modal 
        v-model="visible" 
        :title="option.title" 
        :width="option.width"
        :maskClosable="option.maskClosable"
        :destroyOnClose="true"
        :okText="option.okText"
        :centered="option.centered"
        on-ok="handleOk">
      <template slot="footer">
        <a-button key="back" @click="handleCancel">
          取消
        </a-button>
        <a-button key="submit" type="primary" @click="handleSubmit">
          确认  
        </a-button>
      </template>
      <div class="content">
        <form-model ref="formModel" :formTitle="formTitle" :rules="rules" :record="record" @handleOk="handleOk"></form-model>
      </div>
    </a-modal>
  </div>
</template>
<script>
import formModel from "@/components/formModel/formModel"
export default {
  props:{
    option:{
      type:Object
    },
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
    labelCol: {
      type: Object,
      default() {
        return {
          xs: { span: 24 },
          sm: { span: 7 },
        };
      },
    },
    wrapperCol: {
      type: Object,
      default() {
        return {
          xs: { span: 24 },
          sm: { span: 13 },
        };
      },
    },
  },
  components:{
    formModel
  },
  data() {
    return {
        visible: false,
    };
  },
  methods: {
    showModal() {
      this.visible = true;
    },
    handleSubmit(){
      this.$refs.formModel.onSelfOk()
    },
    handleOk(form) {
        this.visible = false;
        this.$emit("handleOk",form)
    },
    handleCancel() {
      this.visible = false;
    },
  },
};
</script>