<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
       <a-card :bordered="false">
            <a-row :gutter="24">
                <a-col :lg="7" :xl="5" :xxl="4">
                    <ant-tree 
                      :dataSource="tree" 
                      :allowEdit="false" 
                      :allowReload="true"
                      :allowSearch="true"
                      @editTreeNode="editTreeNode" 
                      @addTreeNode="addTreeNode" 
                      @removeTreeNode="removeTreeNode">
                    </ant-tree>
                </a-col>
                <a-col :md="24" :lg="17" :xl="19" :xxl="20">
                    <a-row :gutter="24">
                        <a-col :md="8" :sm="24">
                            <span style="width:100px">关键词搜索：</span>
                            <a-input style="width: calc(100% - 100px);margin-bottom: 24px" placeHolder="请输入要搜索的内容"/>
                        </a-col>
                        <a-col :md="8" :sm="24">
                            <span style="width:100px">职级:</span>
                            <a-select default-value="jack" style="width: calc(100% - 100px);margin-bottom: 24px" @change="handleChange">
                                <!-- <a-select-option value="jack">
                                    哈哈哈
                                </a-select-option> -->
                            </a-select>
                        </a-col>
                        <a-col :md="(!advanced && 8) || 24" :sm="24">
                          <span
                            class="table-page-search-submitButtons"
                            :style="
                              (advanced && { float: 'right', overflow: 'hidden' }) || {}
                            "
                          >
                            <a-button type="primary" @click="$refs.table.refresh(true)"
                              >查询</a-button
                            >
                            <a-button
                              style="margin-left: 8px"
                              @click="() => (queryParam = {})"
                              >重置</a-button
                            >
                            <!-- <a @click="toggleAdvanced" style="margin-left: 8px">
                              {{ advanced ? "收起" : "展开" }}
                              <a-icon :type="advanced ? 'up' : 'down'" />
                            </a> -->
                          </span>
                        </a-col>
                      </a-row>
                      <div class="table-operator" style="margin-bottom: 24px">
                        <a-button type="primary" @click="changeRank" :disabled="selectedRows.length == 0">变更职级</a-button>
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
                          <a @click="handleEdit (record)">查看</a>
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
    import fromModel from '@/components/formModel/formModel'
    import diaHisRank from '@/components/diaPersonnel/history'
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
        AntTree
        
    },
    data() {
      return {
          openKeys: ['key-01'],
          tree,
          loading:false,
          // 高级搜索 展开/关闭
          advanced: false,
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
              key: 'code',
              width: 100
            },
            {
              title: '所属组织',
              dataIndex: 'organ',
              key: 'organ',
               width: 250,
            },
            {
              title: '变动前职级',
              dataIndex: 'beforeRank',
              key: 'beforeRank',
              width: 100,
            },
            {
              title: '变动类型',
              dataIndex: 'status',
              key: 'status',
              width: 150,
              scopedSlots: { customRender: 'status' }
            },
            {
              title: '当前职级',
              dataIndex: 'rank',
              key: 'rank',
              width: 100
            },
            {
              title: '变动原因',
              dataIndex: 'cause',
              key: 'cause',
              width: 100
            },
            {
              title: '生效日期',
              dataIndex: 'date',
              key: 'date',
              width: 100
            },
            {
              title: '审批人',
              dataIndex: 'principal',
              key: 'principal',
              width: 100
            },
            {
              title: '操作',
              dataIndex: 'action',
              scopedSlots: {customRender: 'action'},
              width: 150
            }
          ],
          diaColumns:[
                {
                    title: '序号',
                    dataIndex: 'key',
                    key: 'key',
                    width: 60,
                },
                {
                    title: '职级',
                    dataIndex: 'rank',
                    key: 'rank',
                    width: 80,
                },
                {
                    title: '变动类型',
                    dataIndex: 'status',
                    key: 'status',
                    width: 100,
                    scopedSlots: { customRender: 'status' }
                },
                {
                    title: '生效时间',
                    dataIndex: 'date',
                    key: 'date',
                    width: 100,
                },
                {
                    title: '变动原因',
                    dataIndex: 'cause',
                    key: 'cause',
                    width: 150,
                },
                {
                  title: '审批人',
                  dataIndex: 'principal',
                  key: 'principal',
                  width: 100
                }
          ],
          diaData:[
              {
                  key: '1',
                  rank: '阿斯顿发',
                  status: 'processing',
                  date: '2020-05-02',
                  cause: '作风优良',
                  principal:'张三'
              },
              {
                  key: '2',
                  rank: '阿斯顿发',
                  status: 'error',
                  date: '2020-05-02',
                  cause: '贪污腐败',
                  principal:'张三'
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
                    beforeRank: '哈哈',
                    status: 'processing',
                    rank:'jalsdkfj',
                    cause:'勤劳',
                    date:'2020-02-16',
                    principal:'张三'
                  },
                  {
                    key: '2',
                    account: 'test',
                    name: '李四',
                    code: 'FJ0585',
                    organ: '青秀区东葛路派出所',
                    beforeRank: '哈哈',
                    status: 'processing',
                    rank:'jalsdkfj',
                    cause:'勤劳',
                    date:'2020-02-16',
                    principal:'张三'
                  },
                  {
                    key: '3',
                    account: 'test',
                    name: '王五',
                    code: 'FJ0585',
                    organ: '青秀区东葛路派出所',
                    beforeRank: '加了斯柯达',
                    status: 'error',
                    rank:'jalsdkfj',
                    cause:'结党营私',
                    date:'2020-02-16',
                    principal:'张三'
                  },
                  {
                    key: '4',
                    account: 'test',
                    name: '张三',
                    code: 'FJ0585',
                    organ: '青秀区东葛路派出所',
                    beforeRank: '辅啊速度快放假警',
                    status: 'error',
                    rank:'jalsdkfj',
                    cause:'结党营私',
                    date:'2020-02-16',
                    principal:'张三'
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
          selectedRowKeys: [],
          selectedRows: [],
          extension:[
                {label:'姓名',name:'name',type:'input',refName:'name',placeholder:'请输入姓名',disabled:true},
                {label:'变动前职级',name:'beforeRank',type:'input',refName:'beforeRank',placeholder:'请输入变动前职级',disabled:true},
                {label:'变动后职级',name:'rank',type:'select',refName:'rank',placeholder:'请选择变动后职级'},
                {label:'变动原因',name:'cause',type:'input',refName:'cause',placeholder:'请输入变动原因'},
                {label:'生效日期',name:'date',type:'picker',refName:'date',placeholder:'请选择变动原因'}
          ],
          changeRankRules:{
            rank:[{ required: true, message: '请选择变动后职级', trigger: 'change'}],
            cause: [{ required: true, message: '请输入变动原因', trigger: 'blur'}],
            date: [{ required: true, message: '请选择生效日期', trigger: 'change' }]
          }
      }
    },
    methods:{
      handleEdit(record){
        console.log(record)
        let param ={
            diaColumns:this.diaColumns,
            diaData:this.diaData
        }
        let option = {
            title: '职级历史',
            width: 1000,
            centered: true,
            maskClosable: false,
            okText:"提交",
            footer:"",
            zIndex:1000
          }
        this.modal(param,option,diaHisRank)
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
          console.log(params)
      },
      //添加树节点
      addTreeNode(params){
          console.log(params)
      },
        //删除树节点
      removeTreeNode(params){
            console.log(params)
      },
      // 获取多选的数据
      onSelectChange (selectedRowKeys, selectedRows) {
        
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },

      // 职级变更
      changeRank(){
        console.log(this.selectedRows)
        let param ={
            formTitle:this.extension,
            rules:this.changeRankRules
        }
        let option = {
            title: '职级变更',
            width: 500,
            centered: true,
            maskClosable: false,
            okText:"提交",
          }
        this.modal(param,option,fromModel)
      },
      // 弹窗
      modal(obj,option,model){
        const defaultProps = {
          on: {
                ok () {
                    // console.log('ok 回调')
                },
                cancel () {
                    // e.handleDestroy()
                    // console.log('cancel 回调')
                },
                close () {
                    // e.handleDestroy()
                    // console.log('modal close 回调')
                }
            }
        }
        let formProps =  Object.assign(obj, defaultProps);
        console.log(formProps)
        this.$dialog(model,
          // form props 
          formProps,
          // modal props
          option
        )
      },
      toggleAdvanced() {
        this.advanced = !this.advanced;
      },
    },
    filters: {
      statusFilter (status) {
        const statusMap = {
          'processing': '晋升',
          'error': '降级'
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
@import "index";
</style>
