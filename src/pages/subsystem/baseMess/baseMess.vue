<template>
    <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
        <a-card :bordered="true">
          <div class="baseMess">
            <div class="title">
              <div class="position-and-level-title" :style="{'border-color':theme.color}">基础资料</div>
            </div>
            <div>
				<a-row :gutter="24">
					<c-col :xs="24" :sm="3" :md="3" :lg="3" :xl="3" :xxl="6">
						<div class="avatar">
							<img  src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png">
						</div>  
					</c-col>
					<c-col :xs="24" :sm="24" :md="18" :lg="18" :xl="18" :xxl="18">
						<a-form-model
							ref="ruleForm"
							:model="form" 
							:label-col="labelCol" 
							:wrapper-col="wrapperCol" 
							class="baseForm">
							<a-row :gutter="24">
								<a-col v-for="(item,index) in baseMessTitle" :key="index" :md="24" :lg="12" :xl="12" :xxl="6" >
								<a-form-model-item :label="item.label" :labelCol="{span: 7}" :wrapperCol="{span: 13}" :prop="item.title">
									<a-input v-model="form[item.title]"  disabled/>
								</a-form-model-item>
								</a-col>
							</a-row>
							<a-row :gutter="24">
								<a-col :md="24" :lg="12" :xl="12" :xxl="6" >
								<a-form-model-item label="是否是专业辅警" :labelCol="{span: 10}" :wrapperCol="{span: 13}">
									<a-radio-group v-model="isSpecialty">
									<a-radio value="true">
										是
									</a-radio>
									<a-radio value="false">
										否
									</a-radio>
									</a-radio-group>
								</a-form-model-item>
								</a-col>
							</a-row>
							<a-row :gutter="24" v-if="isSpecialty=='true'">
								<a-col :md="24" :lg="12" :xl="12" :xxl="6">
								<a-form-model-item label="专业技术职业资格" :labelCol="{span: 10}" :wrapperCol="{span: 13}">
									<a-input v-model="form.awardContent" />
								</a-form-model-item>
								</a-col>
								<a-col :md="24" :lg="12" :xl="12" :xxl="6">
								<a-form-model-item label="资格审批单位" :labelCol="{span: 7}" :wrapperCol="{span: 13}">
									<a-input v-model="form.awardUnit" />
								</a-form-model-item>
								</a-col>
								<a-col :md="24" :lg="12" :xl="12" :xxl="6">
								<a-form-model-item label="获得资格日期" :labelCol="{span: 7}" :wrapperCol="{span: 13}">
									<a-date-picker
										v-model="form.awardTime"
										show-time
										type="date"
										placeholder="请选择时间"
										style="width: 100%;"
									/>
								</a-form-model-item>
								</a-col>
							</a-row>
						</a-form-model>
					</c-col>
				</a-row>
            </div>
          </div>
        </a-card>
		<a-card :bordered="true">
          <div class="othoderMess">
            <div class="studyHis">
              <div class="title">
                <div class="position-and-level-title" :style="{'border-color':theme.color}">学习经历</div>
              </div>
              <standard-table
                ref="table"
                :rowKey="(record)=> record.school"
                :columns="studyColumns"
                :data="studySource"
                :showPagination="false"
              >
                <template
                
                  slot="status"
                  slot-scope="status">
                  <a-badge :status="status" :text="status | statusFilter"/>
                </template>
              </standard-table>
            </div>
            <div class="workHis">
              <div class="title">
                <div class="position-and-level-title" :style="{'border-color':theme.color}">工作经历</div>
              </div>
              <standard-table
                ref="worktable"
                rowKey="key"
                  :columns="workColumns"
                  :data="workSource"
                  :showPagination="false"
              >
                <template
                  slot="status"
                  slot-scope="status">
                  <a-badge :status="status" :text="status | statusFilter"/>
                </template>
              </standard-table>
            </div> 
            <div class="familyHis">
              <div class="title">
                <div class="position-and-level-title" :style="{'border-color':theme.color}">家庭及社会关系</div>
              </div>
              <standard-table
                ref="familytable"
                rowKey="key"
                :columns="familyColumns"
                :data="familySource"
                :showPagination="false"
              >
                <template
                  slot="status"
                  slot-scope="status">
                  <a-badge :status="status" :text="status | statusFilter"/>
                </template>
              </standard-table>
            </div>
          </div>
        </a-card>
    </div>
</template>

<script>
import { mapState } from "vuex";
import StandardTable from '@/components/Table_/'
const studyColumns = [
  {
    title: '毕业院校',
    dataIndex: 'school',
    key: 'school'
  },
  {
    title: '所在院系',
    dataIndex: 'courtyard',
    key: 'courtyard'
  },
  {
    title: '学习形式',
    dataIndex: 'learningForm',
    key: 'learningForm'
  },
  {
    title: '学制',
    dataIndex: 'schoolSystem',
    key: 'schoolSystem'
  },
  {
    title: '入学日期',
    dataIndex: 'startDate',
    key: 'startDate'
  },
  {
    title: '毕业日期',
    dataIndex: 'endDate',
    key: 'endDate'
  },
  {
    title: '所学专业',
    dataIndex: 'major',
    key: 'major'
  },
  {
    title: '学历',
    dataIndex: 'education',
    key: 'education'
  },
  {
    title: '学位',
    dataIndex: 'academic',
    key: 'academic'
  },
  {
    title:'学位授予日期',
    dataIndex: 'academicTime',
    key: 'academicTime'
  }
]

