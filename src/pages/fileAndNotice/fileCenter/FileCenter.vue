<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-card :bordered="false">
    <div class="table-operator" style="margin-bottom: 24px" >
        <a-button type="primary" icon="plus">新建</a-button>
        <a-dropdown v-if="selectedRowKeys.length > 0">
          <a-menu slot="overlay">
            <a-menu-item key="1"><a-icon type="delete" />删除</a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px">
            批量操作 <a-icon type="down" />
          </a-button>
        </a-dropdown>
      </div>
    <s-table
        ref="table"
        rowKey="key"
        :columns="columns"
        :data="loadData"
        :rowSelection="rowSelection"
        :scroll="{y:600,x: 1300}"
        showPagination="auto">

        <template
          slot="status"
          slot-scope="status">
          <a-badge :status="status" :text="status | statusFilter"/>
        </template>
        <span slot="name" slot-scope="text, record">
          <a @click="handleEdit (record)">{{text}}</a>
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
        columns: [
            {
              title: '序号',
              dataIndex: 'key',
              key: 'key',
              width: 60,
            },
            {
              title: '文档',
              dataIndex: 'name',
              key: 'name',
              scopedSlots: {customRender: 'name'},
              width: 300,
            },
            {
              title: '内容说明',
              dataIndex: 'remake',
              key: 'remake',
              ellipsis: true
            },
             {
              title: '发布者',
              dataIndex: 'publisher',
              key: 'publisher',
              width: 150
            },
            {
              title: '发布时间',
              dataIndex: 'releaseTime',
              key: 'releaseTime',
              width: 250
            }
          ],
      loadData: () => {
        return new Promise(resolve => {
          resolve({
            data: [
              {
                key: '1',
                name: '辅警管理系统需求文档V1.03(1).docx',
                remake: '需求文档',
                publisher: 'admin',
                releaseTime: '2020-09-29 15:04:00'
              },
              {
                key: '2',
                name: '辅警管理系统需求文档V1.03(2).docx',
                remake: '需求文档',
                publisher: 'admin',
                releaseTime: '2020-09-29 15:04:00'
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
            centered: true,
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