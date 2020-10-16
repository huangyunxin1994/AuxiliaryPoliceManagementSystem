<template>
  <!-- <div class="new-page" :style="`min-height: ${pageMinHeight}px`"> -->
  <div class="page-header-index-wide page-header-wrapper-grid-content-main">
    <a-row :gutter="24">
        <a-col :md="24" :lg="8" :xl="4">
          <a-card :bordered="true">
            <div class="account-center-avatarHolder">
              <div class="username">哈哈中的哈哈</div>
              <div class="avatar">
                <img v-if="imageUrl==''" src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png">
                <img v-else :src="imageUrl" alt="">
              </div>  
              <div class="bio">
                <a-upload
                  name="file"
                  :multiple="true"
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  @change="handleChange"
                  :before-upload="beforeUpload"
                  :show-upload-list="false"
                  ref="upLoad"
                >
                  <a-button type="primary"> <a-icon type="upload" /> 更换头像 </a-button>
                </a-upload>
              </div>
            </div>
            <a-divider/>

            <div class="account-center-tags">
              <div class="tagsTitle">个人信息</div>
                <div class="members">
                  <a-row>
                    <a-col :span="24">
                      <a>
                        <a-avatar size="small" src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png"/>
                        <span class="member"> 基础资料 </span>
                      </a>
                    </a-col>
                  </a-row>
                </div>
            </div>
            <a-divider :dashed="true"/>

            <div class="account-center-team">
              <div class="teamTitle"></div>
                <div class="members">
                  <a-row>
                    <a-col :span="24" v-for="(item, index) in teams" :key="index">
                      <a>
                        <a-avatar size="small" src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png"/>
                        <span class="member">{{ item.name }}</span>
                      </a>
                    </a-col>
                  </a-row>
                </div>
            </div>
          </a-card>
        </a-col>
        <a-col :md="24" :lg="16" :xl="20">
          <a-card :bordered="true">
            <div class="saveBtn">
              <a-button type="primary" @click="saveBtn">保存</a-button>
            </div>
          </a-card>
          <a-card :bordered="true">
            <div class="baseMess">
              <div class="title">
                <div class="position-and-level-title" :style="{'border-color':theme.color}">基础资料</div>
              </div>
              <div>
                <a-form-model 
                  ref="ruleForm"
                  :model="form" 
                  :label-col="labelCol" 
                  :rules="baseRules"
                  :wrapper-col="wrapperCol" 
                  class="baseForm">
                  <a-row :gutter="24">
                    <a-col v-for="(item,index) in baseMessTitle" :key="index" :md="24" :lg="12" :xl="12" :xxl="6" >
                      <a-form-model-item :label="item.label" :labelCol="{span: 7}" :wrapperCol="{span: 13}" :prop="item.title">
                        <a-input v-model="form[item.title]" v-if="item.type=='input'" :disabled="item.disabled"/>
                        <a-select v-model="form[item.title]" :placeholder="item.placeholder" v-else-if="item.type=='select'">
                          <a-select-option  v-for="(i,j) in item.select" :key="j" :value='i.name'>
                            {{i.name}}
                          </a-select-option>
                        </a-select>
                        <a-date-picker
                          v-model="form[item.title]"
                          show-time
                          type="date"
                          placeholder="请选择入职时间"
                          style="width: 100%;"
                          v-else-if="item.type=='time'"
                        />
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
              </div>
            </div>
          </a-card>
          <a-card :bordered="true">
            <div class="othoderMess">
              <div class="importSwrap">
                <excel-btn :tableTitle="allTableTitle" @getTableData="getTableData"></excel-btn>
              </div>
              <div class="studyHis">
                <div class="title">
                  <div class="position-and-level-title" :style="{'border-color':theme.color}">学习经历</div>
                  <a-button type="primary" @click="addStudyData('table1')" icon="plus">添加记录</a-button>
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
                  <span slot="action" slot-scope="text, record">
                    <a @click="editRecord(record,'table1')">编辑</a>
                    <a-divider type="vertical"/>
                    <a @click="del(record)">删除</a>
                  </span>
                </standard-table>
              </div>
              <div class="workHis">
                <div class="title">
                  <div class="position-and-level-title" :style="{'border-color':theme.color}">工作经历</div>
                  <a-button type="primary" @click="addStudyData('table2')" icon="plus">添加记录</a-button>
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
                  <span slot="workaction" slot-scope="text, record">
                    <a @click="editRecord(record,'table2')">编辑</a>
                    <a-divider type="vertical"/>
                    <a @click="del (record)">删除</a>
                  </span>
                </standard-table>
              </div> 
              <div class="familyHis">
                <div class="title">
                  <div class="position-and-level-title" :style="{'border-color':theme.color}">家庭及社会关系</div>
                  <a-button type="primary" @click="addStudyData('table3')" icon="plus">添加记录</a-button>
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
                  <span slot="familyaction" slot-scope="text, record">
                    <a @click="editRecord (record,'table3')">编辑</a>
                    <a-divider type="vertical"/>
                    <a @click="del (record)">删除</a>
                  </span>
                </standard-table>
              </div>
            </div>
          </a-card>
        </a-col>
      </a-row>
      <dialog-data ref="studyData"></dialog-data>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import excelBtn from '@/components/importExcel/importExcel'
  import dialogData from '@/components/dialogPersonalData/dialogPersonalData'
  import fromModel from '@/components/formModel/formModel'
  import StandardTable from '@/components/Table_/'

  // import {rulue} from '@/config/default/rules'
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
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'action' }
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
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'workaction' }
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
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'familyaction' }
  }
]

