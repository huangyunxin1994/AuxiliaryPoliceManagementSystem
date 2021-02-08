<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="模糊查询">
                <a-input
                  v-model="queryParam.name"
                  placeholder="请输入要查询的关键词"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="组织选择">
                <a-select
                  v-model="queryParam['organizationId']"
                  style="width: 100%"
                  placeholder="请选择组织"
                  allowClear
                >
                  <a-select-option v-for="i in treeData" :key="i.organizationId" :value="i.organizationId" >
                    {{ i.organizationName }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="是否审批">
                  <a-select
                    v-model="queryParam.approvalResults"
                    style="width: 100%"
                    @change="handleChange"
                  >
                    <a-select-option value=""> 全部 </a-select-option>
                    <a-select-option value="0"> 未审批 </a-select-option>
                    <a-select-option value="1"> 通过 </a-select-option>
                    <a-select-option value="2"> 拒绝 </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </template>
            <a-col :md="(!advanced && 8) || 24" :sm="24">
              <span
                class="table-page-search-submitButtons"
                :style="
                  (advanced && { float: 'right', overflow: 'hidden' }) || {}
                "
              >
                <a-button type="primary" @click="$refs.table.refresh(true)"
                  >查询</a-button
                >
                <a-button style="margin-left: 8px" @click="reloadData"
                  >重置</a-button
                >
                <a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? "收起" : "展开" }}
                  <a-icon :type="advanced ? 'up' : 'down'" />
                </a>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <div class="table-operator" style="margin-bottom: 24px">
        <a-button type="primary" icon="plus" @click="handleAdd">新建</a-button>
        <a-dropdown v-if="selectedRowKeys.length > 0">
          <a-menu slot="overlay">
            <a-menu-item key="1"><a-icon type="delete" />删除</a-menu-item>
            <!-- lock | unlock -->
            <a-menu-item key="2"><a-icon type="lock" />锁定</a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px">
            批量操作 <a-icon type="down" />
          </a-button>
        </a-dropdown>
      </div>
      <s-table
        ref="table"
        :rowKey="(record) => record.id"
        :columns="scheduleColumns"
        :data="loadScheduleData"
        :scroll="{ y: 550, x: 800 }"
        showPagination="auto"
      >
        <template slot="holiday" slot-scope="holiday">
          <span>{{ holiday | holidayFilter }}</span>
        </template>
        <template slot="isEnable" slot-scope="isEnable">
          <a-badge
            :status="isEnable == '1' ? 'processing' : 'error'"
            :text="isEnable | statusFilter"
          />
        </template>
        <template slot="approvalResults" slot-scope="approvalResults">
          <a-badge
            :status="
              approvalResults == 0
                ? 'processing'
                : approvalResults == 1
                ? 'success'
                : 'error'
            "
            :text="approvalResults | resultFilter"
          />
        </template>
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)" :disabled="record.approvalUpdate===1">{{record.approvalResults===0 ? '审批' : '修改'}}</a>
        </span>
      </s-table>
    </a-card>
    <form-step
      ref="modal"
      title="新建加班记录"
      :formTitle="formTitle"
      :record="addRecord"
      :rules="rules"
      :stepTitle="stepTitle"
      :submitFun="submitFun"
      @refreshTable="reloadData"
    ></form-step>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import STable from "@/components/Table_/";
