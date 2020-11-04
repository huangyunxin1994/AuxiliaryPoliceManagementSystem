<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-card :bordered="false">
      <div
        class="position-and-level-title"
        :style="{ 'border-color': theme.color }"
      >
        上下班时间配置
      </div>
      <a-row :gutter="24">
        <a-col :lg="10" :md="10" :xs="10">
          <span style="width: 100px">上午上班时间：</span>
          <a-time-picker
            v-model="commData.morningUppertime"
            format="HH:mm"
            valueFormat="HH:mm"
            style="width: calc(100% - 100px); margin-bottom: 24px"
          />
        </a-col>
        <a-col :lg="10" :md="10" :xs="10">
          <span style="width: 100px">上午下班时间：</span>
          <a-time-picker
            v-model="commData.morningLowertime"
            format="HH:mm"
            valueFormat="HH:mm"
            style="width: calc(100% - 100px); margin-bottom: 24px"
            :disabled="commData.state === 2 || commData.state === 4 "
          />
        </a-col>
        <a-col :lg="4" :md="4" :xs="4" style="margin-bottom: 24px">
          <a-checkbox :checked="commData.state == 1 ||commData.state == 3" @change="changeCommMorn"> 启用 </a-checkbox>
        </a-col>
        <a-col :lg="10" :md="10" :xs="10">
          <span style="width: 100px">下午下班时间：</span>
          <a-time-picker
            v-model="commData.afternoonLowertime"
            format="HH:mm"
            valueFormat="HH:mm"
            style="width: calc(100% - 100px); margin-bottom: 24px"
          />
        </a-col>
        <a-col :lg="10" :md="10" :xs="10">
          <span style="width: 100px">下午上班时间：</span>
          <a-time-picker
            v-model="commData.afternoonUppertime"
            format="HH:mm"
            valueFormat="HH:mm"
            style="width: calc(100% - 100px); margin-bottom: 24px"
            :disabled="commData.state === 1 || commData.state === 4 "
          />
        </a-col>
        <a-col :lg="4" :md="4" :xs="4" style="margin-bottom: 24px">
          <a-checkbox :checked="commData.state == 2 ||commData.state == 3" @change="changeCommAfter"> 启用 </a-checkbox>
        </a-col>
        <a-col :span="24" style="margin-bottom: 24px">
          <a-button type="primary" icon="save" @click="handleSave"
            >保存配置</a-button
          >
        </a-col>
      </a-row>

      <a-row :gutter="24">
        <a-col :md="12" :xs="24">
          <div
            class="position-and-level-title"
            :style="{ 'border-color': theme.color }"
          >
            证件类型配置
          </div>
          <div class="table-operator" style="margin-bottom: 24px">
            <a-button type="primary" icon="plus" @click="handleCredAdd"
              >新建</a-button
            >
            <a-dropdown v-if="selectedCredRowKeys.length > 0">
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
            ref="credtable"
            :rowKey="(record)=>record.id"
            :columns="credColumns"
            :data="loadCredData"
            :rowSelection="rowCredSelection"
            :scroll="{ y: 600, x: 650 }"
            showPagination="auto"
          >
            <template slot="status" slot-scope="status">
              <a-badge :status="status" :text="status | statusFilter" />
            </template>
            <span slot="action" slot-scope="text, record">
              <a @click="handleCredEdit(record)">编辑</a>
              <a-divider type="vertical" />
              <a @click="handleCredDel(record)">删除</a>
            </span>
          </s-table>
        </a-col>
        <a-col :md="12" :xs="24">
          <div
            class="position-and-level-title"
            :style="{ 'border-color': theme.color }"
          >
            装备类型配置
          </div>
          <div class="table-operator" style="margin-bottom: 24px">
            <a-button type="primary" icon="plus" @click="handleEqupAdd"
              >新建</a-button
            >
            <a-dropdown v-if="selectedEqupRowKeys.length > 0">
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
            ref="equptable"
            :rowKey="(record)=>record.id"
            :columns="equpColumns"
            :data="loadEqupData"
            :rowSelection="rowEqupSelection"
            :scroll="{ y: 600, x: 650 }"
            showPagination="auto"
          >
            <template slot="status" slot-scope="status">
              <a-badge :status="status" :text="status | statusFilter" />
            </template>
            <span slot="action" slot-scope="text, record">
              <a @click="handleEqupEdit(record)">编辑</a>
              <a-divider type="vertical" />
              <a @click="handleEqupDel(record)">删除</a>
            </span>
          </s-table>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
