<template>
    <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
        <a-card :bordered="false">
          <div class="table-page-search-wrapper">
            <a-form layout="inline">
              <a-row :gutter="48">
                <a-col :md="8" :sm="24">
                  <a-form-item label="关键词搜索">
                    <a-input placeholder="请输入要查询的关键词" />
                  </a-form-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <a-form-item label="组织选择">
                    <a-tree-select
                      v-model="value"
                      style="width: 100%"
                      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                      :tree-data="tree"
                      :allowClear="true"
                      :replaceFields="replaceFields"
                      placeholder="请选择组织"
                      tree-default-expand-all
                    >
                    </a-tree-select>
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
                    <a-form-item label="到期日期">
                      <a-date-picker @change="onChange" style="width: 100%"/>
                    </a-form-item>
                  </a-col>
                </template>
                <template v-if="advanced">
                  <a-col :md="8" :sm="24">
                    <a-form-item label="状态">
                      <a-select default-value="" @change="handleChange">
                        <a-select-option value=""> 全部 </a-select-option>
                        <a-select-option value="1">正常</a-select-option>
                        <a-select-option value="2">逾期未回收</a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                </template>
                <template v-if="advanced">
                  <a-col :md="8" :sm="24">
                    <a-form-item label="装备类型">
                      <a-select default-value="" @change="handleChange">
                        <a-select-option value=""> 全部 </a-select-option>
                        <a-select-option value="1">正常</a-select-option>
                        <a-select-option value="2">逾期未回收</a-select-option>
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
            <span class="table-page-search-submitButtons" >
              <a-button type="primary" icon="delete" style="margin-right: 10px" v-if="selectedRowKeys.length == 0" disabled>证件回收</a-button>
              <a-popconfirm
                title="确认回收所选证件?"
                ok-text="确认"
                cancel-text="取消"
                @confirm="confirm"
                @cancel="cancel"
                v-else
              >
                <a-button type="primary" icon="delete" style="margin-right: 10px">证件回收</a-button>
              </a-popconfirm>
              <a-button type="primary" icon="plus" @click="newEqu">新增发放</a-button>
            </span>
            <a-dropdown v-if="selectedRowKeys.length > 0">
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
            ref="table"
            rowKey="key"
            :columns="scheduleColumns"
            :data="loadScheduleData"
            :rowSelection="rowSelection"
            :scroll="{y:600}"
            showPagination="auto">
            <template
              slot="action"
              slot-scope="equState">
              <!-- {{equState}} -->
              <a-badge :status="equState" :text="equState | statusFilter"/>
            </template>
          </s-table> 
        </a-card>
        <form-step ref="modal" title="新增发放证件" :formTitle="formTitle" :rules="rules" :stepTitle="stepTitle" :submitFun="submitFun"></form-step>
    </div>
</template>

<script>
import { mapState } from "vuex";
import STable from '@/components/Table_/'
import formStep from "@/components/stepForm/StepForm";
const tree = [{
    'key': 'key-01',
    'title': '研发中心',
    'icon': 'mail',
    'count': '10',
    'scopedSlots': { title: 'custom' },
    'children': [{
      'key': 'key-01-01',
      'title': '后端组',
      'icon': null,
      'scopedSlots': { title: 'custom' },
      children: [{
        'key': 'key-01-01-01',
        'title': 'JAVA',
        'icon': null,
        'scopedSlots': { title: 'custom' },
      },
      {
        'key': 'key-01-01-02',
        'title': 'PHP',
        'icon': null,
        'scopedSlots': { title: 'custom' },
      },
      {
        'key': 'key-01-01-03',
        'title': 'Golang',
        'icon': null,
        'scopedSlots': { title: 'custom' },
      }
      ]
    }, {
      'key': 'key-01-02',
      'title': '前端组',
      'icon': null,
      'scopedSlots': { title: 'custom' },
      children: [{
        'key': 'key-01-02-01',
        'title': 'React',
        'icon': null,
        'scopedSlots': { title: 'custom' },
      },
      {
        'key': 'key-01-02-02',
        'title': 'Vue',
        'icon': null,
        'scopedSlots': { title: 'custom' },
      },
      {
        'key': 'key-01-02-03',
        'title': 'Angular',
        'icon': null,
        'scopedSlots': { title: 'custom' },
      }
      ]
    }, {
    'key': 'key-02',
    'title': '财务部',
    'icon': 'dollar',
    'scopedSlots': { title: 'custom' },
    'children': [{
        'key': 'key-02-01',
        'title': '会计核算',
        'icon': null,
        'scopedSlots': { title: 'custom' },
        }, {
        'key': 'key-02-02',
        'title': '成本控制',
        'icon': null,
        'scopedSlots': { title: 'custom' },
        }, {
        'key': 'key-02-03',
        'title': '内部控制',
        'icon': null,
        'scopedSlots': { title: 'custom' },
        'children': [{
            'key': 'key-02-03-01',
            'title': '财务制度建设',
            'icon': null,
            'scopedSlots': { title: 'custom' },
        },
        {
            'key': 'key-02-03-02',
            'title': '会计核算',
            'icon': null,
            'scopedSlots': { title: 'custom' },
        }]
    }]
  }]
  }]
