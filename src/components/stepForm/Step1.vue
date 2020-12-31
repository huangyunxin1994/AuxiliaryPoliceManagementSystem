<template>
  <div>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="24" :sm="24">
              <a-form-item label="模糊查询">
                <a-input
                  v-model="queryParams.search"
                  placeholder="请输入搜索内容"
                  class="searchInput"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="组织选择">
                <tree-select 
                  ref="treeSelect"
                  :value="queryParams.organizationId"
                  @handleTreeChange="handleTreeChange"
                ></tree-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
            <a-form-item label="入职日期">
                       <a-date-picker style="width: 100%" value-format="YYYY-MM-DD" v-model="queryParams.time"/>
                    </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24" style="margin-bottom:24px">
              <a-button type="primary" @click="$refs.table.refresh(true)"> 查询 </a-button>
              <a-button @click="reloadData" style="margin-left: 8px">
                重置
              </a-button>
            </a-col>
            <a-col :md="12" :sm="24">
              <s-table
                    ref="table"
                    :rowKey="(record)=>record.id"
                    :columns="leftColumns"
                    :data="leftColumnsData"
                    :rowSelection="rowSelection"
                    :scroll="{ y: 300, x: 400 }"
                    showPagination="auto"
                    size="small"
                >
                  <template slot="title" >
                      <a-row>
                          <a-col :span="12">
                              可选择人员
                          </a-col>
                          <a-col :span="12" style="text-align:right">
                              <a-button type="primary" size="small" :disabled="selectedLeftRows.length===0" @click="handleAdd">添加</a-button>
                          </a-col>
                      </a-row>
                  </template>
                </s-table>
            </a-col>
            <a-col :md="12" :sm="24">
                <a-table 
                    :rowKey="(record)=>record.id" 
                    :columns="rightColumns" 
                    :data-source="rightColumnsData" 
                    size="small" 
                     :scroll="{ y: 300, x: 400 }"
                    :pagination="false"
                    :rowSelection="rowRightSelection">
                    <template slot="title" >
                         <a-row>
                             <a-col :span="12">
                                 已选择人员
                             </a-col>
                             <a-col :span="12" style="text-align:right">
                                 <a-button type="primary" size="small" :disabled="selectedRightRows.length===0" @click="handleDel">移除</a-button>
                             </a-col>
                         </a-row>
                    </template>
                </a-table>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>
  </div>
</template>

<script>
import antTree from "@/components/tree_/Tree";
import STable from "@/components/Table_"
import treeSelect from "@/components/treeSelect/TreeSelect"
import {mapGetters} from 'vuex'
const leftTableColumns = [
  {
    title: "姓名",
    dataIndex: "name",
    key:"name",
    width: 80,
  },
  {
    title: "辅警编号",
    dataIndex: "number",
    key:"number",
    width: 80,
  },
  {
    title: "所属组织",
    dataIndex: "organizationName",
    key:"organizationName",
    // width: 300,
  },
  {
    title: "入职日期",
    dataIndex: "entryTime",
     key:"entryTime",
    // width: 300,
  },
];
const rightTableColumns = [
  {
    title: "姓名",
    dataIndex: "name",
    key:"name",
    width: 80,
  },
  {
    title: "辅警编号",
    dataIndex: "number",
     key:"number",
    width: 80,
  },
  {
    title: "所属组织",
    dataIndex: "organizationName",
    key:"organizationName",
  },
  {
    title: "入职日期",
    dataIndex: "entryTime",
     key:"entryTime",
    // width: 300,
  },
];

export default {
  name: "Step1",
  components: {
    antTree,
    STable,
    treeSelect
  },
  props:{
    filter:{
      type:Object,
      default:undefined
    }
  },
  data() {
    return {
      leftColumns: leftTableColumns,
      queryParams:{
        search:"",
        organizationId:''
      },
      leftColumnsData: params => {
        let param = Object.assign(params,this.queryParams)
        if(this.filter){
          Object.keys(this.filter).map(i => {
            param[i] = this.filter[i]
          })
        }
        return this.$api.auxiliaryPoliceService.getAuxiliaryPoliceData(param).then((res)=>{
          this.tableData=res.data.data.list;
          res.data.data.list=res.data.data.list.filter(x=>!this.rightColumnsData.some(i=>i.id===x.id))
          return res.data
        })
      },
      rightColumns: rightTableColumns,
      rightColumnsData:[],
      tableData:[],
      value: "",
      replaceFields: {
        children: "children",
        title: "title",
        key: "key",
        value: "key",
      },
      loading: false,
      searchVal: "",
      selectedLeftRowKeys: [],
      selectedLeftRows: [],
      selectedRightRowKeys: [],
      selectedRightRows:[],
      organizationId:'',//组织树选择的组织id
    };
  },
  created(){
      this.queryParams.oid = this.user.isSystem !==1 && this.user.organizationId || ""
  },
        
  methods: {
      handleAdd(){
          this.rightColumnsData=[...this.rightColumnsData,
          ...this.tableData.filter(x => this.selectedLeftRows.some(i=>i.id===x.id))]
          this.selectedLeftRows=[]
            this.selectedRightRows=[]
           this.selectedLeftRowKeys=[]
            this.selectedRightRowKeys=[]
          this.$refs.table.refresh(true)
      },
      handleDel(){
          let arr = this.rightColumnsData
          let delArr = this.selectedRightRows
          delArr.map(i=>{
               arr.splice(
                    arr.findIndex(x => i.id === x.id)
                ,1)
          })
            this.selectedLeftRows=[]
            this.selectedRightRows=[]
           this.selectedLeftRowKeys=[]
            this.selectedRightRowKeys=[]
          this.$refs.table.refresh(true)
      },
      reloadData(){
        this.queryParams={
          search:"",
          organizationId:''
        }
        this.$refs.table.refresh(true)
      },
    onSelectChange(selectedRowKeys, selectedRows) {
      
      this.selectedLeftRowKeys = selectedRowKeys;
      this.selectedLeftRows = selectedRows;
    },
    onRightSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRightRowKeys = selectedRowKeys;
      this.selectedRightRows = selectedRows;
    },
    // 获得组织选择的组织id
    handleTreeChange(obj){
      this.queryParams.organizationId = obj.val
    }
  },
  computed:{
    ...mapGetters("account", ["user"]),
      rowSelection() {
      return {
          selectedRowKeys: this.selectedLeftRowKeys ,
          selectedRows: this.selectedLeftRows ,
        onChange: this.onSelectChange,
      };
    },
    rowRightSelection(){
        return {
            selectedRowKeys: this.selectedRightRowKeys ,
        onChange: this.onRightSelectChange,
      };
    }
  }
};
</script>

<style scoped lang="less">
.searchInput {
  margin-bottom: 24px;
}
</style>
