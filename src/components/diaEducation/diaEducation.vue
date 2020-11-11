<template>
  <div>
    <a-card :bordered="false">
            <a-row :gutter="24">
                <a-col :xl="8">
                    <ant-tree 
                        :allowEdit="false" 
                        :allowReload="true"
                        :allowSearch="true"
                        @loadTreeNode="loadTreeNode">
                    </ant-tree>
                </a-col>
                <a-col :xl="16">
                    <a-row :gutter="24">
                        <a-col :span="19">
                            <a-input
                                v-model="searchVal"
                                placeholder="请输入搜索内容"
                                class="searchInput"
                            />
                        </a-col>
                        <a-col :span="5">
                            <a-button type="primary" @click="onSearch">
                                 查询
                            </a-button>
                        </a-col>
                    </a-row>
                    <s-table
                        ref="table"
                        rowKey="key"
                        :alert="true"
                        :columns="scheduleColumns"
                        :data="loadScheduleData"
                        :rowSelection="rowSelection"
                        :scroll="{y:300}"
                        :showPagination="true">
                    </s-table>
                </a-col>
            </a-row>
        </a-card>
  </div>
</template>

<script>
import sTable from '@/components/Table_/'
import antTree from '@/components/tree_/Tree'
export default {
  name: 'Step1',
  components:{
    antTree,
    sTable
  },
  data(){
    return{
      loading:false,
      scheduleColumns: [
          {
              title: '姓名',
              dataIndex: 'name',
              key: 'name',
              width: 50,
          },
          {
              title: '辅警编号',
              dataIndex: 'number',
              key: 'number',
              width: 60,
          },
          {
              title: '岗位',
              dataIndex: 'postName',
              key: 'postName',
              width: 60,
          },
          {
              title: '所属组织',
              dataIndex: 'organizationName',
              key: 'organizationName',
              width: 80,
          }
      ],
      // 查询条件参数
      queryParam: {
          organizationId:'',
          search:''
      },
      loadScheduleData: params => {
        let param = Object.assign(params,this.queryParam)
        return this.$api.auxiliaryPoliceService.getAuxiliaryPoliceData(param).then((res)=>{
        //   this.tableData=res.data.data.list;
        //   res.data.data.list=res.data.data.list.filter(x=>!this.rightColumnsData.some(i=>i.id===x.id))
            res.data.data.list.map((i,k)=>{
                i.key=k+1
            })
          return res.data
        })
      },
      searchVal:"",
      selectedRowKeys: [],
      selectedRows: [],
    }
  },
  methods: {
    nextStep () {
      this.$emit('nextStep')
    },
    // 搜索
    onSearch(){
        this.queryParam.search = this.searchVal
        this.$refs.table.refresh(true)
    },
    // 获取多选的数据
    onSelectChange (selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
    },
    // 选中树节点
    loadTreeNode(data){
        this.queryParam.organizationId = data.id
    },
    // 点击提交时
    onOk() {
        this.$emit("getSelectData",this.selectedRowKeys)
    },
    onCancel () {
      return new Promise(resolve => {
        resolve(true)
      })
    },
  },
  computed:{
      rowSelection () {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
  }
}
</script>

<style scoped lang="less">
  .searchInput{
        margin-bottom: 24px;
    }
    
</style>
