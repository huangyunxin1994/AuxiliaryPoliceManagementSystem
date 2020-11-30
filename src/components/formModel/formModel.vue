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
                :disabled-date="
                  (item.disabledDate && disabledDateStart) ||
                  function () {
                    return false;
                  }
                "
                :show-time="(item.showTime && item.showTime) || false"
                :format="(item.valueFormat && item.valueFormat) || 'YYYY-MM-DD'"
                :valueFormat="
                  (item.valueFormat && item.valueFormat) || 'YYYY-MM-DD'
                "
                type="date"
                :placeholder="item.placeholder"
                style="width: 100%"
              />
            </a-form-model-item>
          </a-col>
          <a-col :xs="item.xsCol || 24" :sm="item.smCol || 24">
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
                :disabled-date="
                  (item.disabledDate && disabledDateEnd) ||
                  function () {
                    return false;
                  }
                "
                :show-time="(item.showTime && item.showTime) || false"
                :format="(item.valueFormat && item.valueFormat) || 'YYYY-MM-DD'"
                :valueFormat="
                  (item.valueFormat && item.valueFormat) || 'YYYY-MM-DD'
                "
                type="date"
                :placeholder="item.placeholder"
                style="width: 100%"
              />
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
            <span v-if="item.type == 'text'">{{ item.filter && item.filter[form[item.name]] || form[item.name] }}</span>
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
              show-search
              v-model="form[item.name]"
              :filter-option="filterOption"
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
              :format="(item.valueFormat && item.valueFormat) || 'YYYY-MM-DD'"
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
              <a-button type="primary" :disabled="item.disabled"
                >选择文件</a-button
              >
            </a-upload>
          </a-form-model-item>
        </a-col>
      </div>
    </a-row>
  </a-form-model>
</template>
<script>
import locale from "ant-design-vue/es/date-picker/locale/zh_CN";
import pick from "lodash.pick";
import moment from "moment";
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
      locale,
      other: "",
      form: {},
      dataSource: [],
      fileList: [],
      formRules: {},
    };
  },
  created() {
    this.formRules = Object.assign({}, this.rules);
    this.formTitle.forEach((i) => {
      this.dataSource.push(i.name);
      if (i.type === "upload" && i.required) {
        let validatePass2 = (rule, value, callback) => {
          if (this.fileList.length === 0) {
            callback(new Error("请上传文件"));
          } else {
            callback();
          }
        };
        this.formRules.fileList = [
          { required: true, validator: validatePass2, trigger: "change" },
        ];
      }
      if (i.validata === "checkpass" && i.required) {
        let validateCheckPass = (rule, value, callback) => {
          if (!value) {
            callback(new Error("请再输入一次新密码"));
          } else if (value !== this.form.password) {
            callback(new Error("两次输入不一致"));
          } else {
            callback();
          }
        };
        this.formRules.again = [
          { required: true, validator: validateCheckPass, trigger: "blur" },
        ];
      }
      if (i.validata == "organizationId") {
        let validateCheckPass = (rule, value, callback) => {
          if (
            value == this.record.beforeOrgId &&
            this.form.currentRank === this.record.beforePost
          ) {
            callback(new Error("调动后组织与岗位未发生变化，请重新选择"));
          } else {
            callback();
          }
        };
        this.formRules.organizationId = [
          { required: true, validator: validateCheckPass, trigger: "change" },
        ];
      }
      if (i.validata == "currentRank") {
        let validateCheckPass = (rule, value, callback) => {
          if (
            value === this.record.beforePost &&
            this.form.organizationId === this.record.beforeOrgId
          ) {
            callback(new Error("调动后组织与岗位未发生变化，请重新选择"));
          } else {
            callback();
          }
        };
        this.formRules.currentRank = [
          { required: true, validator: validateCheckPass, trigger: "change" },
        ];
      }
    });
    if (this.record) {
      this.form = Object.assign(
        JSON.parse(JSON.stringify(this.record)),
        pick(this.record, this.dataSource)
      );
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
  mounted() {},
  methods: {
    disabledDate(current) {
      return (
        current &&
        current <
          moment(new Date(new Date().setDate(new Date().getDate() - 1))).endOf(
            "day"
          )
      );
    },
    disabledDateStart(current) {
      const obj = this.formTitle.find((i) => i.type === "rangePicker");
      if (current && this.form[obj.name2]) {
        return (
          current < moment(new Date(new Date().setDate(new Date().getDate() - 1))).endOf("day") ||
          current > moment(new Date(this.form[obj.name2])).endOf("day")
        );
      } else if (current) {
        return current < moment(new Date(new Date().setDate(new Date().getDate() - 1))).endOf("day")
      } else {
        return false;
      }
    },
    disabledDateEnd(current) {
      const obj = this.formTitle.find((i) => i.type === "rangePicker");
      if (current && this.form[obj.name1]) {
        if (
          moment(new Date()).endOf("day") >=
          moment(new Date(this.form[obj.name1])).endOf("day")
        ) {
          return current < moment(new Date()).endOf("day");
        } else {
          return current < moment(new Date(this.form[obj.name1])).endOf("day");
        }
      } else if (current) {
        return current < moment(new Date()).endOf("day");
      } else {
        return false;
      }
    },
    handleChange(item) {
      if (item.labelName) {
        const param = item.select.find((i) => i.id === this.form[item.name]);
        this.form[item.labelName] = param.name;
      }
    },
    change() {},
    onSubmit() {
      return new Promise((resolve) => {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            resolve(true);
          } else {
            resolve(false);
          }
        });
      });
    },
    onFieldBlur() {},
    resetForm() {
      this.$refs.ruleForm.resetFields();
    },
    onOk() {
      return new Promise((resolve) => {
        setTimeout(() => {
          const result = this.submitFun(this.form);
          result
            .then((res) => {
              if (res.code === 0) {
                // this.resetForm();
                this.$message.success(res.msg);
                resolve(true);
              } else {
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
      return new Promise((resolve) => {
        resolve(true);
      });
    },
    onSelfOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$emit("handleOk", this.form);
        }
      });
      //
    },
    handleRemove(file) {
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;
      this.form.fileList = newFileList;
    },
    // 上传文件
    beforeUpload(file) {
      this.fileList = [...this.fileList, file];
      this.form.fileList = [...this.fileList, file];
      return false;
    },
    //树选择回调
    handleTreeChange(obj) {
      this.form[obj.keyName] = obj.val;
      this.form[obj.labelName] = obj.label;
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