const fromTitle = {
        table1:[
          {label:'毕业院校',name:'school',type:'input',refName:'name',placeholder:'请输入毕业院校'},
          {label:'所在院系',name:'courtyard',type:'input',refName:'courtyard',placeholder:'请输入所在院系'},
          {label:'学习形式',name:'learningForm',type:'input',refName:'learningForm',placeholder:'请输入学习形式'},
          {label:'学制',name:'schoolSystem',type:'select',refName:'schoolSystem',placeholder:'请选择学制',select:[{name:'2年制'},{name:'3年制'},{name:'4年制'},{name:'5年制'}]},
          {label:'入学日期',name:'startDate',type:'picker',refName:'startDate',placeholder:'请选择入学日期'},
          {label:'毕业日期',name:'endDate',type:'picker',refName:'endDate',placeholder:'请选择毕业日期'},
          {label:'所学专业',name:'major',type:'input',refName:'major',placeholder:'请输入毕业院校'},
          {label:'学历',name:'education',props:'name',type:'select',refName:'education',placeholder:'请选择学历',select:[{name:'专科'},{name:'本科'},{name:'硕士'},{name:'博士'},{name:'博士后'}]},
          {label:'学位',name:'academic',props:'name',type:'select',refName:'academic',placeholder:'请选择学位',select:[{name:'学士'},{name:'硕士'},{name:'博士'},{name:'博士后'}]},
          {label:'学位授予日期',name:'academicTime',type:'picker',refName:'academicTime',placeholder:'请选择入学位授予日期'}
        ],
        table2:[
          {label:'工作起始日期',name:'startDate',type:'picker',refName:'startDate',placeholder:'请选择工作起始日期'},
          {label:'工作结束日期',name:'endData',type:'picker',refName:'endData',placeholder:'请选择工作结束日期'},
          {label:'所在单位',name:'company',type:'input',refName:'company',placeholder:'请输入所在单位'},
          {label:'单位类型',name:'unitType',type:'input',refName:'unitType',placeholder:'请输入单位类型'},
          {label:'职务级别',name:'jobLevel',type:'input',refName:'jobLevel',placeholder:'请输入职务级别'},
          {label:'是否公务员',name:'orderly',type:'radio',refName:'orderly',placeholder:'请选择性别',select:[{name:'是'},{name:'否'}]},
          {label:'从事或担任的工作',name:'post',type:'input',refName:'post',placeholder:'请输入从事或担任的工作'},
          {label:'备注',name:'remarks',type:'textarea',refName:'remarks',placeholder:'请输入备注'}
        
        ],
        table3:[
          {label:'成员姓名',name:'familyName',type:'input',refName:'familyName',placeholder:'请输入成员姓名'},
          {label:'与本人关系',name:'familyRelation',type:'select',refName:'familyRelation',placeholder:'请选择关系',select:[{name:'父子'},{name:'母子'},{name:'父女'},{name:'母女'},{name:'兄弟'},{name:'兄妹'},{name:'姐弟'},{name:'姐妹'}]},
          {label:'性别',name:'familySex',type:'radio',refName:'familySex',select:[{name:'男'},{name:'女'}]},
          {label:'成员身份证',name:'familyIDCard',type:'input',refName:'familyIDCard',placeholder:'请输入成员身份证'},
          {label:'出生日期',name:'familyBirthday',type:'picker',refName:'familyBirthday',placeholder:'请选择入出生日期'},
          {label:'民族',name:'familyNatin',type:'input',refName:'familyNatin',placeholder:'请输入民族'}
        
        ]}
  
