<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="关键词搜索">
                <a-input placeholder="请输入要查询的关键词" v-model="queryParam.search"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="组织选择">
                <select-tree 
                  style="width: 100%" 
                  ref="selectTree" 
                  :value="queryParam.organizationId" 
                  @handleTreeChange="handleTreeChange"></select-tree>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="状态">
                  <a-select default-value="" @change="handleChange" v-model="queryParam.state">
                    <a-select-option value=""> 全部： </a-select-option>
                    <a-select-option value="1"> 未结束 </a-select-option>
                    <a-select-option value="2"> 已结束 </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </template>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="培训方式">
                  <a-select default-value="" @change="handleChange" v-model="queryParam.learningStyle">
                    <a-select-option value=""> 全部 </a-select-option>
                    <a-select-option value="2"> 脱岗 </a-select-option>
                    <a-select-option value="1"> 不脱岗 </a-select-option>
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
                  @click="reset"
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
        <a-button type="primary" icon="plus" @click="newEducation" style="margin-right: 10px">新建培训</a-button>
        <a-button type="primary" icon="delete"  :disabled="selectedRowKeys.length == 0" @click="handleDel">删除培训</a-button>
        <!-- <a-button type="primary" icon="plus" @click="$router.push({path:'newEducation'})">新建培训</a-button> -->
        
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
        :rowKey="(record)=>record.id"
        :columns="scheduleColumns"
        :data="loadScheduleData"
        :rowSelection="rowSelection"
        :scroll="{ y: 550, x: 800 }"
        showPagination="auto"
      >
        <template slot="holiday" slot-scope="learningStyle">
          <a-badge
            :status="learningStyle == '1' ? 'processing' : 'error'"
            :text="learningStyle | holidayFilter"
          />
        </template>
        <template slot="state" slot-scope="state">
          <a-badge
            :status="state == '1' ? 'processing' : 'error'"
            :text="state | statusFilter"
          />
        </template>
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">查看/编辑</a>
        </span>
      </s-table>
    </a-card>
    <form-step ref="modal" title="新增培训" formTitleName="name" :formTitle="formTitle" :rules="rules" :stepTitle="stepTitle" :submitFun="submitFun"></form-step>
  </div>
</template>

<script>
import { mapState,mapGetters } from "vuex";
import STable from "@/components/Table_/";
import TaskForm from "@/components/TaskForm";
import selectTree from "@/components/treeSelect/TreeSelect"
import formStep from "@/components/stepForm/StepForm";


const formTitle = [
  {
    label: "培训名称",
    name: "className",
    type: "input",
    placeholder: "请输入培训名称"
  },
  {
    label: "培训起始时间",
    name: "startTime",
    type: "picker",
    placeholder: "请选择培训起始时间"
  },
  {
    label: "培训结束时间",
    name: "endTime",
    type: "picker",
    placeholder: "请选择培训结束时间",
  },
  {
    label: "总学时(小时)",
    name: "classHour",
    type: "input",
    placeholder: "请输入总学时"
  },
  {
    label: "培训方式",
    name: "learningStyle",
    type: "select",
    select:[{name:'脱岗',value:2},{name:'不脱岗',value:1}]
  },
  {
    label: "内容说明",
    name: "learningContent",
    type: "textarea",
    placeholder: "请输入总学时"
  },
];
const stepTitle = [{title:'选择人员'},{title:'填写培训内容'}]
const rules = {
  className: [
    { required: true, message: "请输入培训名称", trigger: "blur"},
  ],
  startTime: [
    { required: true, message: "请选择培训起始日期", trigger: "change" },
  ],
  endTime: [
    { required: true, message: "请选择培训结束日期", trigger: "change" },
  ],
  learningStyle: [{ required: true, message: "请选择培训方式", trigger: "change" }],
};
export default {
  name: "AskForLeave",
  components: {
    STable,
    TaskForm,
    selectTree,
    formStep
  },
  data() {
    return {
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
          dataIndex: "className",
          key: "className",
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
          scopedSlots: { customRender: "state" },
          width: 100
        },
        {
          title: "培训内容说明",
          dataIndex: "learningContent",
          key: "learningContent",
          ellipsis: true
        },
        {
          title: "操作",
          dataIndex: "action",
          scopedSlots: { customRender: "action" },
          width: 100,
        },
      ],
      // 查询条件参数
      queryParam: {
        search:'',
        learningStyle:'',
        oid:'', //登录人员所属组织
        organizationId:'',// 当前页面下的筛选框组织
        state:'',
      },
      loadScheduleData: (params) => {
        this.queryParam.oid = this.user.organizationId
        let param = Object.assign(params,this.queryParam)
        return this.$api.trainService.geteducationList(param).then((res)=>{
          res.data.data.list.map((i,k)=>{
            i.key=k+1
          })
          return res.data
        })
      },
      selectedRowKeys: [],
      selectedRows: [],
      formTitle,
      rules,
      stepTitle,
      submitFun:(params,file)=>{
        // let param = Object.assign(params,this.queryParams)
        return this.$api.trainService.addEducation(params,file).then((res)=>{
          this.$refs.table.refresh(false)
          return res.data
        })
        
      },
      value:null
    };
  },
  methods: {
    handleEdit(record) {
      this.$router.push(
        {
          path:'educationDetails',
          query: {
            param:record
          }
        }
      )
    },
    handleChange() {
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    // 组织树选择
    handleTreeChange(data){
      this.queryParam.organizationId = data.val
    },
    // 新建培训
    newEducation(){
      this.$refs.modal.visible=true
    },
    // 删除培训
    handleDel(){
      const _this = this;
      this.$confirm({
        title: "警告",
        content: `确认要删除所选培训吗?`,
        okText: "删除",
        okType: "danger",
        centered: true,
        cancelText: "取消",
        onOk() {
          _this.$api.trainService.deleteEducation({id:_this.selectedRowKeys}).then((res)=>{
            if(res.data.code == 0){
              _this.$refs.table.refresh(true)
              _this.selectedRowKeys = []
              _this.selectedRows = []
              return res.data
            }else{
              _this.$message.error(res.data.msg);
            }
          }).catch((err) => {
            _this.$message.error(err.data.msg);
          });
        },
        onCancel() {},
      });
    },
    reset(){
      this.queryParam = {}
      this.$refs.table.refresh(true)
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: "未结束",
        2: "已结束",
      };
      return statusMap[status];
    },
    holidayFilter(holiday) {
      const statusMap = {
            "1":'不脱岗 ' ,
            "2":'脱岗' ,
      };
      return statusMap[holiday];
    },
  },
  computed: {
    ...mapState("setting", ["pageMinHeight"]),
    ...mapGetters("account",["user"]),// 获取登录者信息
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