<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-card :bordered="false">
      <a-row :gutter="24">
        <a-col :lg="7" :xl="5" :xxl="4">
          <ant-tree
            :allowEdit="false"
            :allowReload="true"
            :allowSearch="true"
            @loadTreeNode="loadTreeNode"
            @editTreeNode="editTreeNode"
            @addTreeNode="addTreeNode"
            @removeTreeNode="removeTreeNode"
          >
          </ant-tree>
        </a-col>
        <a-col :md="24" :lg="17" :xl="19" :xxl="20">
          <div class="table-page-search-wrapper">
            <a-form layout="inline">
              <a-row :gutter="48">
                <a-col :md="8" :sm="24">
                  <a-form-item label="模糊查询">
                    <a-input
                      placeholder="请输入要查询的关键词"
                      v-model="queryParam.search"
                    />
                  </a-form-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <a-form-item label="合同终止日期">
                    <a-date-picker style="width: 100%" :value-format="dateFormat" v-model="queryParam.endTime"/>
                  </a-form-item>
                </a-col>
                <template v-if="advanced">
                  <a-col :md="8" :sm="24">
                    <a-form-item label="即将到期">
                      <a-select default-value="" v-model="queryParam.isExpire">
                        <a-select-option value=""> 全部 </a-select-option>
                        <a-select-option value="1"> 是 </a-select-option>
                        <a-select-option value="2"> 否 </a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                </template>
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
                    <a-button style="margin-left: 8px" @click="resetSearch"
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
            
            <a-badge dot v-if="isSignUp===1">
              <a-button
                type="primary"
                @click="newContract"
                icon="plus"
                >新建合同</a-button
              >
            </a-badge>  
             <a-button
             v-else
              type="primary"
              @click="newContract"
              icon="plus"
              >新建合同</a-button
            >
            <a-button
              type="primary"
              @click="extensionCon"
              style="margin-left: 8px"
              :disabled="selectedRows.length == 0"
              icon="form"
              >续约合同</a-button 
            >
          </div>
          <s-table
            ref="table"
            rowKey="key"
            :columns="scheduleColumns"
            :data="loadScheduleData"
            :rowSelection="rowSelection"
            :scroll="{ y: 600, x: 800 }"
            :showPagination="true"
          >
            <template slot="isExpire" slot-scope="isExpire">
              <!-- <a-badge :status="isExpire" :text="isExpire | statusFilter" /> -->
              <a-badge
                :status="isExpire == 1 ? 'warning' : ( isExpire == 2 ? 'processing' : ( isExpire == 3 ? 'error' : ''))"
                :text="isExpire | statusFilter"
              />
            </template>
            <span slot="action" slot-scope="text, record">
              <a @click="handleEdit(record)">历史合同</a>
              <a-divider type="vertical" />
              <a @click="extensionOneCon(record)" :disabled="record.isExpire===2">续约合同</a>
            </span>
          </s-table>
        </a-col>
      </a-row>
    </a-card>
    <form-step
      ref="modal"
      title="新增合同"
      formTitleName="name"
      :filter="{contract:'no'}"
      :formTitle="formTitle"
      :rules="rules"
      :stepTitle="stepTitle"
      :submitFun="submitFun"
      @refreshTable="refreshTable"
    ></form-step>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import STable from "@/components/Table_/";
import AntTree from "@/components/tree_/Tree";
import TaskForm from "@/components/TaskForm";
import fromModel from "@/components/formModel/formModel";
import diaHisContract from "@/components/diaHisContract/diaHisContract";
// import diaNewContract from "@/components/diaNewContract/diaNewContract"
import formStep from "@/components/stepForm/StepForm";
import { validateLength } from "@/config/default/rules";

