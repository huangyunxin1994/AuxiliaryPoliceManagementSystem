<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-card :bordered="false">
		<div class="position-and-level-title" :style="{ 'border-color': theme.color }">加班请假统计 </div>
		<div class="table-page-search-wrapper">
			<a-form layout="inline">
				<a-row :gutter="48">
					<a-col :md="8" :sm="24">
						<a-form-item label="模糊查询">
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
            <a-button type="primary" icon="export"   style="margin-right: 10px" @click="overtime">导出</a-button>
        </div>
		<s-table
			ref="table"
			rowKey="key"
			:columns="credColumns"
			:data="loadCredData"
			:scroll="{ y: 600, x: 650 }"
			showPagination="auto"
		>
      <template
        slot="state"
        slot-scope="state">
        <a-badge
          :status="state == '1' ? 'success' : state == '2' ? 'error':'processing'"
          :text="state | statusFilter"
        />
      </template>
		</s-table>
    </a-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
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
          title: "月份",
          dataIndex: "overtimeHours",
          key: "overtimeHours",
          width: 150,
        },
        {
          title: "加班时长(小时)",
          dataIndex: "overtimeHours",
          key: "overtimeHours",
          width: 150,
        },
        {
          title: "年假(小时)",
          dataIndex: "One",
          key: "One",
          width: 100,
        },
        {
          title: "产假(小时)",
          dataIndex: "Two",
          key: "Two",
          width: 100,
        },
        {
          title: "陪产假(小时)",
          dataIndex: "Three",
          key: "Three",
          width: 120,
        },
        {
          title: "婚假(小时)",
          dataIndex: "Four",
          key: "Four",
          width: 100,
        },
        {
          title: "例假(小时)",
          dataIndex: "Five",
          key: "Five",
          width: 100,
        },
        {
          title: "丧假(小时)",
          dataIndex: "Six",
          key: "Six",
          width: 100,
        },
        {
          title: "哺乳假(小时)",
          dataIndex: "Seven",
          key: "Seven",
          width: 120,
        },
        {
          title: "事假(小时)",
          dataIndex: "Eight",
          key: "Eight",
          width: 100,
        },
        {
          title: "调休(小时)",
          dataIndex: "Nine",
          key: "Nine",
          width: 100,
        },
        {
          title: "病假(小时)",
          dataIndex: "Ten",
          key: "Ten",
          width: 100,
        },
        {
          title: "其他(小时)",
          dataIndex: "Eleven",
          key: "Eleven",
          width: 100,
        },
        {
          title: "请假合计(小时)",
          dataIndex: "",
          key: "",
          width: 150,
        }
      ],
      overTimeParam:{
        userId:undefined,
      },
      loadCredData: (params) => {
        let param = Object.assign(params,this.overTimeParam)
        return this.$api.overTimeService.statistics(param).then((res)=>{
          res.data.data.list.map((i,k)=>{
            i.key=k+1
          })
          return res.data
        })
      },
      selectedCredRowKeys: [],
      selectedCredRows: [],
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
    };
  },
  created(){
    this.overTimeParam.userId = this.policeId
  },
  methods: {
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
  },
  filters: {
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
    }
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