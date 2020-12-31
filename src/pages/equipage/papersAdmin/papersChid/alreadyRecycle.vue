<template>
    <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
        <a-card :bordered="false">
          <div class="table-page-search-wrapper">
            <a-form layout="inline">
              <a-row :gutter="48">
                <a-col :md="8" :sm="24">
                  <a-form-item label="模糊查询">
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
                      <a-date-picker @change="allotmentDate" style="width: 100%" :value-format="dateFormat" v-model="queryParam.allotmentDate" />
                    </a-form-item>
                  </a-col>
                </template>
                <template v-if="advanced">
                  <a-col :md="8" :sm="24">
                    <a-form-item label="有效日期">
                      <a-date-picker @change="validity" style="width: 100%" :value-format="dateFormat" v-model="queryParam.termValidity" />
                    </a-form-item>
                  </a-col>
                </template>
                <template v-if="advanced">
                  <a-col :md="8" :sm="24">
                    <a-form-item label="证件类型">
                      <a-select default-value="" v-model="queryParam.cqName">
                        <a-select-option value=""> 全部 </a-select-option>
                        <a-select-option :value="item.name" v-for="item in certList" :key="item.id">{{item.name}}</a-select-option>
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
          dateFormat: 'YYYY-MM-DD',
          certList:[],
          openKeys: ['key-01'],
          loading:false,
          value:null,
          advanced:true,
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
          width:100
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
          width:100
        },
        {
          title: "有效期限",
          dataIndex: "termValidity",
          key: "termValidity",
          width:100
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
          title: "回收人",
          dataIndex: "recycler",
          key: "recycler",
          width: 120,
        },
          ],
          queryParam:{
            organizationId: "",
            describes:"",
            allotmentDate: "",
            termValidity: "",
            type:1,
            state:2,
            oid:"",
            recycler:'',//回收人
            recyclerId:'',//回收人id
            cqName:''
          },
          loadScheduleData:  (parameter) => {
              this.queryParam.recycler = this.user.name
              this.queryParam.recyclerId = this.user.id
              this.queryParam.oid = this.user.isSystem !==1 && this.user.organizationId || ""
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
       this.$api.certEquipService.getCertEqupType({ type: 1, state : 2 }).then((res) => {
        this.certList = res.data.data.list   
      })
    this.queryParam.oid = this.user.isSystem !==1 && this.user.organizationId || ""
  },
    methods:{
        // 配发日期
        handleChange(){

        },
        // 
        onChange(){

        },
        // 配发日期
        allotmentDate(date, dateString) {
          this.queryParam.allotmentDate = dateString
        },
        //有效日期
        validity(date, dateString) {
          this.queryParam.termValidity = dateString
        },
        toggleAdvanced(){
          this.advanced = !this.advanced;
        },
        //树选择回调
    handleTreeChange(obj){
      this.queryParam.organizationId = obj.val
    },
    reloadData(){
      this.queryParam.organizationId=""
      this.queryParam.describes=""
      this.queryParam.allotmentDate=""
      this.queryParam.termValidity=""
      this.queryParam.cqName=""
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