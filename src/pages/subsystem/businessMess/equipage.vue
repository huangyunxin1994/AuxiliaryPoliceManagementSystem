<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-card :bordered="false">
		<div class="position-and-level-title" :style="{ 'border-color': theme.color }">证件信息 </div>
		
		<s-table
			ref="paperTable"
			rowKey="key"
			:columns="credColumns"
			:data="loadCredData"
			:scroll="{ y: 600, x: 650 }"
			showPagination="auto"
		>
      <template
        slot="state"
        slot-scope="state">
        <a-badge
          :status="state == '1' ? 'processing' : 'error'"
          :text="state | statusFilter"
        />
      </template>
		</s-table>
    </a-card>
    <a-card :bordered="false">
      <div class="position-and-level-title" :style="{ 'border-color': theme.color }">装备信息</div>
      
      <s-table
        ref="equTable"
        rowKey="key"
        :columns="dutyColumns"
        :data="dutyData"
        :scroll="{ y: 600, x: 650 }"
        showPagination="auto"
      >
        <template
          slot="state"
          slot-scope="state">
          <a-badge
            :status="state == '1' ? 'processing' : 'error'"
            :text="state | statusFilter"
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
          title: "配发日期",
          dataIndex: "allotmentDate",
          key: "allotmentDate",
          ellipsis: true,
          width: 100,
        },
        {
          title: "有效日期  ",
          dataIndex: "termValidity",
          key: "termValidity",
          ellipsis: true,
          width: 150
        },
        {
          title: "状态",
          dataIndex: "state",
          key: "state",
          ellipsis: true,
          width: 100,
          scopedSlots: { customRender: 'state' }
        },
        {
          title: "证件类型",
          dataIndex: "cqName",
          key: "cqName",
          ellipsis: true,
          width: 150
        },
      ],
      queryParam:{
          userId:undefined,
          type:1,
          name:undefined
      },
      loadCredData: (params) => {
        let param = Object.assign(params,this.queryParam)
        return this.$api.certEquipService.getCertEqup(param).then((res)=>{
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
          title: "配发日期",
          dataIndex: "allotmentDate",
          key: "allotmentDate",
          ellipsis: true,
          width: 200,
        },
        {
          title: "有效日期",
          dataIndex: "termValidity",
          key: "termValidity",
          ellipsis: true,
          width: 100
        },
        {
          title: "状态",
          dataIndex: "state",
          key: "state",
          ellipsis: true,
          width: 100,
          scopedSlots: { customRender: 'state' }
        },
        {
          title: "装备类型",
          dataIndex: "cqName",
          key: "cqName",
          ellipsis: true,
          width: 150
        }
      ],
      equParam:{
        userId:undefined,
        type:2,
        name:undefined
      },
      dutyData:(params) => {
        let param = Object.assign(params,this.equParam)
        return this.$api.certEquipService.getCertEqup(param).then((res)=>{
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
    this.queryParam.userId = this.policeId || this.user.id
    this.equParam.userId = this.policeId || this.user.id
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
    // 重置
    resetParam(data){
      if(data == 'paperTable'){//证件
        this.queryParam.name = undefined
        this.$refs.paperTable.refresh()
      }else{
        this.equParam.name = undefined
        this.$refs.equTable.refresh()
      }
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: "已发放",
        2: "已回收",
        3: "逾期未回收",
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