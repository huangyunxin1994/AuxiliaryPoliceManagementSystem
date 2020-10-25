<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
       <a-card :bordered="false">
			<a-row :gutter="24">
				<a-col :lg="7" :xl="5" :xxl="4">
					<ant-tree
						:allowEdit="false" 
						:allowReload="true"
						:allowSearch="true"
						@editTreeNode="editTreeNode" 
						@addTreeNode="addTreeNode" 
						@removeTreeNode="removeTreeNode"
            @loadTreeNode="loadTreeNode">
					</ant-tree>
				</a-col>
				<a-col :md="24" :lg="17" :xl="19" :xxl="20">
					<div class="table-page-search-wrapper">
						<a-form layout="inline">
							<a-row :gutter="48">
								<a-col :md="8" :sm="24">
									<a-form-item label="关键词搜索">
										<a-input placeholder="请输入要查询的关键词" v-model="queryParam.name" />
									</a-form-item>
								</a-col>
								<a-col :md="8" :sm="24">
									<a-form-item label="职级">
                    <a-input placeholder="请输入职级" v-model="queryParam.currentRank" />
										
									</a-form-item>
								</a-col>
								<template v-if="advanced">
									<a-col :md="8" :sm="24">
										<a-form-item label="变动类型">
											<a-select default-value="" @change="handleChange" v-model="queryParam.state">
												<a-select-option value=""> 全部 </a-select-option>
												<a-select-option value="1"> 晋升 </a-select-option>
												<a-select-option value="2"> 降级 </a-select-option>
											</a-select>
										</a-form-item>
									</a-col>
								</template>
								<a-col :md="(!advanced && 8) || 24" :sm="24">
									<span
										class="table-page-search-submitButtons"
										:style="
										(advanced && { float: 'right', overflow: 'hidden' }) || {}
										">
										<a-button type="primary"  @click="$refs.table.refresh(true)">查询</a-button>
										<a-button
											style="margin-left: 8px"
											@click="resetParam"
										>重置</a-button
										>
										<a @click="toggleAdvanced" style="margin-left: 8px">
										{{ advanced ? "收起" : "展开" }}
										<a-icon :type="advanced ? 'up' : 'down'" />
										</a>
									</span>
								</a-col>
							</a-row>
						</a-form>
					</div>
					<div class="table-operator" style="margin-bottom: 24px" >
						<!-- <a-button type="primary" @click="changeRank" :disabled="selectedRows.length == 0">变更职级</a-button> -->
						<a-button type="primary" @click="changeRank" v-if="selectedRows.length != 0">变更职级</a-button>
						<!-- <a-dropdown v-if="selectedRowKeys.length > 0">
						<a-menu slot="overlay">
							<a-menu-item key="1"><a-icon type="delete" />删除</a-menu-item>
							<a-menu-item key="2"><a-icon type="lock" />锁定</a-menu-item>
						</a-menu>
						<a-button style="margin-left: 8px">
							批量操作 <a-icon type="down" />
						</a-button>
						</a-dropdown> -->
					</div>
					<s-table
						ref="table"
						rowKey="key"
						:columns="scheduleColumns"
						:data="loadScheduleData"
						:rowSelection="rowSelection"
						:scroll="{ y: 600, x: 800 }"
						showPagination="auto">
					
						<template
							slot="state"
							slot-scope="state">
              <a-badge
                :status="state == '1' ? 'success' : state == '2' ? 'error':'processing'"
                :text="state | statusFilter"
              />
						</template>
						<span slot="action" slot-scope="text, record">
							<a @click="changeOneRank(record)">续约</a>
							<a-divider type="vertical"  />
							<a @click="handleEdit (record)">查看</a>
						</span>
					</s-table>
				</a-col>
			</a-row>	
       </a-card>
  </div>
</template>

