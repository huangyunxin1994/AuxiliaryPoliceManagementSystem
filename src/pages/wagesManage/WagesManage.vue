<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-card :bordered="false">
      <a-row>
        <a-col :span="24" style="text-align: center; margin-bottom: 24px">
          <a-month-picker
            v-model="queryParam.month"
            :valueFormat="monthFormat"
            :disabled-date="disabledDate"
            @change="handleChange"
          >
            <h2 style="" :style="{ color: theme.color }">
              <span>{{ queryParam.month | filtersTime }}</span>
              <a-icon
                type="caret-down"
                :style="{ color: theme.color }"
                style="margin-left: 24px"
              />
            </h2>
            <template slot="monthCellContentRender" slot-scope="date">
              <div v-if="getMonthData(date)" style="width: 100%; height: 100%">
                <a-badge :offset="[24, 0]" :count="getBadgeData(date)">
                  {{ getMonthData(date) }}
                </a-badge>
              </div>
            </template>
          </a-month-picker>
        </a-col>
      </a-row>
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="模糊查询">
                <a-input v-model="queryParam.search" placeholder="请输入要查询的关键词" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="组织选择">
                <tree-select :value="queryParam.organ" @handleTreeChange="handleTreeChange"></tree-select>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="工资状态">
                  <a-select
                    v-model="queryParam.state"
                    style="width: 100%"
                    @change="handleChange"
                  >
                    <a-select-option value=""> 全部 </a-select-option>
                    <a-select-option value="1"> 已发放 </a-select-option>
                    <a-select-option value="2"> 未发放 </a-select-option>
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
                  @click="() => (queryParam = {})"
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
        <a-button type="primary" icon="download" @click="downloadExcel"
          >查看工资表模板</a-button
        >
        <a-button
          type="primary"
          icon="upload"
          style="margin-left: 8px"
          @click="uploadExcel"
          >上传工资表</a-button
        >
        <a-button type="primary" icon="sync" style="margin-left: 8px"
          @click="synchroExcel">同步工资表</a-button
        >
      </div>
      <s-table
        ref="table"
        rowKey="key"
        :columns="scheduleColumns"
        :data="loadScheduleData"
        :scroll="{ y: 550, x: 800 }"
        showPagination="auto"
      >
        <template slot="holiday" slot-scope="holiday">
          <span>{{ holiday | holidayFilter }}</span>
        </template>
        <template slot="state" slot-scope="state">
          <a-badge
            :status="state == '1' ? 'success' : 'error'"
            :text="state | statusFilter"
          />
        </template>
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">审批</a>
        </span>
      </s-table>
    </a-card>
    <a-modal v-model="visible" title="上传工资表" on-ok="handleOk" centered destroyOnClose>
      <template slot="footer">
        <a-button key="back" @click="handleCancel"> 取消 </a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="handleOk">
          确认
        </a-button>
      </template>
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="{
          xs: { span: 24 },
          sm: { span: 7 },
        }"
        :wrapper-col="{
          xs: { span: 24 },
          sm: { span: 13 },
        }"
      >
        <a-row>
          <a-col :xs="24" :sm="24">
            <a-form-model-item label="组织选择" prop="organizationId">
              <!-- 树选择 -->
              <a-tree-select
                v-model="form['organizationId']"
                :treeData="treeSelect"
                style="width: 100%"
                :value="value"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                placeholder="请选择组织"
                allow-clear
                multiple
                :replaceFields="{
                  children: 'children',
                  title: 'name',
                  key: 'id',
                  value: 'id',
                }"
                tree-default-expand-all
              >
              </a-tree-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :xs="24" :sm="24">
            <a-form-model-item label="上传文件">
              <a-upload
                name="file"
                :multiple="true"
                action=""
                :before-upload="beforeUpload"
                :show-upload-list="true"
              >
                <a-button type="primary">选择文件</a-button>
              </a-upload>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import moment from "moment";