const formTitle = [
  {
    label: "姓名",
    name: "name",
    type: "text",
    refName: "name",
    placeholder: "请输入所在单位",
    disabled: true,
  },
  {
    label1: "合同起始日期",
    name1: "startDate",
    type: "rangePicker",
    valueFormat1:'YYYY-MM-DD',
    placeholder1: "请选择合同起始日期",
    disabledDate:true,
    label2: "试用结束日期",
    name2: "probation",
    valueFormat2:'YYYY-MM-DD',
    disabledDate2:true,
    placeholder2: "请选择试用结束日期",
  },
  {
    label: "合同期限(月)",
    name: "contractPeriod",
    type: "number",
    refName: "contractPeriod",
    placeholder: "请输入合同期限",
  },
  {
    label: "合同附件",
    name: "uploadFile",
    type: "upload",
    refName: "uploadFile",
  },
];
const stepTitle = [{ title: "选择人员" }, { title: "填写合同信息" }];
const validatePeriod = (rule, value, callback) => {
      var regex = /^(([+]?\d*$)|(^[+]?\d+(\.\d+)?$))/;
      if(regex.test(value)) {
          callback();
      } else {
          callback(new Error('合同期限格式不正确'));
      }
};
const rules = {
  name: [
    { required: false, message: "请输入名字", trigger: "blur", disabled: true },
  ],
  startDate: [
    { required: true, message: "请选择合同起始日期", trigger: "change" },
  ],
  contractPeriod: [
    { required: true, message: "请输入合同期限", trigger: "change" },
    { required: true, validator: validatePeriod, trigger: 'change' },
    { required: true, max:3, validator: validateLength, trigger: 'change' },
  ],
};
export default {
  name: "OrganManage",
  components: {
    STable,
    AntTree,
    TaskForm,
    formStep,
  },
  data() {
    return {
      dateFormat: 'YYYY-MM-DD',
      formTitle,
      rules,
      stepTitle,
      show:true,//历史合同提示
      num:23,//表示新建合同的右上角的点数
      submitFun: (params, file) => {
        // let param = Object.assign(params,this.queryParams)
        return this.$api.contractService
          .addContractData(params, file)
          .then((res) => {
            return res.data;
          });
      },
      // 高级搜索 展开/关闭
      isSignUp:undefined,
      advanced: true,
      openKeys: ["key-01"],
      tree: [],
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
          dataIndex: "number",
          key: "number",
          width: 100,
        },
        {
          title: "所属组织",
          dataIndex: "organizationName",
          key: "organizationName",
          width: 200,
        },
        {
          title: "合同终止日期",
          dataIndex: "endDate",
          key: "endDate",
          width: 120,
        },
        {
          title: "合同期限(月)",
          dataIndex: "contractPeriod",
          key: "contractPeriod",
          width: 120,
        },
        {
          title: "是否需要续约",
          dataIndex: "isExpire",
          key: "isExpire",
          width: 120,
          scopedSlots: { customRender: "isExpire" },
        },
        {
          title: "操作",
          dataIndex: "action",
          scopedSlots: { customRender: "action" },
          width: 150,
        },
      ],
      queryParam: {
        search: "",
        isExpire: "",
        endTime: "",
        organizationId: "",
        oid: "",
      },
      loadScheduleData: (params) => {
        this.queryParam.oid = this.user.organizationId;
        let param = Object.assign(params, this.queryParam);
        return this.$api.contractService.getContractData(param).then((res) => {
          res.data.data.list.map((i, k) => {
            i.key = k + 1;
          });
          this.isSignUp = res.data.data.isSignUp
          return res.data;
        });
      },
      selectedRowKeys: [],
      selectedRows: [],
      extension: [
        {
          label: "姓名",
          name: "name",
          type: "text",
          refName: "name",
          placeholder: "请输入姓名",
          disabled: true,
        },
        {
          label: "合同期限(月)",
          name: "contractPeriod",
          type: "number",
          refName: "contractPeriod",
          placeholder: "请输入整数",
        },
        {
          label: "上传文件",
          name: "uploadFile",
          type: "upload",
          refName: "uploadFile",
          disabled: false,
        },
      ],
      extensionRules: {
        contractPeriod: [
          { required: true, validator: validatePeriod, trigger: 'change' },
          { required: true, message: "请输入合同期限", trigger: "change" },
          { required: true, max:3, validator: validateLength, trigger: 'change' },
        ],
      },
      // 模糊搜索关键字
      keyword: "",
      isExpire: "", //是否到期
      endTime: "", //合同终止日期
    };
  },
  methods: {
    //新建合同之后刷新页面
    refreshTable() {
      this.$refs.table.refresh(false);
    },
    handleEdit(record) {
      let param = {
        person: record,
      };
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
      this.queryParam = {
        key: e.key,
      };
      this.$refs.table.refresh(true);
    },
    handleAdd(item) {
      this.$message.info(`提示：你点了 ${item.key} - ${item.title} `);
      this.$refs.modal.add(item.key);
    },
    handleTitleClick() {
    },
    // 是否即将到期
    handleChange(e) {
      this.isExpire = e;
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
              
            },
            cancel() {
              
            },
            close() {
              
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
              
            },
            cancel() {
              
            },
            close() {
              
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
    removeTreeNode() {
    },
    // 选中树节点
    loadTreeNode(data) {
      this.queryParam.organizationId = data.id;
      this.$refs.table.refresh(true);
    },
    // 获取多选的数据
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },

    //续约单个合同
    extensionOneCon(e) {
      if (e.isExpire == 2) {
        this.$message.error("合同未到期，不能续约!");
      } else {
        this.extension.forEach((item) => {
          if (item.type == "upload") {
            item.disabled = false;
          }
        });
        let param = {
          formTitle: this.extension,
          rules: this.extensionRules,
          record: {
            name: e.name,
            policeId: e.police_id,
          },
          submitFun: (parameter) => {
            return this.$api.contractService
              .postExtensionCon(parameter)
              .then((res) => {
                return res.data;
              });
          },
        };
        let option = {
          title: "续约合同",
          width: 500,
          centered: true,
          maskClosable: false,
          okText: "提交",
        };
        this.modal(param, option, fromModel);
      }
    },
    // 续约合同
    extensionCon() {
      const bool = this.selectedRows.some((i) => i.isExpire === 2);
      if (bool) {
        this.$message.error("选项存在未到期合同，不能续约!");
        return false;
      }

      this.extension.forEach((item) => {
        if (item.type == "upload") {
          item.disabled = true;
        }
      });
      let arr = this.selectedRows;
      let arrName = "";
      let policeId = [];
      arr.forEach((item, index) => {
        arrName += item.name + ",";
        if (index == arr.length - 1) {
          arrName = arrName.slice(0, arrName.length - 1);
        }
        policeId.push(item.police_id);
      });
      let param = {
        formTitle: this.extension,
        rules: this.extensionRules,
        record: {
          name: arrName,
          policeId: policeId,
        },
        submitFun: (parameter) => {
          return this.$api.contractService
            .postManyExtensionCon(parameter)
            .then((res) => {
              return res.data;
            });
        },
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
      this.$refs.modal.visible = true;
    },
    // 弹窗
    modal(obj, option, model) {
      const _this = this
      const defaultProps = {
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
      let formProps = Object.assign(obj, defaultProps);
      this.$dialog(
        model,
        // form props
        formProps,
        // modal props
        option
      );
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    // 点击重置
    resetSearch() {
      this.queryParam = {
        search: "",
        isExpire: "",
        endTime: "",
        organizationId: "",
      };
      this.$refs.table.refresh(false);
    },
    // 获取到组织树信息
    getTreeData(data) {
      this.tree = data;
    },
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: "需续约",
        2: "无需续约"
      };
      return statusMap[status];
    },
  },
  computed: {
    ...mapState("setting", ["pageMinHeight"]),
    ...mapGetters("account", ["user"]), // 获取登录者信息
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange,
        getCheckboxProps: (record) => ({ // 用来限制 多选框是否可选
          props: {
            disabled: record.isExpire === 2, // Column configuration not to be checked
            name: record.id,
          },
        }),
      };
    },
  },
  mounted() {
    // this.getOrganization()
  },
};
</script>

<style scoped lang="less">
@import "index";
/deep/ .ant-badge-dot{
  width: 10px;
  height: 10px;
}
</style>
