<template>
  <div>
    <a-card :bordered="false">
      <a-row :gutter="24">
        <a-col :xl="24">
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
                      :value="i.value || i.name"
                    >
                      {{ i.name }}
                    </a-select-option>
                  </a-select>
                  <!-- 时间框 -->
                  <a-date-picker
                    v-model="form[item.name]"
                    v-else-if="item.type == 'picker'"
                    :disabled="item.disabled"
                    :show-time="item.showTime&&{ format: 'HH:mm:ss' }||false"
                    valueFormat="YYYY-MM-DD HH:mm:ss"
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
                        <a-checkbox :value="i.value || i.name">
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
                  <a-tree-select
                    v-else-if="item.type == 'treeSelect'"
                    v-model="form[item.name]"
                    :disabled="item.disabled"
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
                    
                    :default-file-list="form[item.name]"
                    action=""
                    :before-upload="beforeUpload"
                    :show-upload-list="true"
                    v-else-if="item.type == 'upload'"
                  >
                    <a-button type="primary" :disabled="item.disabled">选择文件</a-button>
                  </a-upload>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-form-model>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script>
import pick from "lodash.pick";
export default {
  name: "Step2",
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
    personName: {
      type: Array,
      default: () => [],
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
  data(){
    return {
      form: {},
      dataSource: [],
      fileList:[]
    }
  },
  mounted() {
    this.formTitle.forEach((i) => {
          this.dataSource.push(i.name);
    });
    this.loadData()
    
  },
  methods: {
    loadData(){
      if (this.record) {
          this.form = Object.assign(
            JSON.parse(JSON.stringify(this.record)) ,
            pick(this.record, this.dataSource)
          );
        }
    },
    nextStep() {
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
    prevStep() {
      this.$emit("prevStep");
    },
    // 上传文件
    beforeUpload(file){
      this.form.fileList=[...this.fileList, file];
      return false
    },
  }
};
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
.nextPage {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 20px;

  .lastBtn {
    margin-right: 20px;
  }
}
</style>
