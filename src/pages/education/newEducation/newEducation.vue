<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-card :bordered="false">
      <div
        class="position-and-level-title"
        :style="{ 'border-color': theme.color }"
      >
        新建培训
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
                        <a-input v-model="form.learningName" />
                    </a-form-model-item>
                </a-col>
                <a-col :md="24" :lg="12" :xl="12" :xxl="6">
                    <a-form-model-item label="培训时间" :labelCol="{xs:{span: 24},sm:{span: 8}}" :wrapperCol="{xs:{span: 24},sm:{span: 16}}" prop="time">
                        <a-range-picker @change="onChange" />
                    </a-form-model-item>
                </a-col>
                <a-col :md="24" :lg="12" :xl="12" :xxl="6">
                    <a-form-model-item label="总学时" :labelCol="{xs:{span: 24},sm:{span: 8}}" :wrapperCol="{xs:{span: 24},sm:{span: 16}}">
                        <a-input v-model="form.classHour" />
                    </a-form-model-item>
                </a-col>
                <a-col :md="24" :lg="12" :xl="12" :xxl="6">
                    <a-form-model-item label="培训方式" :labelCol="{xs:{span: 24},sm:{span: 8}}" :wrapperCol="{xs:{span: 24},sm:{span: 16}}" prop="learningStyle">
                        <a-select v-model="form.learningStyle" placeholder="请选择培训方式">
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
        <a-button type="primary" icon="delete"  v-if="selectedCredRowKeys.length == 0" disabled style="margin-right: 10px">删除人员</a-button>
        <a-popconfirm
          title="确认删除所选人员?"
          ok-text="确认"
          cancel-text="取消"
          @confirm="confirm"
          @cancel="cancel"
          v-else
        >
          <a-button type="primary" icon="delete" style="margin-right: 10px">删除人员</a-button>
        </a-popconfirm>
        
        <a-button type="primary" icon="plus" @click="handleCredAdd" >新建人员</a-button>
        <a-dropdown v-if="selectedCredRowKeys.length > 0">
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
        :columns="credColumns"
        :data="loadCredData"
        :rowSelection="rowCredSelection"
        :scroll="{ y: 600, x: 650 }"
        showPagination="auto"
      >
      </s-table>
      <div class="table-page-search-wrapper">
        <div class="submitBtn">
            <a-button type="primary" icon="plus" @click="submit">完成</a-button>
        </div>
      </div>
      
    </a-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
import STable from "@/components/Table_/";
import TaskForm from "@/components/formModel/formModel";
import addPerson from "@/components/diaEducation/diaEducation"

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
    label: "警员编号",
    name: "remake",
    type: "textarea",
  },
];
const credRules = {
  name: [{ required: true, message: "请输入证件类型名称", trigger: "blur" }],
};
export default {
  name: "OrganManage",
  components: {
    STable,
  },
  data() {
    return {
      tree,
      value:null,
      advanced:false,
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
          title: "警员编号",
          dataIndex: "num",
          key: "num",
          ellipsis: true,
        },
        {
          title: "所属组织",
          dataIndex: "organizationName",
          key: "organizationName",
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
                num:'123456',
                organizationName: "青秀分局"
              },
              {
                key: "2",
                name: "李四",
                num:'123456',
                organizationName: "仙湖分局"
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
        title: "添加人员",
        width: 700,
        centered: true,
        maskClosable: false,
        okText: "提交",
      };
      this.openModal(addPerson, formProps, modalProps);
    },
    handleCredEdit(record) {
      console.log(record);
      let formProps = {
        record: record,
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
        title: "编辑",
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

    // 点击完成
    submit(){

    },
    // 点击删除人员
    confirm(e) {
        console.log(e);
        this.$message.success('删除成功');
    },
    cancel(e) {
        console.log(e);
        this.$message.error('已取消删除');
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
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