<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-card :bordered="false">
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
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="是否审批">
                  <a-select
                    default-value=""
                    style="width: 100%"
                    @change="handleChange"
                  >
                    <a-select-option value=""> 全部 </a-select-option>
                    <a-select-option value="1"> 是 </a-select-option>
                    <a-select-option value="2"> 否 </a-select-option>
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
          <a @click="handleEdit(record)">审批</a>
        </span>
      </s-table>
    </a-card>
    <form-step ref="modal" title="新建加班记录" :formTitle="formTitle" :rules="rules" :stepTitle="stepTitle" :submitFun="submitFun"></form-step>
  </div>
</template>

<script>
import { mapState } from "vuex";
import STable from "@/components/Table_/";
import formStep from "@/components/stepForm/StepForm";
import TaskForm from "@/components/formModel/formModel";
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
    label: "开始时间",
    name: "startTime",
    type: "picker",
    placeholder: "请选择加班开始时间",
  },
  {
    label: "结束时间",
    name: "endTime",
    type: "picker",
    placeholder: "请选择加班结束时间",
  },
  {
    label: "时长(小时)",
    name: "duration",
    type: "input",
    disabled:true,
  },
  {
    label: "法定假日",
    name: "holiday",
    type: "radio",
    select:[
      {name:"是", value:1},
      {name:"否", value:2}
    ]
  },
  {
    label: "加班原因",
    name: "reason",
    type: "textarea",
    placeholder: "请输入加班原因",
  }
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
    label: "法定假日",
    name: "holiday",
    type: "text",
    filter:{
      1:'是' ,
      2:'否' ,
    },
    smCol: { span: 12 },
  },
  {
    label: "加班原因",
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
const stepTitle = [{title:'选择人员'},{title:'填写加班信息'}]
const rules = {
  holiday: [
    { required: true, message: "请选择是否法定假日", trigger: "change" },
  ],
  startTime: [
    { required: true, message: "请选择加班开始时间", trigger: "change" },
  ],
  endTime: [
    { required: true, message: "请选择加班结束时间", trigger: "change" },
  ],
  reason: [{ required: true, message: "请输入加班原因", trigger: "blur" }],
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
        // 高级搜索 展开/关闭
      advanced: false,
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
          width: 100
        },
        {
          title: "是否法定假日",
          dataIndex: "holiday",
          key: "holiday",
          scopedSlots: { customRender: "holiday" },
          width: 150
        },
        {
          title: "加班原因",
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
      //查询参数
      queryParam:{},
      loadScheduleData: (parameter) => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        return this.$api.overTimeService.getOverTimeLeave(requestParameters)
          .then(res => {
            return res.result
          })
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
@import "../index";
</style>