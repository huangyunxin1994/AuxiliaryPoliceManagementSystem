<template>
  <div>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="24" :sm="24">
              <a-form-item label="模糊查询">
                <a-input
                  v-model="searchVal"
                  placeholder="请输入搜索内容"
                  class="searchInput"
                />
              </a-form-item>
            </a-col>
            <a-col :md="16" :sm="24">
              <a-form-item label="组织选择">
                <a-tree-select
                  v-model="value"
                  style="width: 100%"
                  :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                  :tree-data="tree"
                  :allowClear="true"
                  :replaceFields="replaceFields"
                  placeholder="请选择组织"
                  tree-default-expand-all
                >
                </a-tree-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24" style="margin-bottom:24px">
              <a-button type="primary" @click="onSearch"> 查询 </a-button>
              <a-button @click="onSearch" style="margin-left: 8px">
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
                    :scroll="{ y: 300, x: 150 }"
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
                     :scroll="{ y: 300, x: 150 }"
                    :pagination="false"
                    :rowSelection="rowRightSelection">
                    <template slot="title" >
                         <a-row>
                             <a-col :span="12">
                                 已选择选择人员
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

const leftTableColumns = [
  {
    title: "姓名",
    dataIndex: "name",
    key:"name",
    width: 100,
  },
  {
    title: "辅警编号",
    dataIndex: "number",
     key:"number",
    width: 100,
  },
  {
    title: "所属组织",
    dataIndex: "organizationName",
     key:"organizationName",
    width: 300,
  },
];
const rightTableColumns = [
  {
    title: "姓名",
    dataIndex: "name",
    key:"name",
    width: 100,
  },
  {
    title: "辅警编号",
    dataIndex: "number",
     key:"number",
    width: 100,
  },
  {
    title: "所属组织",
    dataIndex: "organizationName",
     key:"organizationName",
    width: 300,
  },
];
const tree = [
  {
    key: "key-01",
    title: "研发中心",
    icon: "mail",
    count: "10",
    scopedSlots: { title: "custom" },
    children: [
      {
        key: "key-01-01",
        title: "后端组",
        icon: null,
        scopedSlots: { title: "custom" },
        children: [
          {
            key: "key-01-01-01",
            title: "JAVA",
            icon: null,
            scopedSlots: { title: "custom" },
          },
          {
            key: "key-01-01-02",
            title: "PHP",
            icon: null,
            scopedSlots: { title: "custom" },
          },
          {
            key: "key-01-01-03",
            title: "Golang",
            icon: null,
            scopedSlots: { title: "custom" },
          },
        ],
      },
      {
        key: "key-01-02",
        title: "前端组",
        icon: null,
        scopedSlots: { title: "custom" },
        children: [
          {
            key: "key-01-02-01",
            title: "React",
            icon: null,
            scopedSlots: { title: "custom" },
          },
          {
            key: "key-01-02-02",
            title: "Vue",
            icon: null,
            scopedSlots: { title: "custom" },
          },
          {
            key: "key-01-02-03",
            title: "Angular",
            icon: null,
            scopedSlots: { title: "custom" },
          },
        ],
      },
      {
        key: "key-02",
        title: "财务部",
        icon: "dollar",
        scopedSlots: { title: "custom" },
        children: [
          {
            key: "key-02-01",
            title: "会计核算",
            icon: null,
            scopedSlots: { title: "custom" },
          },
          {
            key: "key-02-02",
            title: "成本控制",
            icon: null,
            scopedSlots: { title: "custom" },
          },
          {
            key: "key-02-03",
            title: "内部控制",
            icon: null,
            scopedSlots: { title: "custom" },
            children: [
              {
                key: "key-02-03-01",
                title: "财务制度建设",
                icon: null,
                scopedSlots: { title: "custom" },
              },
              {
                key: "key-02-03-02",
                title: "会计核算",
                icon: null,
                scopedSlots: { title: "custom" },
              },
            ],
          },
        ],
      },
    ],
  },
];
export default {
  name: "Step1",
  components: {
    antTree,
    STable
  },
  data() {
    return {
      leftColumns: leftTableColumns,
      leftColumnsData: () => {
        return new Promise((resolve) => {
          resolve({
            data: [
              {
                id: "15656",
                name: "辅警1",
                number: "FJ0584",
                organizationName: "青秀区东葛路派出所",
              },
              {
                id: "16585",
                name: "辅警2",
                number: "FJ0584",
                organizationName: "青秀区东葛路派出所",
              },
              {
                id: "15648",
                name: "辅警3",
                number: "FJ0584",
                organizationName: "青秀区东葛路派出所",
              },
              {
                id: "59542",
                name: "辅警4",
                number: "FJ0584",
                organizationName: "青秀区东葛路派出所",
              },
              {
                id: "156563",
                name: "辅警5",
                number: "FJ0584",
                organizationName: "青秀区东葛路派出所",
              },
              {
                id: "165855",
                name: "辅警6",
                number: "FJ0584",
                organizationName: "青秀区东葛路派出所",
              },
              {
                id: "156487",
                name: "辅警7",
                number: "FJ0584",
                organizationName: "青秀区东葛路派出所",
              },
              {
                id: "595428",
                name: "辅警8",
                number: "FJ0584",
                organizationName: "青秀区东葛路派出所",
              },
              {
                id: "156569",
                name: "辅警9",
                number: "FJ0584",
                organizationName: "青秀区东葛路派出所",
              },
              {
                id: "1658510",
                name: "辅警10",
                number: "FJ0584",
                organizationName: "青秀区东葛路派出所",
              }
            ],
            pageSize: 10,
            pageNo: 1,
            totalPage: 1,
            totalCount: 10,
          });
        }).then((res) => {
            this.tableData = res.data
            res.data = res.data.filter(x => !this.rightColumnsData.some(i=>i.id===x.id))
            console.log(res.data)
          return res;
        });
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
      tree,
      loading: false,
      searchVal: "",
      selectedLeftRowKeys: [],
      selectedLeftRows: [],
      selectedRightRowKeys: [],
      selectedRightRows:[]
    };
  },
  mounted(){
      
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
         console.log( this.selectedLeftRowKeys)
          this.$refs.table.refresh(true)
      },
    // 搜索
    onSearch() {
        console.log(331)
      this.leftColumnsData= () => {
        return new Promise((resolve) => {
          resolve({
            data: [
              {
                id: "56565",
                name: "辅警11",
                number: "FJ0584",
                organizationName: "青秀区东葛路派出所",
              },
              {
                id: "89898",
                name: "辅警12",
                number: "FJ0584",
                organizationName: "青秀区东葛路派出所",
              }
            ],
            pageSize: 10,
            pageNo: 1,
            totalPage: 1,
            totalCount: 10,
          });
        }).then((res) => {
            this.tableData = res.data
            res.data = res.data.filter(x => !this.rightColumnsData.some(i=>i.id===x.id))
          return res;
        });
        
      }
      
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      
      this.selectedLeftRowKeys = selectedRowKeys;
      this.selectedLeftRows = selectedRows;
      console.log(this.selectedLeftRows)
    },
    onRightSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRightRowKeys = selectedRowKeys;
      this.selectedRightRows = selectedRows;
    },
  },
  computed:{
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
