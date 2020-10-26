<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="模糊查询">
                <a-input v-model="queryParam.name" placeholder="请输入要查询的关键词" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="组织选择">
                <tree-select :value="queryParam.organizationId" @handleTreeChange="handleTreeChange"></tree-select>
              </a-form-item>
            </a-col>
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
                <a-button
                  style="margin-left: 8px"
                  @click="refreshTable"
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
          <a-menu slot="overlay" @click="handleDel">
            <a-menu-item key="1"><a-icon type="delete" />删除</a-menu-item>
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
        :rowSelection="rowSelection"
        :scroll="{ y: 550, x: 800 }"
        showPagination="auto"
      >
        <template slot="type" slot-scope="type">
          <span>{{ type | typeFilter }}</span>
        </template>
        <template slot="isEnable" slot-scope="isEnable">
          <a-badge
            :status="isEnable == '1' ? 'processing' : 'error'"
            :text="isEnable | statusFilter"
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
      :formTitle="formTitle"
      :rules="rules"
      :stepTitle="stepTitle"
      :submitFun="submitFun"
      @refreshTable="refreshTable"
    ></form-step>
  </div>
</template>

<script>
import { mapState } from "vuex";
import STable from "@/components/Table_/";
import TaskForm from "@/components/formModel/formModel";
import formStep from "@/components/stepForm/StepForm";
import treeSelect from "@/components/treeSelect/TreeSelect"
const formTitle = [
  {
    label: "原因",
    name: "reason",
    type: "textarea",
  },
  {
    label: "批准机关",
    name: "startTime",
    type: "input",
    placeholder: "请输入批准机关",
  },
  {
    label: "批准日期",
    name: "duration",
    type: "picker",
    placeholder: "请选择批准日期",
  },
];
const formCheckTitle = [
  
  {
    label: "姓名",
    name: "policeName",
    type: "text",
    smCol: { span: 12 },
    labelCol:{
      xs: { span: 24 },
      sm: { span: 14 }
    },
    wrapperCol:{
      xs: { span: 24 },
      sm: { span: 10 }
    }
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
    labelCol:{
      xs: { span: 24 },
      sm: { span: 14 }
    },
    wrapperCol:{
      xs: { span: 24 },
      sm: { span: 10 }
    }
  },
  {
    label: "结束时间",
    name: "endTime",
    type: "text",
    smCol: { span: 12 }
  },
  {
    label: "时长(小时)",
    name: "duration",
    type: "text",
    smCol: { span: 12 },
    labelCol:{
      xs: { span: 24 },
      sm: { span: 14 }
    },
    wrapperCol:{
      xs: { span: 24 },
      sm: { span: 10 }
    }
  },
  {
    label: "请假类型",
    name: "type",
    type: "text",
    filter:{
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
    select:[
      {name:"是", value:1},
      {name:"否", value:2}
    ]
  },
  {
    label: "审批备注",
    name: "approvalRemake",
    type: "textarea",
  }
];
const stepTitle = [{ title: "选择人员" }, { title: "填写请假信息" }];
const rules = {
  reason: [{ required: true, message: "请输入原因", trigger: "blur" }],
  startTime: [
    { required: true, message: "请输入批准机关", trigger: "blur" },
  ],
  duration: [{ required: true, message: "请选择批准日期", trigger: "change" }],
};
export default {
  name: "AskForLeave",
  components: {
    STable,
    TaskForm,
    formStep,
    treeSelect
  },
  data() {
    return {
      formTitle,
      rules,
      stepTitle,
      submitFun: (parameter) => {
        return this.$api.accountabilityService.postAccountability(parameter).then((res) => {
          return res.data;
        });
      },
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
          dataIndex: "name",
          key: "name",
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
          title: "责任说明",
          dataIndex: "reason",
          key: "reason",
          ellipsis: true,
        },
        {
          title: "批准机关",
          dataIndex: "endTime",
          key: "endTime",
          width: 150,
          ellipsis: true,
        },
        {
          title: "批准日期",
          dataIndex: "duration",
          key: "duration",
          width: 100,
        }
      ],
      //查询条件参数
      queryParam: {
        name: "",
        organizationId: "",
      },
      loadScheduleData: (parameter) => {
        const requestParameters = Object.assign({}, parameter, this.queryParam);
        return this.$api.accountabilityService
          .getAccountabilityList(requestParameters)
          .then((res) => {
            res.data.data.list.map((i, k) => {
              i.key = k + 1;
            });
            return res.data;
          });
      },
      selectedRowKeys: [],
      selectedRows: [],
    };
  },
  methods: {
    handleAdd() {
      this.$refs.modal.visible = true;
    },
    //请假审批
    handleEdit(record) {
      console.log(record);
      let formProps = {
        record: record,
        formTitle: formCheckTitle,
        submitFun: () => {
          return new Promise((resolve) => {
            resolve({
              data: [],
              pageSize: 10,
              pageNo: 1,
              totalPage: 1,
              totalCount: 10,
            });
          }).then((res) => {
            return res;
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
      const defaultModalProps = {
        on: {
          ok() {
            console.log("ok 回调");
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
    handleTreeChange(obj) {
      this.queryParam.organizationId = obj.val;
    },
    handleDel(e) {
        console.log(e)
      const _this = this;
      this.$confirm({
        title: "警告",
        content: `真的要删除吗?`,
        okText: "删除",
        okType: "danger",
        centered: true,
        cancelText: "取消",
        onOk() {
          console.log(_this);
          _this.$api.accountabilityService
            .deleteAccountability({ list:_this.selectedRowKeys })
            .then((res) => {
              if (res.data.code == 0) {
                _this.$message.success(res.data.msg);
                _this.selectedRowKeys = []
                _this.selectedRows = []
                _this.$refs.table.refresh();
              } else {
                _this.$message.error(res.data.msg);
              }
            })
            .catch((err) => {
              _this.$message.error(err.data.msg);
            });
        },
        onCancel() {},
      });
    },
    //重新加载
    refreshTable() {
    this.queryParam= {
        name: "",
        organizationId: "",
      }
      this.$refs.table.refresh(true);
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
    typeFilter(type) {
      const statusMap = {
        1: "事假",
        2: "病假",
        3: "调休",
        4: "年假",
        5: "婚假",
        6: "产假",
        7: "陪产假",
        8: "哺乳假",
        9: "丧假",
      };
      return statusMap[type];
    },
  },
  computed: {
    ...mapState("setting", ["pageMinHeight"]),
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