const rules = {
    table1:{
      school: [{ required: true, message: '请输入学院姓名', trigger: 'blur' }],
      courtyard: [{ required: true, message: '请输入所在院系', trigger: 'blur' }],
      learningForm: [{ required: true, message: '请输入学习形式', trigger: 'blur' }],
      schoolSystem: [{ required: true, message: '请选择学制', trigger: 'change'}],
      startDate: [{ required: true, message: '请选择入学时间', trigger: 'change' }],
      endDate: [{ required: true, message: '请选择毕业时间', trigger: 'change' }],
      major: [{ required: true, message: '请输入专业', trigger: 'blur' }],
      education:[{ required: true, message: '请选择学历', trigger: 'change'}],
      academic: [{ required: true, message: '请选择学位', trigger: 'change'}],
      academicTime: [{ required: true, message: '请选择学位授予日期', trigger: 'change' }]
    },
    table2:{
      startDate: [{ required: true, message: '请选择工作起始日期', trigger: 'change' }],
      endData: [{ required: true, message: '请选择工作结束日期', trigger: 'change' }],
      company: [{ required: true, message: '请输入所在单位', trigger: 'blur' }],
      unitType: [{ required: true, message: '请输入单位类型', trigger: 'blur' }],
      jobLevel: [{ required: true, message: '请输入职务级别', trigger: 'blur' }],
      orderly: [
          { required: true, message: '请选择是否是公务员', trigger: 'change' },
      ],
      post: [{ required: true, message: '请输入从事或担任的工作', trigger: 'blur' }],
      remarks: [{ required: true, message: '请输入备注', trigger: 'blur' }]
    },
    table3:{
      familyName: [{ required: true, message: '请输入成员姓名', trigger: 'blur' }],
      relationship: [{ required: true, message: '请选择关系', trigger: 'change' }],
      idCard: [{ required: true, message: '请输入身份证', trigger: 'blur' }],
      sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
      birthday: [{ required: true, message: '请选择出生日期', trigger: 'change' }],
      nation: [{ required: true, message: '请输入民族', trigger: 'blur' }],
    }
  }

  export default {
    name: 'Demo',
    components:{
      StandardTable,
      excelBtn,
      dialogData
    },
    data() {
      return {
        record:'',
        teamSpinning: true,
        tagInputVisible: false,
        teams:[
          {
            avatar:'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
            name:'奖励与责任追究'
          },
          {
            avatar:'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
            name:'合同与工资信息'
          },
          {
            avatar:'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
            name:'人事信息'
          },
          {
            avatar:'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
            name:'培训记录'
          },
          {
            avatar:'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
            name:'证件装备'
          },
          {
            avatar:'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
            name:'加班与请假统计'
          }
        ],
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
        isSpecialty:false,
        baseRules:{},
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
        studyColumns: studyColumns,
        workColumns:workColumns,
        familyColumns: familyColumns,
        studySource : () => {
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
        allTableData:[],
        imageUrl:'',// 用来存放图片的路径
        allTableTitle:[],// 所有的title
        deleteMess:'', // 在点击删除时，会获取到该条信息的所有值，保存在该变量中
        tableDataIndex:'',
      }
    },
    computed: {
      ...mapState('setting', ['theme','pageMinHeight']),
      desc() {
        return this.$t('description')
      }
    },
    methods:{
      //基础信息规则
      getBaseRules(){
        let myrules = {}
        this.baseMessTitle.forEach((item)=>{
          if(item.title == 'number'  || item.title == 'name' || item.title == 'idCard' || item.title == 'phone' || item.title == 'nation'){
            myrules[item.title] = [{ required: true, message: '请输入必填项', trigger: 'blur' }]
          }else if(item.title == 'organization' || item.title == 'post' || item.title == 'rank' || item.title == 'education' || item.title == 'politicalStatus' ){
            myrules[item.title] = [{ required: true, message: '请选择学位', trigger: 'change'}]
          }else if(item.title == 'entryTime'){
            myrules[item.title] = [{ required: true, message: '请选择日期', trigger: 'change' }]
          }
        })
        this.baseRules = myrules

        // let rule ={
        //   name:[{
        //     validator: onePoint, trigger: 'change' 
        //   }]
        // }
        // let nowRulue = rulue.name.concat(rule.name)
        // rulue.name = nowRulue
        // console.log("************************************")
        // console.log(rulue)
      },
      // 获取base64格式的图片
      getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
      },
      // 图片上传
      handleChange(info){
        if (info.file.status === 'uploading') {
          this.loading = true;
          return;
        }
        if (info.file.status === 'done') {
          this.getBase64(info.file.originFileObj, imageUrl => {
            this.imageUrl = imageUrl;
            this.loading = false;
          });
        }
        
      },
      // 上传图片前先进行验证
      beforeUpload(file) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
          this.$message.error('抱歉，你只能上传JPG或者png格式的图片!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error('图片不能小于2MB!');
        }
        return isJpgOrPng && isLt2M;
      },
      // 学习经历删除按钮
      deleteRecord(key,index) {
        this.deleteMess = key
        this.tableDataIndex = index
      },
      // 编辑
      editRecord(key,index){
        // fromTitle[index]
        let param ={
            formTitle:fromTitle[index],
            record:key,
            rules:rules[index]
        }
        let option = {}
        if(index == 'table1'){
          option ={
            title: '学习经历',
            width: 500,
            centered: true,
            maskClosable: false,
            okText:"提交",
          }
        }else if(index == 'table2'){
          option ={
            title: '工作经历',
            width: 500,
            centered: true,
            maskClosable: false,
            okText:"提交",
          }
        }else{
          option ={
            title: '家庭及社会关系',
            width: 500,
            centered: true,
            maskClosable: false,
            okText:"提交",
          }
        }
        this.modal(param,option)

      },
      modal(obj,option){
        const defaultProps = {
          on: {
                ok () {
                    // console.log('ok 回调')
                },
                cancel () {
                    // console.log('cancel 回调')
                },
                close () {
                    // console.log('modal close 回调')
                }
            }
        }
        let formProps =  Object.assign(obj, defaultProps);
        console.log(formProps)
        this.$dialog(fromModel,
          // form props 
          formProps,
          // modal props
          option
        )
      },
      getAllTableTitle(){
        this.allTableTitle.push(this.studyColumns)
        this.allTableTitle.push(this.workColumns)
        this.allTableTitle.push(this.familyColumns)
      },
      // 获取到Excel表格数据
      getTableData(tdata){
        tdata.map((item)=>{
          console.log(item)
          item.map((j,k)=>{
            j.key = k
          })
        })
        console.log(tdata)
        this.$refs.table.changeDataForImport(tdata[0])
        this.$refs.worktable.changeDataForImport(tdata[1])
        this.$refs.familytable.changeDataForImport(tdata[2])
      },
      // 点击删除
      del(key){
        console.log(key)
      },
      // 点击删除时 确认
      confirm(){
        let data = this.deleteMess
        let index = ''
        if(this.tableDataIndex == 0){
          index = this.studySource.findIndex ((item) => {
            return item.key == data.key
          })
          this.studySource.splice(index,1)
        }else if(this.tableDataIndex == 1){
          index = this.workSource.findIndex ((item) => {
            return item.key == data.key
          })
          this.workSource.splice(index,1)
        }else if(this.tableDataIndex == 2){
          index = this.familySource.findIndex ((item) => {
            return item.key == data.key
          })
          this.familySource.splice(index,1)
        }
      },
      // 点击删除时 取消
      cancel(){
        console.log("取消")
      },
      // 添加记录
      addStudyData(index){
        console.log(rules[index])
        let param ={
            formTitle:fromTitle[index],
            rules:rules[index]
        }
        let option = {}
        if(index == 'table1'){
          option ={
            title: '学习经历',
            width: 500,
            centered: true,
            maskClosable: false,
            okText:"提交",
          }
        }else if(index == 'table2'){
          option ={
            title: '工作经历',
            width: 500,
            centered: true,
            maskClosable: false,
            okText:"提交",
          }
        }else{
          option ={
            title: '家庭及社会关系',
            width: 500,
            centered: true,
            maskClosable: false,
            okText:"提交",
          }
        }
        this.modal(param,option)
      },

      // 点击保存按钮
      saveBtn(){
        console.log("保存按钮")
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            // alert('submit!');
            console.log(' submit!!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
        // console.log(this.familySource)
      }
    },
    mounted(){
      this.getBaseRules()
      this.getAllTableTitle()
    }
  }