<script>
    import {mapState,mapGetters} from 'vuex'
    import STable from '@/components/Table_/'
    import AntTree from '@/components/tree_/Tree'
    import fromModel from '@/components/formModel/formModel'
    import diaHisRank from '@/components/diaPersonnel/history'
    export default {
    name: 'OrganManage',
    components:{
        STable,
        AntTree
        
    },
    data() {
      return {
          openKeys: ['key-01'],
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
              dataIndex: 'policeName',
              key: 'policeName',
              width: 80,
            },
            {
              title: '辅警编号',
              dataIndex: 'number',
              key: 'number',
              width: 100
            },
            {
              title: '所属组织',
              dataIndex: 'organizationName',
              key: 'organizationName',
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
              dataIndex: 'state',
              key: 'state',
              width: 150,
              scopedSlots: { customRender: 'state' }
            },
            {
              title: '当前职级',
              dataIndex: 'currentRank',
              key: 'currentRank',
              width: 100
            },
            {
              title: '变动原因',
              dataIndex: 'reason',
              key: 'reason',
              width: 100
            },
            {
              title: '生效日期',
              dataIndex: 'effectiveDate',
              key: 'effectiveDate',
              width: 100
            },
            {
              title: '审批人',
              dataIndex: 'approvedBy',
              key: 'approvedBy',
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
                    dataIndex: 'currentRank',
                    key: 'currentRank',
                    width: 80,
                },
                {
                    title: '变动类型',
                    dataIndex: 'state',
                    key: 'state',
                    width: 100,
                    scopedSlots: { customRender: 'state' }
                },
                {
                    title: '生效时间',
                    dataIndex: 'effectiveDate',
                    key: 'effectiveDate',
                    width: 100,
                },
                {
                    title: '变动原因',
                    dataIndex: 'reason',
                    key: 'reason',
                    width: 150,
                },
                {
                  title: '审批人',
                  dataIndex: 'approvedBy',
                  key: 'approvedBy',
                  width: 100
                }
          ],
          // 查询条件参数
          queryParam: {
            name: "",
            state: "",
            currentRank:'',
            organizationId:'',
            search:'',
            type:1,
			oid:'',
          },
          loadScheduleData: (params) => {
			this.queryParam.oid = this.user.organizationId
            let param = Object.assign(params,this.queryParam)
            return this.$api.personAdminService.getRankList(param).then((res)=>{
              console.log(res)
              res.data.data.list.map((i,k)=>{
                i.key=k+1
              })
              return res.data
            })
          },
          selectedRowKeys: [],
          selectedRows: [],
          extension:[
                {label:'姓名',name:'policeName',type:'text',refName:'name',placeholder:'请输入姓名',disabled:true},
                {label:'变动前职级',name:'beforeRank',type:'text',refName:'beforeRank',placeholder:'请输入变动前职级',disabled:true},
                {label:'变动后职级',name:'currentRank',type:'input',refName:'rank',placeholder:'请选择变动后职级'},
                {label:'变动原因',name:'reason',type:'input',refName:'cause',placeholder:'请输入变动原因'},
                {label:'生效日期',name:'effectiveDate',type:'picker',refName:'date',placeholder:'请选择变动原因'}
          ],
          changeRankRules:{
            currentRank:[{ required: true, message: '请选择变动后职级', trigger: 'change'}],
            reason: [{ required: true, message: '请输入变动原因', trigger: 'blur'}],
            effectiveDate: [{ required: true, message: '请选择生效日期', trigger: 'change' }]
          }
      }
    },
    methods:{
      handleEdit(record){
        console.log(record)
        let param ={
            diaColumns:this.diaColumns,
            person:record
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
        console.log(this.selectedRowKeys)
        console.log(this.selectedRows)
      },
      // 选中树节点
      loadTreeNode(data){
        this.queryParam.organizationId = data.id
        this.$refs.table.refresh(true)
      },

      // 职级变更
      changeRank(){
        console.log(this.selectedRows)
        let param ={
            formTitle:this.extension,
            rules:this.changeRankRules,
            record:{}
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
		// 变更单个直接
		changeOneRank(e){
			let param ={
				formTitle:this.extension,
				rules:this.changeRankRules,
				record:e
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
      /**
     * 重置查询参数
     */
      resetParam() {
        this.queryParam= {
            name: "",
            state: "",
            currentRank:'',
            organizationId:'',
            search:'',
            type:1
        },
        this.$refs.table.refresh(true)
      },
    },
    filters: {
      statusFilter (status) {
        const statusMap = {
          '0':'初始职级',
          '1': '晋升',
          '2': '降级'
        }
        return statusMap[status]
      }
    },
    computed: {
      ...mapState('setting', ['pageMinHeight']),
		...mapGetters("account",["user"]),// 获取登录者信息
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
