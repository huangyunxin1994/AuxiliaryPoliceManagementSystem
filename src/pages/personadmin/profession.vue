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
                      v-model="queryParam.name"
                    />
                  </a-form-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <a-form-item label="获得日期">
                    <a-date-picker @change="onChange" style="width:100%" :value-format="dateFormat" v-model="queryParam.time"/>
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
                    <a-button style="margin-left: 8px" @click="resetParam"
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
            <a-button type="primary" icon="plus" @click="addPerson"
              >新增任职人员</a-button
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
              <a @click="handleEdit(record)">新增个人记录</a>
            </span>
          </s-table>
        </a-col>
      </a-row>
    </a-card>
    <form-step
      ref="modal"
      title="新增任职人员"
      :filter="{isMajor:2}"
      formTitleName="name"
      :formTitle="formTitle"
      :rules="rules"
      :stepTitle="stepTitle"
      :submitFun="submitFun"
    ></form-step>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import STable from "@/components/Table_/";
import AntTree from "@/components/tree_/Tree";
// import fromModel from '@/components/formModel/formModel'
import diaHisFro from "@/components/diaPersonnel/professionHis";
import formStep from "@/components/stepForm/StepForm";
export default {
  name: "OrganManage",
  components: {
    STable,
    AntTree,
    formStep,
  },
  data() {
    return {
      dateFormat: 'YYYY-MM-DD',
      openKeys: ["key-01"],
      loading: false,
      // 高级搜索 展开/关闭
      advanced: true,
      scheduleColumns: [
        {
          title: "序号",
          dataIndex: "key",
          key: "key",
          width: 60,
        },
        {
          title: "姓名",
          dataIndex: "policeName",
          key: "policeName",
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
          title: "专业技术任职资格",
          dataIndex: "qualification",
          key: "qualification",
          width: 150,
        },
        {
          title: "资格审批单位",
          dataIndex: "approvalUnit",
          key: "approvalUnit",
          width: 150,
        },
        {
          title: "获得资格日期",
          dataIndex: "acquireDate",
          key: "acquireDate",
          width: 100,
        },
        {
          title: "操作",
          dataIndex: "action",
          scopedSlots: { customRender: "action" },
          width: 100,
        },
      ],
      queryParam: {
        name: "",
        time: "",
        organizationId: "",
        oid: "",
      },
      loadScheduleData: (params) => {
        this.queryParam.oid = this.user.isSystem !==1 && this.user.organizationId || "";
        let param = Object.assign(params, this.queryParam);
        return this.$api.personAdminService
          .getProfessionData(param)
          .then((res) => {
            res.data.data.list.map((i, k) => {
              i.key = k + 1;
            });
            return res.data;
          });
      },
      selectedRowKeys: [],
      selectedRows: [],
      formTitle: [
        {
          label: "专业技术任职资格称号",
          name: "qualification",
          type: "input",
          placeholder: "请输入专业技术任职资格称号",
        },
        {
          label: "资格审批单位",
          name: "approvalUnit",
          type: "input",
          placeholder: "请输入资格审批单位",
        },
        {
          label: "获得资格日期",
          name: "acquireDate",
          type: "picker",
          placeholder: "请选择获得资格日期",
        },
      ],
      rules: {
        qualification: [
          { required: true, message: "请输入名字", trigger: "blur" },
        ],
        acquireDate: [
          { required: true, message: "请选择获得资格日期", trigger: "change" },
        ],
        approvalUnit: [
          { required: true, message: "请输入资格审批单位", trigger: "blur" },
        ],
      },

      stepTitle: [{ title: "选择人员" }, { title: "填写专业技术" }],

      submitFun: (params) => {
        // let param = Object.assign(params,this.queryParams)
        return this.$api.personAdminService
          .addProfession(params)
          .then((res) => {
            this.$refs.table.refresh(true);
            return res.data;
          });
      },
    };
  },
  methods: {
    handleEdit(record) {
      let param = {
        nameMess: record,
      };
      let option = {
        title: "个人专业技术任职资格记录",
        width: 1000,
        centered: true,
        maskClosable: false,
        footer: "",
        zIndex: 1000,
      };
      this.modal(param, option, diaHisFro);
    },
    handleClick(e) {
      this.queryParam = {
        key: e.key,
      };
      // this.$refs.table.refresh(true)
    },
    handleAdd(item) {
      this.$message.info(`提示：你点了 ${item.key} - ${item.title} `);
      this.$refs.modal.add(item.key);
    },
    handleTitleClick() {
    },
    handleChange() {
    },
    // 选中组织树
    loadTreeNode(data) {
      this.queryParam.organizationId = data.id;
      this.$refs.table.refresh(true);
    },
    //编辑树节点
    editTreeNode() {
    },
    //添加树节点
    addTreeNode() {
    },
    //删除树节点
    removeTreeNode() {
    },
    // 获取多选的数据
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },

    // 新增任职人员
    addPerson() {
      this.$refs.modal.visible = true;
    },
    // 弹窗
    
    modal(obj, option, model) {
      let _this = this
      const defaultProps = {
        on: {
          ok() {
            // console.log('ok 回调')
          },
          cancel() {
            // e.handleDestroy()
            _this.$refs.table.refresh(false);
          },
          close() {
            // e.handleDestroy()
            // console.log('modal close 回调')
            
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
    //日期框筛选
    onChange(date, dateString) {
      this.queryParam.time = dateString;
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    // 重置查询条件
    resetParam() {
      (this.queryParam = {
        name: "",
        time: "",
        organizationId: "",
        oid: "",
      }),
        this.$refs.table.refresh(false);
    },
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        processing: "晋升",
        error: "降级",
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
      };
    },
  },
};
</script>

<style scoped lang="less">
@import "index";
</style>
