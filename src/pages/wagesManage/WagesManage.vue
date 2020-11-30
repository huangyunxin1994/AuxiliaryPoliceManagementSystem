<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-card :bordered="false">
      <a-row>
        <a-col :span="24" style="text-align: center; margin-bottom: 24px">
          <a-month-picker
            v-model="queryParam.month"
            :valueFormat="monthFormat"
            :disabled-date="disabledDate"
            @openChange="handleOpen"
            :panelChange="handlePanelChange"
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
                <a-input
                  v-model="queryParam.search"
                  placeholder="请输入要查询的关键词"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="组织选择">
                <a-tree-select
                  v-model="queryParam.organizationId"
                  :treeData="treeData"
                  style="width: 100%"
                  :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                  placeholder="请选择组织"
                  allow-clear
                  :replaceFields="{
                    children: 'children',
                    title: 'name',
                    key: 'organizationId',
                    value: 'organizationId',
                  }"
                  tree-default-expand-all
                >
                </a-tree-select>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="工资状态">
                  <a-select v-model="queryParam.state" style="width: 100%">
                    <a-select-option value=""> 全部 </a-select-option>
                    <a-select-option value="1"> 已同步 </a-select-option>
                    <a-select-option value="2"> 未同步 </a-select-option>
                    <a-select-option value="3"> 未上传 </a-select-option>
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
                <a-button style="margin-left: 8px" @click="reset"
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
        <a-badge :dot="getBadgeDataForBtn()">
          <a-button
            type="primary"
            icon="upload"
            style="margin-left: 8px"
            @click="uploadExcel"
            >上传工资表</a-button
          >
        </a-badge>
        <a-button
          type="primary"
          icon="sync"
          style="margin-left: 8px"
          @click="synchroExcel"
          >同步工资表</a-button
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
            :status="
              state == 1
                ? 'success'
                : state == 2
                ? 'warning'
                : state == 3
                ? 'error'
                : ''
            "
            :text="state | statusFilter"
          />
        </template>
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">审批</a>
        </span>
      </s-table>
    </a-card>
    <a-modal
      v-model="visible"
      title="上传工资表"
      on-ok="handleOk"
      @cancel="handleCancel"
      centered
      destroyOnClose
    >
      <template slot="footer">
        <a-button key="back" @click="handleCancel"> 取消 </a-button>
        <a-button
          key="submit"
          type="primary"
          :loading="loading"
          @click="handleOk"
        >
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
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                placeholder="请选择组织"
                allow-clear
                multiple
                :replaceFields="{
                  children: 'children',
                  title: 'name',
                  key: 'organizationId',
                  value: 'organizationId',
                }"
                tree-default-expand-all
              >
              </a-tree-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :xs="24" :sm="24">
            <a-form-model-item label="上传文件" prop="file">
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
  data.forEach((item) => {
    delete item.children;
  });
  var map = {};
  data.forEach(function (item) {
    map[item.organizationId] = item;
  });
  var val = [];
  data.forEach(function (item) {
    var parent = map[item.parentId];
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
    //验证组织是否选择
    let validateOrgan = (rule, value, callback) => {
      if (this.form.organizationId.length === 0) {
        callback(new Error("请选择组织"));
      } else {
        callback();
      }
    };
    //验证文件是否上传
    let validateFile = (rule, value, callback) => {
      if (this.form.fileList.length === 0) {
        callback(new Error("请上传文件"));
      } else {
        callback();
      }
    };

    return {
      state: undefined,
      firstCreateTime: undefined,
      form: {
        organizationId: [],
        fileList: [],
      },
      loading: false,
      fileList: [],
      rules: {
        organizationId: [
          { required: true, validator: validateOrgan, trigger: "change" },
        ],
        file: [{ required: true, validator: validateFile, trigger: "change" }],
      },
      tree: [],
      treeSelect: [],
      disableTree: [],
      treeData: [],
      recordMonth: [],
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
        organizationId: "",
        oid: "",
        search: "",
        state: "",
      },
      loadScheduleData: (params) => {
        this.queryParam.oid =
          (this.user.isSystem !== 1 && this.user.organizationId) || "";
        let param = Object.assign(params, this.queryParam);
        return this.$api.salaryService.getSalary(param).then((res) => {
          res.data.data.list.map((i, k) => {
            i.key = k + 1;
          });
          if (res.data.data.list.length > 0) {
            const result = res.data.data.list.find((i) => i.salaryContent);
            if (result) {
              const salaryTitle = Object.assign(
                {},
                JSON.parse(result.salaryContent)
              );
              this.scheduleColumns.map(
                (j) => salaryTitle[j.title] && delete salaryTitle[j.title]
              );
              res.data.data.list.map((i) => {
                const salaryVal =
                  (i.salaryContent && JSON.parse(i.salaryContent)) || {};
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
          }

          return res.data;
        });
      },
    };
  },
  mounted() {
    this.$api.salaryService
      .validateSalary({ month: this.queryParam.month })
      .then((res) => {
        this.state = res.data.data.type;
        this.firstCreateTime = res.data.data.time;
      });
    this.getSalaryRecord();
    this.getOrganForSalary();
  },
  methods: {
    //重置
    reset() {
      this.queryParam = {
        month: moment(
          new Date(new Date().setMonth(new Date().getMonth() - 1))
        ).format("YYYY-MM"),
        organizationId: "",
        search: "",
        state: "",
      };
      this.$refs.table.refresh(true);
    },
    getSalaryRecord() {
      const year = this.queryParam.month.substring(0, 4);
      const param = {
        year: year,
        organizationId: this.user.organizationId,
      };
      this.$api.salaryRecordService.getSalaryRecord(param).then((res) => {
        this.recordMonth = Object.assign([], res.data.data.list);
      });
    },
    getOrganForSalary() {
      const oid = (this.user.isSystem !== 1 && this.user.organizationId) || "";
      this.$api.organizationService
        .getOrganForSalary({ month: this.queryParam.month, oid: oid })
        .then((res) => {
          const data = JSON.parse(JSON.stringify(res.data.data.list));
          this.tree = Object.assign([], res.data.data.list);
          this.treeData = filterArray(data);
          this.searchDisabledTree();
          // this.$emit("getTreeData",this.filterTree)
        });
    },
    disabledDate(current) {
      if (!this.firstCreateTime) {
        return true;
      }
      return (
        current &&
        (current >
          moment(
            new Date(new Date().setMonth(new Date().getMonth() - 1))
          ).endOf("month") ||
          current < moment(new Date(this.firstCreateTime)).startOf("month"))
      );
    },
    getBadgeData(value) {
      if (!this.firstCreateTime) {
        return null;
      }
      let result = moment(value).format("YYYY-MM");
      let params = this.recordMonth.find((i) => i.recordMonth === result);
      console.log(params);
      if (params) {
        return <a-icon type="check-circle" style="color:#87d068" />;
      } else {
        if (
          value >
            moment(
              new Date(new Date().setMonth(new Date().getMonth() - 1))
            ).endOf("month") ||
          value < moment(new Date(this.firstCreateTime)).startOf("month")
        ) {
          return null;
        }
        return <a-icon type="info-circle" style="color:#f50" />;
      }
    },
    getBadgeDataForBtn() {
      if (!this.firstCreateTime) {
        return null;
      }
      let result = moment(this.queryParam.month).format("YYYY-MM");
      let params = this.recordMonth.find((i) => i.recordMonth === result);
      if (params) {
        return false;
      } else {
        if (
          moment(this.queryParam.month) >
            moment(
              new Date(new Date().setMonth(new Date().getMonth() - 1))
            ).endOf("month") ||
          moment(this.queryParam.month) <
            moment(new Date(this.firstCreateTime)).startOf("month")
        ) {
          return false;
        }
        return true;
      }
    },
    getMonthData(value) {
      return moment(value).format("M月");
    },

    //打开关闭日期选择器
    handleChange() {
      this.$refs.table.refresh(true);
      this.getOrganForSalary();
      this.searchDisabledTree();
    },
    handleOpen(state) {
      if (state) {
        setTimeout(() => {
          const dateDom = document.querySelector(".ant-calendar-ym-select");
          dateDom.addEventListener("DOMCharacterDataModified", () => {
            this.getSalaryRecord();
          });
        }, 0);
      }
    },
    handlePanelChange() {},
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    //树选择回调
    handleTreeChange(obj) {
      this.queryParam.organizationId = obj.val;
    },
    downloadExcel() {
      if (!this.state || this.state === 2) {
        this.$message.warning("暂不可进行工资相关的操作");
        return;
      }
      window.location.href = `${process.env.VUE_APP_API_BASE_URL}/salary/formwork?month=${this.queryParam.month}`;
    },
    uploadExcel() {
      if (!this.state || this.state === 2) {
        this.$message.warning("暂不可进行工资相关的操作");
        return;
      }
      this.searchDisabledTree();
      this.visible = true;
    },
    synchroExcel() {
      if (!this.state || this.state === 2) {
        this.$message.warning("暂不可进行工资相关的操作");
        return;
      }
      const _this = this;
      this.$confirm({
        title: "提示",
        content: `真的要同步 ${_this.queryParam.month} 月份工资表吗 吗?`,
        okText: "同步",
        okType: "primary",
        centered: true,
        cancelText: "取消",
        onOk() {
          _this.$api.salaryService
            .getSynchro({
              month: _this.queryParam.month,
              organizationId:
                (_this.user.isSystem !== 1 && _this.user.organizationId) || "",
            })
            .then((res) => {
              if (res.data.code === 0) {
                _this.$message.success(res.data.msg);
                _this.$refs.table.refresh(true);
              } else {
                _this.$message.error(res.data.msg);
              }
            });
        },
        onCancel() {},
      });
    },
    handleOk() {
      if (!this.state || this.state === 2) {
        this.$message.warning("当前未创建工资模板，暂不可进行工资相关的操作");
        return;
      }

      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.form.month = this.queryParam.month;
          this.$api.salaryService.postSalary(this.form).then((res) => {
            this.loading = false;
            this.visible = false;
            // this.form = {
            //   organizationId: [],
            //   fileList: [],
            // };
            if (res.data.code === 0) {
              if (res.data.data.result === 0) {
                // const uploadTree = this.tree.filter(
                //   (item) =>
                //     !this.disableTree.some((ele) => ele === item.organizationId)
                // );
                // console.log(uploadTree);
                // const result =
                //   uploadTree.length === this.form.organizationId.length &&
                //   uploadTree.every((a) =>
                //     this.form.organizationId.some((b) => a.organizationId === b)
                //   ) &&
                //   this.form.organizationId.every((_b) =>
                //     uploadTree.some((_a) => _a.organizationId === _b)
                //   );
                // console.log(result);
                // if (result) {
                //   this.$api.organizationService
                //     .getOrganization({
                //       organizationId:
                //         (this.user.isSystem !== 1 &&
                //           this.user.organizationId) ||
                //         "",
                //     })
                //     .then((res) => {
                //       if (res.data.code === 0) {
                //         let arr = [];
                //         res.data.data.data.map((i) => {
                //           const param = {
                //             recordMonth: this.queryParam.month,
                //             organizationId: i.id,
                //           };
                //           arr.push(param);
                //         });
                //         this.$api.salaryRecordService
                //           .postSalaryRecord(arr)
                //           .then((res) => {
                //             if(res.data.code === 0){
                //               this.getSalaryRecord();
                //             }else{
                //               this.$message.error(res.data.msg)
                //               this.getSalaryRecord();
                //             }
                //           });
                //       }else{
                //         this.$message.error(res.data.msg)
                //         this.getSalaryRecord();
                //       }
                //     });
                // } else {
                //   this.getSalaryRecord();
                // }
                this.getSalaryRecord();
                this.$message.success(res.data.msg);

                this.$refs.table.refresh(true);
              } else if (res.data.data.result === 1) {
                this.$error({
                  title: "表字段不正确",
                  content:
                    "当前上传工资表的字段与系统模板不必配，请查看模板，修改正确后重新上传。",
                });
              } else if (res.data.data.result === 2) {
                this.$error({
                  width: 500,
                  title: "含有所属组织不存在的警员编号",
                  content: (
                    <div>
                      {res.data.data.list.map((item) => {
                        return (
                          <p class="messgeItem">
                            <span>警员编号：{item}</span>
                            <span>问题：所属组织不存在的警员编号</span>
                          </p>
                        );
                      })}
                    </div>
                  ),
                });
              } else if (res.data.data.result === 3) {
                this.$error({
                  width: 500,
                  title: "工资表缺少警员编号",
                  content: (
                    <div>
                      {res.data.data.list.map((item) => {
                        return (
                          <p class="messgeItem">
                            <span>警员编号：{item}</span>
                            <span>问题：工资表缺少此警员编号</span>
                          </p>
                        );
                      })}
                    </div>
                  ),
                });
              } else if (res.data.data.result === 4) {
                this.$error({
                  width: 500,
                  title: "含有重复警员编号",
                  content: (
                    <div>
                      {res.data.data.list.map((item) => {
                        return (
                          <p class="messgeItem">
                            <span>警员编号：{item}</span>
                            <span>问题：警员编号重复</span>
                          </p>
                        );
                      })}
                    </div>
                  ),
                });
              }
            } else {
              this.form = {
                organizationId: [],
                fileList: [],
              };
              this.$message.error(res.data.msg);
            }
          });
        } else {
          console.log("error submit!!");
        }
      });
    },
    handleCancel() {
      this.form = {
        organizationId: [],
        fileList: [],
      };
      this.loading = false;
      this.visible = false;
    },
    // 上传文件
    beforeUpload(file) {
      this.form.fileList = [...this.fileList, file];
      return false;
    },
    //查询已上传工资条的组织
    searchDisabledTree() {
      this.$api.salaryService
        .getSalaryfileter({
          id: (this.user.isSystem !== 1 && this.user.organizationId) || "",
          month: this.queryParam.month,
        })
        .then((res) => {
          this.disableTree = res.data.data.list;
          const tree = JSON.parse(JSON.stringify(this.tree));
          this.treeSelect = this.treeFilter(tree);
          console.log(this.disableTree);
          console.log(this.tree);
        });
    },
    treeFilter(data) {
      data.forEach((item) => {
        delete item.children;
        this.disableTree.forEach((i) => {
          if (i === item.organizationId) {
            item.disabled = true;
          }
        });
      });
      var map = {};
      data.forEach(function (item) {
        map[item.organizationId] = item;
      });
      var val = [];
      data.forEach(function (item) {
        var parent = map[item.parentId];
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
        3: "未上传",
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
.messgeItem {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
/deep/ .ant-modal-confirm-content {
  margin-top: 38px;
  margin-left: 0;
}
/deep/ .ant-badge-dot {
  width: 10px;
  height: 10px;
}
</style>