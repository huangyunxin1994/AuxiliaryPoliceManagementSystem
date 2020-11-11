<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-card :bordered="false">
      <a-row>
        <a-col :span="24" style="text-align: center; margin-bottom: 24px">
          <a-month-picker
            v-model="queryParam.time"
            :valueFormat="monthFormat"
            :disabled-date="disabledDate"
            @change="handleChange"
          >
            <h2 style="" :style="{ color: theme.color }">
              <span>{{ queryParam.time | filtersTime }}</span>
              <a-icon
                type="caret-down"
                :style="{ color: theme.color }"
                style="margin-left: 24px"
              />
            </h2>
            <template slot="monthCellContentRender" slot-scope="date">
              <!-- <div v-if="getMonthData(date)" style="width: 100%; height: 100%">
                <a-badge :offset="[24, 0]" :count="getBadgeData(date)"> -->
              {{ getMonthData(date) }}
              <!-- </a-badge>
              </div> -->
            </template>
          </a-month-picker>
        </a-col>
      </a-row>
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
            <a-col :md="8" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="$refs.table.refresh(true)"
                  >查询</a-button
                >
                <a-button style="margin-left: 8px" @click="reloadData"
                  >重置</a-button
                >
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <div class="table-operator" style="margin-bottom: 24px">
        <a-button type="primary" icon="export" @click="exportToExcel"
          >导出</a-button
        >
        <!-- <a-dropdown v-if="selectedRowKeys.length > 0">
          <a-menu slot="overlay">
            <a-menu-item key="1"><a-icon type="delete" />删除</a-menu-item>
            
            <a-menu-item key="2"><a-icon type="lock" />锁定</a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px">
            批量操作 <a-icon type="down" />
          </a-button>
        </a-dropdown> -->
      </div>
      <s-table
        ref="table"
        rowKey="key"
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
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">审批</a>
        </span>
      </s-table>
    </a-card>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import moment from "moment";
import STable from "@/components/Table_/";
import treeSelect from "@/components/treeSelect/TreeSelect";
import ExportJsonExcel from "js-export-excel";
export default {
  name: "OvertimeLeaveCount",
  components: {
    STable,
    treeSelect,
  },
  data() {
    return {
      time1: moment(new Date()).format("YYYY年MM月"),
      showFormat: "YYYY年MM月",
      monthFormat: "YYYY-MM",
      // 高级搜索 展开/关闭
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
          title: "岗位",
          dataIndex: "postName",
          key: "postName",
          width: 100,
          ellipsis: true,
        },
        {
          title: "加班时长(小时)",
          dataIndex: "overtimeHours",
          key: "overtimeHours",
          width: 150,
        },
        {
          title: "年假(小时)",
          dataIndex: "One",
          key: "One",
          width: 100,
        },
        {
          title: "产假(小时)",
          dataIndex: "Two",
          key: "Two",
          width: 100,
        },
        {
          title: "陪产假(小时)",
          dataIndex: "Three",
          key: "Three",
          width: 120,
        },
        {
          title: "婚假(小时)",
          dataIndex: "Four",
          key: "Four",
          width: 100,
        },
        {
          title: "例假(小时)",
          dataIndex: "Five",
          key: "Five",
          width: 100,
        },
        {
          title: "丧假(小时)",
          dataIndex: "Six",
          key: "Six",
          width: 100,
        },
        {
          title: "哺乳假(小时)",
          dataIndex: "Seven",
          key: "Seven",
          width: 120,
        },
        {
          title: "事假(小时)",
          dataIndex: "Eight",
          key: "Eight",
          width: 100,
        },
        {
          title: "调休(小时)",
          dataIndex: "Nine",
          key: "Nine",
          width: 100,
        },
        {
          title: "病假(小时)",
          dataIndex: "Ten",
          key: "Ten",
          width: 100,
        },
        {
          title: "其他(小时)",
          dataIndex: "Eleven",
          key: "Eleven",
          width: 100,
        },
        {
          title: "请假合计(小时)",
          dataIndex: "",
          key: "",
          width: 150,
        },
      ],
      queryParam: {
        name: "",
        organizationId: "",
        oid: "",
        time: moment(new Date()).format("YYYY-MM"),
      },
      loadScheduleData: (parameter) => {
        const requestParameters = Object.assign({}, parameter, this.queryParam);
        return this.$api.overTimeService
          .statistics(requestParameters)
          .then((res) => {
            res.data.data.list.map((i, k) => (i.key = k + 1));
            return res.data;
          });
      },
    };
  },
  created() {
    this.queryParam.oid = this.user.organizationId;
  },
  methods: {
    disabledDate(current) {
      return current && current > moment().endOf("month");
    },
    getBadgeData(value) {
      let result = moment(value).format("M");
      let arr = [
        { month: "1", result: 1 },
        { month: "2", result: 1 },
        { month: "3", result: 1 },
        { month: "4", result: 1 },
        { month: "5", result: 1 },
        { month: "6", result: 2 },
        { month: "7", result: 2 },
        { month: "8", result: 2 },
        { month: "9", result: 1 },
      ];
      let params = arr.find((i) => i.month === result);
      if (params) {
        if (params.result === 1) {
          return <a-icon type="check-circle" style="color:#87d068" />;
        } else {
          return <a-icon type="info-circle" style="color:#f50" />;
        }
      } else {
        return null;
      }
    },
    getMonthData(value) {
      return moment(value).format("M月");
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
    //打开关闭日期选择器
    handleChange(date) {
      this.time1 = moment(date).format("YYYY年MM月");
      this.$refs.table.refresh(true);
    },
    //树选择回调
    handleTreeChange(obj) {
      this.queryParam.organizationId = obj.val;
    },
    //重置
    reloadData() {
      this.queryParam.name = "";
      this.queryParam.organizationId = "";
      this.queryParam.time = moment(new Date()).format("YYYY-MM");
      this.$refs.table.refresh(true);
    },
    //导出EXCEL
    exportToExcel() {
      let requestParameters = {
        currentPage: 1,
        pageSize: 99999,
      };
      requestParameters = Object.assign({}, requestParameters, this.queryParam);
      this.$api.overTimeService.statistics(requestParameters).then((res) => {
        if (res.data.data.list.length > 0) {
          res.data.data.list.map((i, k) => (i.key = k + 1));
          const ReqDetailList = res.data.data.list;
          const columns = this.scheduleColumns; // 表头数据
          const option = {};
          option.fileName = "excel";
          option.datas = [
            {
              sheetData: ReqDetailList.map((item) => {
                const result = {};
                columns.forEach((c) => {
                  result[c.dataIndex] = item[c.dataIndex];
                });
                return result;
              }),
              sheetName: "加班请假统计表", // Excel文件名称
              sheetFilter: columns.map((item) => item.dataIndex),
              sheetHeader: columns.map((item) => item.title),
              columnWidths: columns.map(() => 5),
            },
          ];
          const toExcel = new ExportJsonExcel(option);
          toExcel.saveExcel();
        } else {
          this.$message.warning("没有可以导出的数据");
        }
      });
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
    filtersTime(time) {
      const dateTime = moment(new Date(time)).format("YYYY年MM月");
      return dateTime;
    },
  },
  computed: {
    ...mapState("setting", ["theme", "pageMinHeight"]),
    ...mapGetters("account", ["user"]),
  },
};
</script>

<style scoped lang="less">
@import "../index";
</style>