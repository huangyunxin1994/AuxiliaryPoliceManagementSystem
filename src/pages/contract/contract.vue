<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-card :bordered="false">
      <a-row :gutter="24">
        <a-col :lg="7" :xl="5" :xxl="4">
          <ant-tree
            :dataSource="tree"
            :allowEdit="false"
            :allowReload="true"
            :allowSearch="true"
            @editTreeNode="editTreeNode"
            @addTreeNode="addTreeNode"
            @removeTreeNode="removeTreeNode"
          >
          </ant-tree>
        </a-col>
        <a-col :md="24" :lg="17" :xl="19" :xxl="20">
          <a-row :gutter="24">
            <a-col :md="6" :sm="24">
              <span style="width: 100px">关键词搜索：</span>
              <a-input
                style="width: calc(100% - 100px); margin-bottom: 24px"
                placeHolder="请输入要搜索的内容"
              />
            </a-col>
            <a-col :md="6" :sm="24">
              <span style="width: 100px">合同终止日期:</span>
              <a-range-picker
                style="width: calc(100% - 100px); margin-bottom: 24px"
                @change="onChange"
              />
            </a-col>
            <a-col :md="6" :sm="24">
              <span style="width: 100px">即将到期:</span>
              <a-select
                default-value="lucy"
                style="width: calc(100% - 100px); margin-bottom: 24px"
                @change="handleChange"
              >
                <a-select-option value="jack"> 全部 </a-select-option>
                <a-select-option value="lucy"> 是 </a-select-option>
                <a-select-option value="disabled"> 否 </a-select-option>
              </a-select>
            </a-col>
            <a-col :md="6" :sm="24" style="margin-bottom: 24px">
              <span class="table-page-search-submitButtons">
                <!-- <a-button type="primary" @click="$refs.table.refresh(true)">续约合同</a-button> -->
                <a-button
                  type="primary"
                  @click="extensionCon"
                  :disabled="selectedRows.length == 0"
                  >续约合同</a-button
                >
                <a-button
                  type="primary"
                  style="margin-left: 8px"
                  @click="newContract"
                  >新建合同</a-button
                >
              </span>
            </a-col>
          </a-row>
          <!-- <div class="table-operator" style="margin-bottom: 24px" >
                        <a-dropdown v-if="selectedRowKeys.length > 0">
                          <a-menu slot="overlay">
                            <a-menu-item key="1"><a-icon type="delete" />删除</a-menu-item>
                            <a-menu-item key="2"><a-icon type="lock" />锁定</a-menu-item>
                          </a-menu>
                          <a-button style="margin-left: 8px">
                            批量操作 <a-icon type="down" />
                          </a-button>
                        </a-dropdown>
                      </div> -->
          <s-table
            ref="table"
            rowKey="key"
            :columns="scheduleColumns"
            :data="loadScheduleData"
            :rowSelection="rowSelection"
            :scroll="{ y: 600 }"
            :showPagination="true"
          >
            <template slot="status" slot-scope="status">
              <a-badge :status="status" :text="status | statusFilter" />
            </template>
            <span slot="action" slot-scope="text, record">
              <a @click="handleEdit(record)">查看历史合同</a>
              <!-- <a-divider type="vertical"/>
                          <a @click="handleEdit (record)">重置密码</a> -->
            </span>
          </s-table>
        </a-col>
      </a-row>
    </a-card>
    <form-step ref="modal" title="新增合同" :formTitle="formTitle" :rules="rules" :stepTitle="stepTitle" :submitFun="submitFun"></form-step>
  </div>
</template>

