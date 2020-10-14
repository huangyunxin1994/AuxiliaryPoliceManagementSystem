<template>
  <div>
    <a-card :bordered="false">
            <a-row :gutter="24">
                <a-col :xl="8">
                    <ant-tree 
                        :dataSource="tree" 
                        :allowEdit="false" 
                        :allowReload="true"
                        :allowSearch="true">
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
  name: 'Step1',
  components:{
    antTree,
    sTable
  },
  data(){
    return{
      tree,
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
              title: '所属组织',
              dataIndex: 'organizationName',
              key: 'organizationName',
              width: 80,
          }
      ],
      // 查询条件参数
      queryParam: {},
      loadScheduleData: () => {
          return new Promise(resolve => {
          resolve({
              data: [
              {
                  key: '1',
                  name: '张三',
                  number: '123',
                  organizationName: '前端组'
              },
              {
                  key: '2',
                  name: '张三',
                  number: '123',
                  organizationName: '前端组'
              },
              {
                  key: '3',
                  name: '张三',
                  number: '123',
                  organizationName: '前端组'
              },
              {
                  key: '4',
                  name: '张三',
                  number: '123',
                  organizationName: '前端组'
              },
              {
                  key: '5',
                  name: '张三',
                  number: '123',
                  organizationName: '前端组'
              },
              {
                  key: '6',
                  name: '张三',
                  number: '123',
                  organizationName: '前端组'
              },
              {
                  key: '7',
                  name: '张三',
                  number: '123',
                  organizationName: '前端组'
              },
              {
                  key: '8',
                  name: '张三',
                  number: '123',
                  organizationName: '前端组'
              },
              {
                  key: '9',
                  name: '张三',
                  number: '123',
                  organizationName: '前端组'
              },
              {
                  key: '10',
                  name: '张三',
                  number: '123',
                  organizationName: '前端组'
              },
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
        console.log(this.searchVal)
        let data=[]
        if(this.searchVal!="")
            data = [
              {
                  key: '9',
                  name: '张三',
                  number: '123',
                  organizationName: '前端组'
              },
              {
                  key: '10',
                  name: '张三',
                  number: '123',
                  organizationName: '前端组'
              },
              ]
        else
            data = [
              {
                  key: '1',
                  name: '张三',
                  number: '123',
                  organizationName: '前端组'
              },
              {
                  key: '2',
                  name: '张三',
                  number: '123',
                  organizationName: '前端组'
              },
              {
                  key: '3',
                  name: '张三',
                  number: '123',
                  organizationName: '前端组'
              },
              {
                  key: '4',
                  name: '张三',
                  number: '123',
                  organizationName: '前端组'
              },
              {
                  key: '5',
                  name: '张三',
                  number: '123',
                  organizationName: '前端组'
              },
              {
                  key: '6',
                  name: '张三',
                  number: '123',
                  organizationName: '前端组'
              },
              {
                  key: '7',
                  name: '张三',
                  number: '123',
                  organizationName: '前端组'
              },
              {
                  key: '8',
                  name: '张三',
                  number: '123',
                  organizationName: '前端组'
              },
              {
                  key: '9',
                  name: '张三',
                  number: '123',
                  organizationName: '前端组'
              },
              {
                  key: '10',
                  name: '张三',
                  number: '123',
                  organizationName: '前端组'
              },
              ]
        this.loadScheduleData=() => {
          return new Promise(resolve => {
          resolve({
              data: data,
              pageSize: 10,
              pageNo: 1,
              totalPage: 1,
              totalCount: 10
          })
          }).then(res => {
              return res
          })
        }
        this.$refs.table.refresh(true)
    },
    // 获取多选的数据
    onSelectChange (selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
        console.log(this.selectedRows)
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
