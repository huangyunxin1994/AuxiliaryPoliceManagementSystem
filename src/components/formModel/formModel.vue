<template>
  <a-form-model
    ref="ruleForm"
    :model="form"
    :rules="rules"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
    :layout="layout"
  >
    <a-row>
      <a-col
        :xs="item.xsCol || 24"
        :sm="item.smCol || 24"
        v-for="(item, index) in formTitle"
        :key="index"
      >
        <a-form-model-item
          :labelCol="item.labelCol"
          :wrapperCol="item.wrapperCol"
          :label="item.label"
          :prop="item.name"
          :ref="item.refName"
        >
          <span v-if="item.type == 'text'">{{ form[item.name] }}</span>
          <!-- 输入框  -->
          <a-input
            v-model="form[item.name]"
            v-if="item.type == 'input'"
            :disabled="item.disabled"
            :placeholder="item.placeholder"
          />
          <!-- 下拉框 -->
          <a-select
            v-model="form[item.name]"
            :disabled="item.disabled"
            v-else-if="item.type == 'select'"
            :placeholder="item.placeholder"
          >
            <a-select-option
              v-for="(i, j) in item.select"
              :key="j"
              :value="i.id || i.name"
            >
              {{ i.name }}
            </a-select-option>
          </a-select>
          <!-- 时间框 -->
          <a-date-picker
            v-model="form[item.name]"
            v-else-if="item.type == 'picker'"
            :disabled="item.disabled"
            :show-time="{ format: 'HH:mm:ss' }"
            valueFormat="YYYY-MM-DD HH:mm:ss"
            type="date"
            :placeholder="item.placeholder"
            style="width: 100%"
          />
          <!-- 开关 -->
          <a-switch
            :disabled="item.disabled"
            v-else-if="item.type == 'switch'"
            v-model="form[item.name]"
          />
          <!-- 复选框组 -->
          <a-checkbox-group
            v-model="form[item.name]"
            :disabled="item.disabled"
            @change="change"
            v-else-if="item.type == 'checkboxgroup'"
            :style="item.showBgc ? 'background:rgba(0,0,0,.02);' : ''"
            style="padding: 10px"
          >
            <a-row>
              <a-col :span="12" v-for="(i, j) in item.select" :key="j">
                <a-checkbox :value="i.id || i.name">
                  {{ i.name }}
                </a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
          <!-- 复选框 -->
          <a-checkbox
            v-model="form[item.name]"
            :disabled="item.disabled"
            v-else-if="item.type == 'checkbox'"
          />
          <!-- 单选框 -->
          <a-radio-group
            v-model="form[item.name]"
            :disabled="item.disabled"
            v-else-if="item.type == 'radio'"
          >
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
            :autoSize="{ minRows: 4, maxRows: 6 }"
            :disabled="item.disabled"
            v-else-if="item.type == 'textarea'"
            :placeholder="item.placeholder"
          />
          <!-- 树选择 -->
          <tree-select
            v-else-if="item.type == 'treeSelect'"
            :value="form[item.name]"
            :keyName="item.name"
            :allowClear="true"
            :replaceFields="item.replaceFields"
            @handleTreeChange="handleTreeChange"
          ></tree-select>
          <a-upload
            name="file"
            :multiple="true"
            :disabled="item.disabled"
            :default-file-list="form[item.name]"
            action=""
            :before-upload="beforeUpload"
            :show-upload-list="true"
            v-else-if="item.type == 'upload'"
          >
            <a-button type="primary">选择文件</a-button>
          </a-upload>
        </a-form-model-item>
      </a-col>
    </a-row>
  </a-form-model>
</template>
<script>
import pick from "lodash.pick";
import treeSelect from "@/components/treeSelect/TreeSelect";
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
  components: {
    treeSelect,
  },
  data() {
    return {
      other: "",
      form: {},
      dataSource: [],
      fileList: [],
    };
  },
  created() {
    this.formTitle.forEach((i) => {
      this.dataSource.push(i.name);
    });
    if (this.record) {
      console.log(this.record);
      this.form = Object.assign(
        JSON.parse(JSON.stringify(this.record)),
        pick(this.record, this.dataSource)
      );
      console.log("*********" + JSON.stringify(this.form));
    }
  },
  watch: {
    record(val) {
      this.form = Object.assign(
        JSON.parse(JSON.stringify(val)),
        pick(val, this.dataSource)
      );
    },
  },
  mounted() {
    
  },
  methods: {
    change(e) {
      console.log(this.form);
      console.log("checked = ", e);
    },
    onSubmit() {
      console.log("监听了 modal submit 事件");
      return new Promise((resolve) => {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            resolve(true);
          } else {
            console.log("error submit!!");
            resolve(false);
          }
        });
      });
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
        setTimeout(() => {
          const result = this.submitFun(this.form);
          result
            .then((res) => {
              console.log(res);
              if(res.code === 0){
                this.resetForm();
                this.$message.success(res.msg);
                resolve(true);
              }else{
                this.resetForm();
                this.$message.error(res.msg);
                resolve(true);
              }
              
            })
            .catch((err) => {
              this.resetForm();
              this.$message.success(err.msg);
              resolve(true);
            });
        }, 1000);
      });
    },
    onCancel() {
      console.log("监听了 modal cancel 事件");
      return new Promise((resolve) => {
        resolve(true);
      });
    },
    // 上传文件
    beforeUpload(file) {
      this.form.fileList = [...this.fileList, file];
      return false;
    },
    //树选择回调
    handleTreeChange(obj){
      this.form[obj.keyName] = obj.val
      console.log( this.form)
    }
  },
};
</script>