import STable from "@/components/Table_/";
import TaskForm from "@/components/formModel/formModel";
const credTitle = [
  {
    label: "证件类型名称",
    name: "name",
    type: "input",
  },
  {
    label: "证件类型描述",
    name: "remake",
    type: "textarea",
  },
  {
    name: "type",
  },
];
const equpTitle = [
  {
    label: "装备类型名称",
    name: "name",
    type: "input",
  },
  {
    label: "装备类型描述",
    name: "remake",
    type: "textarea",
  },
  {
    name: "type",
  },
];
const credRules = {
  name: [{ required: true, message: "请输入证件类型名称", trigger: "blur" }],
};
const equpRules = {
  name: [{ required: true, message: "请输入装备类型名称", trigger: "blur" }],
};
export default {
  name: "OrganManage",
  components: {
    STable,
  },
  data() {
    return {
      commData:{
        morningUppertime:"",
        morningLowertime:"",
        afternoonUppertime:"",
        afternoonLowertime:"",
        state:4
      },
      credColumns: [
        {
          title: "序号",
          dataIndex: "key",
          key: "key",
          width: 60,
        },
        {
          title: "类型名称",
          dataIndex: "name",
          key: "name",
          ellipsis: true,
        },
        {
          title: "类型描述",
          dataIndex: "remake",
          key: "remake",
          ellipsis: true,
        },
        {
          table: "操作",
          dataIndex: "action",
          scopedSlots: { customRender: "action" },
          width: 150,
        },
      ],
      equpColumns: [
        {
          title: "序号",
          dataIndex: "key",
          key: "key",
          width: 60,
        },
        {
          title: "类型名称",
          dataIndex: "name",
          key: "name",
          ellipsis: true,
        },
        {
          title: "类型描述",
          dataIndex: "remake",
          key: "remake",
          ellipsis: true,
        },
        {
          table: "操作",
          dataIndex: "action",
          scopedSlots: { customRender: "action" },
          width: 150,
        },
      ],
      // 查询条件参数
      queryEParam: {},
      queryCParam: {},
      loadCredData: (parameter) => {
        const requestParameters = Object.assign({}, parameter, this.queryCParam)
        return this.$api.otherItemsService.getCredDataList(requestParameters)
          .then(res => {
            res.data.data.list.map((i,k)=>i.key=k+1)
            return res.data
          })
      },
      
      loadEqupData: (parameter) => {
        const requestParameters = Object.assign({}, parameter, this.queryEParam)
        return this.$api.otherItemsService.getEqupDataList(requestParameters)
          .then(res => {
            res.data.data.list.map((i,k)=>i.key=k+1)
            return res.data
          })
      },
      selectedCredRowKeys: [],
      selectedCredRows: [],
      selectedEqupRowKeys: [],
      selectedEqupRows: [],
      levelList: [],
    };
  },
  created(){
    this.$api.otherItemsService.getCommDataList()
    .then(res => {
      if(res.data.data.list.length>0)
      this.commData = res.data.data.list[0]
    })
  },
  methods: {
    /**
     * 保存上下班配置方法
     */
    handleSave() {
      const _this = this
      this.$confirm({
        title: "提示",
        content: `确定保存配置吗？`,
        okText: "确认",
        okType: "primary",
        centered: true,
        cancelText: "取消",
        onOk() {
          console.log("OK");
          // 在这里调用删除接口
          if(! _this.commData.id){
            _this.$api.otherItemsService.postCommuting(_this.commData)
            .then(res => {
              if(res.data.code == 0){
                _this.$message.success(res.data.msg);
              }else{
                _this.$message.error(res.data.msg);
              }
            }).catch(err=>{
              _this.$message.error(err.data.msg);
            })
          }else{
            _this.$api.otherItemsService.putCommuting(_this.commData)
            .then(res => {
              if(res.data.code == 0){
                _this.$message.success(res.data.msg);
              }else{
                _this.$message.error(res.data.msg);
              }
            }).catch(err=>{
              _this.$message.error(err.data.msg);
            })
          }
         
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    },
    /**
     * 添加证件方法
     */
    handleCredAdd() {
      let formProps = {
        record:{
          type:1
        },
        formTitle: credTitle,
        rules: credRules,

        submitFun: (parameter) => {
          return this.$api.otherItemsService.postCertEquip(parameter)
            .then(res => {
              return res.data
            })
        },
      };
      let modalProps = {
        title: "新增",
        width: 700,
        centered: true,
        maskClosable: false,
        okText: "提交",
      };
      this.openModal(TaskForm, formProps, modalProps,()=>{
        this.$refs.credtable.refresh(true)
      });
    },
    /**
     * 编辑证件方法
     */
    handleCredEdit(record) {
      console.log(record);
      let formProps = {
        record: record,
        formTitle: credTitle,
        rules: credRules,
        submitFun: (parameter) => {
          return this.$api.otherItemsService.putCertEquip(parameter)
            .then(res => {
              return res.data
            })
        },
      };
      let modalProps = {
        title: "编辑",
        width: 700,
        centered: true,
        maskClosable: false,
        okText: "提交",
      };
      this.openModal(TaskForm, formProps, modalProps,()=>{
        this.$refs.credtable.refresh(true)
      });
    },
    /**
     * 删除证件方法
     */
    handleCredDel(param){
      const _this = this
      this.$confirm({
        title: "警告",
        content: `真的要删除证件 [ ${param.name} ] 吗?`,
        okText: "删除",
        okType: "danger",
        centered: true,
        cancelText: "取消",
        onOk() {
          console.log(_this);
          _this.$api.otherItemsService
            .deleteCertEquip(param.id)
            .then((res) => {
              if (res.data.code == 0) {
                _this.$message.success(res.data.msg);
                _this.$refs.credtable.refresh(true)
              } else {
                _this.$message.error(res.data.msg);
              }
            })
            .catch((err) => {
              _this.$message.error(err.data.msg);
            });
        },
        onCancel() {},
      });
    },
    /**
     * 添加装备方法
     */
    handleEqupAdd() {
      let formProps = {
        record:{
          type:2
        },
        formTitle: equpTitle,
        rules: equpRules,

        submitFun: (parameter) => {
          return this.$api.otherItemsService.postCertEquip(parameter)
            .then(res => {
              return res.data
            })
        },
      };
      let modalProps = {
        title: "新增",
        width: 700,
        centered: true,
        maskClosable: false,
        okText: "提交",
      };
      this.openModal(TaskForm, formProps, modalProps,()=>{
        this.$refs.equptable.refresh(true)
      });
    },
    /**
     * 编辑装备方法
     */
    handleEqupEdit(record) {
      let formProps = {
        record: record,
        formTitle: equpTitle,
        rules: equpRules,
        submitFun: (parameter) => {
          return this.$api.otherItemsService.putCertEquip(parameter)
            .then(res => {
              return res.data
            })
        },
      };
      let modalProps = {
        title: "编辑",
        width: 700,
        centered: true,
        maskClosable: false,
        okText: "提交",
      };
      this.openModal(TaskForm, formProps, modalProps,()=>{
        this.$refs.equptable.refresh(true)
      });
    },
    /**
     * 删除装备方法
     */
    handleEqupDel(param){
      const _this = this
      this.$confirm({
        title: "警告",
        content: `真的要删除装备 [ ${param.name} ] 吗?`,
        okText: "删除",
        okType: "danger",
        centered: true,
        cancelText: "取消",
        onOk() {
          console.log(_this);
          _this.$api.otherItemsService
            .deleteCertEquip(param.id)
            .then((res) => {
              if (res.data.code == 0) {
                _this.$message.success(res.data.msg);
                _this.$refs.equptable.refresh(true)
              } else {
                _this.$message.error(res.data.msg);
              }
            })
            .catch((err) => {
              _this.$message.error(err.data.msg);
            });
        },
        onCancel() {},
      });
    },
    /**
     * 表单弹窗
     * @param form form模板页面，通过import引入
     * @param formProps form配置项 Object
     * @param modalProps 弹窗配置项 Object
     */
    openModal(form, formProps, modalProps,fn) {
      const defaultModalProps = {
        on: {
          ok() {
            console.log("ok 回调");
            fn()
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
    onCredSelectChange(selectedRowKeys, selectedRows) {
      this.selectedCredRowKeys = selectedRowKeys;
      this.selectedCredRows = selectedRows;
    },
    onEqupSelectChange(selectedRowKeys, selectedRows) {
      this.selectedEqupRowKeys = selectedRowKeys;
      this.selectedEqupRows = selectedRows;
    },
    changeCommMorn(){
      switch(this.commData.state){
        case 1 : {
          this.commData.state = 4;
          break;
        }
        case 2 : {
          this.commData.state = 3;
          break;
        }
        case 3 : {
          this.commData.state = 2;
          break;
        }
        case 4 : {
          this.commData.state = 1;
          break;
        }
      }
    },
    changeCommAfter(){
      switch(this.commData.state){
        case 1 : {
          this.commData.state = 3;
          break;
        }
        case 2 : {
          this.commData.state = 4;
          break;
        }
        case 3 : {
          this.commData.state = 1;
          break;
        }
        case 4 : {
          this.commData.state = 2;
          break;
        }
      }
      console.log(this.commData.state)
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
</style>