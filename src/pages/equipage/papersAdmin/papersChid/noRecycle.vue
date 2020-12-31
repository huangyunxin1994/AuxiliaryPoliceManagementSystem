<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="模糊查询">
                <a-input v-model="queryParam.describes" placeholder="请输入要查询的关键词" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="组织选择">
                <select-tree ref="selectTree" :value="queryParam.organizationId" style="width: 100%" @handleTreeChange="handleTreeChange"></select-tree>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="配发日期">
                  <a-date-picker @change="allotmentDate" style="width: 100%" :value-format="dateFormat" v-model="queryParam.allotmentDate"/>
                </a-form-item>
              </a-col>
            </template>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="到期日期">
                  <a-date-picker @change="validity" style="width: 100%"  :value-format="dateFormat" v-model="queryParam.termValidity"/>
                </a-form-item>
              </a-col>
            </template>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="状态选择">
                  <a-select default-value="4" @change="handleChange" v-model="queryParam.state">
                    <a-select-option :value="4"> 全部 </a-select-option>
                    <a-select-option :value="1">未到期</a-select-option>
                    <a-select-option :value="3">逾期未回收</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </template>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="证件类型">
                  <a-select default-value="" @change="handleChange" v-model="queryParam.cqName">
                    <a-select-option value=""> 全部 </a-select-option>
                    <a-select-option :value="item.name" v-for="item in certList" :key="item.id">{{item.name}}</a-select-option>
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
                <a-button
                  style="margin-left: 8px"
                  @click="resetParam"
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
          <a-button type="primary" icon="plus" @click="newEqu" style="margin-right: 10px"
            >新增发放</a-button
          >
          <a-button type="primary" icon="reload" @click="handleClick" :disabled="selectedRowKeys.length == 0"
            >证件回收</a-button
          >
        <!-- <a-dropdown v-if="selectedRowKeys.length > 0">
          <a-menu slot="overlay" @click="handleClick">
            <a-menu-item key="1"><a-icon type="reload" />证件回收</a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px">
            批量操作 <a-icon type="down" />
          </a-button>
        </a-dropdown> -->
      </div>
      <s-table
        ref="table"
        :rowKey="(record)=>record.id"
        :columns="scheduleColumns"
        :data="loadScheduleData"
        :rowSelection="rowSelection"
        :scroll="{ y: 600, x: 1000 }"
        showPagination="auto"
      >
        <template slot="action" slot-scope="equState">
          <!-- {{equState}} -->
          <a-badge :status="equState == 1 ? 'processing' : ( equState == 2 ? 'success' : (equState == 3 ? 'error' : ''))" :text="equState | statusFilter" />
        </template>
      </s-table>
    </a-card>
    <form-step
      ref="modal"
      title="新增发放证件"
      :formTitle="formTitle"
      :record="record"
      :rules="rules"
      :stepTitle="stepTitle"
      :submitFun="submitFun"
      @refreshTable="refreshTable"
    ></form-step>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import STable from "@/components/Table_/";
import formStep from "@/components/stepForm/StepForm";
import selectTree from "@/components/treeSelect/TreeSelect";
// import moment from 'moment'

