<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <div class="submitBtn">
            <a-button type="primary"  @click="submit">返回</a-button>
        </div>
      </div>
      <div
        class="position-and-level-title"
        :style="{ 'border-color': theme.color }"
      >
        {{param.className}}
      </div>
      <a-form-model 
            :model="form" 
            :label-col="labelCol" 
            :rules="rules"
            :wrapper-col="wrapperCol" 
            class="baseForm">
            <a-row>
                <a-col :md="24" :lg="12" :xl="12" :xxl="6">
                    <a-form-model-item label="培训名称" :labelCol="{xs:{span: 24},sm:{span: 8}}" :wrapperCol="{xs:{span: 24},sm:{span: 16}}" prop="learningName">
                        <a-input disabled v-model="form.learningName" />
                    </a-form-model-item>
                </a-col>
                <a-col :md="24" :lg="12" :xl="12" :xxl="6">
                    <a-form-model-item label="培训时间" :labelCol="{xs:{span: 24},sm:{span: 8}}" :wrapperCol="{xs:{span: 24},sm:{span: 16}}" prop="time">
                        <a-range-picker 
                          disabled 
                          :value="[this.form.startTime,this.form.endTime]"
                          @change="onChange" />
                    </a-form-model-item>
                </a-col>
                <a-col :md="24" :lg="12" :xl="12" :xxl="6">
                    <a-form-model-item label="总学时(小时)" :labelCol="{xs:{span: 24},sm:{span: 8}}" :wrapperCol="{xs:{span: 24},sm:{span: 16}}">
                        <a-input disabled v-model="form.classHour" />
                    </a-form-model-item>
                </a-col>
                <a-col :md="24" :lg="12" :xl="12" :xxl="6">
                    <a-form-model-item label="培训方式" :labelCol="{xs:{span: 24},sm:{span: 8}}" :wrapperCol="{xs:{span: 24},sm:{span: 16}}" prop="learningStyle">
                        
                        <a-input disabled value="不脱岗" v-if="form.learningStyle==1" />
                        <a-input disabled value="脱岗" v-else />
                    </a-form-model-item>
                </a-col>
                <a-col :sm="24" :md="24" >
                    <a-form-model-item label="内容说明" :labelCol="{xs:{span: 24},md:{span: 8} , lg:{span:4} , xl:{span:4} ,xxl:{span:2}}" :wrapperCol="{xs:{span: 24},md:{span: 16} , lg:{span:20} , xl:{span:20} ,xxl:{span:22}}">
                        <a-input
                            v-model="form.learningContent"
                            disabled
                            type="textarea"
                            placeholder="请填写内容说明"
                        />
                    </a-form-model-item>
                </a-col>
            </a-row>
        </a-form-model>
    </a-card>
    <a-card :bordered="false">
      <div class="position-and-level-title" :style="{ 'border-color': theme.color }">关联人员</div>
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="关键词搜索">
                <a-input placeholder="请输入要查询的关键词" v-model="queryParam.search"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="组织选择">
                <select-tree 
                  style="width: 100%" 
                  ref="selectTree" 
                  :value="queryParam.organizationId" 
                  @handleTreeChange="handleTreeChange"></select-tree>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="结果">
                  <a-select default-value="" v-model="queryParam.state">
                    <a-select-option value=""> 全部： </a-select-option>
                    <a-select-option value="1"> 优秀 </a-select-option>
                    <a-select-option value="2"> 良好 </a-select-option>
                    <a-select-option value="3"> 不及格 </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </template>
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
				<a-button type="primary" icon="plus" @click="handleCredAdd" v-if="selectedRows.length != 0">填写结果</a-button>
			</div>
      <s-table
        ref="table"
        rowKey="key"
        :columns="credColumns"
        :data="loadCredData"
        :rowSelection="rowSelection"
        :scroll="{ y: 600, x: 650 }"
        showPagination="auto"
      >
        <template slot="state" slot-scope="state">  
          <span  v-if="state != ''">
            <a-badge
              :status="state == '1' ? 'success' : state == '2' ? 'processing' : state == '3' ? 'error' : ''"
              :text="state | statusFilter(state)"
            />
          </span>
          
        </template>
        <span slot="action" slot-scope="text, record">
          <a @click="handleCredAddOne(record)">填写结果</a>
        </span>
      </s-table>
      
    </a-card>
  </div>
