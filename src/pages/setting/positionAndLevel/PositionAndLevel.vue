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
            <a-button type="primary" icon="plus" @click="handleAddRank"
              >添加职级</a-button
            >
            <a-button
              type="error"
              style="margin-left: 8px"
              icon="delete"
              @click="handDelRank"
              >删除职级</a-button
            >
          </span>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col
          :xl="4"
          :lg="6"
          :md="8"
          :xs="12"
          style="margin-bottom: 24px"
          v-for="(item,index) in rankList"
          :key="item.id"
        >
          <a-card size="small" :title="'#' + item.level">
            <a-button
              type="link"
              slot="extra"
              size="small"
              v-show="!item.edit"
              @click="handEditRank(item.id)"
              :disabled="submitType ? true : false"
              >编辑</a-button
            >
            <a-button
              type="link"
              slot="extra"
              size="small"
              v-show="item.edit"
              @click="handCancelRank(item)"
              style="color: rgba(0, 0, 0, 0.6)"
              >取消</a-button
            >
            <a-divider slot="extra" v-show="item.edit" type="vertical" />
            <a-button
              type="link"
              slot="extra"
              size="small"
              v-show="item.edit"
              @click="handSaveRank(item,index)"
              >保存</a-button
            >
            <div
              v-show="!item.edit"
              style="width: 100%; height: 32px; padding: 6px 13px"
            >
              {{ item.name }}
            </div>
            <a-form-model v-show="item.edit" ref="ruleform" :model="item" :rules="rankRules">
              <a-form-model-item  prop="name">
                <a-input
                  v-model="item.name"
                  placeholder="请输入职级名称"
                  :allowClear="true"
                />
              </a-form-model-item>
            </a-form-model>
          </a-card>
        </a-col>
      </a-row>
      <div
        class="position-and-level-title"
        :style="{ 'border-color': theme.color }"
      >
        岗位管理
      </div>
      <a-row>
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="48">
              <a-col :md="8" :sm="24">
                <a-form-item label="模糊查询">
                  <a-input
                    v-model="queryParam.name"
                    placeholder="请输入要查询的关键词"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="状态选择">
                  <a-select
                    v-model="queryParam.state"
                    default-value=""
                    @change="handleChange"
                  >
                    <a-select-option value=""> 全部 </a-select-option>
                    <a-select-option value="1"> 启用 </a-select-option>
                    <a-select-option value="2"> 禁用 </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <span class="table-page-search-submitButtons">
                  <a-button type="primary" @click="$refs.table.refresh(true)"
                    >查询</a-button
                  >
                  <a-button style="margin-left: 8px" @click="resetParam"
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
        :rowKey="(record) => record.id"
        :columns="scheduleColumns"
        :data="loadScheduleData"
        
        :scroll="{ y: 600, x: 800 }"
        showPagination="auto"
      >
        <template slot="state" slot-scope="state">
          <a-badge
            :status="state == 1 ? 'processing' : 'error'"
            :text="state | stateFilter"
          />
        </template>
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a @click="handleDel(record)">删除</a>
        </span>
      </s-table>
    </a-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
