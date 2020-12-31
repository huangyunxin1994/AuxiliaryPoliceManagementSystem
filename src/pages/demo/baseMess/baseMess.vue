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
                    <a-select  v-model="queryParam.postName" style="width: 100%">
                          <a-select-option value=""> 全部 </a-select-option>
                          <a-select-option :value="item.name" v-for="item in postList" :key="item.name"> {{item.name}} </a-select-option>
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
                      <a-select default-value=""  v-model="queryParam.rankName">
												<a-select-option value=""> 全部 </a-select-option>
                        <a-select-option v-for="(item,index) in rankMess" :key="index" :value="item.name"> {{item.name}} </a-select-option>
											</a-select>
                    </a-form-item>
                  </a-col>
                </template>
                <template v-if="advanced">
                  <a-col :md="8" :sm="24">
                    <a-form-item label="入职日期">
                      <!-- <a-select default-value=""  v-model="queryParam.education">
                        <a-select-option value=""> 全部 </a-select-option>
                        <a-select-option value="小学"> 小学 </a-select-option>
                        <a-select-option value="初中"> 初中 </a-select-option>
                        <a-select-option value="高中"> 高中 </a-select-option>
                        <a-select-option value="大专"> 大专 </a-select-option>
                        <a-select-option value="大学本科"> 大学本科 </a-select-option>
                        <a-select-option value="研究生"> 研究生 </a-select-option>
                      </a-select> -->
                       <a-date-picker style="width: 100%" :value-format="dateFormat" v-model="queryParam.time"/>
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
            <a-button type="primary" icon="upload" @click="visible=true"  style="margin-right: 10px"
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
            :scroll="{ y: 600, x: 700 }"
            showPagination="auto"
          >
          <template slot="name" slot-scope="name,record">
              <a  @click="handleEdit(record)">{{name}}</a>
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
    <import-form ref="importForm" :data='importData' :importParam="importParam" @reloadData="$refs.table.refresh(false)"></import-form>
    <a-modal
      v-model="visible"
      title="批量导入"
      :destroyOnClose="true"
      :afterClose="close"
      :width="400"
      :footer="null"
      :mask-closable="false"
      centered 
    >
    <a-form-model ref="modalForm" :model="importParam" :rules="rules" :label-col="{span:6}"
    :wrapper-col="{span:18}">
            <a-form-model-item label="组织选择" prop="organizationId">
                <tree-select
                  :value="importParam.organizationId"
                  @handleTreeChange="handleTreeChange"
                ></tree-select>
              </a-form-model-item>      
          </a-form-model>
          <div class="modalButton" >
            <a-button
            icon="vertical-align-bottom"
              style="margin-right: 10px"
              type="primary"
               @click="downloadExcel"
            >
              模板下载
            </a-button>
            <import-excel  :tableTitle="tableTitle" btnName="批量导入" @getTableData="getTableData"></import-excel>
          </div>
          
    </a-modal>
        
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import STable from "@/components/Table_/";
import AntTree from "@/components/tree_/Tree";
import fromModel from "@/components/formModel/formModel";
import {daysDistance} from '@/utils/dateTime'
import importExcel from '@/components/importExcel/importExcel'
import importForm from '@/components/importForm/importForm'
import treeSelect from "@/components/treeSelect/TreeSelect";
export default {
  name: "OrganManage",
  components: {
    STable,
    AntTree,
    importExcel,
    importForm,
    treeSelect
  },
  data() {
    return {
      dateFormat:'YYYY-MM-DD',
      visible:false,
      importData:[],
      tableTitle:[
        [
          {title: "姓名",dataIndex: "name",key: "name"},
          {title: "辅警编号",dataIndex: "number",key: "number"},
          {title: "身份证号",dataIndex: "idCard",key: "idCard"},
          {title: "所属岗位",dataIndex: "postName",key: "postName"},
          {title: "所属职级",dataIndex: "rankName",key: "rankName"},
          {title: "民族",dataIndex: "nation",key: "nation"},
          {title: "学历",dataIndex: "education",key: "education"},
          {title: "籍贯",dataIndex: "nativePlace",key: "nativePlace"},
          {title: "身高（cm）",dataIndex: "height",key: "height"},
          {title: "入职日期",dataIndex: "entryTime",key: "entryTime",type:'date'},
          {title: "政治面貌",dataIndex: "politicalStatus",key: "politicalStatus"},
          {title: "手机号码",dataIndex: "phone",key: "phone"},
        ],
        [
          {title: "姓名",dataIndex: "name",key: "name"},
          {title: "辅警编号",dataIndex: "number",key: "number"},
          {title: "毕业院校",dataIndex: "school",key: "school"},
          {title: "所在院系",dataIndex: "courtyard",key: "courtyard"},
          {title: "学习形式",dataIndex: "learningForm",key: "learningForm"},
          {title: "学制",dataIndex: "schoolSystem",key: "schoolSystem"},
          {title: "入学日期",dataIndex: "startDate",key: "startDate",type:'date'},
          {title: "毕业日期",dataIndex: "endDate",key: "endDate",type:'date'},
          {title: "所学专业",dataIndex: "major",key: "major"},
          {title: "学历",dataIndex: "education",key: "education"},
          {title: "学位",dataIndex: "academic",key: "academic"},
          {title: "学位授予日期",dataIndex: "academicTime",key: "academicTime",type:'date'},
        ],
        [
          {title: "姓名",dataIndex: "name",key: "name"},
          {title: "辅警编号",dataIndex: "number",key: "number"},
          {title: "工作起始日期",dataIndex: "startTime",key: "startDate",type:'date'},
          {title: "工作结束日期",dataIndex: "endTime",key: "endData",type:'date'},
          {title: "所在单位",dataIndex: "company",key: "company"},
          {title: "单位类型",dataIndex: "unitType",key: "unitType"},
          {title: "职务级别",dataIndex: "jobLevel",key: "jobLevel"},
          {title: "是否公务员",dataIndex: "orderly",key: "orderly"},
          {title: "从事或担任工作",dataIndex: "post",key: "post"},
          {title: "备注",dataIndex: "remarks",key: "remarks"}
        ],
        [
          {title: "姓名",dataIndex: "name",key: "name"},
          {title: "辅警编号",dataIndex: "number",key: "number"},
          {title: "成员姓名",dataIndex: "familyName",key: "familyName"},
          {title: "与本人关系",dataIndex: "relationship",key: "relationship"},
          {title: "成员身份证",dataIndex: "idCard",key: "idCard"},
          {title: "民族",dataIndex: "nation",key: "nation"}
        ]
      ],
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
          width: 120,
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
        // {
        //   title: "工龄(年)",
        //   dataIndex: "seniority",
        //   key: "seniority",
        //   width: 80,
        // },
        {
          title: "年龄",
          dataIndex: "age",
          key: "age",
          width: 80,
        },
        {
          title: "性别",
          dataIndex: "sex",
          key: "sex",
          scopedSlots: { customRender: "sex" },
          width: 80,
        },
        {
          title: "政治面貌",
          dataIndex: "politicalStatus",
          key: "politicalStatus",
          width: 100,
        },
        {
          title: "入职日期",
          dataIndex: "entryTime",
          key: "entryTime",
          width: 100,
        },
        {
          title: "是否专业辅警",
          dataIndex: "isMajor",
          key: "isMajor",
          scopedSlots: { customRender: "isMajor" },
          width: 120,
        },
        {
          title: "重置密码",
          dataIndex: "action",
          scopedSlots: { customRender: "action" },
          width: 100,
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
        postName:'',
        oid:'',
        rankName:'',
        education:'',
        isMajor:'',
        organizationId:''
      },
      importParam:{
        organizationId:"",
        organizationName:""
      },
      loadScheduleData: (params) => {
        this.queryParam.oid = this.user.isSystem !==1 && this.user.organizationId || "";
        let param = Object.assign(params, this.queryParam);
        return this.$api.auxiliaryPoliceService.getAuxiliaryPoliceData(param).then((res) => {
          res.data.data.list.map((i, k) => {
            i.key = k + 1;
            let now = new Date()
            i.seniority = daysDistance(now,i.entryTime,'year')
          });
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
      rules:{
        organizationId:[
          { required: true, message: "请选择组织", trigger: "change" },
        ]
      },
      advanced: true,
      rankMess:[],//职级选择列表
      postList:[],//岗位选择列表
      postNameList:[],
      rankNameList:[]
    };
  },
  methods: {
    // 获取职级列表
    getRankList(){
      let para = {
        oid:this.user.isSystem !==1 && this.user.organizationId || "",
        type:1
      }
      this.$api.otherItemsService.getAuxPostRank(para).then((res)=>{
        let rank = res.data.data.list
        this.rankMess = rank
      })
    },
    // 获取岗位列表
    getPostList(){
      let para = {
        oid:this.user.isSystem !==1 && this.user.organizationId || "",
        type:2
      }
      this.$api.otherItemsService.getAuxPostRank(para).then(res=>{
          this.postList = Object.assign([],res.data.data.list)
      })
    },
    handleEdit(record) {
      let param = {
        id:record.id,
        name:record.name,
        number:record.number
      }
      if(record.photoPath)
      param.photoPath=record.photoPath
      this.$router.push({
        path:"/baseMess",
        query:param
      });
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
    
    loadTreeNode(data){
      this.queryParam.organizationId = data.id
      console.log(data)
      this.$refs.table.refresh(true)
      this.importParam={
        organizationId:data.id||this.user.organizationId,
        organizationName:data.name||this.user.organizationName
      }
      console.log(this.importParam)
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

    resetTable(){
      this.queryParam.search = ''
      this.queryParam.postName = ''
      this.queryParam.oid = ''
      this.queryParam.rankName = ''
      this.queryParam.education = ''
      this.queryParam.isMajor = ''
      this.$refs.table.refresh(true)
    },
    // 职级变更
    changeRank() {
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
              _this.$message.success("重置成功")
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
      this.$router.push({
        path:"/baseMessA",
        query:{
          oId:this.queryParam.organizationId
        }
      });
    },
    // 展开收缩
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    //下载工资表操作
    downloadExcel() {
      window.location.href = `${process.env.VUE_APP_API_BASE_URL}/img/批量导入模板.xlsx`;
    },
    //导入方法回调
    getTableData(params){
      this.importData = params
      this.$refs.modalForm.validate(valid => {
        if (valid) {
          this.visible=false
          this.$nextTick(()=>{
            this.$refs.importForm.handleShow()
          })
        } else {
          return false;
        }
      });
      
    },
    //树选择回调
    handleTreeChange(obj) {
      console.log(obj)
      this.importParam.organizationId = obj.val;
      this.importParam.organizationName = obj.label
    },
    close(){
      this.importParam={
        organizationId:this.user.organizationId,
        organizationName:this.user.organizationName
      }
    }
  },
  created () {
      this.getRankList()
      this.getPostList()
      this.$api.rankPostService.getPostList().then(res=>{
         this.postNameList = Object.assign([],res.data.data.list)
      })
      this.$api.rankPostService.getRankList().then(res=>{
         this.rankNameList = Object.assign([],res.data.data.list)
      })
      this.importParam={
        organizationId:this.user.organizationId,
        organizationName:this.user.organizationName
      }
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
.modalButton{
  display: flex;
  justify-content: space-around;
}
</style>
