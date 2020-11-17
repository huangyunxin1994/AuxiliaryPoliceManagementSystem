<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-card :bordered="false">
		<div class="position-and-level-title" :style="{ 'border-color': theme.color }">职级调动</div>
		<s-table
			ref="table"
			rowKey="key"
			:columns="rankColumns"
			:data="rankData"
			:scroll="{ y: 600, x: 650 }"
			showPagination="auto"
		>
      <template
        slot="state"
        slot-scope="state">
        <a-badge
          :status="state == '1' ? 'success' : state == '2' ? 'error':'processing'"
          :text="state | stateFilter"
        />
      </template>
		</s-table>
    </a-card>
    <a-card :bordered="false">
      <div class="position-and-level-title" :style="{ 'border-color': theme.color }">岗位变动</div>
      
      <s-table
        ref="table"
        rowKey="key"
        :columns="postColumns"
        :data="postData"
        :scroll="{ y: 600, x: 650 }"
        showPagination="auto"
      >
      </s-table>
      
    </a-card>
    <a-card :bordered="false">
      <div class="position-and-level-title" :style="{ 'border-color': theme.color }">专业技术辅警资格信息</div>
      
      <s-table
        ref="table"
        rowKey="key"
        :columns="professionColumns"
        :data="professionData"
        :scroll="{ y: 600, x: 650 }"
        showPagination="auto"
      >
      </s-table>
      
    </a-card>
  </div>
</template>

