<template>
  <a-form-model
    ref="ruleForm"
    :model="form"
    :rules="formRules"
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
          <!-- 数字输入框  -->
          <a-input-number
            v-model="form[item.name]"
            v-if="item.type == 'number'"
            :disabled="item.disabled"
            :placeholder="item.placeholder"
            style="width: 100%"
          />
          <!-- 下拉框 -->
          <a-select
            v-model="form[item.name]"
            :disabled="item.disabled"
            v-else-if="item.type == 'select'"
            :placeholder="item.placeholder"
            @change="handleChange(item)"
          >
            <a-select-option
              v-for="(i, j) in item.select"
              :key="j"
              :value="i.value || i.id || i.name"
            >
              {{ i.name }}
            </a-select-option>
          </a-select>
          <!-- 时间框 -->
          <a-date-picker
                    v-model="form[item.name]"
                    v-else-if="item.type == 'picker'"
                    :disabled="item.disabled"
                    :show-time="item.showTime&&item.showTime||false"
                    :format="item.valueFormat&&item.valueFormat || 'YYYY-MM-DD'"
                    :valueFormat="item.valueFormat&&item.valueFormat || 'YYYY-MM-DD'"
                    type="date"
                    :placeholder="item.placeholder"
                    style="width: 100%"
                  />
          <!-- 日期框 -->
          <a-date-picker 
            v-model="form[item.name]"
            :disabled="item.disabled"
            :placeholder="item.placeholder"
            valueFormat="YYYY-MM-DD"
            type="date"
            style="width: 100%"
            v-else-if="item.type == 'pickerDate'" />
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
            :labelName="item.labelName"
            :allowClear="true"
            :multiple="item.multiple"
            :treeCheckStrictly="true"
            :replaceFields="item.replaceFields"
            @handleTreeChange="handleTreeChange"
          ></tree-select>
          <a-upload
            name="file"
            :multiple="true"
            :default-file-list="form[item.name]"
            action=""
            :before-upload="beforeUpload"
            :remove="handleRemove"
            :show-upload-list="true"
            v-else-if="item.type == 'upload'"
          >
            <a-button type="primary" :disabled="item.disabled">选择文件</a-button>
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
      formRules:{}
    };
  },
  created() {
    this.formRules = Object.assign({},this.rules)
    this.formTitle.forEach((i) => {
      this.dataSource.push(i.name);
      if(i.type === 'upload' && i.required){
        let validatePass2 = (rule, value, callback) => {
          if (this.fileList.length===0) {
            callback(new Error('请上传文件'));
          } else {
            callback();
          }
        };
        this.formRules.fileList = [{required:true, validator: validatePass2, trigger: "change" }]
      }
      if(i.validata === 'checkpass' && i.required){
         let validateCheckPass = (rule, value, callback) => {
         console.log(value)
         console.log("password= "+this.form.password)
        if (!value) {
          callback(new Error('请再输入一次新密码'));
        } else if (value !== this.form.password) {
          console.log(58)
          callback(new Error("两次输入不一致"));
        } else {
          callback();
        }
      };
      this.formRules.again = [{required:true, validator: validateCheckPass, trigger: "blur" }]
      }
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
    handleChange(item){
      if(item.labelName){
        const param = item.select.find(i=>i.id === this.form[item.name])
        this.form[item.labelName] = param.name
      }
    },
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
                // this.resetForm();
                this.$message.success(res.msg);
                resolve(true);
              }else{
                // this.resetForm();
                this.$message.error(res.msg);
                resolve(true);
              }
              
            })
            .catch((err) => {
              this.$message.error(err.msg);
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
    onSelfOk() {
      console.log(this.form)
      this.$refs.ruleForm.validate((valid) => {
            if (valid) {
               this.$emit("handleOk", this.form);
            } else {
              console.log("error submit!!");
            }
          });
      //
    },
    handleRemove(file) {
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;
      this.form.fileList = newFileList
    },
    // 上传文件
    beforeUpload(file) {
      this.fileList = [...this.fileList, file];
      this.form.fileList = [...this.fileList, file];
      return false;
    },
    //树选择回调
    handleTreeChange(obj){
      console.log(obj)
      console.log(obj.keyName)
      this.form[obj.keyName] = obj.val
      this.form[obj.labelName] = obj.label
      console.log( this.form)
    }
  },
};
</script>