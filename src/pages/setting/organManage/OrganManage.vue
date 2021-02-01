<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-card :bordered="false">
      <a-row :gutter="24">
        <a-col :lg="7" :xl="5" :xxl="4">
          <ant-tree
            ref="tree"
            :replaceFields="replaceFields"
            :allowEdit="true"
            :allowReload="true"
            @loadTreeNode="loadTreeNode"
            @editTreeNode="editTreeNode"
            @addTreeNode="addTreeNode"
            @removeTreeNode="removeTreeNode"
          >
          </ant-tree>
        </a-col>
        <a-col :md="24" :lg="17" :xl="19" :xxl="20">
          <a-row>
            <div class="table-page-search-wrapper">
              <a-form layout="inline">
                <a-row :gutter="48">
                  <a-col :md="8" :sm="24">
                    <a-form-item label="模糊查询">
                      <a-input
                        v-model="queryParam.search"
                        placeholder="请输入要查询的关键词"
                      />
                    </a-form-item>
                  </a-col>
                  <a-col :md="8" :sm="24">
                    <a-form-item label="角色选择">
                      <a-select v-model="queryParam.menuId">
                        <a-select-option value=""> 全部 </a-select-option>
                        <a-select-option :value="item.id" v-for="item in roleList" :key="item.id">
                          {{item.name}}
                        </a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <template v-if="advanced">
                    <!-- <a-col :md="8" :sm="24">
                      <a-form-item label="岗位选择">
                        <a-select  v-model="queryParam.postId" style="width: 100%">
                          <a-select-option value=""> 全部 </a-select-option>
                          <a-select-option :value="item.id" v-for="item in postList" :key="item.id"> {{item.name}} </a-select-option>
                        </a-select>
                      </a-form-item>
                    </a-col> -->
                    <a-col :md="8" :sm="24">
                      <a-form-item label="启用状态">
                        <a-select
                          v-model="queryParam.state"
                          style="width: 100%"
                        >
                          <a-select-option value=""> 全部 </a-select-option>
                          <a-select-option value="1"> 是 </a-select-option>
                          <a-select-option value="2"> 否 </a-select-option>
                        </a-select>
                      </a-form-item>
                    </a-col>
                  </template>
                  <a-col :md="(!advanced && 8) || 24" :sm="24">
                    <span
                      class="table-page-search-submitButtons"
                      :style="
                        (advanced && { float: 'right', overflow: 'hidden' }) ||
                        {}
                      "
                    >
                      <a-button
                        type="primary"
                        @click="$refs.table.refresh(true)"
                        >查询</a-button
                      >
                      <a-button style="margin-left: 8px" @click="reloadData"
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
          </a-row>
          <div class="table-operator" style="margin-bottom: 24px">
            <a-button type="primary" icon="plus" @click="handleAdd" style="margin-right: 10px"
              >新建</a-button
            >
            <a-button type="danger" icon="delete" @click="handleDel" :disabled="selectedRowKeys.length == 0"
              >删除</a-button
            >
            <!-- <a-dropdown v-if="selectedRowKeys.length > 0">
              <a-menu slot="overlay" @click="handleDel">
                <a-menu-item key="1"><a-icon type="delete" />删除</a-menu-item>
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
            showPagination="auto"
          >
            <template slot="isEnable" slot-scope="isEnable">
              <a-badge
                :status="isEnable == '1' ? 'processing' : 'error'"
                :text="isEnable | statusFilter"
              />
            </template>
            <span slot="action" slot-scope="text, record">
              <a @click="handleEdit(record)" v-if="record.isSystem===2">编辑</a>
              <a-divider type="vertical"  v-if="record.isSystem===2"/>
              <a @click="handleReset(record)">重置密码</a>
            </span>
          </s-table>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import STable from "@/components/Table_/";
import AntTree from "@/components/tree_/Tree";
import TaskForm from "@/components/formModel/formModel";
import { validatePhone,validateLength  } from "@/config/default/rules";

let organTitle = [
  {
    label: "上级组织",
    name: "parentId",
    type: "treeSelect",
    replaceFields: {
      children: "children",
      title: "name",
      key: "id",
      value: "id",
    },
  },
  { label: "组织名称", name: "name", type: "input" },
];

