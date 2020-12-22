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
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="批准日期" >
                  <a-date-picker @change="validity" style="width: 100%" :value-format="dateFormat" v-model="queryParam.approvalDate"/>
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
        <a-button type="primary" icon="plus" @click="handleAdd" style="margin-right: 10px">新建</a-button>
        <a-button type="primary" icon="delete"  :disabled="selectedRowKeys.length == 0" @click="handleDel">删除</a-button>
        <!-- <a-dropdown v-if="selectedRowKeys.length > 0">
          <a-menu slot="overlay" @click="handleDel">
            <a-menu-item key="1"><a-icon type="delete" />删除</a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px">
            批量操作 <a-icon type="down" />
          </a-button>
        </a-dropdown> -->
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
      </s-table>
    </a-card>
    <form-step
      ref="modal"
      title="新建责任记录"
      :formTitle="formTitle"
      :rules="rules"
      :stepTitle="stepTitle"
      :submitFun="submitFun"
      @refreshTable="refreshTable"
    ></form-step>
  </div>
</template>

<script>
import { mapState,mapGetters } from "vuex";
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
    name: "approvalAuthority",
    type: "input",
    placeholder: "请输入批准机关",
  },
  {
    label: "批准日期",
    name: "approvalDate",
    type: "picker",
    placeholder: "请选择批准日期",
  },
];
const stepTitle = [{ title: "选择人员" }, { title: "填写责任信息" }];
const rules = {
  reason: [{ required: true, message: "请输入原因", trigger: "blur" }],
  approvalAuthority: [
    { required: true, message: "请输入批准机关", trigger: "blur" },
  ],
  approvalDate: [{ required: true, message: "请选择批准日期", trigger: "change" }],
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
      dateFormat: 'YYYY-MM-DD',
      formTitle,
      rules,
      stepTitle,
      submitFun: (parameter) => {
        return this.$api.accountabilityService.postAccountability(parameter).then((res) => {
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
          dataIndex: "approvalAuthority",
          key: "approvalAuthority",
          width: 150,
          ellipsis: true,
        },
        {
          title: "批准日期",
          dataIndex: "approvalDate",
          key: "approvalDate",
          width: 150,
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
  created(){
    this.queryParam.oid=this.user.isSystem !==1 && this.user.organizationId || ""
  },
  methods: {
    handleAdd() {
      this.$refs.modal.visible = true;
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    handleTreeChange(obj) {
      this.queryParam.organizationId = obj.val;
    },
    handleDel() {
      const _this = this;
      this.$confirm({
        title: "警告",
        content: `真的要删除吗?`,
        okText: "删除",
        okType: "danger",
        centered: true,
        cancelText: "取消",
        onOk() {
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
        organizationId:"",
        oid: this.user.isSystem !==1 && this.user.organizationId || "",
      }
      this.$refs.table.refresh(true);
    },
    //授予日期
    validity(date, dateString) {
      this.queryParam.approvalDate = dateString
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
    ...mapGetters("account", ['user']),
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