const formTitle = [
  {
    label: "证件类型",
    name: "equipageType",
    type: "input",
    refName: "equipageType",
    placeholder: "请输入证件类型",
  },
  {
    label: "配发日期",
    name: "startDate",
    type: "picker",
    refName: "startDate",
    placeholder: "请选择配发日期",
  },
  {
    label: "有效期限",
    name: "validity",
    type: "picker",
    refName: "validity",
    placeholder: "请选择有效期限",
  }
]
const stepTitle = [{title:'选择人员'},{title:'填写证件信息'}]
const rules = {
  equipageType: [
    { required: false, message: "请输入名字", trigger: "blur", disabled: true },
  ],
  startDate: [
    { required: true, message: "请选择合同起始日期", trigger: "change" },
  ],
  validity: [{ required: true, message: "请输入合同期限", trigger: "blur" }],
};
const submitFun = ()=>{
  return new Promise((resolve) => {
    resolve({
      data: [],
      pageSize: 10,
      pageNo: 1,
      totalPage: 1,
      totalCount: 10,
    });
  }).then((res) => {
    return res;
  });
}
export default {
    components:{
        STable,
        formStep
    },
    data(){
        return{
          formTitle,
          rules,
          stepTitle,
          submitFun,
          openKeys: ['key-01'],
          loading:false,
          tree,
          value:null,
          scheduleColumns: [
            {
              title: '序号',
              dataIndex: 'key',
              key: 'key',
              width: 60,
            },
            {
              title: '姓名',
              dataIndex: 'name',
              key: 'name',
              width: 80,
            },
            {
              title: '辅警编号',
              dataIndex: 'code',
              key: 'code' 
            },
            {
              title: '所属组织',
              dataIndex: 'organ',
              key: 'organ',
              width: 150
            },
            {
              title: '配发日期',
              dataIndex: 'allotmentDate',
              key: 'allotmentDate'
            },
            {
              title: '有效期限',
              dataIndex: 'validity',
              key: 'validity'
            },
            {
              title: '状态',
              dataIndex: 'equState',
              key: 'equState',
              scopedSlots: {customRender: 'action'}
            },
            {
              title: '装备描述',
              dataIndex: 'equContent',
              key: 'equContent',
              width: 250
            }
          ],
          
          loadScheduleData: () => {
            return new Promise(resolve => {
              resolve({
                data: [
                  {
                    key: '1',
                    account: 'admin',
                    name: '管理员',
                    code: 'FJ0584',
                    organ: '青秀区东葛路派出所',
                    allotmentDate:'2020-02-16',
                    validity:'2020-02-16',
                    equState:'processing',
                    equContent:'哈哈'
                  },
                  {
                    key: '2',
                    account: 'test',
                    name: '张三',
                    code: 'FJ0585',
                    organ: '青秀区东葛路派出所',
                    date:'2020-02-16',
                    principal:'张三',
                    equState:'error'
                  }
                ],
                pageSize: 10,
                pageNo: 1,
                totalPage: 1,
                totalCount: 60 //总数
              })
            }).then(res => {
              return res
            })
          },
          replaceFields:{
            children:'children',
            title:'title',
            key:'key',
            value: 'key'
          },
          selectedRowKeys: [],
          selectedRows: [],
          advanced:false
        }
    },
    methods:{
        // 配发日期
        handleChange(){

        },
        // 
        onChange(){

        },
        // 多选触发
        onSelectChange(selectedRowKeys, selectedRows) {
          this.selectedRowKeys = selectedRowKeys;
          this.selectedRows = selectedRows;
          console.log(this.selectedRowKeys);
          console.log(this.selectedRows);
        },
        //装备回收
        confirm(e) {
            console.log(e);
            this.$message.success('回收成功');
        },
        cancel(e) {
            console.log(e);
            this.$message.error('已取消回收');
        },
        // 新增发放
        newEqu(){
          this.$refs.modal.visible=true
        },
        toggleAdvanced() {
          this.advanced = !this.advanced;
        },
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