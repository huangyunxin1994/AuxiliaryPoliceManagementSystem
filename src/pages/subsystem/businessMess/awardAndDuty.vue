<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-card :bordered="false">
		<div class="position-and-level-title" :style="{ 'border-color': theme.color }">奖励信息</div>
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
		<s-table
			ref="table"
			rowKey="key"
			:columns="credColumns"
			:data="loadCredData"
			:scroll="{ y: 600, x: 650 }"
			showPagination="auto"
		>
		</s-table>
    </a-card>
    <a-card :bordered="false">
      <div class="position-and-level-title" :style="{ 'border-color': theme.color }">责任追究信息</div>
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
      <s-table
        ref="table"
        rowKey="key"
        :columns="dutyColumns"
        :data="dutyData"
        :scroll="{ y: 600, x: 650 }"
        showPagination="auto"
      >
      </s-table>
      
    </a-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
import STable from "@/components/Table_/";
export default {
  name: "OrganManage",
  components: {
    STable,
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
          title: "奖励原因",
          dataIndex: "reason",
          key: "reason",
          ellipsis: true,
          width: 100,
        },
        {
          title: "奖励批准机关",
          dataIndex: "organizationName",
          key: "organizationName",
          ellipsis: true,
          width: 150
        },
        {
          title: "奖励批准日期",
          dataIndex: "approvalDate",
          key: "approvalDate",
          ellipsis: true,
          width: 100
        },
        {
          title: "荣誉称号授予单位",
          dataIndex: "approvalAuthority",
          key: "approvalAuthority",
          ellipsis: true,
          width: 150
        },
        {
          title: "荣誉称号级别",
          dataIndex: "honoraryTitle",
          key: "honoraryTitle",
          ellipsis: true,
          width: 150
        },
      ],
      loadCredData: () => {
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
      dutyColumns:[
        {
          title: "序号",
          dataIndex: "key",
          key: "key",
          width: 60,
        },
        {
          title: "原因",
          dataIndex: "name",
          key: "name",
          ellipsis: true,
          width: 200,
        },
        {
          title: "批准日期",
          dataIndex: "num",
          key: "num",
          ellipsis: true,
          width: 100
        },
        {
          title: "批准单位",
          dataIndex: "organizationName",
          key: "organizationName",
          ellipsis: true,
          width: 150
        }
      ],
      dutyData:() => {
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
  methods: {
    
    onCredSelectChange(selectedRowKeys, selectedRows) {
      this.selectedCredRowKeys = selectedRowKeys;
      this.selectedCredRows = selectedRows;
    },
    onEqupSelectChange(selectedRowKeys, selectedRows) {
      this.selectedEqupRowKeys = selectedRowKeys;
      this.selectedEqupRows = selectedRows;
    },

    // 开始时间和结束时间
    onChange(date, dateString) {
      console.log(date, dateString);
    },

    // 点击完成
    submit(){

    },
    // 点击删除人员
    confirm(e) {
        console.log(e);
        this.$message.success('删除成功');
    },
    cancel(e) {
        console.log(e);
        this.$message.error('已取消删除');
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
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
.submitBtn{
    width: 100%;
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
}
</style>