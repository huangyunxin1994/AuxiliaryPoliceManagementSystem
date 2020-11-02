<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-card :bordered="false">
      <div
        class="position-and-level-title"
        :style="{ 'border-color': theme.color }"
      >
        工资查询
      </div>
      <a-form-model 
            :model="form" 
            :label-col="labelCol" 
            :wrapper-col="wrapperCol" 
            class="baseForm">
            <a-row>
                <a-col :md="24" :lg="12" :xl="12" :xxl="6">
                    <a-form-model-item label="请选择查询月份" :labelCol="{xs:{span: 24},sm:{span: 8}}" :wrapperCol="{xs:{span: 24},sm:{span: 16}}">
                        <a-month-picker :disabled-date="disabledDate" placeholder="请选择月份" />
                    </a-form-model-item>
                </a-col>
            </a-row>
        </a-form-model>
        <s-table
          ref="table"
          rowKey="key"
          :columns="wageColumns"
          :data="wageData"
          :scroll="{ y: 600, x: 650 }"
          showPagination="auto"
        >
        </s-table>
    </a-card>
    <a-card :bordered="false">
      <div class="position-and-level-title" :style="{ 'border-color': theme.color }">合同信息</div>
      
      <s-table
        ref="table"
        rowKey="key"
        :columns="credColumns"
        :data="loadCredData"
        :scroll="{ y: 600, x: 650 }"
        showPagination="auto"
      >
        <span slot="action" slot-scope="text, record">
					<a @click="handleEdit(record)">查看</a>
				</span>
      </s-table>
      
    </a-card>
  </div>
</template>

<script>
import { mapState,mapGetters } from "vuex";
import STable from "@/components/Table_/";
// import TaskForm from "@/components/formModel/formModel";
import moment from 'moment';



export default {
  name: "OrganManage",
  components: {
    STable,
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
      wageColumns:[
        {
          title: "序号",
          dataIndex: "key",
          key: "key",
          width: 60,
        },
        {
          title: "发放日期",
          dataIndex: "name",
          key: "name",
          ellipsis: true,
          width: 100,
        },
        {
          title: "结束合同日期",
          dataIndex: "num",
          key: "num",
          ellipsis: true,
          width: 100
        },
        {
          title: "合同期限",
          dataIndex: "organizationName",
          key: "organizationName",
          ellipsis: true,
          width: 100
        }
      ],
      wageData: () => {
        return new Promise((resolve) => {
          resolve({
            data: [
              {
                key: "1",
                name: "张三",
                num:'123456',
                organizationName: "青秀分局"
              },
              {
                key: "2",
                name: "李四",
                num:'123456',
                organizationName: "仙湖分局"
              },
            ],
            pageSize: 10,
            pageNo: 1,
            totalPage: 1,
            totalCount: 10,
          });
        }).then((res) => {
          return res;
        });
      },
      credColumns: [
        {
          title: "序号",
          dataIndex: "key",
          key: "key",
          width: 60,
        },
        {
          title: "其实合同日期",
          dataIndex: "name",
          key: "name",
          ellipsis: true,
          width: 100,
        },
        {
          title: "结束合同日期",
          dataIndex: "num",
          key: "num",
          ellipsis: true,
          width: 100
        },
        {
          title: "合同期限",
          dataIndex: "organizationName",
          key: "organizationName",
          ellipsis: true,
          width: 100
        },
        {
          table: "合同附件",
          dataIndex: "action",
          scopedSlots: { customRender: "action" },
          width: 150,
        }
      ],
      queryParam:{
        id:""
      },
      loadCredData: (params) => {
        let param = Object.assign(params,this.queryParam)
        return this.$api.contractService.getdetails(param).then((res)=>{
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
      
    };
  },
  created(){
    this.queryParam.id = this.policeId || this.user.id
  },
  methods: {
    moment,
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
    

    // 开始时间和结束时间
    onChange(date, dateString) {
      console.log(date, dateString);
    },

    
    
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    disabledDate(current) {
      // Can not select days before today and today
      return current && current > moment().endOf('day');
    },
    handleEdit(data){
      console.log(data)
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        processing: "启用",
        error: "禁用",
      };
      return statusMap[status];
    },
  },
  computed: {
    ...mapState("setting", ["theme", "pageMinHeight"]),
    ...mapGetters("account", ["user"]),
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