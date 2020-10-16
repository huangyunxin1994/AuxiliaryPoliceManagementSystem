<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-card :bordered="false">
      <a-form layout="inline">
         <a-form-item label="月份选择">
          <a-month-picker :valueFormat="monthFormat" style="margin-bottom:24px">
            <template slot="monthCellContentRender" slot-scope="date">
              <div v-if="getMonthData(date)" style="width: 100%; height: 100%">
                <a-badge :offset="[24, 0]" :count="getBadgeData(date)">
                  {{ getMonthData(date) }}
                </a-badge>
              </div>
            </template>
          </a-month-picker>
         </a-form-item>
      </a-form>
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="模糊查询">
                <a-input placeholder="请输入要查询的关键词" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="组织选择">
                <a-tree-select
                  v-model="value"
                  style="width: 100%"
                  :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                  :tree-data="tree"
                  :allowClear="true"
                  :replaceFields="replaceFields"
                  placeholder="请选择组织"
                  tree-default-expand-all
                >
                </a-tree-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
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
                  @click="() => (queryParam = {})"
                  >重置</a-button
                >
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <div class="table-operator" style="margin-bottom: 24px">
        <a-button type="primary" icon="export" >导出</a-button>
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
        :scroll="{ y: 550, x: 1300 }"
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
import { mapState } from "vuex";
import moment from "moment";
import STable from "@/components/Table_/";
const tree = [
  {
    key: "key-01",
    title: "研发中心",
    icon: "mail",
    count: "10",
    scopedSlots: { title: "custom" },
    children: [
      {
        key: "key-01-01",
        title: "后端组",
        icon: null,
        scopedSlots: { title: "custom" },
        children: [
          {
            key: "key-01-01-01",
            title: "JAVA",
            icon: null,
            scopedSlots: { title: "custom" },
          },
          {
            key: "key-01-01-02",
            title: "PHP",
            icon: null,
            scopedSlots: { title: "custom" },
          },
          {
            key: "key-01-01-03",
            title: "Golang",
            icon: null,
            scopedSlots: { title: "custom" },
          },
        ],
      },
      {
        key: "key-01-02",
        title: "前端组",
        icon: null,
        scopedSlots: { title: "custom" },
        children: [
          {
            key: "key-01-02-01",
            title: "React",
            icon: null,
            scopedSlots: { title: "custom" },
          },
          {
            key: "key-01-02-02",
            title: "Vue",
            icon: null,
            scopedSlots: { title: "custom" },
          },
          {
            key: "key-01-02-03",
            title: "Angular",
            icon: null,
            scopedSlots: { title: "custom" },
          },
        ],
      },
      {
        key: "key-02",
        title: "财务部",
        icon: "dollar",
        scopedSlots: { title: "custom" },
        children: [
          {
            key: "key-02-01",
            title: "会计核算",
            icon: null,
            scopedSlots: { title: "custom" },
          },
          {
            key: "key-02-02",
            title: "成本控制",
            icon: null,
            scopedSlots: { title: "custom" },
          },
          {
            key: "key-02-03",
            title: "内部控制",
            icon: null,
            scopedSlots: { title: "custom" },
            children: [
              {
                key: "key-02-03-01",
                title: "财务制度建设",
                icon: null,
                scopedSlots: { title: "custom" },
              },
              {
                key: "key-02-03-02",
                title: "会计核算",
                icon: null,
                scopedSlots: { title: "custom" },
              },
            ],
          },
        ],
      },
    ],
  },
];
export default {
  name: "OvertimeLeaveCount",
  components:{
    STable
  },
  data() {
    return {
      tree,
      monthFormat: "YYYY/MM",
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
          dataIndex: "endTime",
          key: "endTime",
          width: 150,
        },
        {
          title: "年假(小时)",
          dataIndex: "duration",
          key: "duration",
          width: 100,
        },
        {
          title: "产假(小时)",
          dataIndex: "holiday",
          key: "holiday",
          width: 100,
        },
        {
          title: "陪产假(小时)",
          dataIndex: "reason",
          key: "reason",
          width: 120,
        },
        {
          title: "婚假(小时)",
          dataIndex: "reason",
          key: "reason",
          width: 100,
        },
        {
          title: "例假(小时)",
          dataIndex: "reason",
          key: "reason",
          width: 100,
        },
        {
          title: "丧假(小时)",
          dataIndex: "reason",
          key: "reason",
          width: 100,
        },
        {
          title: "哺乳假(小时)",
          dataIndex: "reason",
          key: "reason",
          width: 120,
        },
        {
          title: "事假(小时)",
          dataIndex: "reason",
          key: "reason",
          width: 100,
        },
        {
          title: "调休(小时)",
          dataIndex: "reason",
          key: "reason",
          width: 100,
        },
        {
          title: "病假(小时)",
          dataIndex: "reason",
          key: "reason",
          width: 100,
        },
        {
          title: "其他(小时)",
          dataIndex: "reason",
          key: "reason",
          width: 100,
        },
        {
          title: "请假合计(小时)",
          dataIndex: "reason",
          key: "reason",
          width: 150,
        }
      ],
      loadScheduleData: () => {
        return new Promise((resolve) => {
          resolve({
            data: [
              {
                key: "1",
                policeName: "辅警1",
                name: "管理员",
                number: "FJ0584",
                organizationName: "青秀区东葛路派出所",
                startTime: "2020-06-18 09:00:00",
                endTime: "2020-06-18 18:00:00",
                duration: "7",
                holiday: "1",
                reason: "加班",
                approvalResults: "通过",
                approvalRemake: "通过",
              },
            ],
            pageSize: 10,
            pageNo: 1,
            totalPage: 1,
            totalCount: 10,
          });
        }).then((res) => {
          return res;
        });
      }
    };
  },
  methods: {
    getBadgeData(value) {
      let result = moment(value).format("MM");
      console.log(result);
      let arr = [
        { month: "01", result: 1 },
        { month: "02", result: 1 },
        { month: "03", result: 1 },
        { month: "04", result: 1 },
        { month: "05", result: 1 },
        { month: "06", result: 2 },
        { month: "07", result: 2 },
        { month: "08", result: 2 },
        { month: "09", result: 1 },
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
      return moment(value).format("MM");
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
  },
  computed: {
    ...mapState("setting", ["pageMinHeight"]),
  },
};
</script>

<style scoped lang="less">
@import "../index";
</style>