const stepTitle = [{ title: "选择人员" }, { title: "填写证件信息" }];
const rules = {
  cqId: [{ required: true, message: "请选择证件类型", trigger: "change" }],
  allotmentDate: [
    { required: true, message: "请选择配发日期", trigger: "change" },
  ],
  termValidity: [
    { required: true, message: "请选择有效期限", trigger: "change" },
  ],
};
export default {
  components: {
    STable,
    formStep,
    selectTree,
  },
  data() {
    return {
      dateFormat: 'YYYY-MM-DD',
      formTitle:[],
      rules,
      record:{},
      stepTitle,
      submitFun: (params) => {
        params.type = 1;
        return this.$api.certEquipService.postCertEqup(params).then((res) => {
          return res.data;
        });
      },
      certList:[],
      openKeys: ["key-01"],
      loading: false,
      value: null,
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
          width: 150,
        },
        {
          title: "配发日期",
          dataIndex: "allotmentDate",
          key: "allotmentDate",
        },
        {
          title: "有效期限",
          dataIndex: "termValidity",
          key: "termValidity",
        },
        {
          title: "状态",
          dataIndex: "state",
          key: "state",
          scopedSlots: { customRender: "action" },
        },
        {
          title: "证件类型",
          dataIndex: "cqName",
          key: "cqName",
          width: 120,
        },
        {
          title: "发放人",
          dataIndex: "issuedBy",
          key: "issuedBy",
          width: 120,
        },
      ],
      queryParam: {
        organizationId: "",
        describes: "",
        allotmentDate: "",
        termValidity: "",
        state:4,
        type: 1,
        certificatesEquipmentHistory: "",
        cqName:'',//证件或装备类型
        oid:"",
        recycler:'',//回收人
        recyclerId:'',//回收人id
      },
      loadScheduleData: (params) => {
        this.queryParam.recycler = this.user.name
        this.queryParam.recyclerId = this.user.id
        this.queryParam.oid = this.user.isSystem !==1 && this.user.organizationId || ""
        let param = Object.assign(params, this.queryParam);
        return this.$api.certEquipService.getCertEqup(param).then((res) => {
          res.data.data.list.map((i, k) => {
            i.key = k + 1;
          });
          return res.data;
        });
      },
      replaceFields: {
        children: "children",
        title: "title",
        key: "key",
        value: "key",
      },
      selectedRowKeys: [],
      selectedRows: [],
      advanced: true,
    };
  },
  created() {
    this.$api.certEquipService.getCertEqupType({ type: 1, state : 1 }).then((res) => {
        this.certList = res.data.data.list
    })
    this.$api.otherItemsService.getCredDataList().then((res) => {
        this.formTitle = [
        {
          label: "证件类型",
          name: "cqId",
          labelName:"cqName",
          type: "select",
          refName: "cqId",
          placeholder: "请输入证件类型",
          select: res.data.data.list
        },
        {
          label1: "配发日期",
          name1: "allotmentDate",
          type: "rangePicker",
          disabledDate:true,
          refName1: "allotmentDate",
          funOpt:1,
          placeholder1: "请选择配发日期",
          label2: "有效期限",
          name2: "termValidity",
          refName2: "termValidity",
          placeholder2: "请选择有效期限",
        }
      ]
    })
    this.record = {
      issuedBy:this.user.name,
      issuedById:this.user.id
    }
    this.queryParam.oid = this.user.isSystem !==1 && this.user.organizationId || ""
  },
  methods: {
    // 配发日期
    handleChange() {},
    // 配发日期
    allotmentDate(date, dateString) {
      this.queryParam.allotmentDate = dateString
    },
    //到期日期
    validity(date,dateString) {
      this.queryParam.termValidity = dateString
    },
    onChange() {},
    // 多选触发
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    //证件回收
    confirm() {
      this.$message.success("回收成功");
    },
    cancel() {
      this.$message.error("已取消回收");
    },
    // 新增发放
    newEqu() {
      this.$refs.modal.visible = true;
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    //树选择回调
    handleTreeChange(obj){
      this.queryParam.organizationId = obj.val
    },
    handleClick(){
      const _this = this;
      this.$confirm({
        title: "警告",
        content: `真的要回收所选证件吗?`,
        okText: "回收",
        okType: "danger",
        centered: true,
        cancelText: "取消",
        onOk() {
          let arr = [];
          _this.selectedRowKeys
            .map((i) => {
              const param = {
                id: i,
                type: 1,
                recycler: _this.user.name,
                recyclerId: _this.user.id,
              };
              arr.push(param)
            })
          _this.$api.certEquipService
            .putCertEqup(arr)
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
    },
    refreshTable(){
      this.queryParam.organizationId=""
      this.queryParam.describes=""
      this.queryParam.allotmentDate=""
      this.queryParam.termValidity=""
      this.queryParam.certificatesEquipmentHistory=""
      this.$refs.table.refresh(true);
    },
    //重置
    resetParam(){
      this.queryParam = {
        organizationId: "",
        describes: "",
        allotmentDate: "",
        termValidity: "",
        state:4,
        type: 1,
        certificatesEquipmentHistory: "",
        cqName:'',//证件或装备类型
        oid:"",
        recycler:'',//回收人
        recyclerId:'',//回收人id
      }
      this.$refs.table.refresh(false);
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: "未到期",
        2: "已回收",
        3: "逾期未回收",
      };
      return statusMap[status];
    },
  },
  computed: {
    ...mapState("setting", ["pageMinHeight"]),
    ...mapGetters("account", ['user']),
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange,
      };
    },
  },
};
</script>

<style lang="less" scoped>
</style>