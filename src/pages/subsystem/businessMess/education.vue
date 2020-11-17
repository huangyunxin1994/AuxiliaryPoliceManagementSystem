<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-card :bordered="false">
		<div class="position-and-level-title" :style="{ 'border-color': theme.color }">培训记录</div>
		
		<s-table
			ref="table"
			rowKey="key"
			:columns="credColumns"
			:data="loadCredData"
			:scroll="{ y: 600, x: 650 }"
			showPagination="auto"
		>
    <template slot="learningStyle" slot-scope="learningStyle">
          <span>{{learningStyle | eduFilter}}</span>
        </template>
        <template slot="state" slot-scope="state">
            <a-badge
              :status="state == '1' ? 'success' : (state == '2' ? 'processing' : (state == '3' ? 'error' : ''))"
              :text="state | statusFilter(state)"
            />
        </template>
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
          title: "开始时间",
          dataIndex: "startTime",
          key: "startTime",
          ellipsis: true,
          width: 100,
        },
        {
          title: "结束时间",
          dataIndex: "endTime",
          key: "endTime",
          ellipsis: true,
          width: 150
        },
        {
          title: "培训结果",
          dataIndex: "state",
          key: "state",
          scopedSlots: { customRender: "state" },
          ellipsis: true,
          width: 150
        },
        {
          title: "总学时",
          dataIndex: "classHour",
          key: "classHour",
          ellipsis: true,
          width: 100
        },
        {
          title: "培训方式",
          dataIndex: "learningStyle",
          key: "learningStyle",
          scopedSlots: { customRender: "learningStyle" },
          ellipsis: true,
          width: 100
        },
        {
          title: "创建人",
          dataIndex: "creator",
          key: "creator",
          ellipsis: true,
          width: 150
        },
        {
          title: "培训内容说明",
          dataIndex: "learningContent",
          key: "learningContent",
          ellipsis: true,
          width: 200
        },
      ],
      queryParam:{
        policeId:undefined,
        search:undefined
      },
      loadCredData: (params) => {
        let param = Object.assign(params,this.queryParam)
        return this.$api.trainService.getEducationDetailsByAux(param).then((res)=>{
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
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
    };
  },
  created(){
    this.queryParam.policeId = this.policeId || this.user.id
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

    
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    resetParam(){
      this.queryParam.search = undefined
      this.$refs.table.refresh()
    },
  },
  filters: {
    eduFilter(edu) {
      const statusMap = {
            "1":'不脱岗 ' ,
            "2":'脱岗' ,
      };
      return statusMap[edu];
    },
    statusFilter(status) {
      const statusMap = {
        1: "优秀",
        2: "良好",
        3: "不及格"
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