const workColumns = [
  {
    title: '工作起始日期',
    dataIndex: 'startDate',
    key: 'startDate'
  },
  {
    title: '工作结束日期',
    dataIndex: 'endData',
    key: 'endData'
  },
  {
    title: '所在单位',
    dataIndex: 'company',
    key: 'company'
  },
  {
    title: '单位类型',
    dataIndex: 'unitType',
    key: 'unitType'
  },
  {
    title: '职务级别',
    dataIndex: 'jobLevel',
    key: 'jobLevel'
  },
  {
    title: '是否公务员',
    dataIndex: 'orderly',
    key: 'orderly'
  },
  {
    title: '从事或担任工作',
    dataIndex: 'post',
    key: 'post'
  },
  {
    title: '备注',
    dataIndex: 'remarks',
    scopedSlots: { customRender: 'description' },
    key: 'remarks'
  }
]

const familyColumns = [
  {
    title: '成员姓名',
    dataIndex: 'familyName',
    key: 'familyName'
  },
  {
    title: '与本人关系',
    dataIndex: 'relationship',
    key: 'relationship'
  },
  {
    title: '性别',
    dataIndex: 'sex',
    key: 'sex'
  },
  {
    title: '成员身份证',
    dataIndex: 'idCard',
    key: 'idCard'
  },
  {
    title: '出生日期',
    dataIndex: 'birthday',
    key: 'birthday'
  },
  {
    title: '民族',
    dataIndex: 'nation',
    key: 'nation'
  }
]

export default {
    components:{
        StandardTable
    },
    data(){
        return{
			studyColumns: studyColumns,
			workColumns:workColumns,
			familyColumns: familyColumns,
			studySource : () => {
				return new Promise(resolve => {
					resolve({
					data: [
						{
							school:"广西大学"
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
			workSource :() => {
				return new Promise(resolve => {
					resolve({
					data: [],
					pageSize: 10,
					pageNo: 1,
					totalPage: 1,
					totalCount: 10
					})
				}).then(res => {
					return res
				})
			},
			familySource : () => {
				return new Promise(resolve => {
					resolve({
					data: [],
					pageSize: 10,
					pageNo: 1,
					totalPage: 1,
					totalCount: 10
					})
				}).then(res => {
					return res
				})
			},
			form: {
				number:'',
				name: '',
				idCard:'',
				phone:'',
				organizationId:'',
				work:'',
				rankId:'',
				nation:'',
				education:'',
				nativePlace:'',
				height:'',
				entryTime:'',
				politicalStatus:'',
				birthday:'',
				sex:'',
				age:'',
				tenureStatus:'',
				awardContent:'',
				awardUnit:'',
				awardTime:'',
			},
			baseMessTitle:[
				{title:'number',label:'辅警编号',type:'input',placeholder:'请输入辅警编号',disabled:false}, //
				{title:'name',label:'姓名',type:'input',placeholder:'请输入辅警姓名',disabled:false}, //
				{title:'idCard',label:'身份证号',type:'input',placeholder:'请输入身份证号',disabled:false}, //
				{title:'phone',label:'手机号码',type:'input',placeholder:'请输入手机号码',disabled:false}, //
				{title:'organization',label:'所属组织',type:'select',placeholder:'请选择所属组织'}, 
				{title:'post',label:'所属岗位',type:'select',placeholder:'请选择所属岗位'},
				{title:'rank',label:'所属职级',type:'select',placeholder:'请选择所属职级'},
				{title:'nation',label:'民族',type:'input',placeholder:'请输入民族',disabled:false},//
				{title:'education',label:'学历',type:'select',placeholder:'请选择学历',select:[{name:'专科'},{name:'本科'},{name:'硕士'},{name:'博士'},{name:'博士后'}]},//
				{title:'nativePlace',label:'籍贯',type:'input',placeholder:'请输入籍贯',disabled:false},//
				{title:'height',label:'身高(cm)',type:'input',placeholder:'请输入身高',disabled:false},
				{title:'entryTime',label:'入职时间',type:'time',placeholder:'请选择入职时间'},//
				{title:'politicalStatus',label:'政治面貌',type:'select',placeholder:'请选择政治面貌',select:[{name:'团员'},{name:'党员'},{name:'民主人士'},{name:'群众'}]},//
				{title:'birthday',label:'出生日期',type:'input',placeholder:'请输入出生日期',disabled:true},//
				{title:'sex',label:'性别',type:'input',placeholder:'请输入性别',disabled:true},//
				{title:'age',label:'年龄',type:'input',placeholder:'请输入年龄',disabled:true},//
				{title:'tenureStatus',label:'工龄',type:'input',placeholder:'请输入工龄',disabled:true} //  //
			],
			isSpecialty:false,
			labelCol: { span: 4 },
			wrapperCol: { span: 14 },
        }
    },
    methods:{

    },
    computed: {
    ...mapState('setting', ['theme','pageMinHeight']),
    desc() {
      return this.$t('description')
    },
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
    @import "../index";
	.avatar {
		margin: 0 auto;
		width: 104px;
		height: 104px;
		margin-bottom: 20px;
		border-radius: 50%;
		overflow: hidden;
		img {
			height: 100%;
			width: 100%;
		}
	}
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
	.othoderMess{
		.tableTitle{
			font-size: 14px;
			font-weight: 600;
		}
		& > .importSwrap{
			display: flex;
			justify-content: flex-end;
		}
		.studyHis,
		.workHis,
		.familyHis{
			margin-top: 40px;
			.title{
			// display: flex;
			// justify-content: space-between;
			margin-bottom: 20px;
			}
		}
	}
</style>