import STable from "@/components/Table_/";
import TaskForm from "@/components/formModel/formModel";
import { validateLength } from "@/config/default/rules";
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
    type: "radio",
    select: [
      { name: "启用", value: 1 },
      { name: "禁用", value: 2 },
    ],
  },
];
const postRules = {
  name: [{ required: true, message: "请输入岗位名称", trigger: "blur" },
  { required: true, max:10, validator: validateLength, trigger: "change" }],
  describes:[{ max:60, validator: validateLength, trigger: "change" }],
};
const rankRules = {
  name: [{ required: true, message: "请输入职级名称", trigger: "change" },
  { required: true, max:10, validator: validateLength, trigger: "change" }]
};
export default {
  name: "OrganManage",
  components: {
    STable,
  },
  data() {
    return {
      rankRules:rankRules,
      scheduleColumns: [
        {
          title: "序号",
          dataIndex: "key",
          key: "key",
          scopedSlots: { customRender: "key" },
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
      // 查询条件参数
      queryParam: {
        name: "",
        state: "",
      },
      loadScheduleData: (parameter) => {
        const requestParameters = Object.assign({}, parameter, this.queryParam);
        return this.$api.rankPostService
          .getPostList(requestParameters)
          .then((res) => {
            res.data.data.list.map((i,k)=>{
              i.key=k+1
            })
            return res.data;
          });
      },
      selectedRowKeys: [],
      selectedRows: [],
      rankList: [],
      submitType: null,
    };
  },
  created() {
    this.loadRankData();
  },
  methods: {
    //加载职级方法
    loadRankData() {
      this.$api.rankPostService.getRankList().then((res) => {
        let rankList = res.data.data.list;
        if (rankList.length === 0) return;
        rankList.forEach((i) => (i.edit = false));
        this.rankList = rankList.reverse();
      });
    },
    handleAddRank() {
      if (this.rankList.some((i) => i.edit === true)) {
        this.$message.warning("存在未保存的职级，请保存后再操作");
        return false;
      }
      this.submitType = "insert";
      let param = {};
      param.name = "";
      param.level = this.rankList.length + 1;
      param.edit = true;
      this.rankList.push(param);
    },
    handEditRank(id) {
      this.submitType = "update";
      this.rankList.find((i) => {
        if (i.id == id) {
          i.oldName = i.name
          i.edit = !i.edit;
        }
      });
    },
    handDelRank() {
      const _this = this;
      if (this.rankList.length <= 1) {
        this.$message.warning("最后一个职级无法删除");
        return false;
      }

      let param = this.rankList[this.rankList.length - 1];
      this.$confirm({
        title: "警告",
        content: `是否确认删除职级 ${param.name} ?`,
        okText: "删除",
        okType: "danger",
        centered: true,
        cancelText: "取消",
        onOk() {
          _this.$api.rankPostService
            .deleteRank(param.id)
            .then((res) => {
              if (res.data.code == 0) {
                _this.submitType = null;
                _this.$message.success("删除成功");
                _this.loadRankData();
              } else {
                _this.$message.error("删除失败");
              }
            })
            .catch((err) => {
              _this.$message.error(err.msg);
            });
        },
        onCancel() {},
      });
    },
    handCancelRank(item) {
      this.submitType = null;
      if (item.id) {
        this.rankList.find((i) => {
          if (i.id == item.id){
            i.name = i.oldName
            delete i.oldName
            i.edit = !i.edit;
          } 
        });
      } else {
        this.rankList.pop();
      }
    },

    handSaveRank(item,index) {
      /** 调用保存方法,根据 submitType 判断新增或编辑
       * 保存完成 submitType 置 null
       * 调用职级查询方法重新查询职级
       */
      this.$refs.ruleform[index].validate(valid => {
        if (valid) {
          if (this.submitType === "insert") {
            this.$api.rankPostService
              .postRank(item)
              .then((res) => {
                if (res.data.code == 0) {
                  this.submitType = null;
                  this.$message.success("保存成功");
                  this.loadRankData();
                } else {
                  this.$message.error("保存失败," + res.data.msg);
                }
              })
              .catch((err) => {
                this.$message.error(err.msg);
              });
          } else {
            this.$api.rankPostService
              .putRank(item)
              .then((res) => {
                if (res.data.code == 0) {
                  this.submitType = null;
                  this.$message.success("修改成功");
                  this.loadRankData();
                } else {
                  this.$message.error("修改失败" + res.data.msg);
                }
              })
              .catch((err) => {
                this.$message.error(err.data.msg);
              });
          }
        } else {
          this.$message.success("请正确输入职级再保存");
          return false;
        }
      });
      
    },
    //岗位新增
    handleAdd() {
      let formProps = {
        record: {
          state:1
        },
        formTitle: postTitle,
        rules: postRules,
        submitFun: (param) => {
          return this.$api.rankPostService.postPost(param).then((res) => {
            return res.data;
          });
        },
      };
      let modalProps = {
        title: "新增岗位",
        width: 700,
        centered: true,
        maskClosable: false,
        okText: "提交",
      };
      this.openModal(TaskForm, formProps, modalProps);
    },
    //岗位编辑
    handleEdit(record) {
      let formProps = {
        record: record,
        formTitle: postTitle,
        rules: postRules,
        submitFun: (param) => {
          return this.$api.rankPostService.putPost(param).then((res) => {
            return res.data;
          });
        },
      };
      let modalProps = {
        title: "编辑岗位",
        width: 700,
        centered: true,
        maskClosable: false,
        okText: "提交",
      };
      this.openModal(TaskForm, formProps, modalProps);
    },
    //岗位删除
    handleDel(record) {
      const _this = this;
      this.$confirm({
        title: "警告",
        content: `是否确认删除岗位 ${record.name} ?`,
        okText: "删除",
        okType: "danger",
        centered: true,
        cancelText: "取消",
        onOk() {
          _this.$api.rankPostService
            .deletePost(record.id)
            .then((res) => {
              if (res.data.code == 0) {
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
    /**
     * 重置查询参数
     */
    resetParam() {
      this.queryParam = {
        name: "",
        state: "",
      };
      this.$refs.table.refresh(true)
    },
    handleChange() {
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
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