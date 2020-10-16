<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="关键词搜索">
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
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="状态">
                  <a-select default-value="" @change="handleChange">
                    <a-select-option value=""> 全部： </a-select-option>
                    <a-select-option value="1"> 是 </a-select-option>
                    <a-select-option value="2"> 否 </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </template>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="培训方式">
                  <a-select default-value="" @change="handleChange">
                    <a-select-option value=""> 全部 </a-select-option>
                    <a-select-option value="1"> 离岗培训 </a-select-option>
                    <a-select-option value="2"> 在岗培训 </a-select-option>
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
        <a-button type="primary" icon="delete" style="margin-right: 10px" :disabled="selectedRowKeys.length == 0">删除培训</a-button>
        <a-button type="primary" icon="plus">新建培训</a-button>
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
        // 高级搜索 展开/关闭
        advanced: false,
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
    toggleAdvanced() {
      this.advanced = !this.advanced;
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