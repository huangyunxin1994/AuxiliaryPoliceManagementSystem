<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-card :bordered="false">
      <div class="table-operator" style="margin-bottom: 24px">
        <a-button type="primary" icon="plus" @click="handleAdd">新建</a-button>
        <a-button
          style="margin-left: 8px"
          icon="cloud-upload"
          @click="publish"
          :disabled="disabled"
          >发布</a-button
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
        :scroll="{ y: 600, x: 800 }"
        showPagination="auto"
      >
        <template slot="status" slot-scope="status">
          <a-badge :status="status" :text="status | statusFilter" />
        </template>
        <span slot="action" slot-scope="text, record">
          <a
            type="line"
            @click="handleEdit(record)"
            :disabled="record.isSystem == 1"
            >编辑</a
          >
          <a-divider type="vertical" />
          <a type="line" @click="del(record)" :disabled="record.isSystem == 1"
            >删除</a
          >
        </span>
      </s-table>
    </a-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
import STable from "@/components/Table_/";
import TaskForm from "@/components/formModel/formModel";
const wageTitle = [
  {
    label: "工资项目名称",
    name: "itemName",
    type: "input",
  },
  {
    label: "描述",
    name: "itemExplain",
    type: "textarea",
  },
];
const wageRules = {
  itemName: [
    { required: true, message: "请输入工资项目名称", trigger: "blur" },
  ],
};
export default {
  name: "OrganManage",
  components: {
    STable,
  },
  data() {
    return {
      state: undefined,
      disabled: false,
      scheduleColumns: [
        {
          title: "序号",
          dataIndex: "key",
          key: "key",
          width: 60,
        },
        {
          title: "名称",
          dataIndex: "itemName",
          key: "itemName",
          width: 200,
        },
        {
          title: "说明",
          dataIndex: "itemExplain",
          key: "itemExplain",
          ellipsis: true,
        },
        {
          table: "操作",
          dataIndex: "action",
          scopedSlots: { customRender: "action" },
          width: 150,
        },
      ],
      queryParam: {},
      loadScheduleData: (parameter) => {
        const requestParameters = Object.assign({}, parameter, this.queryParam);
        return this.$api.wageItemsService
          .getWageItems(requestParameters)
          .then((res) => {
            if (res.data.data.list.length <= 2) this.disabled = true;
            else this.disabled = false;
            res.data.data.list.map((i, k) => (i.key = k + 1));
            return res.data;
          });
      },
      selectedRowKeys: [],
      selectedRows: [],
    };
  },
  mounted() {
    this.$api.salaryService.validateSalary().then((res) => {
      this.state = res.data.data.type;
    });
  },
  methods: {
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    handleAdd() {
      let formProps = {
        formTitle: wageTitle,
        rules: wageRules,

        submitFun: (requestParameters) => {
          return this.$api.wageItemsService
            .postWageItems(requestParameters)
            .then((res) => {
              return res.data;
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
      let formProps = {
        record: record,
        formTitle: wageTitle,
        rules: wageRules,
        submitFun: (requestParameters) => {
          return this.$api.wageItemsService
            .putWageItems(requestParameters)
            .then((res) => {
              return res.data;
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
      const _this = this;
      const defaultModalProps = {
        on: {
          ok() {
            _this.$refs.table.refresh(true);
          },
          cancel() {},
          close() {},
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
    publish() {
      const _this = this;
      let content = [];
      _this.$refs.table.localDataSource.map((i) => content.push(i.itemName));
      this.$confirm({
        title: "提示",
        content: `更改内容将于下个月1号生效，确定发布吗？`,
        okText: "确认",
        okType: "primary",
        centered: true,
        cancelText: "取消",
        onOk() {
          _this.$api.wageItemsService
            .releaseWageItems({ content: content })
            .then((res) => {
              if (res.data.code === 0) {
                let content;
                if (!_this.state || _this.state === 2)
                  content = "工资模板创建成功，模板将于下一个自然月生效";
                else content = "工资模板修改成功，模板将于下一个自然月生效";
                _this.$success({
                  title: "发布成功",
                  content: content,
                });
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
    },
    del(row) {
      const _this = this;
      this.$confirm({
        title: "警告",
        content: `真的要删除 [ ${row.itemName} ] 工资项吗?`,
        okText: "删除",
        okType: "danger",
        centered: true,
        cancelText: "取消",
        onOk() {
          // 在这里调用删除接口
          _this.$api.wageItemsService
            .deleteWageItems({ id: row.id })
            .then((res) => {
              if (res.data.code === 0) {
                _this.$message.success(res.data.msg);
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
    // rowSelection() {
    //   return {
    //     selectedRowKeys: this.selectedRowKeys,
    //     onChange: this.onSelectChange,
    //   };
    // },
  },
};
</script>

<style scoped lang="less">
@import "../index";
</style>