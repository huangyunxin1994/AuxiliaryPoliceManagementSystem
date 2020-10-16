<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-card :bordered="false">
      <a-row :gutter="24">
        <a-col :sm="24" :md="12"  :lg="12" :xl="6" :xxl="5">
          <span style="width: 100px">关键词搜索：</span>
          <a-input
            style="width: calc(100% - 100px); margin-bottom: 24px"
            placeHolder="请输入要搜索的内容"
          />
        </a-col>
        <a-col :sm="24" :md="12"  :lg="12" :xl="6" :xxl="5">
          <span style="width: 100px">组织：</span>
          <a-tree-select
                v-model="value"
                style="width: calc(100% - 100px);margin-bottom: 24px"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                :tree-data="tree"
                :allowClear="true"
                :replaceFields="replaceFields"
                placeholder="请选择组织"
                tree-default-expand-all
            >
            </a-tree-select>
        </a-col>
        <a-col :sm="24" :md="12"  :lg="12" :xl="6" :xxl="5">
          <span style="width: 100px">状态：</span>
          <a-select
            default-value=""
            style="width: calc(100% - 100px); margin-bottom: 24px"
            @change="handleChange"
          >
            <a-select-option value=""> 全部： </a-select-option>
            <a-select-option value="1"> 是 </a-select-option>
            <a-select-option value="2"> 否 </a-select-option>
          </a-select>
        </a-col>
        <a-col :sm="24" :md="12"  :lg="12" :xl="6" :xxl="5">
          <span style="width: 100px">培训方式：</span>
          <a-select
            default-value=""
            style="width: calc(100% - 100px); margin-bottom: 24px"
            @change="handleChange"
          >
            <a-select-option value=""> 全部 </a-select-option>
            <a-select-option value="1"> 离岗培训 </a-select-option>
            <a-select-option value="2"> 在岗培训 </a-select-option>
          </a-select>
        </a-col>
        <a-col :sm="24" :md="12"  :lg="12" :xl="6" :xxl="4" style="margin-bottom: 24px">
          <span class="table-page-search-submitButtons">
            <a-button type="primary" @click="$refs.table.refresh(true)"
              >查询</a-button
            >
            <a-button
              style="margin-left: 8px"
              @click="() => (this.queryParam = {})"
              >重置</a-button
            >
          </span>
        </a-col>
      </a-row>
      <div class="table-operator" style="margin-bottom: 24px">
        <a-button type="primary" icon="delete" style="margin-right: 10px" :disabled="selectedRowKeys.length == 0">删除培训</a-button>
        <a-button type="primary" icon="plus">新建培训</a-button>
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
        :rowSelection="rowSelection"
        :scroll="{ y: 550, x: 1300 }"
        showPagination="auto"
      >
        <template slot="holiday" slot-scope="holiday">
          <span>{{holiday | holidayFilter}}</span>
        </template>
        <template slot="isEnable" slot-scope="isEnable">
          <a-badge
            :status="isEnable == '1' ? 'processing' : 'error'"
            :text="isEnable | statusFilter"
          />
        </template>
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">查看/编辑</a>
        </span>
      </s-table>
    </a-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
