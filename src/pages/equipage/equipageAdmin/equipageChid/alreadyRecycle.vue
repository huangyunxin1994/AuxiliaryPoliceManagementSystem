<template>
    <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
        <a-card :bordered="false">
          <div class="table-page-search-wrapper">
            <a-form layout="inline">
              <a-row :gutter="48">
                <a-col :md="8" :sm="24">
                  <a-form-item label="关键词搜索">
                    <a-input v-model="queryParam.describes" placeholder="请输入要查询的关键词" />
                  </a-form-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <a-form-item label="组织选择">
                    <select-tree ref="selectTree" :value="queryParam.organizationId" style="width: 100%" @handleTreeChange="handleTreeChange"></select-tree>
                  </a-form-item>
                </a-col>
                <template v-if="advanced">
                  <a-col :md="8" :sm="24">
                    <a-form-item label="配发日期">
                      <a-date-picker @change="onChange" style="width: 100%"/>
                    </a-form-item>
                  </a-col>
                </template>
                <template v-if="advanced">
                  <a-col :md="8" :sm="24">
                    <a-form-item label="回收日期">
                      <a-date-picker @change="onChange" style="width: 100%"/>
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
                      @click="reloadData"
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
          <s-table
            ref="table"
            rowKey="key"
            :columns="scheduleColumns"
            :data="loadScheduleData"
            :scroll="{y:600}"
            showPagination="auto">
            <template
              slot="action"
              slot-scope="equState">
              <a-badge :status="equState" :text="equState | statusFilter"/>
            </template>
          </s-table> 
        </a-card>
    </div>
</template>

<script>
import { mapState,mapGetters } from "vuex";
import STable from '@/components/Table_/'
import selectTree from "@/components/treeSelect/TreeSelect";
export default {
    components:{
        STable,
        selectTree
    },
    data(){
        return{
          openKeys: ['key-01'],
          loading:false,
          value:null,
          advanced:false,
          scheduleColumns: [
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
          width: 80,
        },
        {
          title: "辅警编号",
          dataIndex: "number",
          key: "number",
        },
        {
          title: "所属组织",
          dataIndex: "organizationName",
          key: "organizationName",
          width: 150,
        },
        {
          title: "配发日期",
          dataIndex: "allotmentDate",
          key: "allotmentDate",
        },
        {
          title: "有效期限",
          dataIndex: "termValidity",
          key: "termValidity",
        },
            {
              title: '回收日期',
              dataIndex: 'recoveryDate',
              key: 'recoveryDate',
              width:100
            },
             {
          title: "装备类型",
          dataIndex: "cqName",
          key: "cqName",
          width: 120,
        },
        {
          title: "发放人",
          dataIndex: "issuedBy",
          key: "issuedBy",
          width: 120,
        },
          ],
          queryParam:{
            organizationId: "",
            describes:"",
            type:2,
            state:2,
            oid:""
          },
          loadScheduleData:  (parameter) => {
              const requestParameters = Object.assign({}, parameter, this.queryParam);
              return this.$api.certEquipService
                .getCertEqup(requestParameters)
                .then((res) => {
                  res.data.data.list.map((i,k)=>i.key=k+1)
                  return res.data;
                });
            },
          replaceFields:{
            children:'children',
            title:'title',
            key:'key',
            value: 'key'
          },
          selectedRowKeys: [],
          selectedRows: [],
        }
    },
    created(){
    this.queryParam.oid = this.user.organizationId
  },
    methods:{
        // 配发日期
        handleChange(){

        },
        // 
        onChange(){

        },
        toggleAdvanced(){
          this.advanced = !this.advanced;
        },
        //树选择回调
    handleTreeChange(obj){
      this.queryParam.organizationId = obj.val
      console.log(this.queryParam)
    },
    reloadData(){
      this.queryParam.organizationId=""
      this.queryParam.describes=""
      this.$refs.table.refresh(true)
    }
    },
    filters: {
      statusFilter (status) {
        const statusMap = {
          'processing': '正常',
          'error': '异常'
        }
        return statusMap[status]
      }
    },
    computed: {
        ...mapState("setting", ["pageMinHeight"]),
        ...mapGetters("account",["user"]),
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

</style>