</template>

<script>
import { mapState,mapGetters } from "vuex";
import STable from "@/components/Table_/";
import TaskForm from "@/components/formModel/formModel";
import selectTree from "@/components/treeSelect/TreeSelect"


const credTitle = [
  {
    label: "姓名",
    name: "policeName",
    type: "input",
  },
  {
    label: "培训情况",
    name: "state",
    type: "select",
    select:[{name:'优秀',value:'1'},{name:'良好',value:'2'},{name:'不合格',value:'3'}]
  },
  {
    label: "说明",
    name: "trainExplain",
    type: "textarea",
  },
];
const credRules = {
  policeName: [{ required: true, message: "请输入证件类型名称", trigger: "blur" }],
  state:[{ required: true, message: "请选择培训情况", trigger: "change" }]
};
export default {
  name: "OrganManage",
  components: {
    STable,
    selectTree
  },
  data() {
    return {
      name:"哈哈培训",//培训名称
      value:null,
      advanced:false,
      param:{},
      vaule:'',
      selectedRowKeys: [],
      selectedRows: [],
      replaceFields:{
          children:'children',
          title:'title',
          key:'key',
          value: 'key'
      },
      credColumns: [
        {
          title: "序号",
          dataIndex: "key",
          key: "key",
          width: 60,
        },
        {
          title: "姓名",
          dataIndex: "policeName",
          key: "policeName",
          ellipsis: true,
        },
        {
          title: "所属岗位",
          dataIndex: "postName",
          key: "postName",
          ellipsis: true,
        },
        {
          title: "所属组织",
          dataIndex: "organizationName",
          key: "organizationName",
          ellipsis: true,
        },
        {
          title: "培训情况",
          dataIndex: "state",
          key: "state",
          scopedSlots: { customRender: "state" },
          ellipsis: true,
        },
        {
          title: "说明",
          dataIndex: "trainExplain",
          key: "trainExplain",
          ellipsis: true,
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: {customRender: 'action'},
          width: 150
        }
      ],
      queryParam:{
        organizationId:'',
        id:'',
        oid:'',
        state:'',
        search:''
      },
      loadCredData: (params) => {
        // this.queryParam.oid = this.user.organizationId
        this.queryParam.id = this.param.id
        let param = Object.assign(params,this.queryParam)
        return this.$api.trainService.getEducationDetails(param).then((res)=>{
          console.log(res)
          res.data.data.list.map((i,k)=>{
            i.key=k+1
          })
          return res.data
        })
      },
      selectedCredRowKeys: [],
      selectedCredRows: [],
        form:{
            learningName:'',
            startTime:'',
            endTime:'',
            classHour:'',
            learningStyle:'',
            learningContent:''
        },
        rules:{
            learningName:[{ required: true, message: '请输入培训名称', trigger: 'blur' }],
            time:[{ required: true, message: '请选择日期', trigger: 'change' }],
            learningStyle:[{ required: true, message: '请选择培训方式', trigger: 'change'}]
        },
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
      selcetPersonName:{}
    };
  },
  methods: {
    //填写结果(批量)
    handleCredAdd() {
      let arrName = "";
      let selectArr = []
      let arr = this.selectedRows
      arr.forEach((e)=>{
        let queryPa = {
          id:e.id,
          trainId:this.param.id,
          policeId:e.policeId,
          policeName:e.policeName,
          postId:e.postId,
          postName:e.postName,
          organizationId:e.organizationId,
          organizationName:e.organizationName
        }
        arrName = e.policeName + ",";
        this.selcetPersonName.policeName = arrName.slice(0,arrName.length - 1);
        selectArr.push(queryPa)
      })
      let formProps = {
        formTitle: credTitle,
        rules: credRules,
        record:this.selcetPersonName,
        submitFun:(params) => {
            // let param = Object.assign(params,queryPa)
            return this.$api.trainService.putManyEducation(params,selectArr).then((res)=>{
                res.data.data.list.map((i,k)=>{
                    i.key=k+1
                })
                return res.data
            })
        },
      };
      let modalProps = {
        title: "填写结果",
        width: 700,
        centered: true,
        maskClosable: false,
        okText: "提交",
      };
      this.openModal(TaskForm, formProps, modalProps);
    },
    // 填写结果(单个)
    handleCredAddOne(e){
      let queryPa = {
        id:e.id,
        trainId:e.trainId,
        policeId:e.policeId,
        policeName:e.policeName,
        postId:e.postId,
        postName:e.postName,
        organizationId:e.organizationId,
        organizationName:e.organizationName
      }
      let formProps = {
        formTitle: credTitle,
        rules: credRules,
        record:e,
        submitFun:(params) => {
            let param = Object.assign(params,queryPa)
            return this.$api.trainService.putEducation(param).then((res)=>{
                res.data.data.list.map((i,k)=>{
                    i.key=k+1
                })
                this.$refs.table.refresh(true)
                return res.data
            })
        },
      };
      let modalProps = {
        title: "填写结果",
        width: 700,
        centered: true,
        maskClosable: false,
        okText: "提交",
      };
      this.openModal(TaskForm, formProps, modalProps);
    },
    /**
     * 表单弹窗
     * @param form form模板页面，通过import引入
     * @param formProps form配置项 Object
     * @param modalProps 弹窗配置项 Object
     */
    openModal(form, formProps, modalProps) {
      const defaultModalProps = {
        on: {
          ok() {
            console.log("ok 回调");
          },
          cancel() {
            console.log("cancel 回调");
          },
          close() {
            console.log("modal close 回调");
          },
        },
      };
      formProps = Object.assign(formProps, defaultModalProps);
      this.$dialog(
        form,
        // component props
        formProps,
        // modal props
        modalProps
      );
    },
    // 获取多选的数据
    onSelectChange (selectedRowKeys, selectedRows) {
      
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
      console.log(this.selectedRowKeys)
      console.log(this.selectedRows)
    },

    // 组织树选择
    handleTreeChange(data){
      this.queryParam.organizationId = data.val
      this.value = data.val
    },

    // 开始时间和结束时间
    onChange(date, dateString) {
      console.log(date, dateString);
    },

    // 点击返回
    submit(){
      this.$router.replace(
        {
          path:'education'
        }
      )
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    handleChange(e) {
      console.log(e);
    },
    //重置查询参数
    resetParam(){
      this.queryParam={
        organizationId:'',
        id:'',
        oid:'',
        state:'',
        search:''
      }
      this.$refs.table.refresh(false)
    }
  },
  created(){
    // param
    this.param = this.$route.query.param
    this.form.learningName = this.$route.query.param.className
    this.form.startTime = this.$route.query.param.startTime
    this.form.endTime = this.$route.query.param.endTime
    this.form.classHour = this.$route.query.param.classHour
    this.form.learningStyle = this.$route.query.param.learningStyle
    this.form.learningContent = this.$route.query.param.learningContent
    
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: "优秀",
        2: "良好",
        3: "不及格"
      };
      return statusMap[status];
    },
  },
  computed: {
    ...mapState("setting", ["theme", "pageMinHeight"]),
    ...mapGetters("account",["user"]),// 获取登录者信息
    rowSelection () {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
  },
};
</script>

<style scoped lang="less">
@import "../index";
.position-and-level-title {
  border-style: solid;
  border-width: 5px;
  border-top: none;
  border-right: none;
  border-bottom: none;
  color: @title-color;
  font-weight: 500;
  font-size: 16px;
  text-indent: 10px;
  margin-bottom: 24px;
}
/deep/ .ant-card-head {
  background-color: #fafafa;
}
.submitBtn{
    width: 100%;
    // padding: 20px 20px 0px 0px;
    display: flex;
    justify-content: flex-end;
}
</style>