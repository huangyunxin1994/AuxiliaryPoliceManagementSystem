<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
       <a-card :bordered="false">
            <a-row :gutter="24">
                <a-col :lg="7" :xl="5" :xxl="4">
                    <ant-tree 
                      :allowEdit="false" 
                      :allowReload="true"
                      :allowSearch="true"
                      @loadTreeNode="loadTreeNode"
                      @editTreeNode="editTreeNode" 
                      @addTreeNode="addTreeNode" 
                      @removeTreeNode="removeTreeNode">
                    </ant-tree>
                </a-col>
                <a-col :md="24" :lg="17" :xl="19" :xxl="20">
					<div class="table-page-search-wrapper">
						<a-form layout="inline">
							<a-row :gutter="48">
								<a-col :md="8" :sm="24">
									<a-form-item label="关键词搜索">
										<a-input placeholder="请输入要查询的关键词" v-model="queryParam.name"/>
									</a-form-item>
								</a-col>
								<a-col :md="8" :sm="24">
									<a-form-item label="岗位">
										<!-- <a-input placeholder="请输入岗位" v-model="queryParam.currentRank" /> -->
                    <a-select  v-model="queryParam.currentRank" style="width: 100%">
                          <a-select-option value=""> 全部 </a-select-option>
                          <a-select-option :value="item.name" v-for="item in postList" :key="item.name"> {{item.name}} </a-select-option>
                        </a-select>
									</a-form-item>
								</a-col>
								<template v-if="advanced">
									<a-col :md="8" :sm="24">
										<a-form-item label="生效时间" v-model="queryParam.time">
											<a-date-picker @change="onChange" style="width: 100%"/>
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
                    <div class="table-operator" style="margin-bottom: 24px">
						<a-button type="primary" icon="swap" @click="changePost" v-if="selectedRows.length != 0">调动岗位与组织</a-button>
            <a-button type="primary" icon="swap" @click="changeOrgan" v-if="selectedRows.length != 0">调动组织</a-button>
                    </div>
                      <s-table
                        ref="table"
                        rowKey="key"
                        :columns="scheduleColumns"
                        :data="loadScheduleData"
                        :scroll="{ y: 600, x: 800 }"
                        showPagination="auto">

                        <template
                          slot="status"
                          slot-scope="status">
                          <a-badge :status="status" :text="status | statusFilter"/>
                        </template>
                        <span slot="action" slot-scope="text, record">
							<!-- <a @click="changeOnePost(record)">岗位/组织调动</a> -->
                    <a-button  type="link" @click="changeOnePost(record)" :disabled="record.effDisabled" style="padding:0px;">岗位/组织调动</a-button>
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
          postDisabled:false,
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
              title: '岗位',
              dataIndex: 'currentRank',
              key: 'currentRank',
              width: 100,
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
              width: 250
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
                    title: '所属组织',
                    dataIndex: 'organizationName',
                    key: 'organizationName',
                    width: 180,
                },
                {
                    title: '所属岗位',
                    dataIndex: 'currentRank',
                    key: 'currentRank',
                    width: 100
                },
                {
                    title: '生效时间',
                    dataIndex: 'effectiveDate',
                    key: 'effectiveDate',
                    width: 100,
                },
                {
                    title: '调动原因',
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
            organizationId:'',
            currentRank:'',
            time:'',
            type:2,
			oid:''
          },
          loadScheduleData: (params) => {
			this.queryParam.oid = this.user.organizationId
            let param = Object.assign(params,this.queryParam)
            return this.$api.personAdminService.getRankList(param).then((res)=>{
              res.data.data.list.map((i,k)=>{
                i.key=k+1
                i.effDisabled = this.compareDate(i.effectiveDate)
              })
              return res.data
            })
          },
          selectedRowKeys: [],
          selectedRows: [],
          extension:[
                {label:'姓名',name:'policeName',type:'text',placeholder:'请输入姓名'},
                {label:'原组织',name:'beforeOrg',type:'text',placeholder:'请输入变动前职级'},
                {label:'原岗位',name:'beforePost',type:'text',placeholder:'请输入变动前职级'},
                {label:'生效日期',name:'effectiveDate',type:'picker',placeholder:'请选择生效日期'},
                {label:'调动后组织',name:'organizationId',labelName:"organizationName",type:'treeSelect',validata:'organizationId',placeholder:'请选择变动后组织'},
                {label:'调动后岗位',name:'currentRank',type:'select',validata:'currentRank',placeholder:'请选择调动后岗位'},
                {label:'变动原因',name:'reason',type:'textarea',placeholder:'请输入变动原因'},
          ],
          extensionPost:[
                {label:'姓名',name:'policeName',type:'text',placeholder:'请输入姓名'},
                // {label:'原组织',name:'beforeOrg',type:'text',placeholder:'请输入变动前职级'},
                // {label:'原岗位',name:'beforePost',type:'text',placeholder:'请输入变动前职级'},
                {label:'生效日期',name:'effectiveDate',type:'picker',placeholder:'请选择生效日期'},
                // {label:'调动后组织',name:'organizationId',labelName:"organizationName",type:'treeSelect',placeholder:'请选择变动后组织'},
                {label:'调动后岗位',name:'currentRankId',type:'select',labelName:'currentRank',placeholder:'请选择调动后岗位'},
                {label:'变动原因',name:'reason',type:'textarea',placeholder:'请输入变动原因'},
          ],
          extensionOrgan:[
                {label:'姓名',name:'policeName',type:'text',placeholder:'请输入姓名'},
                // {label:'原组织',name:'beforeOrg',type:'text',placeholder:'请输入变动前职级'},
                {label:'生效日期',name:'effectiveDate',type:'picker',placeholder:'请选择生效日期'},
                {label:'调动后组织',name:'organizationId',labelName:"organizationName",type:'treeSelect',placeholder:'请选择变动后组织'},
                {label:'变动原因',name:'reason',type:'textarea',placeholder:'请输入变动原因'},
          ],
          changeRankRules:{
            currentRank:[{ required: true, message: '请选择变动后岗位', trigger: 'change'}],
            organizationId:[{ required: true, message: '请选择变动后组织', trigger: 'change'}],
            reason: [{ required: true, message: '请输入变动原因', trigger: 'blur'}],
            effectiveDate: [{ required: true, message: '请选择生效日期', trigger: 'change' }]
          },
          postList:[],
          postMess:[]
      }
    },
    created () {
      this.getPostList()
      // this.getOrgList()
    },
    methods:{
      //比较时间大小
      compareDate(date1){
        var effectiveDate = new Date(date1);
        var nowTime = new Date();
        if(effectiveDate.getTime() > nowTime.getTime()){ 
            return true; //第一个大
        } else {
            return false; //第二个大
        }
      },
      // 获取岗位列表
      getPostList(){
        this.$api.rankPostService.getPostList().then(res=>{
            this.postList = Object.assign([],res.data.data.list)
            this.extension.forEach((item)=>{
              if(item.name == 'currentRank'){
                item.select = this.postList.filter(i=>i.state===1)
                item.select.map(i=> delete i.id)
              }
            })
            this.extensionPost.forEach((item)=>{
              if(item.name == 'currentRankId'){
                item.select = this.postList.filter(i=>i.state===1)
              }
            })
        })
      },
      handleEdit(record){
        let param ={
            diaColumns:this.diaColumns,
            person:record
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
        this.modal(param,option,diaHisRank)
      },
      handleClick (e) {
          this.queryParam = {
              key: e.key
          }
          this.$refs.table.refresh(true)
      },
      handleAdd (item) {
          this.$message.info(`提示：你点了 ${item.key} - ${item.title} `)
          this.$refs.modal.add(item.key)
      },
      handleTitleClick () {
      },
      handleChange(){
      },
      // 选中树节点
      loadTreeNode(data){
        this.queryParam.organizationId = data.id
        this.$refs.table.refresh(true)
      },
      //编辑树节点
      editTreeNode(){
      },
      //添加树节点
      addTreeNode(){
      },
        //删除树节点
      removeTreeNode(){
      },
      // 获取多选的数据
      onSelectChange (selectedRowKeys, selectedRows) {
        
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },

      // 批量岗位调动
      changePost(){
        let arr = []
        let arrName = ''
        this.selectedRows.forEach((item,index)=>{
          let obj = {
            policeName:item.policeName,//名字
            number:item.number,//警员编号
            userId:item.userId,//用户id
            beforeRank:item.currentRank,//变动前岗位
            approvedBy:this.user.name,//审批人
            approvedById:this.user.id,//审批人id
            type:2
          }
          arrName += item.policeName + ",";
          if(index == this.selectedRows.length - 1 ){
            arrName = arrName.slice(0,arrName.length - 1);
          }
          arr.push(obj)
        })
        let param ={
            formTitle:this.extensionPost,
            rules:this.changeRankRules,
            record:{
              policeName:arrName,//名字
              policeArr:arr,
              organizationId:"",
            },
            submitFun: (parameter) => {
              return this.$api.personAdminService
                .changeManyPost(parameter)
                .then((res) => {
                  if(res.data.code == 0){
                    return res.data;
                  }else{
                    this.$message.error(res.data.msg)
                  }
                })
                .catch((res)=>{
                  this.$message.error(res.data.msg)
                })
            },
            
        }
        let callback = () => {
          this.$refs.table.refresh(true);
          this.selectedRows = []
          this.selectedRowKeys = []
        }
        let option = {
            title: '岗位调动',
            width: 500,
            centered: true,
            maskClosable: false,
            okText:"提交",
          }
        this.modal(param,option,fromModel,callback)
      },
      // 批量组织调动
      changeOrgan(){
        let arr = []
        let arrName = ''
        this.selectedRows.forEach((item,index)=>{
          let obj = {
            policeName:item.policeName,//名字
            number:item.number,//警员编号
            userId:item.userId,//用户id
            // beforeRank:item.currentRank,//变动前岗位
            approvedBy:this.user.name,//审批人
            approvedById:this.user.id,//审批人id
            type:2
          }
          arrName += item.policeName + ",";
          if(index == this.selectedRows.length - 1 ){
            arrName = arrName.slice(0,arrName.length - 1);
          }
          arr.push(obj)
        })
        let param ={
            formTitle:this.extensionOrgan,
            rules:this.changeRankRules,
            record:{
              policeName:arrName,//名字
              policeArr:arr,
              organizationId:"",
            },
            submitFun: (parameter) => {
              return this.$api.personAdminService
                .changeManyPost(parameter)
                .then((res) => {
                  if(res.data.code == 0){
                    return res.data;
                  }else{
                    this.$message.error(res.data.msg)
                  }
                })
                .catch((res)=>{
                  this.$message.error(res.data.msg)
                })
            },
            
        }
        let callback = () => {
          this.$refs.table.refresh(true);
          this.selectedRows = []
          this.selectedRowKeys = []
        }
        let option = {
            title: '组织调动',
            width: 500,
            centered: true,
            maskClosable: false,
            okText:"提交",
          }
        this.modal(param,option,fromModel,callback)
      },
		// 调动单个岗位
		changeOnePost(e){
      let policeArr = []
      let obj = {
        policeName:e.policeName,//名字
        number:e.number,//警员编号
        beforeRank:e.currentRank,//变动前职级
        approvedBy:this.user.name,//审批人
        approvedById:this.user.id,//审批人id
        type:2,
        userId:e.userId
      }
      policeArr.push(obj)
			let param ={
				formTitle:this.extension,
				rules:this.changeRankRules,
				record:{
          policeName:e.policeName,//名字
          policeArr:policeArr,
          organizationId:e.organizationId,
          organizationName:e.organizationName,
          currentRank:e.currentRank,
          beforeOrg:e.organizationName, 
          beforeOrgId:e.organizationId,
          beforePost:e.currentRank,
        },
        submitFun: (parameter) => {
          // if(parameter.beforeOrgId == parameter.organizationId && parameter.beforePost == parameter.currentRank) {
          //   this.$message.error("操作失败！存在辅警调动岗位或职级与原岗位或职级相同！不能提交!")
          // }else{
            return this.$api.personAdminService
            .changeManyPost(parameter)
            .then((res) => {
               return res.data;
            })
          // }
        },
      }
      let callback = () => {
        this.$refs.table.refresh(true);
      }
			let option = {
				title: '岗位调动',
				width: 500,
				centered: true,
				maskClosable: false,
				okText:"提交",
			}
			this.modal(param,option,fromModel,callback)
		},
      // 弹窗
      modal(obj,option,model,callback){
        const defaultProps = {
          on: {
                ok () {
                    // console.log('ok 回调')
                    callback()
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
        // console.log(formProps)
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
            organizationId:'',
            currentRank:'',
            time:'',
            type:2
        },
        this.$refs.table.refresh(false)
      },
      // 生效时间
      onChange(date, dateString) {
        this.queryParam.time = dateString
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
