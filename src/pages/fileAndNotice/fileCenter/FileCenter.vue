<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-card :bordered="false">
      <a-row>
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="48">
              <a-col :md="8" :sm="24">
                <a-form-item label="模糊查询">
                  <a-input v-model="queryParam.name" placeholder="请输入要查询的关键词" />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <span class="table-page-search-submitButtons">
                  <a-button type="primary" @click="$refs.table.refresh(true)"
                    >查询</a-button
                  >
                  <a-button
                    style="margin-left: 8px"
                    @click="reloadData"
                    >重置</a-button
                  >
                </span>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </a-row>
      <div class="table-operator" style="margin-bottom: 24px">
        <a-button type="primary" icon="plus" @click="handleAdd">新建</a-button>
        <a-dropdown v-if="selectedRowKeys.length > 0">
          <a-menu slot="overlay" @click="handleDel">
            <a-menu-item key="1"><a-icon type="delete" />删除</a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px">
            批量操作 <a-icon type="down" />
          </a-button>
        </a-dropdown>
      </div>
      <s-table
        ref="table"
        :rowKey="(record)=>record.id"
        :columns="columns"
        :data="loadData"
        :rowSelection="rowSelection"
        :scroll="{ y: 600, x: 800 }"
        showPagination="auto"
      >
      <template slot="status" slot-scope="status">
          <a-badge :status="status" :text="status | statusFilter" />
        </template>
        <span slot="name" slot-scope="text, record">
          <a name="file" :download="record.name" :href="BASE_URL+'/DocumentAnnouncement/document/download?documentId='+record.id">{{ text }}</a>
        </span>
      </s-table>
    </a-card>
  </div>
</template>

<script>
import { mapState,mapGetters } from "vuex";
import STable from "@/components/Table_/";
import TaskForm from "@/components/formModel/formModel";
const formTitle = [
  {
    label: "上传文件",
    name: "fileList",
    type: "upload",
    required:true,
    placeholder: "请输入请假原因",
  },
  {
    label: "内容说明",
    name: "remake",
    type: "textarea",
    placeholder: "请输入内容说明",
  },
  {
    name:"publisher"
  },
  {
    name:"organizationId"
  },
  {
    name:"publisherId"
  }
];
const rules = {
  remake: [{ required: true, message: "请输入内容说明", trigger: "blur" }]
  
};
export default {
  name: "OrganManage",
  components: {
    STable,
    TaskForm,
  },
  data() {
    return {
      BASE_URL:"",
      columns: [
        {
          title: "序号",
          dataIndex: "key",
          key: "key",
          width: 60,
        },
        {
          title: "文档",
          dataIndex: "name",
          key: "name",
          scopedSlots: { customRender: "name" },
          width: 300,
        },
        {
          title: "内容说明",
          dataIndex: "remake",
          key: "remake",
          ellipsis: true,
        },
        {
          title: "发布者",
          dataIndex: "publisher",
          key: "publisher",
          width: 150,
        },
        {
          title: "发布时间",
          dataIndex: "releaseTime",
          key: "releaseTime",
          width: 250,
        },
      ],
      queryParam:{
        name:"",
        oid:""
      },
      loadData: (parameter) => {
        const requestParameters = Object.assign({}, parameter, this.queryParam);
        return this.$api.documentAnnouncementService
          .getDocument(requestParameters)
          .then((res) => {
            res.data.data.list.map((i,k)=>i.key=k+1)
            return res.data;
          });
      },
      selectedRowKeys: [],
      selectedRows: [],
    };
  },
  created(){
    this.queryParam.oid = this.user.isSystem !==1 && this.user.organizationId || ""
  },
  mounted(){
    this.BASE_URL = process.env.VUE_APP_API_BASE_URL
  },
  methods: {
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    //新增文件
    handleAdd() {
      let formProps = {
        record:{
          publisher:this.user.name,
          organizationId:this.user.isSystem !==1 && this.user.organizationId || "",
          publisherId:this.user.id,
        },
        formTitle: formTitle,
        rules: rules,
        submitFun: (parameter) => {
        return this.$api.documentAnnouncementService
          .postDocument(parameter)
          .then((res) => {
            return res.data;
          });
        },
      };
      let modalProps = {
        title: "新建",
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
       const _this = this;
      const defaultModalProps = {
        on: {
          ok() {
            _this.$refs.table.refresh(true)
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
    reloadData(){
      this.queryParam={
        name:""
      }
      this.$refs.table.refresh(true)
    },
    handleDown(obj){
      this.$api.documentAnnouncementService
          .downDocument({documentId:obj.id})
    },
    handleDel(){
      const _this = this;
      this.$confirm({
        title: "警告",
        content: `真的要删除吗?`,
        okText: "删除",
        okType: "danger",
        centered: true,
        cancelText: "取消",
        onOk() {
          _this.$api.documentAnnouncementService
            .deleteDocument({ id:_this.selectedRowKeys })
            .then((res) => {
              if (res.data.code == 0) {
                _this.$message.success(res.data.msg);
                _this.selectedRowKeys = []
                _this.selectedRows = []
                _this.$refs.table.refresh();
              } else {
                _this.$message.error(res.data.msg);
              }
            })
            .catch((err) => {
              _this.$message.error(err.data.msg);
            });
        },
        onCancel() {},
      });
    }
    
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
    ...mapGetters("account",["user"]),
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