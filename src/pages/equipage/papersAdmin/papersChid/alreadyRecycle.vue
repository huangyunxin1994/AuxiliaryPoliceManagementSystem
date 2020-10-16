<template>
    <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
        <a-card :bordered="false">
            <a-row :gutter="24">
                <a-col :md="24" :lg="24" :xl="24" :xxl="24">
                    <a-row :gutter="24">
                        <a-col :sm="24" :md="10" :lg="8" :xl="5" :xxl="6" >
                            <span style="width:100px">关键词搜索：</span>
                            <a-input style="width: calc(100% - 100px);margin-bottom: 24px" placeHolder="请输入要搜索的内容"/>
                        </a-col>
                        <a-col :sm="24" :md="12"  :lg="12" :xl="8" :xxl="5" >
                            <span style="width: 100px">组织：</span>
                            <a-tree-select
                                v-model="value"
                                style="width: calc(100% - 100px);margin-bottom: 24px"
                                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                                :tree-data="tree"   
                                :allowClear="true"
                                :replaceFields="replaceFields"
                                placeholder="请选择组织"
                                tree-default-expand-all
                            >
                            </a-tree-select>
                        </a-col>
                        <a-col :sm="24" :md="12" :lg="12" :xl="8" :xxl="6" style="margin-bottom: 24px">
                            <span style="width:100px">配发日期：</span>
                            <a-date-picker @change="onChange" />
                        </a-col>
                        <a-col :sm="24" :md="12" :lg="12" :xl="8" :xxl="6" style="margin-bottom: 24px">
                            <span style="width:100px">回收日期：</span>
                            <a-date-picker @change="onChange" />
                        </a-col>
                        <a-col :sm="24" :md="12"  :lg="12" :xl="6" :xxl="6"  style="margin-bottom: 24px" >
                          <span class="table-page-search-submitButtons" >
                            <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                            <a-button style="margin-left: 8px" @click="() => (this.queryParam = {})">重置</a-button>
                          </span>
                        </a-col>
                    </a-row>
                      <s-table
                        ref="table"
                        rowKey="key"
                        :columns="scheduleColumns"
                        :data="loadScheduleData"
                        :scroll="{y:600}"
                        showPagination="auto">
                        <template
                          slot="action"
                          slot-scope="equState">
                          <a-badge :status="equState" :text="equState | statusFilter"/>
                        </template>
                      </s-table>
                </a-col>
            </a-row>
        </a-card>
    </div>
</template>

<script>
import { mapState } from "vuex";
import STable from '@/components/Table_/'
const tree = [{
    'key': 'key-01',
    'title': '研发中心',
    'icon': 'mail',
    'count': '10',
    'scopedSlots': { title: 'custom' },
    'children': [{
      'key': 'key-01-01',
      'title': '后端组',
      'icon': null,
      'scopedSlots': { title: 'custom' },
      children: [{
        'key': 'key-01-01-01',
        'title': 'JAVA',
        'icon': null,
        'scopedSlots': { title: 'custom' },
      },
      {
        'key': 'key-01-01-02',
        'title': 'PHP',
        'icon': null,
        'scopedSlots': { title: 'custom' },
      },
      {
        'key': 'key-01-01-03',
        'title': 'Golang',
        'icon': null,
        'scopedSlots': { title: 'custom' },
      }
      ]
    }, {
      'key': 'key-01-02',
      'title': '前端组',
      'icon': null,
      'scopedSlots': { title: 'custom' },
      children: [{
        'key': 'key-01-02-01',
        'title': 'React',
        'icon': null,
        'scopedSlots': { title: 'custom' },
      },
      {
        'key': 'key-01-02-02',
        'title': 'Vue',
        'icon': null,
        'scopedSlots': { title: 'custom' },
      },
      {
        'key': 'key-01-02-03',
        'title': 'Angular',
        'icon': null,
        'scopedSlots': { title: 'custom' },
      }
      ]
    }, {
    'key': 'key-02',
    'title': '财务部',
    'icon': 'dollar',
    'scopedSlots': { title: 'custom' },
    'children': [{
        'key': 'key-02-01',
        'title': '会计核算',
        'icon': null,
        'scopedSlots': { title: 'custom' },
        }, {
        'key': 'key-02-02',
        'title': '成本控制',
        'icon': null,
        'scopedSlots': { title: 'custom' },
        }, {
        'key': 'key-02-03',
        'title': '内部控制',
        'icon': null,
        'scopedSlots': { title: 'custom' },
        'children': [{
            'key': 'key-02-03-01',
            'title': '财务制度建设',
            'icon': null,
            'scopedSlots': { title: 'custom' },
        },
        {
            'key': 'key-02-03-02',
            'title': '会计核算',
            'icon': null,
            'scopedSlots': { title: 'custom' },
        }]
    }]
  }]
  }]
export default {
    components:{
        STable
    },
    data(){
        return{
          openKeys: ['key-01'],
          loading:false,
          tree,
          value:null,
          scheduleColumns: [
            {
              title: '序号',
              dataIndex: 'key',
              key: 'key',
              width: 60,
            },
            {
              title: '姓名',
              dataIndex: 'name',
              key: 'name',
              width: 80,
            },
            {
              title: '辅警编号',
              dataIndex: 'code',
              key: 'code'
            },
            {
              title: '所属组织',
              dataIndex: 'organ',
              key: 'organ',
              width: 200,
            },
            {
              title: '配发日期',
              dataIndex: 'allotmentDate',
              key: 'allotmentDate'
            },
            {
              title: '有效期限',
              dataIndex: 'validity',
              key: 'validity'
            },
            {
              title: '回收日期',
              dataIndex: 'recycleDate',
              key: 'recycleDate'
            },
            {
              title: '证件描述',
              dataIndex: 'equContent',
              key: 'equContent',
              width: 250
            }
          ],
          
          loadScheduleData: () => {
            return new Promise(resolve => {
              resolve({
                data: [
                  {
                    key: '1',
                    account: 'admin',
                    name: '管理员',
                    code: 'FJ0584',
                    organ: '青秀区东葛路派出所',
                    allotmentDate:'2020-02-16',
                    validity:'2020-02-16',
                    recycleDate:'2020-02-16',
                    equContent:'哈哈'
                  },
                  {
                    key: '2',
                    account: 'test',
                    name: '张三',
                    code: 'FJ0585',
                    organ: '青秀区东葛路派出所',
                    date:'2020-02-16',
                    principal:'张三',
                    recycleDate:'2020-02-16',
                  }
                ],
                pageSize: 10,
                pageNo: 1,
                totalPage: 1,
                totalCount: 60 //总数
              })
            }).then(res => {
              return res
            })
          },
          replaceFields:{
            children:'children',
            title:'title',
            key:'key',
            value: 'key'
          },
          selectedRowKeys: [],
          selectedRows: [],
        }
    },
    methods:{
        // 配发日期
        handleChange(){

        },
        // 
        onChange(){

        },
    },
    filters: {
      statusFilter (status) {
        const statusMap = {
          'processing': '正常',
          'error': '异常'
        }
        return statusMap[status]
      }
    },
    computed: {
        ...mapState("setting", ["pageMinHeight"]),
        rowSelection() {
            return {
                selectedRowKeys: this.selectedRowKeys,
                onChange: this.onSelectChange,
            };
        },
    },
    
}
</script>

<style lang="less" scoped>

</style>