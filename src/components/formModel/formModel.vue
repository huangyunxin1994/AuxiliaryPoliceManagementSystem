<template>
  <a-form-model
    ref="ruleForm"
    :model="form"
    :rules="rules"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
    :layout="layout"
  >
    <a-form-model-item
      v-for="(item, index) in formTitle"
      :key="index"
      :label="item.label"
      :prop="item.name"
      :ref="item.refName"
    >
      <!-- 输入框  -->
      <a-input
        v-model="form[item.name]"
        v-if="item.type=='input'"
        :disabled="item.disabled"
        :placeholder="item.placeholder"
      />
      <!-- 下拉框 -->
      <a-select
        v-model="form[item.name]"
        v-else-if="item.type == 'select'"
        :placeholder="item.placeholder"
      >
        <a-select-option
          v-for="(i, j) in item.select"
          :key="j"
          :value="i.value || i.name"
        >
          {{ i.name }}
        </a-select-option>
      </a-select>
      <!-- 时间框 -->
      <a-date-picker
        v-model="form[item.name]"
        v-else-if="item.type == 'picker'"
        :show-time="{ format: 'HH:mm:ss' }"
        format="YYYY-MM-DD HH:mm:ss"
        type="date"
        :placeholder="item.placeholder"
        style="width: 100%"
      />
      <!-- 开关 -->
      <a-switch v-else-if="item.type == 'switch'" v-model="form[item.name]" />
      <!-- 复选框组 -->
      <a-checkbox-group v-model="form[item.name]" @change="change" v-else-if="item.type == 'checkboxgroup'" :style=" item.showBgc ? 'background:rgba(0,0,0,.02);' : ''" style="padding:10px">
        <a-row>
          <a-col :span="12" v-for="(i,j) in item.select" :key="j">
            <a-checkbox :value="i.value">
              {{i.name}}
            </a-checkbox>
          </a-col>
        </a-row>
      </a-checkbox-group>
       <!-- 复选框 -->
      <a-checkbox v-model="form[item.name]" v-else-if="item.type == 'checkbox'"/>
      <!-- 单选框 -->
      <a-radio-group v-model="form[item.name]" v-else-if="item.type == 'radio'">
        <a-radio
          v-for="(i, j) in item.select"
          :key="j"
          :value="i.value || i.name"
        >
          {{ i.name }}
        </a-radio>
      </a-radio-group>
      <!-- 文本域 -->
      <a-input
        v-model="form[item.name]"
        type="textarea"
        v-else-if="item.type == 'textarea'"
        :placeholder="item.placeholder"
      />
      <!-- 树选择 -->
      <a-tree-select
        v-else-if="item.type == 'treeSelect'"
        v-model="form[item.name]"
        :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
        :tree-data="item.select"
        :allowClear="true"
        :replaceFields="item.replaceFields"
        placeholder="请选择组织"
        tree-default-expand-all
      >
      </a-tree-select>
      <a-upload
          name="file"
          :multiple="true"
          action=""
          :before-upload="beforeUpload"
          :show-upload-list="true"
          v-else-if="item.type == 'upload'"
        >
        <a-button type="primary">选择文件</a-button>
      </a-upload>
    </a-form-model-item>
  </a-form-model>
</template>
<script>
import pick from "lodash.pick";
export default {
  props: {
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
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 },
      },
      other: "",
      form: {},
      dataSource: [],
      fileList:[]
    };
  },
  created() {
    
  },
  mounted() {
    this.formTitle.forEach((i) => {
      this.dataSource.push(i.name);
    });
    if (this.record) {
      this.form = Object.assign(
        JSON.parse(JSON.stringify(this.record)) ,
        pick(this.record, this.dataSource)
      );
    }
  },
  methods: {
    change(e){
      console.log(this.form)
      console.log('checked = ', e);
    },
    onSubmit() {
      console.log("监听了 modal submit 事件")
       return new Promise((resolve) => {
          this.$refs.ruleForm.validate((valid) => {
            if (valid) {
              this.form.fileList = Object.assign([],this.fileList);
               resolve(true);
            } else {
              console.log("error submit!!");
               resolve(false);
            }
          });
       })
    },
    onFieldBlur() {
      console.log("哈哈哈");
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
    },
    onOk() {
      console.log("监听了 modal ok 事件");
      return new Promise((resolve) => {
        
            setTimeout(()=>{
              resolve(true);
              // const result = this.submitFun(this.form);
              //   result
              //     .then((res) => {
              //       console.log(res);
              //       this.resetForm()
              //       this.$message.success('成功');
              //       resolve(true);
              //     })
              //     .catch((err) => {
              //       console.log(err);
              //       resolve(true);
              //     });
            },3000)
          
        
        });
      
    },
    onCancel () {
      console.log('监听了 modal cancel 事件')
      return new Promise(resolve => {
        resolve(true)
      })
    },
    // 上传文件
    beforeUpload(file){
      this.fileList=[...this.fileList, file];
      return false
    },
  },
};
</script>