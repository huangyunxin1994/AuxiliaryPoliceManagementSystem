<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
       <a-card :bordered="false">
            <a-row :gutter="24">
                <a-col :lg="7" :xl="5" :xxl="4">
                    <ant-tree :dataSource="tree" :allowEdit="true" @editTreeNode="editTreeNode" @addTreeNode="addTreeNode" @removeTreeNode="removeTreeNode">
                    </ant-tree>
                </a-col>
                <a-col :md="24" :lg="17" :xl="19" :xxl="20">
                    <a-row :gutter="24">
                        <a-col :md="8" :sm="24">
                            <span style="width:100px">关键词搜索：</span>
                            <a-input style="width: calc(100% - 100px);margin-bottom: 24px" placeHolder="请输入要搜索的内容"/>
                        </a-col>
                        <a-col :md="8" :sm="24">
                            <span style="width:100px">角色：</span>
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
                          <a @click="handleEdit (record)">重置密码</a>
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
  import AntTree from '@/components/tree_/Tree'
  import TaskForm from '@/components/TaskForm'
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
    name: 'OrganManage',
    components:{
        STable,
        AntTree,
        TaskForm
    },
    data() {
      return {
          openKeys: ['key-01'],
          tree,
          loading:false,
          scheduleColumns: [
            {
              title: '序号',
              dataIndex: 'key',
              key: 'key',
              width: 60,
            },
            {
              title: '账号',
              dataIndex: 'account',
              key: 'account',
              width: 100,
            },
            {
              title: '姓名',
              dataIndex: 'name',
              key: 'name',
              width: 80,
            },
            {
              title: '警员编号',
              dataIndex: 'code',
              key: 'code',
              width: 100
            },
            {
              title: '组织',
              dataIndex: 'organ',
              key: 'organ',
               width: 250,
            },
            {
              title: '岗位',
              dataIndex: 'post',
              key: 'post',
              width: 100,
            },
            {
              title: '联系电话',
              dataIndex: 'phone',
              key: 'phone',
              width: 150,
            },
            {
              title: '是否启用',
              dataIndex: 'status',
              key: 'status',
              width: 100,
              scopedSlots: { customRender: 'status' }
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
                account: 'admin',
                name: '管理员',
                code: 'FJ0584',
                organ: '青秀区东葛路派出所',
                post: '辅警',
                phone: '13584585258',
                status: 'processing'
              },
              {
                key: '2',
                account: 'test',
                name: '李四',
                code: 'FJ0585',
                organ: '青秀区东葛路派出所',
                post: '辅警',
                phone: '13584585258',
                status: 'processing'
              },
              {
                key: '3',
                account: 'test',
                name: '王五',
                code: 'FJ0585',
                organ: '青秀区东葛路派出所',
                post: '辅警',
                phone: '13584585258',
                status: 'processing'
              },
              {
                key: '4',
                account: 'test',
                name: '张三',
                code: 'FJ0585',
                organ: '青秀区东葛路派出所',
                post: '辅警',
                phone: '13584585258',
                status: 'processing'
              },
              {
                key: '5',
                account: 'test',
                name: '赵六',
                code: 'FJ0585',
                organ: '青秀区东葛路派出所',
                post: '辅警',
                phone: '13584585258',
                status: 'error'
              },
              {
                key: '6',
                account: 'test',
                name: '赵六',
                code: 'FJ0585',
                organ: '青秀区东葛路派出所',
                post: '辅警',
                phone: '13584585258',
                status: 'error'
              },
              {
                key: '7',
                account: 'test',
                name: '赵六',
                code: 'FJ0585',
                organ: '青秀区东葛路派出所',
                post: '辅警',
                phone: '13584585258',
                status: 'error'
              },
              {
                key: '8',
                account: 'test',
                name: '赵六',
                code: 'FJ0585',
                organ: '青秀区东葛路派出所',
                post: '辅警',
                phone: '13584585258',
                status: 'error'
              },
              {
                key: '9',
                account: 'test',
                name: '赵六',
                code: 'FJ0585',
                organ: '青秀区东葛路派出所',
                post: '辅警',
                phone: '13584585258',
                status: 'error'
              },
              {
                key: '10',
                account: 'test',
                name: '赵六',
                code: 'FJ0585',
                organ: '青秀区东葛路派出所',
                post: '辅警',
                phone: '13584585258',
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
      selectedRows: []
      }
    },
    methods:{
      handleEdit(record){
        console.log(record)
      },
        handleClick (e) {
            console.log('handleClick', e)
            this.queryParam = {
                key: e.key
            }
            this.$refs.table.refresh(true)
        },
        handleAdd (item) {
            console.log('add button, item', item)
            this.$message.info(`提示：你点了 ${item.key} - ${item.title} `)
            this.$refs.modal.add(item.key)
        },
        handleTitleClick (item) {
            console.log('handleTitleClick', item)
        },
        handleChange(e){
            console.log(e)
        },
        //编辑树节点
        editTreeNode(params){
            this.$dialog(TaskForm,
            // component props
            {
            record: params,
            fn:() => {
             return new Promise(resolve => {
                resolve({
                  data: [
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
            on: {
                ok () {
                    console.log('ok 回调')
                },
                cancel () {
                    console.log('cancel 回调')
                },
                close () {
                    console.log('modal close 回调')
                }
            }
            },
            // modal props
            {
            title: '编辑',
            width: 700,
            centered: true,
            maskClosable: false,
            okText:"提交",
            })
        },
        //添加树节点
        addTreeNode(params){
            this.$dialog(TaskForm,
            // component props
            {
            record: params,
            on: {
                ok () {
                    console.log('ok 回调')
                },
                cancel () {
                    console.log('cancel 回调')
                },
                close () {
                    console.log('modal close 回调')
                }
            }
            },
            // modal props
            {
            title: '新增',
            width: 700,
            centered: true,
            maskClosable: false,
            okText:"提交",
            })
        },
         //删除树节点
        removeTreeNode(params){
             console.log(params)
        },
        onSelectChange (selectedRowKeys, selectedRows) {
          
          this.selectedRowKeys = selectedRowKeys
          this.selectedRows = selectedRows
          console.log(this.selectedRowKeys)
          console.log(this.selectedRows)
        },
    },
    filters: {
      statusFilter (status) {
        const statusMap = {
          'processing': '是',
          'error': '否'
        }
        return statusMap[status]
      }
    },
    computed: {
      ...mapState('setting', ['pageMinHeight']),
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