import STable from "@/components/Table_/";
import treeSelect from "@/components/treeSelect/TreeSelect";
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
  return val;
}
export default {
  name: "WagesManage",
  components: {
    STable,
    treeSelect,
  },
  data() {
    return {
      form: {
        organizationId: [],
        fileList: [],
      },
      loading:false,
      fileList: [],
      rules: {},
      tree: [],
      treeSelect:[],
      disableTree: [],
      treeData: [],
      visible: false,
      salaryTitle: {},
      advanced: false,
      showFormat: "YYYY年MM月",
      monthFormat: "YYYY-MM",
      // 高级搜索 展开/关闭
      value: null,
      replaceFields: {
        children: "children",
        title: "title",
        key: "key",
        value: "key",
      },
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
          width: 100,
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
          ellipsis: true,
        },
        {
          title: "状态",
          dataIndex: "state",
          key: "state",
          scopedSlots: { customRender: "state" },
          width: 100,
        },
      ],
      queryParam: {
        month: moment(
          new Date(new Date().setMonth(new Date().getMonth() - 1))
        ).format("YYYY-MM"),
        organizationId:"",
        oid:"",
        search:"",
        state:""
      },
      loadScheduleData: (params) => {
        this.queryParam.oid = this.user.organizationId;
        let param = Object.assign(params, this.queryParam);
        return this.$api.salaryService.getSalary(param).then((res) => {
          if (res.data.data.list.length > 0) {
            const salaryTitle = Object.assign(
              {},
              JSON.parse(res.data.data.list[0].salaryContent)
            );
            this.scheduleColumns.map(
              (j) => salaryTitle[j.title] && delete salaryTitle[j.title]
            );
            res.data.data.list.map((i, k) => {
              i.key = k + 1;
              const salaryVal = JSON.parse(i.salaryContent);
              i = Object.assign(i, salaryVal);
            });
            Object.keys(salaryTitle)
              .reverse()
              .map((i) => {
                let params = {};
                params.title = i;
                params.dataIndex = i;
                params.key = i;
                this.scheduleColumns.splice(4, 0, params);
              });
          }

          return res.data;
        });
      },
    };
  },
  mounted() {
    const oid =
      (this.user.account !== "huachen2020" && this.user.organizationId) || "";
    this.$api.organizationService
      .getOrganization({ organizationId: oid })
      .then((res) => {
        const data = JSON.parse(JSON.stringify(res.data.data.data));
        this.tree = Object.assign([], res.data.data.data);
        this.treeData = filterArray(data);
        this.searchDisabledTree()
        // this.$emit("getTreeData",this.filterTree)
      });
  },
  methods: {
    disabledDate(current) {
      console.log(current);
      console.log(moment().endOf("month"));
      return (
        current &&
        current >
          moment(
            new Date(new Date().setMonth(new Date().getMonth() - 1))
          ).endOf("month")
      );
    },
    getBadgeData(value) {
      let result = moment(value).format("M");
      let arr = [
        { month: "1", result: 1 },
        { month: "2", result: 1 },
        { month: "3", result: 1 },
        { month: "4", result: 1 },
        { month: "5", result: 1 },
        { month: "6", result: 2 },
        { month: "7", result: 2 },
        { month: "8", result: 2 },
        { month: "9", result: 1 },
      ];
      let params = arr.find((i) => i.month === result);
      if (params) {
        if (params.result === 1) {
          return <a-icon type="check-circle" style="color:#87d068" />;
        } else {
          return <a-icon type="info-circle" style="color:#f50" />;
        }
      } else {
        return null;
      }
    },
    getMonthData(value) {
      return moment(value).format("M月");
    },

    //打开关闭日期选择器
    handleChange() {
      this.$refs.table.refresh(true);
      this.searchDisabledTree()
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    //树选择回调
    handleTreeChange(obj) {
      this.queryParam.organizationId = obj.val;
    },
    downloadExcel() {
      this.$api.salaryService.getFormwork({month:this.queryParam.month}).then(res=>{
        if(res.data.code===0){
          window.location.href = `${process.env.VUE_APP_API_BASE_URL}/salary/formwork?month=${this.queryParam.month}`;
        }else{
          this.$message.error(res.data.msg)
        }
      })
      
    },
    uploadExcel() {
      this.visible = true;
    },
    synchroExcel(){
      const _this = this
      this.$confirm({
        title: "提示",
        content: `真的要同步 ${_this.queryParam.month} 月份工资表吗 吗?`,
        okText: "同步",
        okType: "primary",
        centered: true,
        cancelText: "取消",
        onOk() {
          _this.$api.salaryService.getSynchro({month:_this.queryParam.month,organizationId:_this.user.organizationId }).then((res) => {
            console.log(res);
            if(res.data.code === 0){
              _this.$message.success(res.data.msg)
              _this.$refs.table.refresh(true)
            }else{
              _this.$message.error(res.data.msg)
            }
          });
        },
        onCancel() {},
      });
      
    },
    handleOk() {
      this.loading = true
      this.form.month = this.queryParam.month;
      this.$api.salaryService.postSalary(this.form).then((res) => {
        this.loading = false
        this.visible = false;
        if(res.data.code === 0){
          this.$message.success(res.data.msg)
          this.$refs.table.refresh(true)
        }else{
          this.$message.error(res.data.msg)
        }
      });
    },
    handleCancel() {
      this.visible = false;
    },
    // 上传文件
    beforeUpload(file) {
      console.log(file);
      this.form.fileList = [...this.fileList, file];
      return false;
    },
    //查询已上传工资条的组织
    searchDisabledTree(){
      this.$api.salaryService
        .getSalaryfileter({ id: this.user.organizationId, month: this.queryParam.month })
        .then((res) => {
          this.disableTree = res.data.data.list;
          this.treeSelect = JSON.parse(JSON.stringify(this.tree))
          this.treeSelect = this.treeFilter(this.treeSelect)
        });
    },
    treeFilter(data) {
      data.forEach((item) => {
        delete item.children;
        this.disableTree.forEach((i) => {
          if (i === item.id) {
            item.disabled = true;
          }
        });
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
      return val;
    },
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: "已同步",
        2: "未同步",
      };
      return statusMap[status];
    },
    holidayFilter(holiday) {
      const statusMap = {
        1: "是",
        2: "否",
      };
      return statusMap[holiday];
    },
    filtersTime(time) {
      const dateTime = moment(new Date(time)).format("YYYY年MM月");
      return dateTime;
    },
  },
  computed: {
    ...mapState("setting", ["theme", "pageMinHeight"]),
    ...mapGetters("account", ["user"]),
  },
};
</script>

<style scoped lang="less">
@import "./index";
</style>