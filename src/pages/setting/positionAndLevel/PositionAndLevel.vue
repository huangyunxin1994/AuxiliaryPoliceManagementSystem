<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-card :bordered="false">
      <div
        class="position-and-level-title"
        :style="{ 'border-color': theme.color }"
      >
        职级管理
      </div>
      <a-row :gutter="24">
        <a-col :span="24" style="margin-bottom: 24px">
          <span class="table-page-search-submitButtons">
            <a-button type="primary" icon="plus" @click="handleAddLevel"
              >添加职级</a-button
            >
            <a-button
              type="error"
              style="margin-left: 8px"
              icon="delete"
              @click="() => (this.queryParam = {})"
              >删除职级</a-button
            >
          </span>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col
          :lg="4"
          :md="6"
          :xs="12"
          style="margin-bottom: 24px"
          v-for="(item, index) in levelList"
          :key="item.id"
        >
          <a-card size="small" :title="'#' + parseInt(index + 1)">
            <a-button
              type="link"
              slot="extra"
              size="small"
              v-show="!item.edit"
              @click="handEditLevel(item.id)"
              :disabled="submitType ? true : false"
              >编辑</a-button
            >
            <a-button
              type="link"
              slot="extra"
              size="small"
              v-show="item.edit"
              @click="handCancelLevel(item)"
              style="color: rgba(0, 0, 0, 0.6)"
              >取消</a-button
            >
            <a-divider slot="extra" v-show="item.edit" type="vertical" />
            <a-button
              type="link"
              slot="extra"
              size="small"
              v-show="item.edit"
              @click="handSaveLevel(item)"
              >保存</a-button
            >
            <div
              v-show="!item.edit"
              style="width: 100%; height: 32px; padding: 6px 13px"
            >
              {{ item.name }}
            </div>
            <a-input
              v-show="item.edit"
              v-model="item.name"
              placeholder="请输入职级名称"
              :allowClear="true"
            />
          </a-card>
        </a-col>
      </a-row>
      <div
        class="position-and-level-title"
        :style="{ 'border-color': theme.color }"
      >
        岗位管理
      </div>
      <a-row :gutter="24">
        <a-col :md="8" :sm="24">
          <span style="width: 100px">关键词搜索：</span>
          <a-input
            style="width: calc(100% - 100px); margin-bottom: 24px"
            placeHolder="请输入要搜索的内容"
          />
        </a-col>
        <a-col :md="8" :sm="24">
          <span style="width: 100px">状态：</span>
          <a-select
            default-value=""
            style="width: calc(100% - 100px); margin-bottom: 24px"
            @change="handleChange"
          >
            <a-select-option value=""> 全部 </a-select-option>
            <a-select-option value="1"> 启用 </a-select-option>
            <a-select-option value="2"> 禁用 </a-select-option>
          </a-select>
        </a-col>
        <a-col :md="8" :sm="24" style="margin-bottom: 24px">
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
        :scroll="{ y: 600, x: 1300 }"
        showPagination="auto"
      >
        <template slot="state" slot-scope="state">
          <a-badge
            :status="state == '1' ? 'processing' : 'error'"
            :text="state | stateFilter"
          />
        </template>
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a @click="handleEdit(record)">删除</a>
        </span>
      </s-table>
    </a-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
import STable from "@/components/Table_/";
import TaskForm from "@/components/formModel/formModel";
const postTitle = [
  {
    label: "岗位名称",
    name: "name",
    type: "input",
  },
  {
    label: "描述",
    name: "describes",
    type: "textarea",
  },
  {
    label: "状态",
    name: "state",
    type: "checkboxgroup",
    select: [{ value: 1 }],
  },
];
const postRules = {
  name: [{ required: true, message: "请输入岗位名称", trigger: "blur" }],
};
export default {
  name: "OrganManage",
  components: {
    STable,
  },
  data() {
    return {
      scheduleColumns: [
        {
          title: "序号",
          dataIndex: "key",
          key: "key",
          width: 60,
        },
        {
          title: "岗位名称",
          dataIndex: "name",
          key: "name",
          ellipsis: true,
        },
        {
          title: "状态",
          dataIndex: "state",
          key: "state",
          scopedSlots: { customRender: "state" },
          width: 80,
        },
        {
          title: "描述",
          dataIndex: "describes",
          key: "describes",
          ellipsis: true,
        },
        {
          table: "操作",
          dataIndex: "action",
          scopedSlots: { customRender: "action" },
          width: 150,
        },
      ],
      loadScheduleData: () => {
        return new Promise((resolve) => {
          resolve({
            data: [
              {
                key: "1",
                name: "辅警",
                describes: "负责协助交警管理交通",
                state: [1],
              },
              {
                key: "2",
                name: "辅警内勤",
                describes: "负责协助交警管理交通事故案件",
                state: [1],
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
      selectedRowKeys: [],
      selectedRows: [],
      levelList: [
        { id: 1, edit: false, name: "初级" },
        { id: 2, edit: false, name: "二级" },
        { id: 3, edit: false, name: "三级" },
      ],
      submitType: null,
    };
  },
  methods: {
    handleAddLevel() {
      if (this.levelList.some((i) => i.edit === true)) {
        this.$message.warning("存在未保存的职级，请保存后再操作");
        return false;
      }
      this.submitType = "insert";
      let param = {};
      param.name = "";
      param.edit = true;
      this.levelList.push(param);
    },
    handEditLevel(id) {
      console.log(id);
      this.submitType = "update";
      this.levelList.find((i) => {
        if (i.id == id) i.edit = !i.edit;
      });
    },
    handCancelLevel(item) {
      this.submitType = null;
      if (item.id) {
        this.levelList.find((i) => {
          if (i.id == item.id) i.edit = !i.edit;
        });
      } else {
        this.levelList.pop();
      }
    },

    handSaveLevel(item) {
      console.log(item, this.submitType);
      /** 调用保存方法,根据 submitType 判断新增或编辑
       * 保存完成 submitType 置 null
       * 调用职级查询方法重新查询职级
       */
      this.levelList.find((i) => {
        i.edit = false;
      });
      this.submitType = null;
      this.$message.success("保存成功");
    },
    handleAdd() {
      let formProps = {
        formTitle: postTitle,
        rules: postRules,

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
        title: "新增",
        width: 700,
        centered: true,
        maskClosable: false,
        okText: "提交",
      };
      this.openModal(TaskForm, formProps, modalProps);
    },
    handleEdit(record) {
      console.log(record);
      let formProps = {
        record: record,
        formTitle: postTitle,
        rules: postRules,
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
    stateFilter(status) {
      const statusMap = {
        1: "启用",
        2: "禁用",
      };
      return statusMap[status];
    },
  },
  computed: {
    ...mapState("setting", ["theme", "pageMinHeight"]),
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
</style>