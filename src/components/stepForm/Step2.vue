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
              <div v-for="(item, index) in formTitle" :key="index">
                <div v-if="item.type === 'rangePicker'">
                  <a-col :xs="item.xsCol || 24" :sm="item.smCol || 24">
                    <a-form-model-item
                      :labelCol="item.labelCol"
                      :wrapperCol="item.wrapperCol"
                      :label="item.label1"
                      :prop="item.name1"
                      :ref="item.refName1"
                    >
                      <a-date-picker
                        :locale="locale"
                        v-model="form[item.name1]"
                        :disabled="item.disabled"
                        :showToday="item.showToday"
                        :disabled-date="
                          item.disabledDate && (item.funOpt === 1 ? disabledDateStart : item.funOpt === 2 ? disabledDateSStart : disabledDateOStart)||
                          function () {
                            return false;
                          }
                        "
                        :show-time="(item.showTime1 && item.showTime1) || false"
                        :format="
                          (item.valueFormat1 && item.valueFormat1) || 'YYYY-MM-DD'
                        "
                        :valueFormat="
                          (item.valueFormat1 && item.valueFormat1) || 'YYYY-MM-DD'
                        "
                        type="date"
                        :placeholder="item.placeholder1"
                        style="width: 100%"
                      />
                      <div style="color:#f5222d;line-height:1.5" v-if="item.notice">{{item.notice}}</div>
                    </a-form-model-item>
                  </a-col>
                  <a-col
                    :xs="item.xsCol || 24"
                    :sm="item.smCol || 24"
                  >
                    <a-form-model-item
                      :labelCol="item.labelCol"
                      :wrapperCol="item.wrapperCol"
                      :label="item.label2"
                      :prop="item.name2"
                      :ref="item.refName2"
                    >
                      <a-date-picker
                        :locale="locale"
                        v-model="form[item.name2]"
                        :disabled="item.disabled"
                        :showToday="item.showToday"
                        :disabled-date="
                          item.disabledDate &&(item.funOpt === 1 ? disabledDateEnd : item.funOpt === 2 ? disabledDateSEnd : disabledDateOEnd) ||
                          function () {
                            return false;
                          }
                        "
                        :show-time="(item.showTime2 && item.showTime2) || false"
                        :format="
                          (item.valueFormat2 && item.valueFormat2) || 'YYYY-MM-DD'
                        "
                        :valueFormat="
                          (item.valueFormat2 && item.valueFormat2) || 'YYYY-MM-DD'
                        "
                        type="date"
                        :placeholder="item.placeholder2"
                        style="width: 100%"
                      />
                      <div style="color:#f5222d;line-height:1.5" v-if="item.notice">{{item.notice}}</div>
                    </a-form-model-item>
                  </a-col>
                </div>
                <a-col :xs="item.xsCol || 24" :sm="item.smCol || 24" v-else>
                  <a-form-model-item
                    :labelCol="item.labelCol"
                    :wrapperCol="item.wrapperCol"
                    :label="item.label"
                    :prop="item.name"
                    :ref="item.refName"
                  >
                    <span v-if="item.type == 'text'">{{
                      form[item.name]
                    }}</span>
                    <!-- 输入框  -->
                    <a-input
                      v-model="form[item.name]"
                      v-if="item.type == 'input'"
                      :disabled="item.disabled"
                      :placeholder="item.placeholder"
                    />
                    <!-- 数字输入框  -->
                    <a-input
                      type="number"
                      v-model="form[item.name]"
                      :min="0"
                      v-if="item.type == 'number'"
                      :disabled="item.disabled"
                      :placeholder="item.placeholder"
                      style="width: 100%"
                    />
                    <!-- 下拉框 -->
                    <a-select
                      show-search
                      v-model="form[item.name]"
                      :disabled="item.disabled"
                      :filter-option="filterOption"
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
                      :locale="locale"
                      v-model="form[item.name]"
                      v-else-if="item.type == 'picker'"
                      :disabled="item.disabled"
                      :disabled-date="
                        (item.disabledDate &&
                          ((item.disabledDateFun && item.disabledDateFun) ||
                            disabledDate)) ||
                        function () {
                          return false;
                        }
                      "
                      :show-time="(item.showTime && item.showTime) || false"
                      :format="
                        (item.valueFormat && item.valueFormat) || 'YYYY-MM-DD'
                      "
                      :valueFormat="
                        (item.valueFormat && item.valueFormat) || 'YYYY-MM-DD'
                      "
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
                        <a-col
                          :span="12"
                          v-for="(i, j) in item.select"
                          :key="j"
                        >
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
                      :default-file-list="fileList"
                      :file-list="fileList"
                      action=""
                      :before-upload="beforeUpload"
                      :remove="handleRemove"
                      :show-upload-list="true"
                      v-else-if="item.type == 'upload'"
                    >
                      <a-button type="primary" :disabled="item.disabled"
                        >选择文件</a-button
                      >
                    </a-upload>
                    <div style="color:#f5222d;line-height:1.5" v-if="item.notice">{{item.notice}}</div>
                  </a-form-model-item>
                </a-col>
              </div>
            </a-row>
          </a-form-model>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script>
