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
          title: "开始时间",
          dataIndex: "name",
          key: "name",
          ellipsis: true,
          width: 100,
        },
        {
          title: "结束时间",
          dataIndex: "num",
          key: "num",
          ellipsis: true,
          width: 150
        },
        {
          title: "总学时",
          dataIndex: "organizationName",
          key: "organizationName",
          ellipsis: true,
          width: 100
        },
        {
          title: "培训方式",
          dataIndex: "num",
          key: "num",
          ellipsis: true,
          width: 100
        },
        {
          title: "创建人",
          dataIndex: "num",
          key: "num",
          ellipsis: true,
          width: 150
        },
        {
          title: "培训内容说明",
          dataIndex: "num",
          key: "num",
          ellipsis: true,
          width: 200
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