<script>
import { mapState } from "vuex";
import STable from "@/components/Table_/";
import AntTree from "@/components/tree_/Tree";
import TaskForm from "@/components/TaskForm";
import fromModel from "@/components/formModel/formModel";
import diaHisContract from "@/components/diaHisContract/diaHisContract";
// import diaNewContract from "@/components/diaNewContract/diaNewContract"
import formStep from "@/components/stepForm/StepForm";
const tree = [
  {
    key: "key-01",
    title: "研发中心",
    icon: "mail",
    count: "10",
    scopedSlots: { title: "custom" },
    children: [
      {
        key: "key-01-01",
        title: "后端组",
        icon: null,
        scopedSlots: { title: "custom" },
        children: [
          {
            key: "key-01-01-01",
            title: "JAVA",
            icon: null,
            scopedSlots: { title: "custom" },
          },
          {
            key: "key-01-01-02",
            title: "PHP",
            icon: null,
            scopedSlots: { title: "custom" },
          },
          {
            key: "key-01-01-03",
            title: "Golang",
            icon: null,
            scopedSlots: { title: "custom" },
          },
        ],
      },
      {
        key: "key-01-02",
        title: "前端组",
        icon: null,
        scopedSlots: { title: "custom" },
        children: [
          {
            key: "key-01-02-01",
            title: "React",
            icon: null,
            scopedSlots: { title: "custom" },
          },
          {
            key: "key-01-02-02",
            title: "Vue",
            icon: null,
            scopedSlots: { title: "custom" },
          },
          {
            key: "key-01-02-03",
            title: "Angular",
            icon: null,
            scopedSlots: { title: "custom" },
          },
        ],
      },
      {
        key: "key-02",
        title: "财务部",
        icon: "dollar",
        scopedSlots: { title: "custom" },
        children: [
          {
            key: "key-02-01",
            title: "会计核算",
            icon: null,
            scopedSlots: { title: "custom" },
          },
          {
            key: "key-02-02",
            title: "成本控制",
            icon: null,
            scopedSlots: { title: "custom" },
          },
          {
            key: "key-02-03",
            title: "内部控制",
            icon: null,
            scopedSlots: { title: "custom" },
            children: [
              {
                key: "key-02-03-01",
                title: "财务制度建设",
                icon: null,
                scopedSlots: { title: "custom" },
              },
              {
                key: "key-02-03-02",
                title: "会计核算",
                icon: null,
                scopedSlots: { title: "custom" },
              },
            ],
          },
        ],
      },
    ],
  },
];
const formTitle = [
  {
    label: "姓名",
    name: "name",
    type: "input",
    refName: "name",
    placeholder: "请输入所在单位",
  },
  {
    label: "合同起始日期",
    name: "startDate",
    type: "picker",
    refName: "startDate",
    placeholder: "请选择工作起始日期",
  },
  {
    label: "合同期限(月)",
    name: "deadline",
    type: "input",
    refName: "deadline",
    placeholder: "请输入合同期限",
  },
  {
    label: "试用结束日期",
    name: "endData",
    type: "picker",
    refName: "endData",
    placeholder: "请选择工作结束日期",
  },
  {
    label: "合同附件",
    name: "uploadFile",
    type: "upload",
    refName: "uploadFile",
  },
];
const stepTitle = [{title:'选择人员'},{title:'填写合同信息'}]
const rules = {
  name: [
    { required: false, message: "请输入名字", trigger: "blur", disabled: true },
  ],
  startDate: [
    { required: true, message: "请选择合同起始日期", trigger: "change" },
  ],
  deadline: [{ required: true, message: "请输入合同期限", trigger: "blur" }],
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
  name: "OrganManage",
  components: {
    STable,
    AntTree,
    TaskForm,
    formStep
  },
  data() {
    return {
      formTitle,
      rules,
      stepTitle,
      submitFun,
      openKeys: ["key-01"],
      tree,
      loading: false,
      scheduleColumns: [
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
          width: 80,
        },
        {
          title: "辅警编号",
          dataIndex: "code",
          key: "code",
          width: 100,
        },
        {
          title: "所属组织",
          dataIndex: "organ",
          key: "organ",
          width: 250,
        },
        {
          title: "合同终止日期",
          dataIndex: "post",
          key: "post",
          width: 100,
        },
        {
          title: "合同期限(月)",
          dataIndex: "phone",
          key: "phone",
          width: 150,
        },
        {
          title: "是否即将到期",
          dataIndex: "status",
          key: "status",
          width: 100,
          scopedSlots: { customRender: "status" },
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
                account: "admin",
                name: "管理员",
                code: "FJ0584",
                organ: "青秀区东葛路派出所",
                post: "辅警",
                phone: "13584585258",
                status: "processing",
              },
              {
                key: "2",
                account: "test",
                name: "李四",
                code: "FJ0585",
                organ: "青秀区东葛路派出所",
                post: "辅警",
                phone: "13584585258",
                status: "processing",
              },
              {
                key: "3",
                account: "test",
                name: "王五",
                code: "FJ0585",
                organ: "青秀区东葛路派出所",
                post: "辅警",
                phone: "13584585258",
                status: "processing",
              },
              {
                key: "4",
                account: "test",
                name: "张三",
                code: "FJ0585",
                organ: "青秀区东葛路派出所",
                post: "辅警",
                phone: "13584585258",
                status: "processing",
              },
              {
                key: "5",
                account: "test",
                name: "赵六",
                code: "FJ0585",
                organ: "青秀区东葛路派出所",
                post: "辅警",
                phone: "13584585258",
                status: "error",
              },
              {
                key: "6",
                account: "test",
                name: "赵六",
                code: "FJ0585",
                organ: "青秀区东葛路派出所",
                post: "辅警",
                phone: "13584585258",
                status: "error",
              },
              {
                key: "7",
                account: "test",
                name: "赵六",
                code: "FJ0585",
                organ: "青秀区东葛路派出所",
                post: "辅警",
                phone: "13584585258",
                status: "error",
              },
              {
                key: "8",
                account: "test",
                name: "赵六",
                code: "FJ0585",
                organ: "青秀区东葛路派出所",
                post: "辅警",
                phone: "13584585258",
                status: "error",
              },
              {
                key: "9",
                account: "test",
                name: "赵六",
                code: "FJ0585",
                organ: "青秀区东葛路派出所",
                post: "辅警",
                phone: "13584585258",
                status: "error",
              },
              {
                key: "10",
                account: "test",
                name: "赵六",
                code: "FJ0585",
                organ: "青秀区东葛路派出所",
                post: "辅警",
                phone: "13584585258",
                status: "error",
              },
              {
                key: "11",
                account: "test",
                name: "赵六",
                code: "FJ0585",
                organ: "青秀区东葛路派出所",
                post: "辅警",
                phone: "13584585258",
                status: "error",
              },
              {
                key: "12",
                account: "test",
                name: "赵六",
                code: "FJ0585",
                organ: "青秀区东葛路派出所",
                post: "辅警",
                phone: "13584585258",
                status: "error",
              },
              {
                key: "13",
                account: "test",
                name: "赵六",
                code: "FJ0585",
                organ: "青秀区东葛路派出所",
                post: "辅警",
                phone: "13584585258",
                status: "error",
              },
              {
                key: "14",
                account: "test",
                name: "赵六",
                code: "FJ0585",
                organ: "青秀区东葛路派出所",
                post: "辅警",
                phone: "13584585258",
                status: "error",
              },
              {
                key: "15",
                account: "test",
                name: "赵六",
                code: "FJ0585",
                organ: "青秀区东葛路派出所",
                post: "辅警",
                phone: "13584585258",
                status: "error",
              },
              {
                key: "16",
                account: "test",
                name: "赵六",
                code: "FJ0585",
                organ: "青秀区东葛路派出所",
                post: "辅警",
                phone: "13584585258",
                status: "error",
              },
            ],
            pageSize: 10,
            pageNo: 1,
            totalPage: 1,
            totalCount: 60,
          });
        }).then((res) => {
          return res;
        });
      },
      selectedRowKeys: [],
      selectedRows: [],
      extension: [
        {
          label: "姓名",
          name: "name",
          type: "input",
          refName: "name",
          placeholder: "请输入姓名",
          disabled: true,
        },
        {
          label: "合同期限(月)",
          name: "deadline",
          type: "input",
          refName: "deadline",
          placeholder: "请输入整数",
        },
        {
          label: "上传文件",
          name: "uploadFile",
          type: "upload",
          refName: "uploadFile",
        },
      ],
    };
  },
  methods: {
    handleEdit(record) {
      console.log(record);
      let param = {};
      let option = {
        title: "历史合同信息",
        width: 1000,
        centered: true,
        maskClosable: false,
        okText: "提交",
        footer: "",
        zIndex: 1000,
      };
      this.modal(param, option, diaHisContract);
    },
    handleClick(e) {
      console.log("handleClick", e);
      this.queryParam = {
        key: e.key,
      };
      this.$refs.table.refresh(true);
    },
    handleAdd(item) {
      console.log("add button, item", item);
      this.$message.info(`提示：你点了 ${item.key} - ${item.title} `);
      this.$refs.modal.add(item.key);
    },
    handleTitleClick(item) {
      console.log("handleTitleClick", item);
    },
    handleChange(e) {
      console.log(e);
    },
    //编辑树节点
    editTreeNode(params) {
      this.$dialog(
        TaskForm,
        // component props
        {
          record: params,
          fn: () => {
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
        },
        // modal props
        {
          title: "编辑",
          width: 700,
          centered: true,
          maskClosable: false,
          okText: "提交",
        }
      );
    },
    //添加树节点
    addTreeNode(params) {
      this.$dialog(
        TaskForm,
        // component props
        {
          record: params,
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
        },
        // modal props
        {
          title: "新增",
          width: 700,
          centered: true,
          maskClosable: false,
          okText: "提交",
        }
      );
    },
    //删除树节点
    removeTreeNode(params) {
      console.log(params);
    },
    // 获取多选的数据
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
      console.log(this.selectedRowKeys);
      console.log(this.selectedRows);
    },

    // 时间框选择
    onChange(date, dateString) {
      console.log(date, dateString);
    },
    // 续约合同
    extensionCon() {
      console.log(this.selectedRows);
      let param = {
        formTitle: this.extension,
        rules: {},
      };
      let option = {
        title: "续约合同",
        width: 500,
        centered: true,
        maskClosable: false,
        okText: "提交",
      };
      this.modal(param, option, fromModel);
    },
    // 新建合同
    newContract() {
      this.$refs.modal.visible=true
      // let param = {
      //   stepTitle:[{title:'选择人员'},{title:'填写合同信息'}],
      //   formTitle: formTitle,
      //   rules: rules,
      //   submitFun: () => {
      //     return new Promise((resolve) => {
      //       resolve({
      //         data: [],
      //         pageSize: 10,
      //         pageNo: 1,
      //         totalPage: 1,
      //         totalCount: 10,
      //       });
      //     }).then((res) => {
      //       return res;
      //     });
      //   },
      // };
      // let option = {
      //   title: "新建合同",
      //   width: 800,
      //   centered: true,
      //   maskClosable: false,
      //   footer: "",
      // };
      // this.modal(param, option, formStep);
    },
    // 弹窗
    modal(obj, option, model) {
      const defaultProps = {
        on: {
          ok() {
            // console.log('ok 回调')
          },
          cancel() {
            // e.handleDestroy()
            // console.log('cancel 回调')
          },
          close() {
            // e.handleDestroy()
            // console.log('modal close 回调')
          },
        },
      };
      let formProps = Object.assign(obj, defaultProps);
      console.log(formProps);
      this.$dialog(
        model,
        // form props
        formProps,
        // modal props
        option
      );
    },
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        processing: "是",
        error: "否",
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
        getCheckboxProps: (record) => ({
          props: {
            disabled: record.status === "error", // Column configuration not to be checked
            name: record.status,
          },
        }),
      };
    },
  },
};
</script>

<style scoped lang="less">
@import "index";
</style>
