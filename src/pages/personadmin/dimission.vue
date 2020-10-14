<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
       <a-card :bordered="false">
            <a-row :gutter="24">
                <a-col :md="24" :lg="24" :xl="24" :xxl="24">
                    <a-row :gutter="24">
                        <a-col :md="6" :sm="24">
                            <span style="width:100px">关键词搜索：</span>
                            <a-input style="width: calc(100% - 100px);margin-bottom: 24px" placeHolder="请输入要搜索的内容"/>
                        </a-col>
                        <a-col :md="6" :sm="24">
                            <span style="width:100px">装备证件是否回收:</span>
                            <a-select default-value="jack" style="width: calc(100% - 200px);margin-bottom: 24px" @change="handleChange">
                                <a-select-option value="jack">
                                    全部
                                </a-select-option>
                                <a-select-option value="a">
                                    是
                                </a-select-option>
                                <a-select-option value="b">
                                    否
                                </a-select-option>
                            </a-select>
                        </a-col>
                        <a-col :md="6" :sm="24">
                            <span style="width:100px">离职生效时间:</span>
                            <a-date-picker @change="onChange" />
                        </a-col>
                        <a-col :md="6" :sm="24" style="margin-bottom: 24px" >
                          <span class="table-page-search-submitButtons" >
                            <a-button type="primary" @click="newDimission" :disabled="selectedRows.length == 0">新建离职</a-button>
                          </span>
                        </a-col>
                    </a-row>
                      <s-table
                        ref="table"
                        rowKey="key"
                        :columns="scheduleColumns"
                        :data="loadScheduleData"
                        :rowSelection="rowSelection"
                        :scroll="{y:600}"
                        showPagination="auto">
                        
                        <span slot="action" slot-scope="text, record">
                            <span>{{text==1?'已回收':'未回收'}}</span>
                            <a-divider type="vertical" v-if="text !=1" />
                            <!-- <a @click="handleEdit (record)" v-if="text !=1">修改</a> -->
                            <a-popconfirm
                                title="是否将此人员的证件装备回收状态改为“已回收”?"
                                ok-text="是"
                                cancel-text="否"
                                @confirm="confirm (record)"
                                @cancel="cancel"
                                v-if="text !=1"
                            >
                                <a href="#">修改</a>
                            </a-popconfirm>
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
    import newDimission from '@/components/diaPersonnel/newDimissionStep/StepForm'
    
    export default {
    name: 'OrganManage',
    components:{
        STable
    },
    data() {
      return {
          openKeys: ['key-01'],
          loading:false,
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
              title: '岗位',
              dataIndex: 'post',
              key: 'post',
              width: 100,
            },
            {
              title: '生效日期',
              dataIndex: 'date',
              key: 'date',
              width: 150
            },
            {
              title: '审批人',
              dataIndex: 'principal',
              key: 'principal',
              width: 100
            },
            {
              title: '证件装备回收状态',
              dataIndex: 'equState',
              key: 'equState',
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
                    date:'2020-02-16',
                    principal:'张三',
                    equState:'1'
                  },
                  {
                    key: '2',
                    account: 'test',
                    name: '李四',
                    code: 'FJ0585',
                    organ: '青秀区东葛路派出所',
                    date:'2020-02-16',
                    principal:'张三',
                    equState:'1'
                  },
                  {
                    key: '3',
                    account: 'test',
                    name: '王五',
                    code: 'FJ0585',
                    organ: '青秀区东葛路派出所',
                    date:'2020-02-16',
                    principal:'张三',
                    equState:'2'
                  },
                  {
                    key: '4',
                    account: 'test',
                    name: '张三',
                    code: 'FJ0585',
                    organ: '青秀区东葛路派出所',
                    date:'2020-02-16',
                    principal:'张三',
                    equState:'2'
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
            title: '个人岗位历史',
            width: 1000,
            centered: true,
            maskClosable: false,
            okText:"提交",
            footer:"",
            zIndex:1000
          }
        this.modal(param,option,newDimission)
      },
      handleChange(e){
          console.log(e)
      },
      // 获取多选的数据
      onSelectChange (selectedRowKeys, selectedRows) {
        
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },

      // 新建离职
      newDimission(){
        console.log(this.selectedRows)
        let param ={
            
        }
        let option = {
            title: '新建离职',
            width: 1000,
            centered: true,
            maskClosable: false,
            footer:""
          }
        this.modal(param,option,newDimission)
      },
      // 离职生效时间
      onChange(date, dateString){
          console.log(date, dateString);
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
      //修改装备状态
        confirm(e) {
            console.log(e);
            this.$message.success('修改成功');
        },
        cancel(e) {
            console.log(e);
            this.$message.error('已取消');
        },
    },
    filters: {
      equState (status) {
        const statusMap = {
          '1': '已回收',
          '2': '未回收'
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
