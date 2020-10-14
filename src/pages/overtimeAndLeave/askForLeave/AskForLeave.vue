<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-card :bordered="false">
      <a-row :gutter="24">
        <a-col :md="5" :sm="24">
          <span style="width: 100px">关键词搜索：</span>
          <a-input
            style="width: calc(100% - 100px); margin-bottom: 24px"
            placeHolder="请输入要搜索的内容"
          />
        </a-col>
        <a-col :md="5" :sm="24">
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
        <a-col :md="5" :sm="24">
          <span style="width: 100px">是否审批：</span>
          <a-select
            default-value=""
            style="width: calc(100% - 100px); margin-bottom: 24px"
            @change="handleChange"
          >
            <a-select-option value=""> 全部 </a-select-option>
            <a-select-option value="1"> 是 </a-select-option>
            <a-select-option value="2"> 否 </a-select-option>
          </a-select>
        </a-col>
        <a-col :md="5" :sm="24">
          <span style="width: 100px">请假类型：</span>
          <a-select
            default-value=""
            style="width: calc(100% - 100px); margin-bottom: 24px"
            @change="handleChange"
          >
            <a-select-option value=""> 全部 </a-select-option>
            <a-select-option value="1"> 事假 </a-select-option>
            <a-select-option value="2"> 病假 </a-select-option>
            <a-select-option value="3"> 调休 </a-select-option>
            <a-select-option value="4"> 年假 </a-select-option>
            <a-select-option value="5"> 婚假 </a-select-option>
            <a-select-option value="6"> 产假 </a-select-option>
            <a-select-option value="7"> 陪产假 </a-select-option>
            <a-select-option value="8"> 哺乳假 </a-select-option>
            <a-select-option value="9"> 丧假 </a-select-option>
          </a-select>
        </a-col>
        <a-col :md="4" :sm="24" style="margin-bottom: 24px">
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
        :rowSelection="rowSelection"
        :scroll="{ y: 550, x: 1300 }"
        showPagination="auto"
      >
        <template slot="type" slot-scope="type">
          <span>{{type | typeFilter}}</span>
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
    <form-step ref="modal" title="新建请假记录" :formTitle="formTitle" :rules="rules" :stepTitle="stepTitle" :submitFun="submitFun"></form-step>
  </div>
</template>

<script>
import { mapState } from "vuex";
import STable from "@/components/Table_/";
import TaskForm from "@/components/TaskForm";
import formStep from "@/components/stepForm/StepForm";
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
const formTitle = [
  {
    label: "请假类型",
    name: "type",
    type: "select",
    placeholder: "请选择请假类型",
    select:[
      {value:1 ,name:"事假"},
      {value:2 ,name:"病假"},
      {value:3 ,name:"调休"},
      {value:4 ,name:"年假"},
      {value:5 ,name:"婚假"},
      {value:6 ,name:"产假"},
      {value:7 ,name:"陪产假"},
      {value:8 ,name:"哺乳假"},
      {value:9 ,name:"丧假"},
    ]
  },
  {
    label: "开始时间",
    name: "startTime",
    type: "picker",
    placeholder: "请选择请假开始时间",
  },
  {
    label: "结束时间",
    name: "endTime",
    type: "picker",
    placeholder: "请选择请假结束时间",
  },
  {
    label: "请假原因",
    name: "reason",
    type: "textarea",
    placeholder: "请输入请假原因",
  }
];
const stepTitle = [{title:'选择人员'},{title:'填写请假信息'}]
const rules = {
  type: [
    { required: true, message: "请选择请假类型", trigger: "change" },
  ],
  startTime: [
    { required: true, message: "请选择请假开始时间", trigger: "change" },
  ],
  endTime: [
    { required: true, message: "请选择请假结束时间", trigger: "change" },
  ],
  reason: [{ required: true, message: "请输入请假原因", trigger: "blur" }],
};
const submitFun = ()=>{
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
}
export default {
  name: "AskForLeave",
  components: {
    STable,
    TaskForm,
    formStep
  },
  data() {
    return {
        tree,
        formTitle,
        rules,
        stepTitle,
        submitFun,
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
          title: "时长(小时)",
          dataIndex: "duration",
          key: "duration",
          width: 100
        },
        {
          title: "请假类型",
          dataIndex: "type",
          key: "type",
          scopedSlots: { customRender: "type" },
          width: 150
        },
        {
          title: "请假原因",
          dataIndex: "reason",
          key: "reason",
          ellipsis: true
        },
        {
          title: "审批结果",
          dataIndex: "approvalResults",
          key: "approvalResults",
          width: 100
        },
        {
          title: "审批备注",
          dataIndex: "approvalRemake",
          key: "approvalRemake",
          ellipsis: true
        },
        {
          title: "审批人",
          dataIndex: "name",
          key: "name",
          width: 100,
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
                policeName: "辅警1",
                name: "管理员",
                number: "FJ0584",
                organizationName: "青秀区东葛路派出所",
                startTime: "2020-06-18 09:00:00",
                endTime: "2020-06-18 18:00:00",
                duration: "7",
                type: "1",
                reason: "事假",
                approvalResults: "通过",
                approvalRemake: "通过",
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
    handleAdd(){
      this.$refs.modal.visible=true
    },
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
    typeFilter(type) {
      const statusMap = {
            "1":'事假' ,
            "2":'病假' ,
            "3":'调休' ,
            "4":'年假' ,
            "5":'婚假' ,
            "6":'产假' ,
            "7":'陪产假', 
            "8":'哺乳假' ,
            "9":'丧假' 
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