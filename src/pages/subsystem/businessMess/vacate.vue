<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-card :bordered="false">
		<div class="position-and-level-title" :style="{ 'border-color': theme.color }">加班记录 </div>
		<div class="table-page-search-wrapper">
			<a-form layout="inline">
				<a-row :gutter="48">
					<a-col :md="8" :sm="24">
						<a-form-item label="关键词搜索">
							<a-input placeholder="请输入要查询的关键词" />
						</a-form-item>
					</a-col>
					<a-col :md="(!advanced && 8) || 24" :sm="24">
						<span
							class="table-page-search-submitButtons"
							:style="
							(advanced && { float: 'right', overflow: 'hidden' }) || {}
							"
						>
							<a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
							<a-button
								style="margin-left: 8px"
								@click="() => (queryParam = {})"
								>重置</a-button>
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
            <a-button v-if="loginType==1" type="primary" icon="clock-circle"   style="margin-right: 10px" @click="overtime">申请加班</a-button>
        </div>
		<s-table
			ref="table"
			rowKey="key"
			:columns="credColumns"
			:data="loadCredData"
			:scroll="{ y: 600, x: 650 }"
			showPagination="auto"
		>
      <template slot="holiday" slot-scope="holiday">
          <span>{{holiday === 1 ? '是' : '否'}}</span>
        </template>
      <template slot="approvalResults" slot-scope="approvalResults">
          <a-badge
            :status="approvalResults == '0' ? 'processing' : (approvalResults == 1 ? 'success' : 'error')"
            :text="approvalResults | resultFilter"
          />
        </template>
		</s-table>
    </a-card>
    <a-card :bordered="false">
      <div class="position-and-level-title" :style="{ 'border-color': theme.color }">请假记录</div>
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="关键词搜索">
                <a-input placeholder="请输入要查询的关键词" />
              </a-form-item>
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
        <a-button v-if="loginType==1" type="primary" icon="clock-circle"   style="margin-right: 10px" @click="vacate">申请请假</a-button>
      </div>
      <s-table
        ref="table"
        rowKey="key"
        :columns="dutyColumns"
        :data="dutyData"
        :scroll="{ y: 600, x: 650 }"
        showPagination="auto"
      >
        
        <template slot="approvalResults" slot-scope="approvalResults">
          <a-badge
            :status="approvalResults == '0' ? 'processing' : (approvalResults == 1 ? 'success' : 'error')"
            :text="approvalResults | resultFilter"
          />
        </template>
        <template slot="state" slot-scope="state">
          <span>{{ state | typeFilter }}</span>
        </template>
      </s-table>
      
    </a-card>
  </div>
</template>

