<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-card :bordered="false">
     <div class="position-and-level-title" :style="{'border-color':theme.color}">上下班时间配置</div>
     <a-row :gutter="24">
      <a-col :lg="10" :md="10" :xs="10" style="margin-bottom: 24px">
          <span style="width:100px">上午上班时间：</span>
          <a-time-picker style="width: calc(100% - 100px);margin-bottom: 24px"/>
      </a-col>
      <a-col :lg="10" :md="10" :xs="10" style="margin-bottom: 24px">
          <span style="width:100px">上午下班时间：</span>
          <a-time-picker style="width: calc(100% - 100px);margin-bottom: 24px" disabled/>
      </a-col>
      <a-col :lg="4" :md="4" :xs="4" style="margin-bottom: 24px">
        <a-checkbox>
          启用
        </a-checkbox>
      </a-col>
      <a-col :lg="10" :md="10" :xs="10" style="margin-bottom: 24px">
          <span style="width:100px">下午上班时间：</span>
          <a-time-picker style="width: calc(100% - 100px);margin-bottom: 24px" />
      </a-col>
      <a-col :lg="10" :md="10" :xs="10" style="margin-bottom: 24px">
          <span style="width:100px">下午下班时间：</span>
          <a-time-picker style="width: calc(100% - 100px);margin-bottom: 24px" disabled/>
      </a-col>
      <a-col :lg="4" :md="4" :xs="4" style="margin-bottom: 24px">
        <a-checkbox>
          启用
        </a-checkbox>
      </a-col>
     </a-row>
     <a-row :gutter="24">
       <a-col :md="12" :xs="24">
         <div class="position-and-level-title" :style="{'border-color':theme.color}">证件类型配置</div>
          <div class="table-operator" style="margin-bottom: 24px" >
            <a-button type="primary" icon="plus">新建</a-button>
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
              <a @click="handleEdit (record)">删除</a>
            </span>
          </s-table>
       </a-col>
       <a-col :md="12" :xs="24">
         <div class="position-and-level-title" :style="{'border-color':theme.color}">装备类型配置</div>
          <div class="table-operator" style="margin-bottom: 24px" >
            <a-button type="primary" icon="plus">新建</a-button>
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
              <a @click="handleEdit (record)">删除</a>
            </span>
          </s-table>
       </a-col>
     </a-row>
     
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
    data() {
      return {
        scheduleColumns: [
            {
              title: '序号',
              dataIndex: 'key',
              key: 'key',
              width: 60,
            },
            {
              title: '类型名称',
              dataIndex: 'postName',
              key: 'postName',
              ellipsis: true,
            },
            {
              title: '类型描述',
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
                postName: '辅警',
                desc: '负责协助交警管理交通',
                status: 'processing'
              },
              {
                key: '2',
                postName: '辅警内勤',
                desc: '负责协助交警管理交通事故案件',
                status: 'error'
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
      levelList:[
        { id: 1, edit:false, name: '初级'},
        { id: 2, edit:false, name: '二级'},
        { id: 3, edit:false, name: '三级'}
      ]
      }
    },
    methods:{
      handleChange(e){
        console.log(e)
      },
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
.position-and-level-title{
 
   border-style: solid;
        border-width: 5px ;
        border-top:none;
        border-right:none;
        border-bottom:none;
        color: @title-color;
        font-weight: 500;
        font-size: 16px;
        text-indent: 10px;
        margin-bottom: 24px;
}
/deep/ .ant-card-head{
  background-color: #fafafa;
}
</style>