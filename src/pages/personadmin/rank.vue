<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-card :bordered="false">
      <a-row :gutter="24">
        <a-col :lg="7" :xl="5" :xxl="4">
          <ant-tree
            :allowEdit="false"
            :allowReload="true"
            :allowSearch="true"
            @editTreeNode="editTreeNode"
            @addTreeNode="addTreeNode"
            @removeTreeNode="removeTreeNode"
            @loadTreeNode="loadTreeNode"
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
                  <a-form-item label="职级">
                    <!-- <a-input placeholder="请输入职级" v-model="queryParam.currentRank" /> -->
                    <a-select default-value="" v-model="queryParam.currentRank">
                      <a-select-option value=""> 全部 </a-select-option>
                      <a-select-option
                        v-for="(item, index) in rankMess"
                        :key="index"
                        :value="item.name"
                      >
                        {{ item.name }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <template v-if="advanced">
                  <a-col :md="8" :sm="24">
                    <a-form-item label="变动类型">
                      <a-select
                        default-value=""
                        @change="handleChange"
                        v-model="queryParam.state"
                      >
                        <a-select-option value=""> 全部 </a-select-option>
                        <a-select-option value="1"> 晋升 </a-select-option>
                        <a-select-option value="2"> 降级 </a-select-option>
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
            <!-- <a-button type="primary" @click="changeRank" :disabled="selectedRows.length == 0">变更职级</a-button> -->
            <a-button
              type="primary"
              icon="edit"
              @click="changeRank"
              v-if="selectedRows.length != 0"
              >变更职级</a-button
            >
            <!-- <a-dropdown v-if="selectedRowKeys.length > 0">
						<a-menu slot="overlay">
							<a-menu-item key="1"><a-icon type="delete" />删除</a-menu-item>
							<a-menu-item key="2"><a-icon type="lock" />锁定</a-menu-item>
						</a-menu>
						<a-button style="margin-left: 8px">
							批量操作 <a-icon type="down" />
						</a-button>
						</a-dropdown> -->
          </div>
          <s-table
            ref="table"
            rowKey="key"
            :columns="scheduleColumns"
            :data="loadScheduleData"
            :scroll="{ y: 600, x: 800 }"
            showPagination="auto"
          >
            <template slot="state" slot-scope="state">
              <a-badge
                :status="
                  state == '1'
                    ? 'success'
                    : state == '2'
                    ? 'error'
                    : 'processing'
                "
                :text="state | statusFilter"
              />
            </template>
            <span slot="action" slot-scope="text, record">
              <a @click="changeOneRank(record)" :disabled="record.effDisabled"
                >变更职级</a
              >
              <a-divider type="vertical" />
              <a @click="handleEdit(record)">查看</a>
            </span>
          </s-table>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import STable from "@/components/Table_/";
import AntTree from "@/components/tree_/Tree";
import fromModel from "@/components/formModel/formModel";
import diaHisRank from "@/components/diaPersonnel/history";
import moment from "moment";
import { validateLength } from "@/config/default/rules";
export default {
  name: "OrganManage",
  components: {
    STable,
    AntTree,
  },
  data() {
    return {
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
          width: 250,
        },
        {
          title: "当前职级",
          dataIndex: "currentRank",
          key: "currentRank",
          width: 100,
        },
        // {
        //   title: "变动前职级",
        //   dataIndex: "beforeRank",
        //   key: "beforeRank",
        //   width: 120,
        // },
        {
          title: "变动类型",
          dataIndex: "state",
          key: "state",
          width: 150,
          scopedSlots: { customRender: "state" },
        },
        {
          title: "变动原因",
          dataIndex: "reason",
          key: "reason",
          width: 150,
        },
        {
          title: "生效日期",
          dataIndex: "effectiveDate",
          key: "effectiveDate",
          width: 150,
        },
        {
          title: "审批人",
          dataIndex: "approvedBy",
          key: "approvedBy",
          width: 100,
        },
        {
          title: "操作",
          dataIndex: "action",
          scopedSlots: { customRender: "action" },
          width: 150,
        },
      ],
      diaColumns: [
        // {
        //   title: "序号",
        //   dataIndex: "key",
        //   key: "key",
        //   width: 60,
        // },
        {
          title: "生效时间",
          dataIndex: "effectiveDate",
          key: "effectiveDate",
          width: 100,
        },
        {
          title: "职级",
          dataIndex: "currentRank",
          key: "currentRank",
          width: 80,
        },
        {
          title: "变动类型",
          dataIndex: "state",
          key: "state",
          width: 100,
          scopedSlots: { customRender: "state" },
        },
        
        {
          title: "变动原因",
          dataIndex: "reason",
          key: "reason",
          width: 150,
        },
        {
          title: "审批人",
          dataIndex: "approvedBy",
          key: "approvedBy",
          width: 100,
        },
      ],
      // 查询条件参数
      queryParam: {
        name: "",
        state: "",
        currentRank: "",
        organizationId: "",
        search: "",
        type: 1,
        oid: "",
      },
      loadScheduleData: (params) => {
        this.queryParam.oid = this.user.organizationId;
        let param = Object.assign(params, this.queryParam);
        return this.$api.personAdminService.getRankList(param).then((res) => {
          res.data.data.list.map((i, k) => {
            i.key = k + 1;
            i.effDisabled = this.compareDate(i.effectiveDate);
          });
          return res.data;
        });
      },
      selectedRowKeys: [],
      selectedRows: [],
      extension: [
        {
          label: "姓名",
          name: "policeName",
          type: "text",
          refName: "name",
          placeholder: "请输入姓名",
          disabled: true,
        },
        {
          label: "变动前职级",
          name: "beforeRank",
          type: "text",
          refName: "beforeRank",
          placeholder: "请输入变动前职级",
          disabled: true,
        },
        {
          label: "变动后职级",
          name: "currentRank",
          type: "select",
          refName: "rank",
          placeholder: "请选择变动后职级",
        },
        {
          label: "变动原因",
          name: "reason",
          type: "input",
          refName: "cause",
          placeholder: "请输入变动原因",
        },
        {
          label: "生效日期",
          name: "effectiveDate",
          type: "picker",
          refName: "date",
          placeholder: "请选择生效时间",
          disabledDate: true,
          notice:'注：调动将于当日0:00生效',
          disabledDateFun: function (current) {
            return current && current < moment(new Date()).startOf("day");
          },
        },
      ],
      changeRankRules: {
        currentRank: [
          { required: true, message: "请选择变动后职级", trigger: "change" },
        ],
        reason: [
          { required: true, message: "请输入变动原因", trigger: "change" },
          { required: true, max:60, validator: validateLength, trigger: "change" }
        ],
        effectiveDate: [
          { required: true, message: "请选择生效日期", trigger: "change" },
        ],
      },
      rankMess: [],
    };
  },
  mounted() {
    this.getRankList();
  },
  methods: {
    //比较时间大小
    compareDate(date1) {
      var effectiveDate = new Date(date1);
      var nowTime = new Date();
      if (effectiveDate.getTime() > nowTime.getTime()) {
        return true; //第一个大
      } else {
        return false; //第二个大
      }
    },
    getRankList() {
      let param = {
        oid: this.user.organizationId,
        type: 1,
      };
      this.$api.otherItemsService.getPerPostRank(param).then((res) => {
        this.rankMess = Object.assign([], res.data.data.list);
      });
      let para = {
        oid: this.user.organizationId,
      };
      this.$api.rankPostService.getRankList(para).then((res) => {
        let rank = res.data.data.list;
        this.extension.forEach((item) => {
          if (item.name == "currentRank") {
            let arr = [];
            rank.forEach((i) => {
              let obj = {
                name: i.name,
              };
              arr.push(obj);
            });
            item.select = arr;
            // this.rankMess = arr
          }
        });
      });
    },
    handleEdit(record) {
      let param = {
        diaColumns: this.diaColumns,
        person: record,
      };
      let option = {
        title: "职级历史",
        width: 1000,
        centered: true,
        maskClosable: false,
        okText: "提交",
        footer: "",
        zIndex: 1000,
      };
      this.modal(param, option, diaHisRank);
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
    handleTitleClick() {},
    handleChange() {},
    //编辑树节点
    editTreeNode() {},
    //添加树节点
    addTreeNode() {},
    //删除树节点
    removeTreeNode() {},
    // 获取多选的数据
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    // 选中树节点
    loadTreeNode(data) {
      this.queryParam.organizationId = data.id;
      this.$refs.table.refresh(true);
    },

    // 职级变更
    changeRank() {
      let arr = [];
      let arrName = "";
      this.selectedRows.forEach((item, index) => {
        let obj = {
          policeName: item.policeName, //名字
          number: item.number, //警员编号
          userId: item.userId, //用户id
          beforeRank: item.currentRank, //变动前职级
          approvedBy: this.user.name, //审批人
          approvedById: this.user.id, //审批人id
          organizationName: item.organizationName, //组织名
          organizationId: item.organizationId, //组织id
          type: 1,
        };
        arrName += item.policeName + ",";
        if (index == this.selectedRows.length - 1) {
          arrName = arrName.slice(0, arrName.length - 1);
        }
        arr.push(obj);
      });

      let param = {
        formTitle: this.extension,
        rules: this.changeRankRules,
        record: {
          policeName: arrName, //名字
          policeArr: arr,
        },
        submitFun: (parameter) => {
          return this.$api.personAdminService
            .changeManyPostRank(parameter)
            .then((res) => {
              return res.data;
            });
        },
      };
      let callback = () => {
        this.$refs.table.refresh(true);
        this.selectedRows = [];
        this.selectedRowKeys = [];
      };
      let option = {
        title: "职级变更",
        width: 500,
        centered: true,
        maskClosable: false,
        okText: "提交",
      };
      this.modal(param, option, fromModel, callback);
    },
    // 变更单个职级
    changeOneRank(e) {
      this.$api.contractService.getdetails({ id: e.userId }).then((res) => {
        if (res.data.data.list.length === 0) {
          this.$message.error("该辅警未创建合同，请创建合同后再操作!");
          return;
        }
        let obj = {
          policeName: e.policeName, //名字
          number: e.number, //警员编号
          userId: e.userId, //用户id
          beforeRank: e.currentRank, //变动前职级
          approvedBy: this.user.name, //审批人
          approvedById: this.user.id, //审批人id
          organizationName: e.organizationName, //组织名
          organizationId: e.organizationId, //组织id
          type: 1,
        };
        let arr = [];
        arr.push(obj);
        let param = {
          formTitle: this.extension,
          rules: this.changeRankRules,
          record: {
            policeName: e.policeName, //名字
            beforeRank: e.currentRank, //变动前职级
            policeArr: arr,
          },
          submitFun: (parameter) => {
            return this.$api.personAdminService
              .changeManyPostRank(parameter)
              .then((res) => {
                return res.data;
              });
          },
        };
        let callback = () => {
          this.$refs.table.refresh(true);
        };
        let option = {
          title: "职级变更",
          width: 500,
          centered: true,
          maskClosable: false,
          okText: "提交",
        };
        this.modal(param, option, fromModel, callback);
      });
    },
    // 弹窗
    modal(obj, option, model, callback) {
      const defaultProps = {
        on: {
          ok() {
            callback();
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
    /**
     * 重置查询参数
     */
    resetParam() {
      (this.queryParam = {
        name: "",
        state: "",
        currentRank: "",
        organizationId: "",
        search: "",
        type: 1,
      }),
        this.$refs.table.refresh(false);
    },
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: "初始职级",
        1: "晋升",
        2: "降级",
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