</script>

<style scoped lang="less">
  @import "index";
  .saveBtn{
    display: flex;
    justify-content: flex-end;
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
  // /deep/ .ant-card-head{
  //   background-color: #fafafa;
  // }
  .page-header-wrapper-grid-content-main {
  width: 100%;
  height: 100%;
  min-height: 100%;
  transition: 0.3s;

  .account-center-avatarHolder {
    text-align: center;
    margin-bottom: 24px;

    & > .avatar {
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

    .username {
      color: rgba(0, 0, 0, 0.85);
      font-size: 14px;
      line-height: 28px;
      font-weight: 500;
      margin-bottom: 14px;
    }
  }

  .account-center-detail {
    p {
      margin-bottom: 8px;
      padding-left: 26px;
      position: relative;
    }

    i {
      position: absolute;
      height: 14px;
      width: 14px;
      left: 0;
      top: 4px;
      background: url(https://gw.alipayobjects.com/zos/rmsportal/pBjWzVAHnOOtAUvZmZfy.svg);
    }

    .title {
      background-position: 0 0;
    }
    .group {
      background-position: 0 -22px;
    }
    .address {
      background-position: 0 -44px;
    }
  }

  .account-center-tags {
    .ant-tag {
      margin-bottom: 8px;
    }
  }

  .account-center-team,
  .account-center-tags {
    .members {
      a {
        display: block;
        margin: 12px 0;
        line-height: 24px;
        height: 24px;
        .member {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.65);
          line-height: 24px;
          max-width: 100px;
          vertical-align: top;
          margin-left: 12px;
          transition: all 0.3s;
          display: inline-block;
        }
        &:hover {
          span {
            color: #1890ff;
          }
        }
      }
    }
  }

  .tagsTitle,
  .teamTitle {
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    margin-bottom: 12px;
  }

  .baseMess{
    & > .title{
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }
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
}
</style>