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
                <tree-select
                  :value="queryParam.organizationId"
                  @handleTreeChange="handleTreeChange"
                ></tree-select>
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
              <a-col :md="8" :sm="24">
                <a-form-item label="请假类型">
                  <a-select
                    v-model="queryParam.state"
                    style="width: 100%"
                    @change="handleChange"
                  >
                    <a-select-option value=""> 全部 </a-select-option>
                    <a-select-option value="1"> 年假 </a-select-option>
                    <a-select-option value="2"> 产假 </a-select-option>
                    <a-select-option value="3"> 陪产假 </a-select-option>
                    <a-select-option value="4"> 婚假 </a-select-option>
                    <a-select-option value="5"> 例假 </a-select-option>
                    <a-select-option value="6"> 丧假 </a-select-option>
                    <a-select-option value="7"> 哺乳假 </a-select-option>
                    <a-select-option value="8"> 事假 </a-select-option>
                    <a-select-option value="9"> 调休 </a-select-option>
                    <a-select-option value="10"> 病假 </a-select-option>
                    <a-select-option value="11"> 其他 </a-select-option>
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
        rowKey="key"
        :columns="scheduleColumns"
        :data="loadScheduleData"
        :scroll="{ y: 550, x: 800 }"
        showPagination="auto"
      >
        <template slot="state" slot-scope="state">
          <span>{{ state | typeFilter }}</span>
        </template>
        <template slot="approvalResults" slot-scope="approvalResults">
          <a-badge
            :status="
              approvalResults == '0'
                ? 'processing'
                : approvalResults == 1
                ? 'success'
                : 'error'
            "
            :text="approvalResults | resultFilter"
          />
        </template>
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">审批</a>
        </span>
      </s-table>
    </a-card>
    <form-step
      ref="modal"
      title="新建请假记录"
      :record="addRecord"
      :formTitle="formTitle"
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
import TaskForm from "@/components/formModel/formModel";
import formStep from "@/components/stepForm/StepForm";
import treeSelect from "@/components/treeSelect/TreeSelect";
const formTitle = [
  {
    label: "请假类型",
    name: "state",
    type: "select",
    placeholder: "请选择请假类型",
    select: [
      { value: 1, name: "年假" },
      { value: 2, name: "产假" },
      { value: 3, name: "陪产假" },
      { value: 4, name: "婚假 " },
      { value: 5, name: "例假 " },
      { value: 6, name: "丧假" },
      { value: 7, name: "哺乳假" },
      { value: 8, name: "事假" },
      { value: 9, name: "调休" },
      { value: 10, name: "病假" },
      { value: 11, name: "其他" },
    ],
  },
  {
    label: "开始时间",
    name: "startTime",
    type: "picker",
    valueFormat:'YYYY-MM-DD HH:mm',
    placeholder: "请选择请假开始时间",
    showTime:{ format: 'HH:mm' }
  },
  {
    label: "结束时间",
    name: "endTime",
    type: "picker",
    showTime: { format: 'HH:mm' },
    valueFormat:'YYYY-MM-DD HH:mm',
    placeholder: "请选择请假结束时间",
  },
  {
    label: "时长(小时)",
    name: "duration",
    type: "input",
  },
  {
    label: "请假原因",
    name: "reason",
    type: "textarea",
    placeholder: "请输入请假原因",
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
    label: "请假类型",
    name: "type",
    type: "text",
    filter: {
      1: "事假",
      2: "病假",
      3: "调休",
      4: "年假",
      5: "婚假",
      6: "产假",
      7: "陪产假",
      8: "哺乳假",
      9: "丧假",
    },
    smCol: { span: 12 },
  },
  {
    label: "请假原因",
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
  {
    name: "approvalId",
  },
];
const stepTitle = [{ title: "选择人员" }, { title: "填写请假信息" }];
const rules = {
  type: [{ required: true, message: "请选择请假类型", trigger: "change" }],
  startTime: [
    { required: true, message: "请选择请假开始时间", trigger: "change" },
  ],
  endTime: [
    { required: true, message: "请选择请假结束时间", trigger: "change" },
  ],
  reason: [{ required: true, message: "请输入请假原因", trigger: "blur" }],
};
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
      submitFun: (parameter) => {
        return this.$api.overTimeService.postByUser(parameter).then((res) => {
          return res.data;
        });
      },
      addRecord:{type:2},
      // 高级搜索 展开/关闭
      advanced: false,
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
          width: 150,
          ellipsis: true,
        },
        {
          title: "结束时间",
          dataIndex: "endTime",
          key: "endTime",
          width: 150,
          ellipsis: true,
        },
        {
          title: "时长(小时)",
          dataIndex: "duration",
          key: "duration",
          width: 100,
        },
        {
          title: "请假类型",
          dataIndex: "state",
          key: "state",
          scopedSlots: { customRender: "state" },
          width: 100,
        },
        {
          title: "请假原因",
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
        type: 2,
        organizationId: "",
        name: "",
        oid: "",
        approvalResults: "",
        state: "",
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
  created() {
    this.addRecord.approval = this.user.name;
    this.addRecord.approvalId = this.user.id;
    this.queryParam.oid = this.user.organizationId;
  },
  methods: {
    handleAdd() {
      this.$refs.modal.visible = true;
    },
    //请假审批
    handleEdit(record) {
      console.log(record);
      record.approval = this.user.name;
      record.approvalId = this.user.id;
      let formProps = {
        record: record,
        formTitle: formCheckTitle,
        submitFun: (parameter) => {
          return this.$api.overTimeService
            .putOverTimeLeave(parameter)
            .then((res) => {
              return res.data;
            });
        },
      };
      let modalProps = {
        title: "编辑",
        width: 700,
        centered: true,
        maskClosable: false,
        okText: "提交",
      };
      this.openModal(TaskForm, formProps, modalProps);
    },
    handleChange(e) {
      console.log(e);
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
      console.log(this.selectedRowKeys);
      console.log(this.selectedRows);
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    /**
     * 表单弹窗
     * @param form form模板页面，通过import引入
     * @param formProps form配置项 Object
     * @param modalProps 弹窗配置项 Object
     */
    openModal(form, formProps, modalProps) {
      const _this = this;
      const defaultModalProps = {
        on: {
          ok() {
            console.log("ok 回调");
            _this.$refs.table.refresh(true);
          },
          cancel() {
            console.log("cancel 回调");
          },
          close() {
            console.log("modal close 回调");
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
    //树选择回调
    handleTreeChange(obj) {
      this.queryParam.organizationId = obj.val;
      console.log(this.queryParam);
    },
    //重置
    reloadData() {
      this.queryParam.organizationId = "";
      this.queryParam.name = "";
      this.queryParam.approvalResults = "";
      this.queryParam.state = "";
      this.$refs.table.refresh(true);
    },
  },
  filters: {
    typeFilter(type) {
      const statusMap = {
        1: "年假 ",
        2: "产假 ",
        3: "陪产假",
        4: "婚假",
        5: "例假",
        6: "丧假",
        7: "哺乳假",
        8: "事假",
        9: "调休",
        10: "病假",
        11: "其他",
      };
      return statusMap[type];
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