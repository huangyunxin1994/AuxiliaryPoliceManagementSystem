<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-card :bordered="false">
     <div class="position-and-level-title" :style="{'border-color':theme.color}">职级管理</div>
     <a-row :gutter="24">
       <a-col :span='24' style="margin-bottom: 24px" >
          <span class="table-page-search-submitButtons" >
            <a-button type="primary" icon="plus" @click="$refs.table.refresh(true)">添加职级</a-button>
            <a-button type="error" style="margin-left: 8px" icon="delete" @click="() => this.queryParam = {}">删除职级</a-button>
          </span>
        </a-col>
     </a-row>
     <a-row :gutter="24">
       <a-col :lg="4" :md="6" :xs="12" style="margin-bottom: 24px" v-for="item in levelList" :key="item.id">
          <a-card size="small" :title="'#'+item.id">
            <a slot="extra" href="#" v-show="!item.edit" @click="handEditLevel(item.id)">编辑</a>
            <a slot="extra" href="#" v-show="item.edit" @click="handEditLevel(item.id)">保存</a>
            <div v-show="!item.edit" style="width: 100%;
    height: 32px;
    padding: 6px 13px;">{{item.name}}</div>
            <a-input v-show="item.edit" v-model="item.name" placeholder="请输入职级名称" allowClear="true"/>
          </a-card>
        </a-col>
     </a-row>
     <div class="position-and-level-title" :style="{'border-color':theme.color}">岗位管理</div>
     <a-row :gutter="24">
        <a-col :md="8" :sm="24">
            <span style="width:100px">关键词搜索：</span>
            <a-input style="width: calc(100% - 100px);margin-bottom: 24px" placeHolder="请输入要搜索的内容"/>
        </a-col>
        <a-col :md="8" :sm="24">
            <span style="width:100px">状态：</span>
            <a-select default-value="lucy" style="width: calc(100% - 100px);margin-bottom: 24px" @change="handleChange">
                <a-select-option value="jack">
                    Jack
                </a-select-option>
                <a-select-option value="lucy">
                    Lucy
                </a-select-option>
                <a-select-option value="disabled" disabled>
                    Disabled
                </a-select-option>
                <a-select-option value="Yiminghe">
                    yiminghe
                </a-select-option>
            </a-select>
        </a-col>
        <a-col :md="8" :sm="24" style="margin-bottom: 24px" >
          <span class="table-page-search-submitButtons" >
            <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
            <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
          </span>
        </a-col>
    </a-row>
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
              title: '岗位名称',
              dataIndex: 'postName',
              key: 'postName',
              ellipsis: true,
            },
            {
              title: '状态',
              dataIndex: 'status',
              key: 'status',
              scopedSlots: {customRender: 'status'},
              width: 80,
            },
            {
              title: '描述',
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