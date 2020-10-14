<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-card :bordered="false">
    <div class="table-operator">
        <a-button type="primary" icon="plus"  style="margin-bottom: 24px" >新建</a-button>
        <a-dropdown v-if="selectedRowKeys.length > 0">
          <a-menu slot="overlay">
            <a-menu-item key="1"><a-icon type="delete" />删除</a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px">
            批量操作 <a-icon type="down" />
          </a-button>
        </a-dropdown>
        <a-row>
            <a-col :xl="4" :lg="8" :md="10" :sm="12" :xs="12">
                <span style="width:100px">是否到期：</span>
                <a-select default-value="" style="width: calc(100% - 100px);margin-bottom: 24px" @change="handleChange">
                    <a-select-option value="">
                        全部
                    </a-select-option>
                    <a-select-option value="1">
                        是
                    </a-select-option>
                    <a-select-option value="2">
                        否
                    </a-select-option>
                </a-select>
            </a-col>
        </a-row>
      </div>
    <s-table
        ref="table"
        rowKey="key"
        :columns="scheduleColumns"
        :data="loadScheduleData"
        :rowSelection="rowSelection"
        :scroll="{y:600,x: 1300}"
        showPagination="auto">

        <template
          slot="expire"
          slot-scope="expire">
          <a-badge :status="expire==1 ? 'error' : 'processing' " :text="expire | statusFilter"/>
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
        scheduleColumns: [
            {
              title: '序号',
              dataIndex: 'key',
              key: 'key',
              width: 60,
            },
            {
              title: '公告标题',
              dataIndex: 'title',
              key: 'title',
              width: 200,
              ellipsis: true
            },
            {
              title: '发布时间',
              dataIndex: 'releaseTime',
              key: 'releaseTime',
              width: 200,
              ellipsis: true
            },
            {
              title: '到期时间',
              dataIndex: 'expireDate',
              key: 'expireDate',
              width: 200,
              ellipsis: true
            },
            {
              title: '是否到期',
              dataIndex: 'expire',
              key: 'expire',
              width: 100,
              scopedSlots: {customRender: 'expire'},
              ellipsis: true
              
            },
            {
              title: '公告内容',
              dataIndex: 'content',
              key: 'content',
              ellipsis: true
            },
            {
              title: '发布者',
              dataIndex: 'publisher',
              key: 'publisher',
              width: 200,
              ellipsis: true
              
            },
            {
              title: '附件',
              dataIndex: 'name',
              key: 'name',
              width: 300,
              ellipsis: true,
              scopedSlots: {customRender: 'name'},
            },
          ],
      loadScheduleData: () => {
        return new Promise(resolve => {
          resolve({
            data: [
              {
                key: '1',
                title: '测试',
                content: '需求文档2',
                publisher: 'admin',
                expireDate: '',
                releaseTime: '2020-09-30 09:44:16',
                expire: '2',
                name: '辅警管理系统需求文档V1.03(1).docx',
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
          '1': '是',
          '2': '否'
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