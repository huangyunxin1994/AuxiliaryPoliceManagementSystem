<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-card :bordered="false">
		<div class="position-and-level-title" :style="{ 'border-color': theme.color }">奖励信息</div>
		<s-table
			ref="table"
			rowKey="key"
			:columns="credColumns"
			:data="loadCredData"
			:scroll="{ y: 600, x: 650 }"
			showPagination="auto"
		>
		</s-table>
    </a-card>
    <a-card :bordered="false">
      <div class="position-and-level-title" :style="{ 'border-color': theme.color }">责任追究信息</div>
      <s-table
        ref="table"
        rowKey="key"
        :columns="dutyColumns"
        :data="dutyData"
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
      credColumns: [
        {
          title: "序号",
          dataIndex: "key",
          key: "key",
          width: 60,
        },
        {
          title: "奖励原因",
          dataIndex: "reason",
          key: "reason",
          ellipsis: true,
          width: 100,
        },
        {
          title: "奖励批准机关",
          dataIndex: "approvalAuthority",
          key: "approvalAuthority",
          ellipsis: true,
          width: 150
        },
        {
          title: "奖励批准日期",
          dataIndex: "approvalDate",
          key: "approvalDate",
          ellipsis: true,
          width: 100
        },
        {
          title: "荣誉称号授予单位",
          dataIndex: "company",
          key: "company",
          ellipsis: true,
          width: 150
        },
        {
          title: "荣誉称号级别",
          dataIndex: "honoraryTitle",
          key: "honoraryTitle",
          ellipsis: true,
          width: 150
        },
      ],
      //查询条件
      queryParam:{
        id:""
      },
      loadCredData: (params) => {
            let param = Object.assign(params,this.queryParam)
            return this.$api.rewardService.getRewardById(param).then((res)=>{
              res.data.data.count = res.data.data.list.length;
              res.data.data.currentPage = 1;
              res.data.data.list.map((i,k)=>{
                i.key=k+1
              })
              return res.data
            })
          },
      dutyColumns:[
        {
          title: "序号",
          dataIndex: "key",
          key: "key",
          width: 60,
        },
        {
          title: "原因",
          dataIndex: "reason",
          key: "reason",
          ellipsis: true,
          width: 200,
        },
        {
          title: "批准日期",
          dataIndex: "approvalDate",
          key: "approvalDate",
          ellipsis: true,
          width: 100
        },
        {
          title: "批准单位",
          dataIndex: "approvalAuthority",
          key: "approvalAuthority",
          ellipsis: true,
          width: 150
        }
      ],
      
      dutyData:(params) => {
        let param = Object.assign(params,this.queryParam)
        return this.$api.accountabilityService.getAccountabilityById(param).then((res)=>{
          res.data.data.count = res.data.data.list.length;
          res.data.data.currentPage = 1;
          res.data.data.list.map((i,k)=>{
            i.key=k+1
          })
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
    this.queryParam.id = this.policeId || this.user.id
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
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        processing: "启用",
        error: "禁用",
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