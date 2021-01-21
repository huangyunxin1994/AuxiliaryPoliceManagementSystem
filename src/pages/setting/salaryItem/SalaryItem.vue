<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-card :bordered="false">
      <div
        class="position-and-level-title"
        :style="{ 'border-color': theme.color }"
      >
        <!-- 上下班时间配置 -->
        工资表生成时间配置
      </div>
      <a-row :gutter="24">
        <a-col :span="24">
          <span style="width: 100px">工资表生成时间：每月 </span>
          <a-select default-value="" v-model="salaryTime" style="width: 100px">
            <a-select-option v-for="i in 28" :key="i" :value="i">
              {{ i }}
            </a-select-option>
          </a-select>
          <span> 日 </span>
          <a-button
            type="primary"
            icon="save"
            @click="handleSave"
            v-show="showSaveBtn"
            >保存</a-button
          >
        </a-col>
      </a-row>
      <div
        class="position-and-level-title"
        :style="{ 'border-color': theme.color }"
      >
        <!-- 上下班时间配置 -->
        工资项配置
      </div>
      <div class="table-operator" style="margin-bottom: 24px">
        <a-button type="primary" icon="plus" @click="handleAdd">新建</a-button>
        <a-button
          style="margin-left: 8px"
          icon="cloud-upload"
          @click="publish"
          :disabled="disabled"
          type="danger"
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
        :showPagination="false"
      >
        <template
          v-for="col in ['key', 'itemName', 'itemExplain']"
          :slot="col"
          slot-scope="text, record"
        >
          <div :key="col">
            <div
              v-if="
                record.state === 'add' ||
                record.state === 'delete' ||
                record.state === 'update'
              "
              style="color: rgba(0, 0, 0, 0.25)"
            >
              {{ text }}
            </div>
            <template v-else>
              {{ text }}
            </template>
          </div>
        </template>
        <template slot="state" slot-scope="state">
          <a-badge
            :status="
              state == 'add' || state == 'delete' || state == 'update'
                ? 'error'
                : 'success'
            "
            :text="state | statusFilter"
          />
        </template>
        <span slot="action" slot-scope="text, record">
          <a
            type="line"
            @click="handleEdit(record)"
            :disabled="record.isSystem == 1 || record.state === 'delete'"
            >编辑</a
          >
          <a-divider type="vertical" />
          <a
            type="line"
            @click="del(record)"
            :disabled="record.isSystem == 1"
            v-show="!record.state"
            >删除</a
          >
          <a
            type="line"
            @click="handelReCall(record)"
            :disabled="record.isSystem == 1"
            v-show="record.state"
            >撤回</a
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
import moment from "moment";
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
      salaryTime: undefined,
      saveSalaryTime: undefined,
      showSaveBtn: false,
      state: undefined,
      initData: [],
      disabled: true,
      scheduleColumns: [
        {
          title: "序号",
          dataIndex: "key",
          key: "key",
          width: 60,
          scopedSlots: { customRender: "key" },
        },
        {
          title: "名称",
          dataIndex: "itemName",
          key: "itemName",
          width: 200,
          scopedSlots: { customRender: "itemName" },
        },
        {
          title: "说明",
          dataIndex: "itemExplain",
          key: "itemExplain",
          ellipsis: true,
          scopedSlots: { customRender: "itemExplain" },
        },
        {
          title: "状态",
          dataIndex: "state",
          key: "state",
          ellipsis: true,
          scopedSlots: { customRender: "state" },
        },
        {
          table: "操作",
          dataIndex: "action",
          scopedSlots: { customRender: "action" },
          width: 150,
        },
      ],
      queryParam: {
        pageSize: 99999,
      },
      loadScheduleData: (parameter) => {
        const requestParameters = Object.assign({}, parameter, this.queryParam);
        return this.$api.wageItemsService
          .getWageItems(requestParameters)
          .then((res) => {
            res.data.data.list.map((i, k) => (i.key = k + 1));
            this.initData = Object.assign([], res.data.data.list);
            return res.data;
          });
      },
      selectedRowKeys: [],
      selectedRows: [],
    };
  },
  created() {
    this.$api.otherItemsService.getSalaryTime().then((res) => {
      if (res.data.data.configure) {
        this.saveSalaryTime = res.data.data.configure;
        this.salaryTime = res.data.data.configure;
      }
    });
  },
  mounted() {
    this.$api.salaryService.validateSalary().then((res) => {
      this.state = res.data.data.type;
    });
    let _this = this;
    window.onbeforeunload = function (e) {
      if (_this.$route.name == "工资项管理" && !_this.disabled) {
        e = e || window.event;
        // 兼容IE8和Firefox 4之前的版本
        if (e) {
          e.returnValue = "当前存在未发布的工资项，确定要离开？";
        }
        // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
        return "当前存在未发布的工资项，确定要离开？";
      } else {
        window.onbeforeunload = null;
      }
    };
  },
  // 路由跳转确认
  beforeRouteLeave(to, from, next) {
    if (!this.disabled) {
      const answer = window.confirm("当前存在未发布的工资项，确定要离开？");
      if (answer) {
        next();
      } else {
        next(false);
      }
    } else {
      next();
    }
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

        // submitFun: (requestParameters) => {
        //   return this.$api.wageItemsService
        //     .postWageItems(requestParameters)
        //     .then((res) => {
        //       return res.data;
        //     });
        // },
        submitFun: (requestParameters) => {
          requestParameters.createTime = moment(new Date()).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          requestParameters.compareData = Object.assign(
            [],
            this.$refs.table.localDataSource
          );
          return this.$api.wageItemsService
            .postWageItems(requestParameters)
            .then((res) => {
              if (res.data.code == 0) {
                res.data.data.state = "add";
                res.data.data.key = this.$refs.table.localDataSource.length + 1;
                this.$refs.table.localDataSource.push(res.data.data);
                this.disabled = false;
              }
              return res.data;
            });
        },
      };
      let modalProps = {
        title: "新建工资项",
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
          requestParameters.compareData = Object.assign(
            [],
            this.$refs.table.localDataSource
          );
          return this.$api.wageItemsService
            .putWageItems(requestParameters)
            .then((res) => {
              if (res.data.code == 0) {
                if (!res.data.data.state) res.data.data.state = "update";
                const index = this.$refs.table.localDataSource.findIndex(
                  (i) => i.id === res.data.data.id
                );
                this.$refs.table.localDataSource.splice(
                  index,
                  1,
                  res.data.data
                );
                this.disabled = false;
              }
              return res.data;
            });
        },
      };
      let modalProps = {
        title: "编辑工资项",
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
      // const _this = this;
      const defaultModalProps = {
        on: {
          ok() {
            // _this.$refs.table.refresh(true);
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
      let dataArr = Object.assign([], _this.$refs.table.localDataSource);
      let submitData = dataArr.filter((i) => !i.isMust && i.state !== "delete");
      submitData.map((i) => {
        i.content = JSON.stringify(content);
        delete i.state;
      });
      console.log(submitData);
      this.$confirm({
        title: "提示",
        content: `更改内容将于下月1日生效，是否确认发布？`,
        okText: "确认",
        okType: "primary",
        centered: true,
        cancelText: "取消",
        onOk() {
          _this.$api.wageItemsService
            .releaseWageItems(submitData)
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
                _this.disabled = true;
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
        content: `是否确认删除工资项 ${row.itemName} ?`,
        okText: "删除",
        okType: "danger",
        centered: true,
        cancelText: "取消",
        onOk() {
          // 在这里调用删除接口
          // row.state='delete'
          const index = _this.$refs.table.localDataSource.findIndex(
            (i) => i.id === row.id
          );
          const rowData = _this.$refs.table.localDataSource.find(
            (i) => i.id === row.id
          );
          rowData.state = "delete";
          _this.$refs.table.localDataSource.splice(index, 1, rowData);
          _this.$message.success("删除成功");
          _this.disabled = false;

          // _this.$api.wageItemsService
          //   .deleteWageItems({ id: row.id })
          //   .then((res) => {
          //     if (res.data.code === 0) {
          //       _this.$message.success(res.data.msg);
          //       _this.$refs.table.refresh();
          //     } else {
          //       _this.$message.error(res.data.msg);
          //     }
          //   })
          //   .catch((err) => {
          //     _this.$message.error(err.data.msg);
          //   });
        },
        onCancel() {},
      });
    },
    //撤回方法
    handelReCall(row) {
      const _this = this;
      this.$confirm({
        title: "警告",
        content: `是否确认撤回之前操作?`,
        okText: "撤回",
        okType: "primary",
        centered: true,
        cancelText: "取消",
        onOk() {
          if (row.state === "add") {
            const index = _this.$refs.table.localDataSource.findIndex(
              (i) => i.key === row.key
            );
            _this.$refs.table.localDataSource.splice(index, 1);
          }
          if (row.state === "delete") {
            const filterArr = _this.$refs.table.localDataSource.filter(
              (i) => i.itemName === row.itemName
            );
            if (filterArr.length > 1) {
              _this.$message.error(
                `工资项名称 [ ${row.itemName} ] 已存在，撤回失败`
              );
              return false;
            }
            const index = _this.$refs.table.localDataSource.findIndex(
              (i) => i.id === row.id
            );
            const rowData = _this.$refs.table.localDataSource.find(
              (i) => i.id === row.id
            );
            delete rowData.state;
            _this.$refs.table.localDataSource.splice(index, 1, rowData);
          }
          if (row.state === "update") {
            const init = _this.initData.find((i) => i.id === row.id);
            const state = _this.$refs.table.localDataSource.some(
              (i) =>
                i.itemName === init.itemName &&
                i.id !== init.id &&
                i.state != "delete"
            );
            if (state) {
              _this.$message.error(
                `工资项名称 [ ${init.itemName} ] 已存在，撤回失败`
              );
              return false;
            }
            const index = _this.$refs.table.localDataSource.findIndex(
              (i) => i.id === row.id
            );
            const rowData = _this.initData.find((i) => i.id === row.id);
            console.log(rowData);
            _this.$refs.table.localDataSource.splice(index, 1, rowData);
          }
          const state = _this.$refs.table.localDataSource.some((i) => i.state);
          if (state) {
            _this.disabled = false;
          } else {
            _this.disabled = true;
          }
        },
        onCancel() {},
      });
    },
    /**
     * 保存上下班配置方法
     */
    handleSave() {
      const _this = this;
      this.$confirm({
        title: "提示",
        content: `工资表将于下月${this.salaryTime}日0点生成，确定保存吗？`,
        okText: "确认",
        okType: "primary",
        centered: true,
        cancelText: "取消",
        onOk() {
          // 在这里调用删除接口
          _this.$api.otherItemsService
            .postSalaryTime({ date: _this.salaryTime })
            .then((res) => {
              if (res.data.code == 0) {
                console.log(res.data.code)
                _this.$success({
                  title: "保存成功",
                  content: `工资表生成时间将于下个月${_this.salaryTime}日0点开始生效`,
                });
                _this.saveSalaryTime = _this.salaryTime;
                _this.showSaveBtn = false;
              } else {
                _this.$message.error(res.data.msg);
              }
            })
            .catch((err) => {
              console.log(err)
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
        add: "已新增，待发布",
        delete: "已删除，待发布",
        update: "已修改，待发布",
      };
      return statusMap[status] || "已发布";
    },
  },
  watch: {
    salaryTime(newVal) {
      if (newVal !== this.saveSalaryTime) this.showSaveBtn = true;
      else this.showSaveBtn = false;
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
  margin: 24px 0;
}
</style>