const organRules = {
  name: [{ required: true, message: "请输入组织名称", trigger: "blur" }],
  parentId: [
    {
      required: true,
      message: "请选择上级组织",
      trigger: "change",
    },
  ],
};
const tableRules = {
  account: [{ required: true, message: "请输入账号", trigger: "change" },
  { required: true, max:20, validator: validateLength, trigger: "change" }],
  organizationId: [
    {
      required: true,
      message: "请选择组织",
      trigger: "change",
    },
  ],
  roleId: [
    {
      type: "array",
      required: true,
      message: "请至少选择一项",
      trigger: "change",
    },
  ],
  name: [{ required: true, message: "请输入姓名", trigger: "change" },
  { required: true, max:20, validator: validateLength, trigger: "change" }],
  number: [{ required: true, message: "请输入警员编号", trigger: "change" },
  { required: true, max:20, validator: validateLength, trigger: "change" }],
  phone: [{ validator: validatePhone, trigger: "change" }],
  postName:[{ max:20, validator: validateLength, trigger: "change" }],
};
export default {
  name: "OrganManage",
  components: {
    STable,
    AntTree,
    TaskForm,
  },
  data() {
    return {
      advanced: true,
      tableTitle: [],
      roleList:[],
      replaceFields: {
        children: "children",
        title: "name",
        key: "id",
      },
      loading: false,
      scheduleColumns: [
        {
          title: "序号",
          dataIndex: "key",
          key: "key",
          width: 60,
        },
        {
          title: "账号",
          dataIndex: "account",
          key: "account",
          width: 120,
        },
        {
          title: "姓名",
          dataIndex: "name",
          key: "name",
          width: 120,
        },
        {
          title: "警员编号",
          dataIndex: "number",
          key: "number",
          width: 100,
        },
        {
          title: "组织",
          dataIndex: "organizationName",
          key: "organizationName",
          width: 200,
        },
        {
          title: "岗位",
          dataIndex: "postName",
          key: "postName",
          width: 100,
        },
        {
          title: "联系电话",
          dataIndex: "phone",
          key: "phone",
          width: 150,
        },
        {
          title: "是否启用",
          dataIndex: "isEnable",
          key: "isEnable",
          width: 100,
          scopedSlots: { customRender: "isEnable" },
        },
        {
          table: "操作",
          dataIndex: "action",
          scopedSlots: { customRender: "action" },
          width: 150,
        },
      ],
      // 查询条件参数
      queryParam: {
        search: "",
        state: "",
        menuId:"",
        organizationId: "",
        postId:""
      },
      loadScheduleData: (parameter) => {
        const requestParameters = Object.assign({}, parameter, this.queryParam);
        return this.$api.organizationService
          .getUser(requestParameters)
          .then((res) => {
            res.data.data.list.map((i,k)=>{
                i.key=k+1
                i.role=[]
                i.oRole = []
                res.data.data.data[i.id]&&res.data.data.data[i.id].map(j => {
                  i.role.push(j.menuId)
                  i.oRole.push(j.menuId)
                })
            }
            )
            return res.data;
          });
      },
      selectedRowKeys: [],
      selectedRows: [],
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    loadTreeNode(obj) {
      this.queryParam.organizationId = obj.id || "";
      this.$refs.table.refresh(true);
    },
    handleAdd() {
      let formProps = {
        record: {
          organizationId: this.queryParam.organizationId,
          isEnable:1
        },
        formTitle: this.tableTitle,
        rules: tableRules,
        submitFun: (parameter) => {
          return this.$api.organizationService
            .postUser(parameter)
            .then((res) => {
              return res.data;
            });
        },
      };
      let modalProps = {
        title: "新建管理员用户",
        width: 700,
        centered: true,
        maskClosable: false,
        okText: "提交",
      };
      this.openModal(TaskForm, formProps, modalProps,()=>{
        this.$refs.table.refresh(true);
      });
    },
    handleEdit(record) {
      record.organizationId = !record.organizationId&&""||record.organizationId
      let formProps = {
        record: record,
        formTitle: this.tableTitle,
        rules: tableRules,
        submitFun: (parameter) => {
          return this.$api.organizationService
            .putUser(parameter)
            .then((res) => {
              return res.data;
            });
        },
      };
      let modalProps = {
        title: "编辑管理员用户",
        width: 700,
        centered: true,
        maskClosable: false,
        okText: "提交",
      };
      this.openModal(TaskForm, formProps, modalProps,()=>{
        this.$refs.table.refresh(true);
      });
    },
    handleClick(e) {
      this.queryParam = {
        key: e.key,
      };
      this.$refs.table.refresh(true);
    },
    //编辑树节点
    editTreeNode(params) {
      const id = params.id;
      const name = params.name;
      const code = params.code;
      const parentId = params.parentId || "";
      let obj = { id, name, code, parentId };
      let organTitle = []
      if(parentId == ""){
        organTitle = [
          { label: "组织名称", name: "name", type: "input" }
        ]
      }else{
        organTitle = [
          {
            label: "上级组织",
            name: "parentId",
            type: "treeSelect",
            disabled:true,
            replaceFields: {
              children: "children",
              title: "name",
              key: "id",
              value: "id",
            },
          },
          { label: "组织名称", name: "name", type: "input" }
        ]
      }
      let formProps = {
        record: obj,
        formTitle: organTitle,
        rules: organRules,
        submitFun: (parameter) => {
          return this.$api.organizationService
            .putOrganization(parameter)
            .then((res) => {
              return res.data;
            });
        },
      };
      let modalProps = {
        title: "编辑组织",
        width: 700,
        centered: true,
        maskClosable: false,
        okText: "提交",
      };
      this.openModal(TaskForm, formProps, modalProps,()=>{
        this.$refs.tree.loadTree();
      });
    },
    //添加树节点
    addTreeNode(params) {
      const name = "";
      const parentId = params.id;
      let obj = { name, parentId };
      let formProps = {
        record: obj,
        formTitle: organTitle,
        rules: organRules,
        submitFun: (parameter) => {
          return this.$api.organizationService
            .postOrganization(parameter)
            .then((res) => {
              return res.data;
            });
        },
      };
      let modalProps = {
        title: "新建组织",
        width: 700,
        centered: true,
        maskClosable: false,
        okText: "提交",
      };
      this.openModal(TaskForm, formProps, modalProps,()=>{
        this.$refs.tree.loadTree();
      });
    },
    //删除树节点
    removeTreeNode(params) {
     const _this = this
      this.$confirm({
        title: "警告",
        content: `是否确认删除组织 ${params.name} ?`,
        okText: "删除",
        okType: "danger",
        centered: true,
        cancelText: "取消",
        onOk() {
          _this.$api.organizationService
            .deleteOrganization({organizationId :params.id})
            .then((res) => {
              if (res.data.code == 0) {
                _this.$message.success(res.data.msg);
                _this.selectedRowKeys=[]
                _this.$refs.tree.loadTree()
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
    //
    /**
     * 表单弹窗
     * @param form form模板页面，通过import引入
     * @param formProps form配置项 Object
     * @param modalProps 弹窗配置项 Object
     */
    openModal(form, formProps, modalProps,fn) {
      // const _this = this
      const defaultModalProps = {
        on: {
          ok() {
             fn()
          },
          cancel() {
          },
          close() {
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
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    //重新加载数据
    reloadData() {
      this.queryParam.search = ''
      this.queryParam.state = ''
      this.queryParam.menuId = ''
      this.queryParam.postId = ''
      this.$refs.table.refresh(true);
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    getRoleList() {
      this.$api.organizationService.getRole().then((res) => {
        const list = res.data.data.data.sort(function(a,b){
            return a.number-b.number;
        })
        list.splice(list.findIndex(i=>i.code==='xtgl'),1)
        this.roleList = Object.assign([],list)
          this.tableTitle = [
          {
            label: "账号",
            name: "account",
            type: "input",
          },
          {
            label: "组织",
            name: "organizationId",
            type: "treeSelect",
            replaceFields: {
              children: "children",
              title: "name",
              key: "id",
              value: "id",
            },
          },
          {
            label: "角色",
            name: "role",
            type: "checkboxgroup",
            showBgc: true,
            select: list,
          },
          {
            label: "姓名",
            name: "name",
            type: "input",
          },
          {
            label: "警员编号",
            name: "number",
            type: "input",
          },

          {
            label: "岗位",
            name: "postName",
            type: "input",
          },
          {
            label: "联系电话",
            name: "phone",
            type: "input",
          },
          {
            label: "是否启用",
            name: "isEnable",
            type: "radio",
            select: [
              { name: "是", value: 1 },
              { name: "否", value: 2 },
            ],
          },
        ];
        
      });
    },
    //重置密码
    handleReset(row){
      const _this = this
      this.$confirm({
        title: "警告",
        content: `是否确认重置管理员 ${row.name} 密码为123456?`,
        okText: "重置",
        okType: "danger",
        centered: true,
        cancelText: "取消",
        onOk() {
          _this.$api.organizationService.putResetPassword({id:row.id}).then(res=>{
            if(res.data.code ===0){
              _this.$message.success(res.data.msg)
              _this.$refs.table.refresh()
            }else{
              _this.$message.error(res.data.msg)
            }
          }).catch(err=>{
            _this.$message.error(err.data.msg)
          })
        },
        onCancel() {},
      });
      
    },
    handleDel(){
       const _this = this
      this.$confirm({
        title: "警告",
        content: `是否确认删除所选用户?`,
        okText: "删除",
        okType: "danger",
        centered: true,
        cancelText: "取消",
        onOk() {
          _this.$api.organizationService.deleteUser({list:_this.selectedRowKeys}).then(res=>{
            if(res.data.code ===0){
              _this.$message.success(res.data.msg)
              _this.selectedRowKeys = []
              _this.selectedRows = []
              _this.$refs.table.refresh()
            }else{
              _this.$message.error(res.data.msg)
            }
          }).catch(err=>{
            _this.$message.error(err.data.msg)
          })
        },
        onCancel() {},
      });
    }
  
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: "是",
        2: "否",
      };
      return statusMap[status];
    },
  },
  computed: {
    ...mapState("setting", ["pageMinHeight"]),
    ...mapGetters("account", ["user"]),
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange,
         getCheckboxProps: (record) => ({
          props: {
            disabled: record.isSystem === 1, // Column configuration not to be checked
            name: record.id,
          },
        }),
      };
    },
  },
};
</script>

<style scoped lang="less">
@import "../index";
</style>
