<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-card :bordered="false">
      <div
        class="position-and-level-title"
        :style="{ 'border-color': theme.color }"
      >
        工资查询
      </div>
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="月份选择">
                <a-month-picker
                  v-model="salaryParam.month"
                  :disabled-date="disabledDate"
                  placeholder="请选择月份"
                  @change="changeMonth"
                  valueFormat="YYYY-MM"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <s-table
        ref="wageTable"
        rowKey="key"
        :columns="wageColumns"
        :data="wageData"
        :scroll="{ y: 600, x: 650 }"
        showPagination="auto"
      >
      </s-table>
    </a-card>
    <a-card :bordered="false">
      <div
        class="position-and-level-title"
        :style="{ 'border-color': theme.color }"
      >
        合同信息
      </div>

      <s-table
        ref="table"
        rowKey="key"
        :columns="credColumns"
        :data="loadCredData"
        :scroll="{ y: 600, x: 650 }"
        showPagination="auto"
      >
        <span slot="action" slot-scope="text, record">
          <a
            name="file"
            :download="record.name"
            @click="downContract(record.id)"
            :disabled="!record.electronicContract"
            >查看</a
          >
        </span>
      </s-table>
    </a-card>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import STable from "@/components/Table_/";
// import TaskForm from "@/components/formModel/formModel";
import moment from "moment";

export default {
  name: "OrganManage",
  components: {
    STable,
  },
  props: {
    policeId: String,
    policeNumber: String,
  },
  data() {
    return {
      value: null,
      advanced: false,
      replaceFields: {
        children: "children",
        title: "title",
        key: "key",
        value: "key",
      },
      wageColumns: [
        {
          title: "序号",
          dataIndex: "key",
          key: "key",
          width: 60,
        },
      ],
      salaryParam: {
        id: "",
        month: moment(
          new Date(new Date().setMonth(new Date().getMonth() - 1))
        ).format("YYYY-MM"),
      },
      wageData: (params) => {
        let param = Object.assign(params, this.salaryParam);
        return this.$api.salaryService.getSalaryByAux(param).then((res) => {
          res.data.data.currentPage = 1;
          res.data.data.count = 1;
          if (res.data.data.list.length > 0) {
            const salaryTitle = Object.assign(
              {},
              JSON.parse(res.data.data.list[0].salaryContent)
            );
            this.wageColumns.map(
              (j) => salaryTitle[j.title] && delete salaryTitle[j.title]
            );
            res.data.data.list.map((i, k) => {
              i.key = k + 1;
              const salaryVal = JSON.parse(i.salaryContent);
              i = Object.assign(i, salaryVal);
            });
            Object.keys(salaryTitle)
              .reverse()
              .map((i) => {
                let params = {};
                params.title = i;
                params.dataIndex = i;
                params.key = i;
                this.wageColumns.splice(1, 0, params);
              });
          }

          return res.data;
        });
      },
      credColumns: [
        {
          title: "序号",
          dataIndex: "key",
          key: "key",
          width: 60,
        },
        {
          title: "合同开始日期",
          dataIndex: "startDate",
          key: "startDate",
          ellipsis: true,
          width: 100,
        },
        {
          title: "试用结束日期",
          dataIndex: "probation",
          key: "probation",
          ellipsis: true,
          width: 100,
        },
        {
          title: "合同结束日期",
          dataIndex: "endDate",
          key: "endDate",
          ellipsis: true,
          width: 100,
        },
        {
          title: "合同期限",
          dataIndex: "contractPeriod",
          key: "contractPeriod",
          ellipsis: true,
          width: 100,
        },
        {
          title: "合同附件",
          dataIndex: "action",
          scopedSlots: { customRender: "action" },
          width: 150,
        },
      ],
      queryParam: {
        id: "",
      },
      loadCredData: (params) => {
        let param = Object.assign(params, this.queryParam);
        return this.$api.contractService.getdetails(param).then((res) => {
          res.data.data.list.map((i, k) => {
            i.key = k + 1;
          });
          return res.data;
        });
      },
      selectedCredRowKeys: [],
      selectedCredRows: [],
      form: {
        learningName: "",
        startTime: "",
        endTime: "",
        classHour: "",
        learningStyle: "",
        learningContent: "",
      },
      rules: {
        learningName: [
          { required: true, message: "请输入培训名称", trigger: "blur" },
        ],
        time: [{ required: true, message: "请选择日期", trigger: "change" }],
        learningStyle: [
          { required: true, message: "请选择培训方式", trigger: "change" },
        ],
      },
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      BASE_URL:"",
    };
  },
  created() {
    this.queryParam.id = this.policeId || this.user.id;
    this.salaryParam.number = this.policeNumber || this.user.number;
    this.BASE_URL = process.env.VUE_APP_API_BASE_URL
  },
  methods: {
    disabledDate(current) {
      return (
        current &&
        current >
          moment(
            new Date(new Date().setMonth(new Date().getMonth() - 1))
          ).endOf("month")
      );
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
          ok() {},
          cancel() {},
          close() {},
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

    // 开始时间和结束时间
    onChange() {},

    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    handleEdit() {},
    changeMonth() {
      this.$refs.wageTable.refresh(true);
    },
    downContract(id) {
      this.$api.contractService.downNotice({ contractId: id }).then((res) => {
        if (!res.data.code) {
          window.location.href = `${this.BASE_URL}/contract/downloadFile?contractId=${id}`;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        processing: "启用",
        error: "禁用",
      };
      return statusMap[status];
    },
  },
  computed: {
    ...mapState("setting", ["theme", "pageMinHeight"]),
    ...mapGetters("account", ["user"]),
    rowCredSelection() {
      return {
        selectedRowKeys: this.selectedCredRowKeys,
        onChange: this.onCredSelectChange,
      };
    },
    rowEqupSelection() {
      return {
        selectedRowKeys: this.selectedEqupRowKeys,
        onChange: this.onEqupSelectChange,
      };
    },
  },
};
</script>

<style scoped lang="less">
@import "../index";
.position-and-level-title {
  border-style: solid;
  border-width: 5px;
  border-top: none;
  border-right: none;
  border-bottom: none;
  color: @title-color;
  font-weight: 500;
  font-size: 16px;
  text-indent: 10px;
  margin-bottom: 24px;
}
/deep/ .ant-card-head {
  background-color: #fafafa;
}
.submitBtn {
  width: 100%;
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>