import STable from "@/components/Table_/";
import TaskForm from "@/components/TaskForm";
const tree = [{
    'key': 'key-01',
    'title': '研发中心',
    'icon': 'mail',
    'count': '10',
    'scopedSlots': { title: 'custom' },
    'children': [{
      'key': 'key-01-01',
      'title': '后端组',
      'icon': null,
      'scopedSlots': { title: 'custom' },
      children: [{
        'key': 'key-01-01-01',
        'title': 'JAVA',
        'icon': null,
        'scopedSlots': { title: 'custom' },
      },
      {
        'key': 'key-01-01-02',
        'title': 'PHP',
        'icon': null,
        'scopedSlots': { title: 'custom' },
      },
      {
        'key': 'key-01-01-03',
        'title': 'Golang',
        'icon': null,
        'scopedSlots': { title: 'custom' },
      }
      ]
    }, {
      'key': 'key-01-02',
      'title': '前端组',
      'icon': null,
      'scopedSlots': { title: 'custom' },
      children: [{
        'key': 'key-01-02-01',
        'title': 'React',
        'icon': null,
        'scopedSlots': { title: 'custom' },
      },
      {
        'key': 'key-01-02-02',
        'title': 'Vue',
        'icon': null,
        'scopedSlots': { title: 'custom' },
      },
      {
        'key': 'key-01-02-03',
        'title': 'Angular',
        'icon': null,
        'scopedSlots': { title: 'custom' },
      }
      ]
    }, {
    'key': 'key-02',
    'title': '财务部',
    'icon': 'dollar',
    'scopedSlots': { title: 'custom' },
    'children': [{
        'key': 'key-02-01',
        'title': '会计核算',
        'icon': null,
        'scopedSlots': { title: 'custom' },
        }, {
        'key': 'key-02-02',
        'title': '成本控制',
        'icon': null,
        'scopedSlots': { title: 'custom' },
        }, {
        'key': 'key-02-03',
        'title': '内部控制',
        'icon': null,
        'scopedSlots': { title: 'custom' },
        'children': [{
            'key': 'key-02-03-01',
            'title': '财务制度建设',
            'icon': null,
            'scopedSlots': { title: 'custom' },
        },
        {
            'key': 'key-02-03-02',
            'title': '会计核算',
            'icon': null,
            'scopedSlots': { title: 'custom' },
        }]
    }]
  }]
  }]
export default {
  name: "AskForLeave",
  components: {
    STable,
    TaskForm,
  },
  data() {
    return {
        tree,
        value:null,
        replaceFields:{
            children:'children',
            title:'title',
            key:'key',
            value: 'key'
        },
      scheduleColumns: [
        {
          title: "序号",
          dataIndex: "key",
          key: "key",
          width: 60,
        },
        {
          title: "培训名称",
          dataIndex: "learningName",
          key: "learningName",
          width: 100,
        },
        {
          title: "组织",
          dataIndex: "organizationName",
          key: "organizationName",
          width: 180,
        },
        {
          title: "开始时间",
          dataIndex: "startTime",
          key: "startTime",
          width: 150,
        },
        {
          title: "结束时间",
          dataIndex: "endTime",
          key: "endTime",
          width: 150,
        },
        {
          title: "总学时",
          dataIndex: "classHour",
          key: "classHour",
          width: 100
        },
        {
          title: "培训方式",
          dataIndex: "learningStyle",
          key: "learningStyle",
          scopedSlots: { customRender: "holiday" },
          width: 150
        },
        {
          title: "创建人",
          dataIndex: "creator",
          key: "creator",
          ellipsis: true
        },
        {
          title: "状态",
          dataIndex: "state",
          key: "state",
          width: 100
        },
        {
          title: "培训内容说明",
          dataIndex: "learningContent",
          key: "learningContent",
          ellipsis: true
        },
        {
          table: "操作",
          dataIndex: "action",
          scopedSlots: { customRender: "action" },
          width: 100,
        },
      ],
      loadScheduleData: () => {
        return new Promise((resolve) => {
          resolve({
            data: [
              {
                key: "1",
                learningName: "培训1",
                organizationName: "青秀区东葛路派出所",
                startTime: "2020-06-18 09:00:00",
                endTime: "2020-06-18 18:00:00",
                classHour: "7",
                learningStyle: "1",
                creator:"张三",
                state:"正在培训",
                learningContent:'这是培训1'
              }
            ],
            pageSize: 10,
            pageNo: 1,
            totalPage: 1,
            totalCount: 10,
          });
        }).then((res) => {
          return res;
        });
      },
      selectedRowKeys: [],
      selectedRows: [],
    };
  },
  methods: {
    handleEdit(record) {
      console.log(record);
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
            "1":'是' ,
            "2":'否' ,
      };
      return statusMap[holiday];
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
@import "index";
</style>