<script>
import { mapState,mapGetters } from "vuex";
import STable from "@/components/Table_/";
// import ExportJsonExcel from "js-export-excel";
export default {
  name: "OrganManage",
  components: {
    STable,
  },
  props:{
    policeId:String
  },
  data() {
    return {
      value:null,
      advanced:false,
      replaceFields:{
          children:'children',
          title:'title',
          key:'key',
          value: 'key'
      },
      rankColumns: [
        {
          title: "序号",
          dataIndex: "key",
          key: "key",
          width: 60,
        },
        {
          title: "职级",
          dataIndex: "currentRank",
          key: "currentRank",
          ellipsis: true,
          width: 100,
        },
        {
          title: '变动类型',
          dataIndex: 'state',
          key: 'state',
          width: 150,
          scopedSlots: { customRender: 'state' }
        },
        {
          title: "变动原因",
          dataIndex: "reason",
          key: "reason",
          ellipsis: true,
          width: 100
        },
        {
          title: "生效日期",
          dataIndex: "effectiveDate",
          key: "effectiveDate",
          ellipsis: true,
          width: 150
        }
      ],
      rankQuery:{
        userId:this.policeId,
        type:1
      },
      rankData: (parameter) => {
        const requestParameters = Object.assign({}, parameter, this.rankQuery)
        return this.$api.personAdminService.getRankPostHistory(requestParameters)
          .then(res => {
            res.data.data.list.map((i,k)=>i.key=k+1)
            return res.data
          })
      },
      postColumns:[
        {
          title: "序号",
          dataIndex: "key",
          key: "key",
          width: 60,
        },
        {
          title: "组织",
          dataIndex: "organizationName",
          key: "organizationName",
          ellipsis: true,
          width: 150
        },
        {
          title: "岗位",
          dataIndex: "currentRank",
          key: "currentRank",
          ellipsis: true,
          width: 100,
        },
        {
          title: "调动原因",
          dataIndex: "reason",
          key: "reason",
          ellipsis: true,
          width: 200,
        },
        {
          title: "生效日期",
          dataIndex: "effectiveDate",
          key: "effectiveDate",
          ellipsis: true,
          width: 100
        }
      ],
      postQuery:{
        userId:this.policeId,
        type:2
      },
      postData:(parameter) => {
        const requestParameters = Object.assign({}, parameter, this.postQuery)
        return this.$api.personAdminService.getRankPostHistory(requestParameters)
          .then(res => {
            res.data.data.list.map((i,k)=>i.key=k+1)
            return res.data
          })
      },
      professionColumns:[
        {
          title: "序号",
          dataIndex: "key",
          key: "key",
          width: 60,
        },
        {
          title: "专业技术任职资格",
          dataIndex: "qualification",
          key: "qualification",
          ellipsis: true,
          width: 150
        },
        {
          title: "资格审批单位",
          dataIndex: "approvalUnit",
          key: "approvalUnit",
          ellipsis: true,
          width: 100,
        },
        {
          title: "获得资格日期",
          dataIndex: "acquireDate",
          key: "acquireDate",
          ellipsis: true,
          width: 100
        }
      ],
      proferssPara:{
        userId:undefined
      },
      professionData:(parameter) => {
        const requestParameters = Object.assign({}, parameter, this.proferssPara)
        return this.$api.personAdminService.getPersonProfession(requestParameters)
          .then(res => {
            res.data.data.list.map((i,k)=>i.key=k+1)
            return res.data
          })
      },
      selectedCredRowKeys: [],
      selectedCredRows: [],
        form:{
            learningName:'',
            startTime:'',
            endTime:'',
            classHour:'',
            learningStyle:'',
            learningContent:''
        },
        rules:{
            learningName:[{ required: true, message: '请输入培训名称', trigger: 'blur' }],
            time:[{ required: true, message: '请选择日期', trigger: 'change' }],
            learningStyle:[{ required: true, message: '请选择培训方式', trigger: 'change'}]
        },
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
    };
  },
  created(){
    this.rankQuery.userId = this.policeId || this.user.id
    this.postQuery.userId = this.policeId || this.user.id
    this.proferssPara.userId = this.policeId || this.user.id
    
  },
  methods: {
    
    onCredSelectChange(selectedRowKeys, selectedRows) {
      this.selectedCredRowKeys = selectedRowKeys;
      this.selectedCredRows = selectedRows;
    },
    onEqupSelectChange(selectedRowKeys, selectedRows) {
      this.selectedEqupRowKeys = selectedRowKeys;
      this.selectedEqupRows = selectedRows;
    },

    // 开始时间和结束时间
    onChange() {
    },

    // 点击完成
    submit(){

    },
    // 点击删除人员
    confirm() {
        this.$message.success('删除成功');
    },
    cancel() {
        this.$message.error('已取消删除');
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    //导出Excel
    exportToExcel() {
      // let requestParameters = {
      //   currentPage: 1,
      //   pageSize: 99999,
      // };
      // requestParameters = Object.assign({}, requestParameters, this.queryParam);
      // this.$api.overTimeService.statistics(requestParameters).then((res) => {
        // if (res.data.data.list.length > 0) {
        //   res.data.data.list.map((i, k) => (i.key = k + 1));
        //   const ReqDetailList = res.data.data.list;
        //   const columns = this.scheduleColumns; // 表头数据
        //   const option = {};
        //   option.fileName = "excel";
        //   option.datas = [
        //     {
        //       sheetData: ReqDetailList.map((item) => {
        //         const result = {};
        //         columns.forEach((c) => {
        //           result[c.dataIndex] = item[c.dataIndex];
        //         });
        //         return result;
        //       }),
        //       sheetName: "加班请假统计表", // Excel文件名称
        //       sheetFilter: columns.map((item) => item.dataIndex),
        //       sheetHeader: columns.map((item) => item.title),
        //       columnWidths: columns.map(() => 5),
        //     },
        //   ];
        //   const toExcel = new ExportJsonExcel(option);
        //   toExcel.saveExcel();
        // } else {
        //   this.$message.warning("没有可以导出的数据");
        // }
      // });
    },
  },
  filters: {
    stateFilter(status) {
      const statusMap = {
        '0':'初始职级',
        '1': '晋升',
        '2': '降级'
      };
      return statusMap[status];
    },
  },
  computed: {
    ...mapState("setting", ["theme", "pageMinHeight"]),
    ...mapGetters("account", ["user"]),
    rowCredSelection() {
      return {
        selectedRowKeys: this.selectedCredRowKeys,
        onChange: this.onCredSelectChange,
      };
    },
    rowEqupSelection() {
      return {
        selectedRowKeys: this.selectedEqupRowKeys,
        onChange: this.onEqupSelectChange,
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
.submitBtn{
    width: 100%;
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
}
</style>