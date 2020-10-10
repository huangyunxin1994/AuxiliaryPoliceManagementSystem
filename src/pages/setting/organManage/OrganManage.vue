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
                        <a-col :md="10" :lg="8" :xl="7" :xxl="6">
                            <ant-input placeHolder="请输入要搜索的内容">
                            </ant-input>
                        </a-col>
                        <a-col :md="10" :lg="8" :xl="7" :xxl="6">
                            <a-select default-value="lucy" style="width: 100%" @change="handleChange">
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
                    </a-row>
                    <ant-table 
                        :columns="columns" :dataSource="data" 
                        :bordered="true" :loading="loading" 
                        :pagination="{ pageSize: 50 }" :scroll="{ y: 500 }"
                    >
                    </ant-table>
                </a-col>
            </a-row>
       </a-card>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import AntTable from '@/components/table/StandardTable'
  import AntTree from '@/components/tree_/Tree'
  import AntInput from '@/components/input/Input'
  import TaskForm from '@/components/TaskForm'
  const columns = [
  {
    title: '账号',
    dataIndex: 'name',
    key: 'name',
    scopedSlots: { customRender: 'name' },
  },
  {
    title: '姓名',
    dataIndex: 'age',
    key: 'age',
    width: 80,
  },
  {
    title: '警员编号',
    dataIndex: 'address',
    key: 'address 1',
    ellipsis: true,
  },
  {
    title: '组织',
    dataIndex: 'address',
    key: 'address 2',
    ellipsis: true,
  },
  {
    title: '岗位',
    dataIndex: 'address',
    key: 'address 3',
    ellipsis: true,
  },
  {
    title: '联系号码',
    dataIndex: 'address',
    key: 'address 4',
    ellipsis: true,
  },
];

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park, New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 2 Lake Park, London No. 2 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park, Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
  {
    key: '4',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park, New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '5',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 2 Lake Park, London No. 2 Lake Park',
    tags: ['loser'],
  },
  {
    key: '6',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park, Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
  {
    key: '7',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park, New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '8',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 2 Lake Park, London No. 2 Lake Park',
    tags: ['loser'],
  },
  {
    key: '9',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park, Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
  {
    key: '10',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park, New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '11',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 2 Lake Park, London No. 2 Lake Park',
    tags: ['loser'],
  },
  {
    key: '12',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park, Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
  {
    key: '13',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park, New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '14',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 2 Lake Park, London No. 2 Lake Park',
    tags: ['loser'],
  },
  {
    key: '15',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park, Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
  {
    key: '16',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park, New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '17',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 2 Lake Park, London No. 2 Lake Park',
    tags: ['loser'],
  },
  {
    key: '18',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park, Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
];
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
    i18n: require('./i18n'),
    components:{
        AntTable,
        AntTree,
        AntInput,
        TaskForm
    },
    data() {
      return {
          openKeys: ['key-01'],
          columns,
          data,
          tree,
          loading:false,
      }
    },
    methods:{
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
            var promise = new Promise(function (resolve, reject) {
                var a = 1
                if (a == 1) {
                    resolve(a)
                } else {
                    reject('err')
                }
            })
            promise.then(function (value) {
                console.log(value);
            }).catch(function (error) {
                console.log(error);
            })
            this.$dialog(TaskForm,
            // component props
            {
            record: params,
            fn:promise,
            on: {
                ok (e) {
                    e.handleDestroy()
                    console.log('ok 回调')
                },
                cancel (e) {
                    e.handleDestroy()
                    console.log('cancel 回调')
                },
                close (e) {
                    e.handleDestroy()
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
                ok (e) {
                    e.handleDestroy()
                    console.log('ok 回调')
                },
                cancel (e) {
                    e.handleDestroy()
                    console.log('cancel 回调')
                },
                close (e) {
                    e.handleDestroy()
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
        }
    },
    computed: {
      ...mapState('setting', ['pageMinHeight']),
      desc() {
        return this.$t('description')
      }
    }
  }
</script>

<style scoped lang="less">
@import "index";
</style>