import locale from "ant-design-vue/es/date-picker/locale/zh_CN";
import pick from "lodash.pick";
import moment from "moment";
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
  data() {
    return {
      locale,
      form: {},
      dataSource: [],
      fileList: [],
    };
  },
  mounted() {
    this.formTitle.forEach((i) => {
      this.dataSource.push(i.name);
    });
    this.loadData();
  },
  methods: {
    disabledDate(current) {
      return (
        current &&
        current <=
          moment(new Date()).endOf(
            "day"
          )
      );
    },
    disabledDateOStart(current) {
      const obj = this.formTitle.find(i=>i.type==='rangePicker')
      if(current&&this.form[obj.name2]){
        return current> moment(this.form[obj.name2]);
      }else{
        return false
      }
    },
    disabledDateOEnd(current) {
       const obj = this.formTitle.find(i=>i.type==='rangePicker')
      if(current&&this.form[obj.name1]){
        return moment(this.form[obj.name1])> current;
      }else{
        return false
      }
    },
    disabledDateSStart(current) {
      const obj = this.formTitle.find(i=>i.type==='rangePicker')
      const endValue = this.form[obj.name2];
      const lastMonth  = moment()
      lastMonth.set({'year': moment(endValue).get('year'),'month': moment(endValue).get('month')-1})
      if (!current || !endValue) {
        return false;
      }
      if(current.isAfter(moment(endValue),'minute'))
        current.set({'hour': moment(endValue).get('hour'), 'minute': moment(endValue).get('minute')});
      if(current.isAfter(moment(endValue),'minute')){
        return true
        
      }else if(current<lastMonth.endOf('month'))
        return true 
          
    },
    disabledDateSEnd(current) {
      const obj = this.formTitle.find(i=>i.type==='rangePicker')
      const startValue = this.form[obj.name1];
      const nextMonth = moment()
      nextMonth.set({'year': moment(startValue).get('year'),'month': moment(startValue).get('month')+1})
      if (!current || !startValue) {
        return false;
      }
      if(current.isBefore(moment(startValue),'minute'))
        current.set({'hour': moment(startValue).get('hour'), 'minute': moment(startValue).get('minute')});
      if(current.isBefore(moment(startValue),'minute')){
         return true
      }else if(current > nextMonth.startOf('month')){
         return true
      }else
        return false
    },
    // disabledDateOStart(current) {
    //   const obj = this.formTitle.find(i=>i.type==='rangePicker')
    //   if(current&&this.form[obj.name2]){
    //     return current > moment(new Date(this.form[obj.name2])).endOf("day")
    //   }else{
    //     return false
    //   }
    // },
    // disabledDateOEnd(current) {
    //    const obj = this.formTitle.find(i=>i.type==='rangePicker')
    //   if(current&&this.form[obj.name1]){
    //     return current < moment(new Date(this.form[obj.name1])).endOf("day")
    //   }else{
    //     return false
    //   }
    // },
    disabledDateStart(current) {
      const obj = this.formTitle.find(i=>i.type==='rangePicker')
      if(current&&this.form[obj.name2]){
        return current > moment(new Date(this.form[obj.name2])).startOf("day")
      }else{
        return false
      }
    },
    disabledDateEnd(current) {
       const obj = this.formTitle.find(i=>i.type==='rangePicker')
      if(current&&this.form[obj.name1]){
        
          if(moment(new Date(this.form[obj.name1])).endOf("day") > moment(new Date()).endOf("day"))
           return current < moment(new Date(this.form[obj.name1])).startOf("day")
          else
           return current < moment(new Date()).startOf("day")
       
      }else{
        return false
      }
    },
    handleChange(item) {
      if (item.labelName) {
        const param = item.select.find((i) => i.id === this.form[item.name]);
        this.form[item.labelName] = param.name;
      }
    },
    loadData() {
      if (this.record) {
        this.form = Object.assign(
          JSON.parse(JSON.stringify(this.record)),
          pick(this.record, this.dataSource)
        );
      }
    },
    nextStep() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$emit("handleOk", this.form);
        }
      });
      //
    },
    prevStep() {
      this.$emit("prevStep");
    },
    // 上传文件
    beforeUpload(file) {
      const isJpgOrPng =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "application/pdf";
      if (!isJpgOrPng) {
        this.$message.error("你只能上传PDF,JPG,PNG格式的文件");
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!isLt2M) {
        this.$message.error("上传的文件大小不能超过10M");
        return false;
      }
      this.fileList = [file];
      this.form.fileList = [...this.fileList];
      this.fileList = this.fileList.slice(-1);
      this.form.fileList = this.form.fileList.slice(-1);
      return false;
    },
    handleRemove(file) {
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;
      this.form.fileList = newFileList;
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
  },
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
