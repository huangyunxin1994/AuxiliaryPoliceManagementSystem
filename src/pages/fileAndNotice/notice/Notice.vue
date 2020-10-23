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
                <a-form-item label="是否到期">
                  <a-select default-value="" v-model="queryParam.expire">
                    <a-select-option value=""> 全部 </a-select-option>
                    <a-select-option value="1"> 未过期 </a-select-option>
                    <a-select-option value="2"> 已过期 </a-select-option>
                  </a-select>
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
      <div class="table-operator">
        <a-button type="primary" icon="plus" style="margin-bottom: 24px"
        @click="handleAdd"
          >新建</a-button
        >
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
        :columns="scheduleColumns"
        :data="loadScheduleData"
        :rowSelection="rowSelection"
        :scroll="{ y: 600, x: 800 }"
        showPagination="auto"
      >
        <template slot="expire" slot-scope="expire">
          <a-badge
            :status="expire == 1 ? 'processing' : 'error'"
            :text="expire | statusFilter"
          />
        </template>
        <span slot="name" slot-scope="text,record">
          <a  name="file" :download="record.name" :href="BASE_URL+'/DocumentAnnouncement/notice/download?noticeId='+record.id">{{ text }}</a>
        </span>
      </s-table>
    </a-card>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import STable from "@/components/Table_/";
import TaskForm from "@/components/formModel/formModel";
const formTitle = [
  {
    label: "标题",
    name: "title",
    type: "input",
    placeholder: "请输入标题",
  },
  {
    label: "到期时间",
    name: "expireDate",
    type: "picker",
    placeholder: "请选择到期时间",
  },
  
  {
    label: "公告内容",
    name: "content",
    type: "textarea",
    placeholder: "请输入公告内容",
  },
  {
    label: "上传文件",
    name: "uploadFile",
    type: "upload",
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
  title: [{ required: true, message: "请输入标题", trigger: "blur" }],
  content: [{ required: true, message: "请输入公告内容", trigger: "blur" }],
};
export default {
  name: "OrganManage",
  components: {
    STable,
  },
  data() {
    return {
      BASE_URL:"",
      scheduleColumns: [
        {
          title: "序号",
          dataIndex: "key",
          key: "key",
          width: 60,
        },
        {
          title: "公告标题",
          dataIndex: "title",
          key: "title",
          width: 200,
          ellipsis: true,
        },
        {
          title: "发布时间",
          dataIndex: "releaseTime",
          key: "releaseTime",
          width: 200,
          ellipsis: true,
        },
        {
          title: "到期时间",
          dataIndex: "expireDate",
          key: "expireDate",
          width: 200,
          ellipsis: true,
        },
        {
          title: "是否到期",
          dataIndex: "expire",
          key: "expire",
          width: 100,
          scopedSlots: { customRender: "expire" },
          ellipsis: true,
        },
        {
          title: "公告内容",
          dataIndex: "content",
          key: "content",
          ellipsis: true,
        },
        {
          title: "发布者",
          dataIndex: "publisher",
          key: "publisher",
          width: 200,
          ellipsis: true,
        },
        {
          title: "附件",
          dataIndex: "name",
          key: "name",
          width: 300,
          ellipsis: true,
          scopedSlots: { customRender: "name" },
        },
      ],
      queryParam:{
        name:"",
        expire:""
      },
      loadScheduleData: (parameter) => {
        const requestParameters = Object.assign({}, parameter, this.queryParam);
        return this.$api.documentAnnouncementService
          .getNotice(requestParameters)
          .then((res) => {
            res.data.data.list.map((i,k)=>i.key=k+1)
            return res.data;
          });
      },
      selectedRowKeys: [],
      selectedRows: [],
    };
  },
  mounted(){
    this.BASE_URL = process.env.VUE_APP_API_BASE_URL2
    console.log( this.BASE_URL)
  },
  methods: {
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
      console.log(this.selectedRowKeys);
      console.log(this.selectedRows);
    },
    //新增文件
    handleAdd() {
      let formProps = {
        record:{
          publisher:this.user.name,
          organizationId:this.user.organizationId,
          publisherId:this.user.id,
        },
        formTitle: formTitle,
        rules:rules,
        submitFun: (parameter) => {
          return this.$api.documentAnnouncementService
            .postNotice(parameter)
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
    del(row) {
      this.$confirm({
        title: "警告",
        content: `真的要删除 ${row.name} 吗?`,
        okText: "删除",
        okType: "danger",
        centered: true,
        cancelText: "取消",
        onOk() {
          console.log("OK");
          // 在这里调用删除接口
          return new Promise((resolve, reject) => {
            setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
          }).catch(() => console.log("Oops errors!"));
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    },
    /**
     * 表单弹窗
     * @param form form模板页面，通过import引入
     * @param formProps form配置项 Object
     * @param modalProps 弹窗配置项 Object
     */
    openModal(form, formProps, modalProps) {
      const _this = this
      const defaultModalProps = {
        on: {
          ok() {
            console.log("ok 回调");
            _this.$refs.table.refresh(true)
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
    reloadData(){
      this.queryParam={
        name:"",
        expire:""
      },
      this.$refs.table.refresh(true)
    },
    handleDel(e){
      console.log(e)
      const _this = this;
      this.$confirm({
        title: "警告",
        content: `真的要删除吗?`,
        okText: "删除",
        okType: "danger",
        centered: true,
        cancelText: "取消",
        onOk() {
          console.log(_this);
          _this.$api.documentAnnouncementService
            .deleteNotice({ id:_this.selectedRowKeys })
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
        1: "未过期",
        2: "已过期",
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