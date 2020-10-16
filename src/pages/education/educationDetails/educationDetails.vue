<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-card :bordered="false">
      <div
        class="position-and-level-title"
        :style="{ 'border-color': theme.color }"
      >
        {{name}}
      </div>
      <a-form-model 
            :model="form" 
            :label-col="labelCol" 
            :rules="rules"
            :wrapper-col="wrapperCol" 
            class="baseForm">
            <a-row>
                <a-col :md="24" :lg="12" :xl="12" :xxl="6">
                    <a-form-model-item label="培训名称" :labelCol="{xs:{span: 24},sm:{span: 8}}" :wrapperCol="{xs:{span: 24},sm:{span: 16}}" prop="learningName">
                        <a-input disabled v-model="form.learningName" />
                    </a-form-model-item>
                </a-col>
                <a-col :md="24" :lg="12" :xl="12" :xxl="6">
                    <a-form-model-item label="培训时间" :labelCol="{xs:{span: 24},sm:{span: 8}}" :wrapperCol="{xs:{span: 24},sm:{span: 16}}" prop="time">
                        <a-range-picker disabled @change="onChange" />
                    </a-form-model-item>
                </a-col>
                <a-col :md="24" :lg="12" :xl="12" :xxl="6">
                    <a-form-model-item label="总学时" :labelCol="{xs:{span: 24},sm:{span: 8}}" :wrapperCol="{xs:{span: 24},sm:{span: 16}}">
                        <a-input disabled v-model="form.classHour" />
                    </a-form-model-item>
                </a-col>
                <a-col :md="24" :lg="12" :xl="12" :xxl="6">
                    <a-form-model-item label="培训方式" :labelCol="{xs:{span: 24},sm:{span: 8}}" :wrapperCol="{xs:{span: 24},sm:{span: 16}}" prop="learningStyle">
                        <a-select disabled v-model="form.learningStyle" placeholder="请选择培训方式">
                            <a-select-option   value='不脱岗'>
                                不脱岗
                            </a-select-option>
                            <a-select-option   value='脱岗'>
                                脱岗
                            </a-select-option>
                        </a-select>
                    </a-form-model-item>
                </a-col>
                <a-col :sm="24" :md="24" >
                    <a-form-model-item label="内容说明" :labelCol="{xs:{span: 24},md:{span: 8} , lg:{span:4} , xl:{span:4} ,xxl:{span:2}}" :wrapperCol="{xs:{span: 24},md:{span: 16} , lg:{span:20} , xl:{span:20} ,xxl:{span:22}}">
                        <a-input
                            v-model="form.learningContent"
                            disabled
                            type="textarea"
                            placeholder="请填写内容说明"
                        />
                    </a-form-model-item>
                </a-col>
            </a-row>
            <a-row :gutter="24">
                
            </a-row>
        </a-form-model>
    </a-card>
    <a-card :bordered="false">
      <div class="position-and-level-title" :style="{ 'border-color': theme.color }">关联人员</div>
      <a-row :gutter="24">
        <a-col :sm="24" :md="12" :lg="8" :xl="5" :xxl="6">
            <span style="width:100px">关键词搜索：</span>
            <a-input style="width: calc(100% - 100px);margin-bottom: 24px" placeHolder="请输入要搜索的内容"/>
        </a-col>
        <a-col :sm="24" :md="12" :lg="16" :xl="8" :xxl="6">
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
        <a-col :sm="24" :md="12"  :lg="12" :xl="6" :xxl="6"  style="margin-bottom: 24px" >
            <span class="table-page-search-submitButtons" >
            <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
            <a-button style="margin-left: 8px" @click="() => (this.queryParam = {})">重置</a-button>
            </span>
        </a-col>
        <a-col :sm="24" :md="24"   style="margin-bottom: 24px" >
            <a-button type="primary" icon="plus" @click="handleCredAdd" >填写结果</a-button>
        </a-col>
      </a-row>
      <s-table
        ref="table"
        rowKey="key"
        :columns="credColumns"
        :data="loadCredData"
        :rowSelection="rowCredSelection"
        :scroll="{ y: 600, x: 650 }"
        showPagination="auto"
      >
      </s-table>
      <a-row :gutter="24">
          <a-col :md="24" :xs="24">
              <div class="submitBtn">
                  <a-button type="primary" icon="plus" @click="submit">完成</a-button>
              </div>
          </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
import STable from "@/components/Table_/";
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
const credTitle = [
  {
    label: "姓名",
    name: "name",
    type: "input",
  },
  {
    label: "培训情况",
    name: "trainGrade",
    type: "select",
    select:[{name:'优秀'},{name:'良好'},{name:'不合格'}]
  },
  {
    label: "说明",
    name: "remake",
    type: "textarea",
  },
];
const credRules = {
  name: [{ required: true, message: "请输入证件类型名称", trigger: "blur" }],
  trainGrade:[{ required: true, message: "请选择培训情况", trigger: "change" }]
};
export default {
  name: "OrganManage",
  components: {
    STable,
  },
  data() {
    return {
      name:"哈哈培训",//培训名称
      tree,
      value:null,
      replaceFields:{
          children:'children',
          title:'title',
          key:'key',
          value: 'key'
      },
      credColumns: [
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
          ellipsis: true,
        },
        {
          title: "所属岗位",
          dataIndex: "post",
          key: "post",
          ellipsis: true,
        },
        {
          title: "所属组织",
          dataIndex: "organizationName",
          key: "organizationName",
          ellipsis: true,
        },
        {
          title: "培训情况",
          dataIndex: "trainGrade",
          key: "trainGrade",
          ellipsis: true,
        },
        {
          title: "说明",
          dataIndex: "trainContent",
          key: "trainContent",
          ellipsis: true,
        }
      ],
      loadCredData: () => {
        return new Promise((resolve) => {
          resolve({
            data: [
              {
                key: "1",
                name: "张三",
                post:'哈哈哈',
                organizationName: "青秀分局",
                trainGrade:'良好',
                trainContent:'这个学员态度认真'
              },
              {
                key: "2",
                name: "李四",
                post:'哈哈哈',
                organizationName: "青秀分局",
                trainGrade:'优秀',
                trainContent:'这个学员非常nice'
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
      },
      selectedCredRowKeys: [],
      selectedCredRows: [],
        form:{
            learningName:'',
            startTime:'',
            endTime:'',
            classHour:'',
            learningStyle:'',
            learningContent:''
        },
        rules:{
            learningName:[{ required: true, message: '请输入培训名称', trigger: 'blur' }],
            time:[{ required: true, message: '请选择日期', trigger: 'change' }],
            learningStyle:[{ required: true, message: '请选择培训方式', trigger: 'change'}]
        },
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
    };
  },
  methods: {
    handleCredAdd() {
      let formProps = {
        formTitle: credTitle,
        rules: credRules,

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
        title: "填写结果",
        width: 700,
        centered: true,
        maskClosable: false,
        okText: "提交",
      };
      this.openModal(TaskForm, formProps, modalProps);
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
    onCredSelectChange(selectedRowKeys, selectedRows) {
      this.selectedCredRowKeys = selectedRowKeys;
      this.selectedCredRows = selectedRows;
    },
    onEqupSelectChange(selectedRowKeys, selectedRows) {
      this.selectedEqupRowKeys = selectedRowKeys;
      this.selectedEqupRows = selectedRows;
    },

    // 开始时间和结束时间
    onChange(date, dateString) {
      console.log(date, dateString);
    },

    // 点击返回
    submit(){

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
.submitBtn{
    width: 100%;
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
}
</style>