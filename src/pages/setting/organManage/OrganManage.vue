<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-card :bordered="false">
      <a-row :gutter="24">
        <a-col :lg="7" :xl="5" :xxl="4">
          <ant-tree
            :dataSource="filterTree"
            :replaceFields="replaceFields"
            :allowEdit="true"
            @loadTreeNode="loadTreeNode"
            @editTreeNode="editTreeNode"
            @addTreeNode="addTreeNode"
            @removeTreeNode="removeTreeNode"
          >
          </ant-tree>
        </a-col>
        <a-col :md="24" :lg="17" :xl="19" :xxl="20">
          <a-row :gutter="24">
            <a-col :md="8" :sm="24">
              <span style="width: 100px">关键词搜索：</span>
              <a-input
                style="width: calc(100% - 100px); margin-bottom: 24px"
                placeHolder="请输入要搜索的内容"
              />
            </a-col>
            <a-col :md="8" :sm="24">
              <span style="width: 100px">角色：</span>
              <a-select
                default-value=""
                style="width: calc(100% - 100px); margin-bottom: 24px"
                @change="handleChange"
              >
                <a-select-option value=""> 全部 </a-select-option>
                <a-select-option value="1"> 人员资料管理员 </a-select-option>
                <a-select-option value="2">合同管理员</a-select-option>
                <a-select-option value="3"> 人事管理员 </a-select-option>
                <a-select-option value="4"> 工资管理员 </a-select-option>
                <a-select-option value="5">培训管理员</a-select-option>
                <a-select-option value="6"> 证件装备管理员 </a-select-option>
                <a-select-option value="7"> 奖励与追责管理员 </a-select-option>
                <a-select-option value="8">文档与公告管理员</a-select-option>
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
            <a-button type="primary" icon="plus" @click="handleAdd"
              >新建</a-button
            >
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
            <template slot="isEnable" slot-scope="isEnable">
              <a-badge
                :status="isEnable == '1' ? 'processing' : 'error'"
                :text="isEnable | statusFilter"
              />
            </template>
            <span slot="action" slot-scope="text, record">
              <a @click="handleEdit(record)">编辑</a>
              <a-divider type="vertical" />
              <a @click="handleEdit(record)">重置密码</a>
            </span>
          </s-table>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
import STable from "@/components/Table_/";
import AntTree from "@/components/tree_/Tree";
import TaskForm from "@/components/formModel/formModel";
import { validatePhone } from "@/config/default/rules";
function filterArray(data) {
  data.forEach(function (item) {
    delete item.children;
  });
  var map = {};
  data.forEach(function (item) {
    map[item.id] = item;
  });
  var val = [];
  data.forEach(function (item) {
    var parent = map[item.parentId] || map[item.code];
    if (parent) {
      (parent.children || (parent.children = [])).push(item);
    } else {
      val.push(item);
    }
  });
  console.log(val);
  return val;
}
const tree = [
  { id: 1, name: "根组织", code: "000001", scopedSlots: { title: "custom" } },
  {
    id: 2,
    name: "西乡塘",
    code: "000002",
    parentId: 1,
    scopedSlots: { title: "custom" },
  },
  {
    id: 3,
    name: "青秀",
    code: "000003",
    parentId: 1,
    scopedSlots: { title: "custom" },
  },
  {
    id: 4,
    name: "西乡塘1",
    code: "000004",
    parentId: 2,
    scopedSlots: { title: "custom" },
  },
  {
    id: 5,
    name: "青秀1",
    code: "000005",
    parentId: 3,
    scopedSlots: { title: "custom" },
  },
];
const filterTree = filterArray(tree);

