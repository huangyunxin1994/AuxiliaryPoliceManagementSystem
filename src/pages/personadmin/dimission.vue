<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
       <a-card :bordered="false">
			<div class="table-page-search-wrapper">
				<a-form layout="inline">
					<a-row :gutter="48">
						<a-col :md="8" :sm="24">
							<a-form-item label="关键词搜索">
								<a-input placeholder="请输入要查询的关键词" v-model="queryParam.name"/>
							</a-form-item>
						</a-col>
						<a-col :md="8" :sm="24">
							<a-form-item label="装备证件是否回收">
								<a-select default-value=""  v-model="queryParam.state">
									<a-select-option value=""> 全部： </a-select-option>
									<a-select-option value="1"> 已回收 </a-select-option>
									<a-select-option value="2"> 未回收 </a-select-option>
								</a-select>
							</a-form-item>
						</a-col>
						<template v-if="advanced">
							<a-col :md="8" :sm="24">
								<a-form-item label="离职生效时间">
									<a-date-picker @change="onChange" />
								</a-form-item>
							</a-col>
						</template>
						<a-col :md="(!advanced && 8) || 24" :sm="24">
							<span
								class="table-page-search-submitButtons"
								:style="
								(advanced && { float: 'right', overflow: 'hidden' }) || {}
								">
								<a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
								<a-button
									style="margin-left: 8px"
									@click="() => (queryParam = {})"
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
			<div class="table-operator" style="margin-bottom: 24px">
				<a-button type="primary" icon="plus" @click="newDimission">新建离职</a-button>
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
				:rowKey="(record) => record.id"
				:columns="scheduleColumns"
				:data="loadScheduleData"
				:rowSelection="rowSelection"
				:scroll="{ y: 600, x: 800 }"
				showPagination="auto">
				<span slot="action" slot-scope="text, record">
					<span>{{text==1?'已回收':'未回收'}}</span>
					<a-divider type="vertical" v-if="text !=1" />
					<a @click="confirm (record)" v-if="text !=1">修改</a>
					<!-- <a-popconfirm
						title="是否将此人员的证件装备回收状态改为“已回收”?"
						ok-text="是"
						cancel-text="否"
						@confirm="confirm (record)"
						@cancel="cancel"
						v-if="text !=1"
					>
						<a href="#">修改</a>
					</a-popconfirm> -->
				</span>
			</s-table>
       </a-card>
      <form-step ref="modal" title="新增离职" formTitleName="name" :formTitle="formTitle" :rules="rules" :stepTitle="stepTitle" :submitFun="submitFun"></form-step>
  </div>
</template>

<script>
    import {mapState,mapGetters} from 'vuex'
    import STable from '@/components/Table_/'
    // import newDimission from '@/components/diaPersonnel/newDimissionStep/StepForm'
    import formStep from "@/components/stepForm/StepForm";
    
    export default {
    name: 'OrganManage',
    components:{
        STable,
        formStep
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
              title: '离职创建时间',
              dataIndex: 'createTime',
              key: 'createTime',
              width: 200,
            },
            {
              title: '离职生效日期',
              dataIndex: 'effectiveDate',
              key: 'effectiveDate',
              width: 150
            },
            {
              title: '离职离职原因',
              dataIndex: 'reason',
              key: 'reason',
              width: 200
            },
            {
              title: '审批人',
              dataIndex: 'approval',
              key: 'approval',
              width: 100
            },
            {
              title: '证件装备回收状态',
              dataIndex: 'recoveryStatus',
              key: 'recoveryStatus',
              scopedSlots: {customRender: 'action'},
              width: 150
            }
          ],
          // 查询条件参数
          queryParam: {
            name: "",
            time:'',
            state:'',
			oid:''
          },
          loadScheduleData: (params) => {
			this.queryParam.oid = this.user.organizationId
            let param = Object.assign(params,this.queryParam)
            return this.$api.personAdminService.getDimissionList(param).then((res)=>{
              console.log(res)
              res.data.data.list.map((i,k)=>{
                i.key=k+1
              })
              return res.data
            })  
          },
          selectedRowKeys: [],
          selectedRows: [],
          // 高级搜索 展开/关闭
          advanced: false,
          formTitle:[
            {
              label: "姓名",
              name: "name",
              type: "text",
              placeholder: "请输入所在单位"
            },
            {
              label: "离职生效日期",
              name: "effectiveDate",
              type: "pickerDate",
              placeholder: "请选择离职生效日期"
            },
            {
              label: "离职原因",
              name: "reason",
              type: "textarea",
              placeholder: "请输入离职原因"
            }
          ],
          rules:{
            name: [
              { required: false, message: "请输入名字", trigger: "blur"},
            ],
            effectiveDate: [
              { required: true, message: "请选择离职生效日期", trigger: "change" },
            ],
            reason: [{ required: true, message: "请输入离职原因", trigger: "blur" }],
          },

          stepTitle:[{title:'选择人员'},{title:'填写离职信息'}],

          submitFun:(params)=>{
            let queryParam = {
              approval:this.user.name
            }
            let param = Object.assign(params,queryParam)
            return this.$api.personAdminService.addDimission(param).then((res)=>{
              this.$refs.table.refresh(false)
              return res.data
            })
          },
      }
    },
    methods:{
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
        this.$refs.modal.visible=true
      },
      // 离职生效时间
      onChange(date, dateString){
          console.log(date, dateString);
          this.queryParam.time = dateString
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
          const _this = this;
          this.$confirm({
            title: "警告",
            content: `是否将此人员的证件装备回收状态改为“已回收”?`,
            okText: "是",
            okType: "danger",
            centered: true,
            cancelText: "否",
            onOk() {
              console.log(_this);
              let param = {
                id:e.id,
                state:1
              }
              _this.$api.personAdminService.putDimission(param).then((res)=>{
                console.log(res)
                if(res.data.code == 0){
                  _this.$message.success('修改成功');
                  _this.$refs.table.refresh(true)
                }else{
                  _this.$message.error('修改失败，请重试');
                }
              })
            },
            onCancel() {},
          });
      },
      cancel(e) {
          console.log(e);
          this.$message.error('已取消');
      },
      toggleAdvanced() {
        this.advanced = !this.advanced;
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
