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
                    <a-input placeholder="请输入要查询的关键词" v-model="queryParam.search"/>
                  </a-form-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <a-form-item label="岗位选择">
                    <a-select  v-model="queryParam.postId" style="width: 100%">
                          <a-select-option value=""> 全部 </a-select-option>
                          <a-select-option :value="item.id" v-for="item in postList" :key="item.id"> {{item.name}} </a-select-option>
                        </a-select>
                  </a-form-item>
                </a-col>
                <template v-if="advanced">
                  <a-col :md="8" :sm="24">
                    <a-form-item label="是否专业辅警">
                      <a-select default-value="" v-model="queryParam.isMajor">
                        <a-select-option value=""> 全部 </a-select-option>
                        <a-select-option value="1"> 是 </a-select-option>
                        <a-select-option value="2"> 否 </a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                </template>
                <template v-if="advanced">
                  <a-col :md="8" :sm="24">
                    <a-form-item label="职级选择">
                      <a-select default-value=""  v-model="queryParam.rankId">
												<a-select-option value=""> 全部 </a-select-option>
                        <a-select-option v-for="(item,index) in rankMess" :key="index" :value="item.id"> {{item.name}} </a-select-option>
											</a-select>
                    </a-form-item>
                  </a-col>
                </template>
                <template v-if="advanced">
                  <a-col :md="8" :sm="24">
                    <a-form-item label="学历选择">
                      <a-select default-value=""  v-model="queryParam.education">
                        <a-select-option value=""> 全部 </a-select-option>
                        <a-select-option value="专科"> 专科 </a-select-option>
                        <a-select-option value="本科"> 本科 </a-select-option>
                        <a-select-option value="硕士"> 硕士 </a-select-option>
                        <a-select-option value="博士"> 博士 </a-select-option>
                        <a-select-option value="博士后"> 博士后 </a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                </template>
                <!-- <template v-if="advanced">
                  <a-col :md="8" :sm="24">
                    <a-form-item label="工龄">
                      <a-input placeholder="请输入工龄" />
                    </a-form-item>
                  </a-col>
                </template> -->
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
                      @click="resetTable">重置</a-button
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
            <a-button
              type="primary"
              icon="vertical-align-bottom"
              style="margin-right: 10px"
              >批量导入</a-button
            >
            <a-button type="primary" icon="plus" @click="addPerson"
              >新增人员</a-button
            >
            <a-dropdown v-if="selectedRowKeys.length > 0">
              <a-menu slot="overlay">
                <a-menu-item key="1"><a-icon type="delete" />删除</a-menu-item>
                <a-menu-item key="2"><a-icon type="lock" />锁定</a-menu-item>
              </a-menu>
              <a-button style="margin-left: 8px">
                批量操作 <a-icon type="down" />
              </a-button>
            </a-dropdown>
          </div>
          <s-table
            ref="table"
            :rowKey="(record)=>record.id"
            :columns="scheduleColumns"
            :data="loadScheduleData"
            :rowSelection="rowSelection"
            :scroll="{ y: 600, x: 700 }"
            showPagination="auto"
          >
          <template slot="name" slot-scope="name,record">
              <a  @click="handleEdit(record.id,record.name)">{{name}}</a>
            </template>
            <template slot="status" slot-scope="status">
              <a-badge :status="status" :text="status | statusFilter" />
            </template>
            <template slot="sex" slot-scope="sex">
              <span >{{sex | sexFilter}}</span>
            </template>
            <template slot="isMajor" slot-scope="isMajor">
              <span >{{isMajor | majorFilter}}</span>
            </template>
            <span slot="action" slot-scope="text, record">
              <a @click="confirm(record)">重置</a>
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
export default {
  name: "OrganManage",
  components: {
    STable,
    AntTree,
  },
  data() {
    return {
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
          scopedSlots: { customRender: "name" },
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
          title: "岗位",
          dataIndex: "postName",
          key: "postName",
          width: 100,
        },
        {
          title: "职级",
          dataIndex: "rankName",
          key: "rankName",
          width: 100,
        },
        {
          title: "工龄",
          dataIndex: "seniority",
          key: "seniority",
          width: 100,
        },
        {
          title: "年龄",
          dataIndex: "age",
          key: "age",
          width: 100,
        },
        {
          title: "性别",
          dataIndex: "sex",
          key: "sex",
          scopedSlots: { customRender: "sex" },
          width: 100,
        },
        {
          title: "政治面貌",
          dataIndex: "politicalStatus",
          key: "politicalStatus",
          width: 100,
        },
        {
          title: "学历",
          dataIndex: "education",
          key: "education",
          width: 100,
        },
        {
          title: "是否专业辅警",
          dataIndex: "isMajor",
          key: "isMajor",
          scopedSlots: { customRender: "isMajor" },
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
        {
          title: "序号",
          dataIndex: "key",
          key: "key",
          width: 60,
        },
        {
          title: "职级",
          dataIndex: "rank",
          key: "rank",
          width: 80,
        },
        {
          title: "变动类型",
          dataIndex: "status",
          key: "status",
          width: 100,
          scopedSlots: { customRender: "status" },
        },
        {
          title: "生效时间",
          dataIndex: "date",
          key: "date",
          width: 100,
        },
        {
          title: "变动原因",
          dataIndex: "cause",
          key: "cause",
          width: 150,
        },
        {
          title: "审批人",
          dataIndex: "principal",
          key: "principal",
          width: 100,
        },
      ],
      diaData: [],
      queryParam: {
        search:'',
        postId:'',
        oid:'',
        rankId:'',
        education:'',
        isMajor:'',
        organizationId:''
      },
      loadScheduleData: (params) => {
        this.queryParam.oid = this.user.organizationId;
        let param = Object.assign(params, this.queryParam);
        console.log(param)
        return this.$api.auxiliaryPoliceService.getAuxiliaryPoliceData(param).then((res) => {
          res.data.data.list.map((i, k) => {
            i.key = k + 1;
          });
          console.log(res);
          return res.data;
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
          label: "变动前职级",
          name: "beforeRank",
          type: "input",
          refName: "beforeRank",
          placeholder: "请输入变动前职级",
          disabled: true,
        },
        {
          label: "变动后职级",
          name: "rank",
          type: "select",
          refName: "rank",
          placeholder: "请选择变动后职级",
        },
        {
          label: "变动原因",
          name: "cause",
          type: "input",
          refName: "cause",
          placeholder: "请输入变动原因",
        },
        {
          label: "生效日期",
          name: "date",
          type: "picker",
          refName: "date",
          placeholder: "请选择变动原因",
        },
      ],
      changeRankRules: {
        rank: [
          { required: true, message: "请选择变动后职级", trigger: "change" },
        ],
        cause: [{ required: true, message: "请输入变动原因", trigger: "blur" }],
        date: [
          { required: true, message: "请选择生效日期", trigger: "change" },
        ],
      },
      advanced: false,
      rankMess:[],//职级选择列表
      postList:[],//岗位选择列表
    };
  },
  methods: {
    // 获取职级列表
    getRankList(){
      let para = {
        oid:this.user.organizationId
      }
      this.$api.rankPostService.getRankList(para).then((res)=>{
        console.log(res)
        let rank = res.data.data.list
        console.log(rank)
        this.rankMess = rank
      })
    },
    // 获取岗位列表
    getPostList(){
      this.$api.rankPostService.getPostList().then(res=>{
          this.postList = Object.assign([],res.data.data.list)
      })
    },
    handleEdit(id,name) {
      this.$router.push({
        path:"/baseMess",
        query:{
          id:id,
          name:name
        }
      });
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
    
    loadTreeNode(data){
      console.log(data)
      this.queryParam.organizationId = data.id
      this.$refs.table.refresh(true)
    },
    //编辑树节点
    editTreeNode(params) {
      console.log(params);
    },
    //添加树节点
    addTreeNode(params) {
      console.log(params);
    },
    //删除树节点
    removeTreeNode(params) {
      console.log(params);
    },
    // 获取多选的数据
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },

    resetTable(){
      this.queryParam.search = ''
      this.queryParam.postId = ''
      this.queryParam.oid = ''
      this.queryParam.rankId = ''
      this.queryParam.education = ''
      this.queryParam.isMajor = ''
      this.$refs.table.refresh(true)
    },
    // 职级变更
    changeRank() {
      console.log(this.selectedRows);
      let param = {
        formTitle: this.extension,
        rules: this.changeRankRules,
      };
      let option = {
        title: "职级变更",
        width: 500,
        centered: true,
        maskClosable: false,
        okText: "提交",
      };
      this.modal(param, option, fromModel);
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
    // 重置密码
    confirm(e) {
      console.log(e);
      // this.$message.success("修改成功");
      const _this = this;
      this.$confirm({
        title: "警告",
        content: `确认要重置密码为123456吗?`,
        okText: "确认",
        okType: "danger",
        centered: true,
        cancelText: "取消",
        onOk() {
          let param = {
            id:e.id,
            password:123456
          }
          _this.$api.auxiliaryPoliceService.putAuxiliaryPolice(param).then((res)=>{
            if(res.data.code == 0){
              _this.$refs.table.refresh(true)
              return res.data
            }else{
              _this.$message.error(res.data.msg);
            }
          }).catch((err) => {
            _this.$message.error(err.data.msg);
          });
        },
        onCancel() {},
      });
    },
    // 新增人员
    addPerson() {
      this.$router.push("/baseMessA");
    },
    // 展开收缩
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
  },
  mounted () {
      this.getRankList()
      this.getPostList()
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        processing: "是",
        error: "否",
      };
      return statusMap[status];
    },
    sexFilter(sex){
      const statusMap = {
        1: "男",
        2: "女",
      };
      return statusMap[sex];
    },
    majorFilter(major){
      const statusMap = {
        1: "是",
        2: "否",
      };
      return statusMap[major];
    }
  },
  computed: {
    ...mapState("setting", ["pageMinHeight"]),
    ...mapGetters("account", ["user"]),
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
</style>