const organTitle = [
  {
    label: "上级组织",
    name: "parentId",
    type: "treeSelect",
    select: filterTree,
    replaceFields: {
      children: "children",
      title: "name",
      key: "id",
      value: "id",
    },
  },
  { label: "组织名称", name: "name", type: "input" },
];
const tableTitle = [
  {
    label: "账号",
    name: "account",
    type: "input",
  },
  {
    label: "组织",
    name: "organizationId",
    type: "treeSelect",
    select: filterTree,
    replaceFields: {
      children: "children",
      title: "name",
      key: "id",
      value: "id",
    },
  },
  {
    label: "角色",
    name: "roleId",
    type: "checkboxgroup",
    showBgc: true,
    select: [
      { name: "人员资料管理员", value: 1 },
      { name: "合同管理员", value: 2 },
      { name: "人事管理员", value: 3 },
      { name: "工资管理员", value: 4 },
      { name: "培训管理员", value: 5 },
      { name: "证件装备管理员", value: 6 },
      { name: "奖励与追责管理员", value: 7 },
      { name: "文档与公告管理员", value: 8 },
    ],
  },
  {
    label: "姓名",
    name: "name",
    type: "input",
  },
  {
    label: "警员编号",
    name: "number",
    type: "input",
  },

  {
    label: "岗位",
    name: "postId",
    type: "select",
  },
  {
    label: "联系电话",
    name: "phone",
    type: "input",
  },
  {
    label: "是否启用",
    name: "isEnable",
    type: "checkboxgroup",
    select: [{ value: 1 }],
  },
];
const organRules = {
  name: [{ required: true, message: "请输入组织名称", trigger: "blur" }],
  parentId: [
    {
      required: true,
      message: "请选择上级组织",
      trigger: "change",
    },
  ],
};
const tableRules = {
  account: [{ required: true, message: "请输入账号", trigger: "change" }],
  organizationId: [
    {
      required: true,
      message: "请选择组织",
      trigger: "change",
    },
  ],
  roleId: [
    {
      type: "array",
      required: true,
      message: "请至少选择一项",
      trigger: "change",
    },
  ],
  name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
  number: [{ required: true, message: "请输入警员编号", trigger: "blur" }],
  phone: [{ validator: validatePhone, trigger: "change" }],
};
export default {
  name: "OrganManage",
  components: {
    STable,
    AntTree,
    TaskForm,
  },
  data() {
    return {
      openKeys: ["key-01"],
      filterTree,
      replaceFields: {
        children: "children",
        title: "name",
        key: "id",
      },
      loading: false,
      scheduleColumns: [
        {
          title: "序号",
          dataIndex: "key",
          key: "key",
          width: 60,
        },
        {
          title: "账号",
          dataIndex: "account",
          key: "account",
          width: 100,
        },
        {
          title: "姓名",
          dataIndex: "name",
          key: "name",
          width: 80,
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
          width: 250,
        },
        {
          title: "岗位",
          dataIndex: "postName",
          key: "postName",
          width: 100,
        },
        {
          title: "联系电话",
          dataIndex: "phone",
          key: "phone",
          width: 150,
        },
        {
          title: "是否启用",
          dataIndex: "isEnable",
          key: "isEnable",
          width: 100,
          scopedSlots: { customRender: "isEnable" },
        },
        {
          table: "操作",
          dataIndex: "action",
          scopedSlots: { customRender: "action" },
          width: 150,
        },
      ],
      // 查询条件参数
      queryParam: {},
      loadScheduleData: (parameter) => {
        return new Promise((resolve) => {
          resolve({
            data: [
              {
                key: "1",
                account: "admin",
                name: "管理员",
                number: "FJ0584",
                organizationName: "青秀区东葛路派出所",
                postName: "辅警",
                phone: "13584585258",
                isEnable: ["1"],
              },
              {
                key: "2",
                account: "test",
                name: "李四",
                number: "FJ0585",
                organizationName: "青秀区东葛路派出所",
                postName: "辅警",
                phone: "13584585258",
                isEnable: ["1"],
              },
              {
                key: "3",
                account: "test",
                name: "王五",
                number: "FJ0585",
                organizationName: "青秀区东葛路派出所",
                postName: "辅警",
                phone: "13584585258",
                isEnable: ["1"],
              },
              {
                key: "4",
                account: "test",
                name: "张三",
                number: "FJ0585",
                organizationName: "青秀区东葛路派出所",
                postName: "辅警",
                phone: "13584585258",
                isEnable: ["1"],
              },
              {
                key: "5",
                account: "test",
                name: "赵六",
                number: "FJ0585",
                organizationName: "青秀区东葛路派出所",
                postName: "辅警",
                phone: "13584585258",
                isEnable: ["2"],
              },
              {
                key: "6",
                account: "test",
                name: "赵六",
                number: "FJ0585",
                organizationName: "青秀区东葛路派出所",
                postName: "辅警",
                phone: "13584585258",
                isEnable: ["2"],
              },
              {
                key: "7",
                account: "test",
                name: "赵六",
                number: "FJ0585",
                organizationName: "青秀区东葛路派出所",
                postName: "辅警",
                phone: "13584585258",
                isEnable: ["2"],
              },
              {
                key: "8",
                account: "test",
                name: "赵六",
                number: "FJ0585",
                organizationName: "青秀区东葛路派出所",
                postName: "辅警",
                phone: "13584585258",
                isEnable: ["2"],
              },
              {
                key: "9",
                account: "test",
                name: "赵六",
                number: "FJ0585",
                organizationName: "青秀区东葛路派出所",
                postName: "辅警",
                phone: "13584585258",
                isEnable: ["2"],
              },
              {
                key: "10",
                account: "test",
                name: "赵六",
                number: "FJ0585",
                organizationName: "青秀区东葛路派出所",
                postName: "辅警",
                phone: "13584585258",
                isEnable: ["2"],
              },
            ],
            pageSize: 10,
            pageNo: 1,
            totalPage: 1,
            totalCount: 10,
            params: Object.assign(parameter, this.queryParam),
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
    loadTreeNode(obj) {
      this.queryParam = obj;
      this.$refs.table.refresh(true);
    },
    handleAdd() {
      let formProps = {
        formTitle: tableTitle,
        rules: tableRules,

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
        formTitle: tableTitle,
        rules: tableRules,
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
    handleClick(e) {
      console.log("handleClick", e);
      this.queryParam = {
        key: e.key,
      };
      this.$refs.table.refresh(true);
    },
    handleChange(e) {
      console.log(e);
    },
    //编辑树节点
    editTreeNode(params) {
      const id = params.id;
      const name = params.name;
      const code = params.code;
      const parentId = params.parentId || "";
      let obj = { id, name, code, parentId };
      let formProps = {
        record: obj,
        formTitle: organTitle,
        rules: organRules,
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
    //添加树节点
    addTreeNode(params) {
      const name = "";
      const parentId = params.id;
      let obj = { name, parentId };
      let formProps = {
        record: obj,
        formTitle: organTitle,
        rules: organRules,
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
    //删除树节点
    removeTreeNode(params) {
      console.log(params);
    },
    //
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
