<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-card :bordered="false">
       <a-row>
         <a-col :span="24"  style="text-align:center;margin-bottom:24px;">
      <a-month-picker v-model="time1" :valueFormat="monthFormat"   @change="handleChange">
            <h2 style="" :style="{'color':theme.color}">{{ time1 ? time1 : 'SelectTime' }}<a-icon type="caret-down" :style="{'color':theme.color}" style="margin-left:24px"/></h2>
            <template slot="monthCellContentRender" slot-scope="date">
              <div v-if="getMonthData(date)" style="width: 100%; height: 100%">
                <a-badge :offset="[24, 0]" :count="getBadgeData(date)">
                  {{ getMonthData(date) }}
                </a-badge>
              </div>
            </template>
          </a-month-picker>
         </a-col>
       </a-row>
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
                <tree-select @handleTreeChange="handleTreeChange"></tree-select>
              </a-form-item>
            </a-col>
             <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="工资状态">
                  <a-select
                    default-value=""
                    style="width: 100%"
                    @change="handleChange"
                  >
                    <a-select-option value=""> 全部 </a-select-option>
                    <a-select-option value="1"> 已发放 </a-select-option>
                    <a-select-option value="2"> 未发放 </a-select-option>
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
                <a-button
                  style="margin-left: 8px"
                  @click="() => (queryParam = {})"
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
        <a-button type="primary" icon="download" >查看工资表模板</a-button>
        <a-button type="primary" icon="upload" style="margin-left: 8px">上传工资表</a-button>
        <a-button type="primary" icon="sync" style="margin-left: 8px">同步工资表</a-button>
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
import { mapState } from "vuex";
import moment from "moment";
import STable from "@/components/Table_/";
import treeSelect from "@/components/treeSelect/TreeSelect"
export default {
  name: "WagesManage",
  components:{
    STable,
    treeSelect
  },
  data() {
    return {
      time1:moment(new Date()).format("YYYY年MM月"),
      advanced:false,
      showFormat:'YYYY年MM月',
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
          ellipsis: true,
        },
        {
          title: "状态",
          dataIndex: "postName",
          key: "postName",
          width: 100,
        }
      ],
      queryParam:{},
      loadScheduleData: (parameter) => {
        
        return new Promise((resolve) => {
          resolve({
              params:parameter,
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
    //打开关闭日期选择器
    handleChange(date){
      console.log( moment(date).format("YYYY年MM月"))
      this.time1 = moment(date).format("YYYY年MM月")
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    //树选择回调
    handleTreeChange(val){
      this.value = val
      console.log("this.value = " + this.value)
    }
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
    ...mapState("setting", ["theme","pageMinHeight"]),
  },
};
</script>

<style scoped lang="less">
@import "./index";
</style>