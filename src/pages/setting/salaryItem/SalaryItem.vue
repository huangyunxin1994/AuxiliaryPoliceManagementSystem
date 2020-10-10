<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-card :bordered="false">
    <div class="table-operator" style="margin-bottom: 24px" >
        <a-button type="primary" icon="plus">新建</a-button>
        <a-button style="margin-left: 8px" icon="cloud-upload" @click="() => this.queryParam = {}">发布</a-button>
        <a-dropdown v-if="selectedRowKeys.length > 0">
          <a-menu slot="overlay">
            <a-menu-item key="1"><a-icon type="delete" />删除</a-menu-item>
            <!-- lock | unlock -->
            <a-menu-item key="2"><a-icon type="lock" />锁定</a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px">
            批量操作 <a-icon type="down" />
          </a-button>
        </a-dropdown>
      </div>
    <s-table
        ref="table"
        rowKey="key"
        :columns="scheduleColumns"
        :data="loadScheduleData"
        :rowSelection="rowSelection"
        :scroll="{y:600}"
        showPagination="auto">

        <template
          slot="status"
          slot-scope="status">
          <a-badge :status="status" :text="status | statusFilter"/>
        </template>
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit (record)">编辑</a>
          <a-divider type="vertical"/>
          <a @click="del (record)">删除</a>
        </span>
      </s-table>
    </a-card>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import STable from '@/components/Table_/'
  export default {
    name: 'OrganManage',
    components:{
        STable
    },
    data(){
      return{
        scheduleColumns: [
            {
              title: '序号',
              dataIndex: 'key',
              key: 'key',
              width: 60,
            },
            {
              title: '名称',
              dataIndex: 'name',
              key: 'name',
              width: 200,
            },
            {
              title: '说明',
              dataIndex: 'desc',
              key: 'desc',
              ellipsis: true,
            },
            {
              table: '操作',
              dataIndex: 'action',
              scopedSlots: {customRender: 'action'},
              width: 150
            }
          ],
      loadScheduleData: () => {
        return new Promise(resolve => {
          resolve({
            data: [
              {
                key: '1',
                name: '姓名',
                desc: '必填项，用户数据校验'
              },
              {
                key: '2',
                name: '辅警编号',
                desc: '必填项，用户数据校验'
              }
            ],
            pageSize: 10,
            pageNo: 1,
            totalPage: 1,
            totalCount: 10
          })
        }).then(res => {
          return res
        })
      },
      selectedRowKeys: [],
      selectedRows: [],
      }
    },
    methods:{
       onSelectChange (selectedRowKeys, selectedRows) {
          
          this.selectedRowKeys = selectedRowKeys
          this.selectedRows = selectedRows
          console.log(this.selectedRowKeys)
          console.log(this.selectedRows)
        },
        handEditLevel(id){
          console.log(id)
          this.levelList.find(i=>{
            if(i.id == id)
            i.edit = !i.edit
          })
          this.$message.info('This is a normal message');
        },
        del(row){
           this.$confirm({
            title: '警告',
            content: `真的要删除 ${row.name} 吗?`,
            okText: '删除',
            okType: 'danger',
            centered: 'true',
            cancelText: '取消',
            onOk () {
              console.log('OK')
              // 在这里调用删除接口
              return new Promise((resolve, reject) => {
                setTimeout(Math.random() > 0.5 ? resolve : reject, 1000)
              }).catch(() => console.log('Oops errors!'))
            },
            onCancel () {
              console.log('Cancel')
            }
          })
        }
    },
    filters: {
      statusFilter (status) {
        const statusMap = {
          'processing': '启用',
          'error': '禁用'
        }
        return statusMap[status]
      }
    },
    computed: {
      ...mapState('setting', ['theme','pageMinHeight']),
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
@import "../index";
</style>