import formStep from "@/components/stepForm/StepForm";
import TaskForm from "@/components/formModel/formModel";
import treeSelect from "@/components/treeSelect/TreeSelect";
import moment from 'moment'
import { validateLength } from "@/config/default/rules";
const formTitle = [
  {
    label1: "开始时间",
    name1: "startTime",
    type: "rangePicker",
    valueFormat1:'YYYY-MM-DD HH:mm',
    placeholder1: "请选择加班开始时间",
    disabledDate:true,
    fomate:'minutes',
    showToday:false,
    funOpt:2,
    showTime1:{ format: 'HH:mm',minuteStep:10,defaultValue:moment(new Date().setMinutes(0)) },
    label2: "结束时间",
    name2: "endTime",
    showTime2: { format: 'HH:mm',minuteStep:10,defaultValue:moment(new Date().setMinutes(0)) },
    valueFormat2:'YYYY-MM-DD HH:mm',
    disabledDate2:true,
    placeholder2: "请选择加班结束时间",
  },
  {
    label: "时长(小时)",
    name: "duration",
    type: "number",
  },
  {
    label: "法定假日",
    name: "holiday",
    type: "radio",
    select: [
      { name: "是", value: 1 },
      { name: "否", value: 2 },
    ],
  },
  {
    label: "加班原因",
    name: "reason",
    type: "textarea",
    placeholder: "请输入加班原因",
  },
  {
    name: "type",
  },
];
const formCheckTitle = [
  {
    label: "姓名",
    name: "policeName",
    type: "text",
    smCol: { span: 12 },
    labelCol: {
      xs: { span: 24 },
      sm: { span: 14 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 10 },
    },
  },

  {
    label: "警员编号",
    name: "number",
    type: "text",
    smCol: { span: 12 },
  },
  {
    label: "开始时间",
    name: "startTime",
    type: "text",
    smCol: { span: 12 },
    labelCol: {
      xs: { span: 24 },
      sm: { span: 14 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 10 },
    },
  },
  {
    label: "结束时间",
    name: "endTime",
    type: "text",
    smCol: { span: 12 },
  },
  {
    label: "时长(小时)",
    name: "duration",
    type: "text",
    smCol: { span: 12 },
    labelCol: {
      xs: { span: 24 },
      sm: { span: 14 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 10 },
    },
  },
  {
    label: "法定假日",
    name: "holiday",
    type: "text",
    filter: {
      1: "是",
      2: "否",
    },
    smCol: { span: 12 },
  },
  {
    label: "加班原因",
    name: "reason",
    type: "text",
  },
  {
    label: "是否通过",
    name: "approvalResults",
    type: "radio",
    select: [
      { name: "是", value: 1 },
      { name: "否", value: 2 },
    ],
  },
  {
    label: "审批备注",
    name: "approvalRemake",
    type: "textarea",
  },
  {
    name: "approval",
  },
];
const stepTitle = [{ title: "选择人员" }, { title: "填写加班信息" }];
const rules = {
  holiday: [
    { required: true, message: "请选择是否法定假日", trigger: "change" },
  ],
  startTime: [
    { required: true, message: "请选择加班开始时间", trigger: "change" },
  ],
  endTime: [
    { required: true, message: "请选择加班结束时间", trigger: "change" },
  ],
  reason: [{ required: true, message: "请输入加班原因", trigger: "change" },
  { required: true, max:60, validator: validateLength, trigger: "change" }],
  duration:[{ required: true, message: "请输入加班时长", trigger: "change" },
  { required: true, max:3, validator: validateLength, trigger: "change" }],
 
};
const checkRules = {
  approvalRemake: [{ required: true, message: "请输入审批备注", trigger: "change" },
  { required: true, max:60, validator: validateLength, trigger: "change" }],
  approvalResults:[
    { required: true, message: "请选择是否通过", trigger: "blur" },
  ],
}
export default {
  name: "AskForLeave",
  components: {
    STable,
    TaskForm,
    formStep,
    treeSelect,
  },
  data() {
    return {
      formTitle,
      rules,
      stepTitle,
      treeData:[],
      addRecord:{type: 1,approvalResults:1,holiday:2},
      submitFun: (parameter) => {
        return this.$api.overTimeService.postByUser(parameter).then((res) => {
          return res.data;
        });
      },
      // 高级搜索 展开/关闭
      advanced: true,
      value: null,
      replaceFields: {
        children: "children",
        title: "title",
        key: "key",
        value: "key",
      },
      scheduleColumns: [
        {
          title: "序号",
          dataIndex: "key",
          key: "key",
          width: 60,
        },
        {
          title: "姓名",
          dataIndex: "policeName",
          key: "policeName",
          width: 100,
        },
        {
          title: "警员编号",
          dataIndex: "number",
          key: "number",
          width: 100,
        },
        {
          title: "组织",
          dataIndex: "organizationName",
          key: "organizationName",
          width: 180,
          ellipsis: true,
        },
        {
          title: "开始时间",
          dataIndex: "startTime",
          key: "startTime",
          width: 180,
        },
        {
          title: "结束时间",
          dataIndex: "endTime",
          key: "endTime",
          width: 180,
        },
        {
          title: "时长(小时)",
          dataIndex: "duration",
          key: "duration",
          width: 100,
        },
        {
          title: "是否法定假日",
          dataIndex: "holiday",
          key: "holiday",
          scopedSlots: { customRender: "holiday" },
          width: 150,
        },
        {
          title: "加班原因",
          dataIndex: "reason",
          key: "reason",
          ellipsis: true,
        },
        {
          title: "审批结果",
          dataIndex: "approvalResults",
          key: "approvalResults",
          scopedSlots: { customRender: "approvalResults" },
          width: 120,
        },
        {
          title: "审批备注",
          dataIndex: "approvalRemake",
          key: "approvalRemake",
          ellipsis: true,
        },
        {
          title: "审批人",
          dataIndex: "approval",
          key: "approval",
          width: 120,
        },
        {
          table: "操作",
          dataIndex: "action",
          scopedSlots: { customRender: "action" },
          width: 100,
        },
      ],
      //查询参数
      queryParam: {
        type: 1,
        organizationId: "",
        name: "",
        oid: "",
        approvalResults: "",
      },
      loadScheduleData: (parameter) => {
        const requestParameters = Object.assign({}, parameter, this.queryParam);
        return this.$api.overTimeService
          .getOverTimeLeave(requestParameters)
          .then((res) => {
            res.data.data.list.map((i, k) => (i.key = k + 1));
            return res.data;
          });
      },
      selectedRowKeys: [],
      selectedRows: [],
    };
  },
 async created() {
    this.addRecord.approval = this.user.name;
    this.addRecord.approvalId = this.user.id;
    this.queryParam.oid = this.user.organizationId;
    await this.$api.overTimeService
      .getOverTimeLeaveOrgan({organizationId:this.user.organizationId,state:1})
      .then((res) => {
             this.treeData=res.data.data.list
      });
  },
  methods: {
    handleAdd() {
      this.$refs.modal.visible = true;
    },
    handleEdit(record) {
      record.approval = this.user.name;
      record.approvalId = this.user.id;
      record.holiday = this.statusFilter(record.holiday)
      let params = Object.assign({},record)
      params.approvalResults = 1
      let formProps = {
        record: params,
        formTitle: formCheckTitle,
        rules:checkRules,
        submitFun: (parameter) => {
          return this.$api.overTimeService
            .putOverTimeLeave(parameter)
            .then((res) => {
              return res.data;
            });
        },
      };
      let modalProps = {
        title: "编辑加班记录",
        width: 700,
        centered: true,
        maskClosable: false,
        okText: "提交",
      };
      this.openModal(TaskForm, formProps, modalProps);
    },
    handleChange() {
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    /**
     * 表单弹窗
     * @param form form模板页面，通过import引入
     * @param formProps form配置项 Object
     * @param modalProps 弹窗配置项 Object
     */
    openModal(form, formProps, modalProps) {
      const _this = this
      const defaultModalProps = {
        on: {
          ok() {
            _this.$refs.table.refresh()
          },
          cancel() {
            
          },
          close() {
            
          },
        },
      };
      formProps = Object.assign(formProps, defaultModalProps);
      this.$dialog(
        form,
        // component props
        formProps,
        // modal props
        modalProps
      );
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    //树选择回调
    handleTreeChange(obj) {
      this.queryParam.organizationId = obj.val;
    },
    //重置
    reloadData() {
      this.queryParam.organizationId = "";
      this.queryParam.name = "";
      this.queryParam.approvalResults = "";
      this.$refs.table.refresh(true);
    },
    statusFilter(status) {
      const statusMap = {
        1: "是",
        2: "否",
      };
      return statusMap[status];
    },
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: "是",
        2: "否",
      };
      return statusMap[status];
    },
    holidayFilter(holiday) {
      const statusMap = {
        1: "是",
        2: "否",
      };
      return statusMap[holiday];
    },
    resultFilter(result) {
      const statusMap = {
        0: "未审批",
        1: "审批通过",
        2: "审批拒绝",
      };
      return statusMap[result];
    },
  },
  computed: {
    ...mapState("setting", ["pageMinHeight"]),
    ...mapGetters("account", ["user"]),
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange,
      };
    },
  },
};
</script>

<style scoped lang="less">
@import "../index";
</style>