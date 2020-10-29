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
        <a-button key="submit" type="primary" :loading="loading" @click="handleSubmit">
          提交  
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
        loading: false,
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
      this.loading = true;
      setTimeout(() => {
        this.visible = false;
        this.loading = false;
        this.$emit("handleOk",form)
      }, 3000);
    },
    handleCancel() {
      this.visible = false;
    },
  },
};
</script>