<script>
import { mapState,mapGetters } from "vuex";
import STable from "@/components/Table_/";
import fromModel from "@/components/formModel/formModel";
export default {
  name: "OrganManage",
  components: {
    STable,
    fromModel
  },
  props:{
    policeId:String
  },
  data() {
    return {
      value:null,
      advanced:false,
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
          title: "开始时间",
          dataIndex: "startTime",
          key: "startTime",
          ellipsis: true,
          width: 100,
        },
        {
          title: "结束时间  ",
          dataIndex: "endTime",
          key: "endTime",
          ellipsis: true,
          width: 150
        },
        {
          title: "时长(小时)",
          dataIndex: "duration",
          key: "duration",
          width: 100
        },
        {
          title: "是否法定假日",
          dataIndex: "holiday",
          key: "holiday",
          scopedSlots: { customRender: "holiday" },
          width: 150
        },
        {
          title: "加班原因",
          dataIndex: "reason",
          key: "reason",
          ellipsis: true
        },
        {
          title: "状态",
          dataIndex: "approvalResults",
          key: "approvalResults",
          ellipsis: true,
          scopedSlots: { customRender: 'approvalResults' }
        },
        {
          title: "审批人",
          dataIndex: "approval",
          key: "approval",
          width: 120,
        },
        {
          title: "审批备注",
          dataIndex: "approvalRemake",
          key: "approvalRemake",
          ellipsis: true
        },
      ],
      overTimeParam:{
        userId:undefined,
        type:1
      },
      leaveParam:{
        userId:undefined,
        type:2
      },
      loadCredData: (params) => {
        let param = Object.assign(params,this.overTimeParam)
        return this.$api.overTimeService.getOverTimeLeave(param).then((res)=>{
          res.data.data.list.map((i,k)=>{
            i.key=k+1
          })
          return res.data
        })
      },
      dutyColumns:[
        {
          title: "序号",
          dataIndex: "key",
          key: "key",
          width: 60,
        },
        {
          title: "开始时间",
          dataIndex: "startTime",
          key: "startTime",
          ellipsis: true,
          width: 100,
        },
        {
          title: "结束时间  ",
          dataIndex: "endTime",
          key: "endTime",
          ellipsis: true,
          width: 150
        },
        {
          title: "时长(小时)",
          dataIndex: "duration",
          key: "duration",
          width: 100
        },
        {
          title: "请假类型",
          dataIndex: "state",
          key: "state",
          scopedSlots: { customRender: "state" },
          width: 100,
        },
        {
          title: "请假原因",
          dataIndex: "reason",
          key: "reason",
          ellipsis: true,
        },
        {
          title: "审批状态",
          dataIndex: "approvalResults",
          key: "approvalResults",
          scopedSlots: { customRender: "approvalResults" },
          width: 120
        },
        {
          title: "审批人",
          dataIndex: "approval",
          key: "approval",
          width: 120,
        },
        {
          title: "审批备注",
          dataIndex: "approvalRemake",
          key: "approvalRemake",
          ellipsis: true
        },
      ],
      dutyData:(params) => {
        let param = Object.assign(params,this.leaveParam)
        return this.$api.overTimeService.getOverTimeLeave(param).then((res)=>{
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
        overtimeModel: [
          {
            label: "开始时间",
            name: "startTime",
            type: "picker",
            placeholder: "请选择开始时间",
            valueFormat:'YYYY-MM-DD HH:mm',
            showTime:{ format: 'HH:mm' }
          },
          {
            label: "结束时间",
            name: "endTime",
            type: "picker",
            placeholder: "请选择结束时间",
            valueFormat:'YYYY-MM-DD HH:mm',
            showTime:{ format: 'HH:mm' }
          },
          {
            label: "时长(小时)",
            name: "duration",
            type: "number",
            placeholder: "请输入时长",
          },
          {
            label: "法定假日",
            name: "holiday",
            type: "radio",
            select: [
              { value: 1, name: "是" },
              { value: 2, name: "否" }
            ],
          },
          {
            label: "加班原因",
            name: "reason",
            type: "textarea",
            placeholder: "请输入加班原因",
          }
        ],
        overtimeRules:{
          startTime: [
            { required: true, message: "请选择开始时间", trigger: "change"},
          ],
          endTime: [
            { required: true, message: "请选择结束时间", trigger: "change"},
          ],
          duration: [
            { required: true, message: "请输入请假时长", trigger: "blur"},
          ],
          statutoryHoliday: [
            { required: true, message: "请选择法定假日", trigger: "change"},
          ],
          cause: [
            { required: true, message: "请输入加班原因", trigger: "blur"},
          ]
        },
        vacateModel: [
          {
            label: "请假类型",
            name: "state",
            type: "select",
            placeholder: "请选择请假类型",
            select: [
              { value: 1, name: "年假" },
              { value: 2, name: "产假" },
              { value: 3, name: "陪产假" },
              { value: 4, name: "婚假 " },
              { value: 5, name: "例假 " },
              { value: 6, name: "丧假" },
              { value: 7, name: "哺乳假" },
              { value: 8, name: "事假" },
              { value: 9, name: "调休" },
              { value: 10, name: "病假" },
              { value: 11, name: "其他" }
            ],
          },
          {
            label: "开始时间",
            name: "startTime",
            type: "picker",
            placeholder: "请选择开始时间",
            valueFormat:'YYYY-MM-DD HH:mm',
            showTime:{ format: 'HH:mm' }
            
          },
          {
            label: "结束时间",
            name: "endTime",
            type: "picker",
            placeholder: "请选择结束时间",
            valueFormat:'YYYY-MM-DD HH:mm',
            showTime:{ format: 'HH:mm' }
          },
           {
            label: "时长(小时)",
            name: "duration",
            type: "number",
            placeholder: "请输入时长",
          },
          {
            label: "请假原因",
            name: "reason",
            type: "textarea",
            placeholder: "请输入请假原因",
          }
        ],
        vacateRules:{
          state:[
            { required: true, message: "请选择请假类型", trigger: "change"},
          ],
          startTime: [
            { required: true, message: "请选择开始时间", trigger: "change"},
          ],
          endTime: [
            { required: true, message: "请选择结束时间", trigger: "change"},
          ],
          reason: [
            { required: true, message: "请输入加班原因", trigger: "blur"},
          ],
          holiday: [
            { required: true, message: "请选择是否法定假日", trigger: "change"},
          ],
        }
    };
  },
  created(){
    this.overTimeParam.userId = this.policeId||this.user.id
    this.leaveParam.userId = this.policeId||this.user.id
  },
  methods: {
    // 加班
    overtime(){
      let param = {
        formTitle: this.overtimeModel,
        record:{
          holiday:2,
          type:1,
          number:this.user.number,
          policeName:this.user.name,
          userId:this.user.id,
          organizationId:this.user.organizationId,
          organizationName:this.user.organizationName,
        },
        rules: this.overtimeRules,
        submitFun:(params) => {
          return this.$api.overTimeService.postByAux(params).then((res)=>{
            return res.data
          })
        },
      };
      let option = {
        title: "加班申请",
        width: 500,
        centered: true,
        maskClosable: false,
        okText: "提交",
      };
      this.modal(param, option, fromModel);
    },
    // 请假
    vacate(){
      let param = {
        formTitle: this.vacateModel,
        rules: this.vacateRules,
        record:{
          type:2,
          number:this.user.number,
          policeName:this.user.name,
          userId:this.user.id,
          organizationId:this.user.organizationId,
          organizationName:this.user.organizationName,
        },
        submitFun:(params) => {
          return this.$api.overTimeService.postByAux(params).then((res)=>{
            return res.data
          })
        },
      };
      let option = {
        title: "请假申请",
        width: 500,
        centered: true,
        maskClosable: false,
        okText: "提交",
      };
      this.modal(param, option, fromModel);
    },
    // 弹窗
    modal(obj, option, model) {
      const defaultProps = {
        on: {
          ok() {
            // console.log('ok 回调')
          },
          cancel() {
            // e.handleDestroy()
            // console.log('cancel 回调')
          },
          close() {
            // e.handleDestroy()
            // console.log('modal close 回调')
          },
        },
      };
      let formProps = Object.assign(obj, defaultProps);
      this.$dialog(
        model,
        // form props
        formProps,
        // modal props
        option
      );
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '1': "通过",
        '2': "不通过",
      };
      return statusMap[status];
    },
    typeFilter(type) {
      const statusMap = {
        1: "年假 ",
        2: "产假 ",
        3: "陪产假",
        4: "婚假",
        5: "例假",
        6: "丧假",
        7: "哺乳假",
        8: "事假",
        9: "调休",
        10: "病假",
        11: "其他"
      };
      return statusMap[type];
    },
     resultFilter(result){
      const statusMap = {
        0:'未审批' ,
            1:'审批通过' ,
            2:'审批拒绝' ,
      };
      return statusMap[result];
    }
  },
  computed: {
    ...mapState("setting", ["theme", "pageMinHeight"]),
    ...mapGetters("account", ["user","loginType"]),
    rowCredSelection() {
      return {
        selectedRowKeys: this.selectedCredRowKeys,
        onChange: this.onCredSelectChange,
      };
    },
    rowEqupSelection() {
      return {
        selectedRowKeys: this.selectedEqupRowKeys,
        onChange: this.onEqupSelectChange,
      };
    },
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
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
}
</style>