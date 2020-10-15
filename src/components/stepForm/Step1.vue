<template>
  <div>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="24" :sm="24">
              <a-form-item label="模糊查询">
                <a-input
                  v-model="searchVal"
                  placeholder="请输入搜索内容"
                  class="searchInput"
                />
              </a-form-item>
            </a-col>
            <a-col :md="16" :sm="24">
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
            <a-col :md="8" :sm="24" style="margin-bottom:24px">
              <a-button type="primary" @click="onSearch"> 查询 </a-button>
              <a-button @click="onSearch" style="margin-left: 8px">
                重置
              </a-button>
            </a-col>
            <a-col :span="24">
              <a-transfer
                :rowKey="record => record.id"
                :dataSource="mockData"
                :target-keys="targetKeys"
                :operations="['添加', '移除']"
                :list-style="{
                  width: '43.33333%',
                }"
                :disabled="disabled"
                :show-search="showSearch"
                :show-select-all="false"
                @change="onChange"
              >
                <template
                  slot="children"
                  slot-scope="{
                    props: {
                      direction,
                      filteredItems,
                      selectedKeys,
                      disabled: listDisabled,
                    },
                    on: { itemSelectAll, itemSelect },
                  }"
                >
                  <a-table
                    :row-selection="
                      getRowSelection({
                        disabled: listDisabled,
                        selectedKeys,
                        itemSelectAll,
                        itemSelect,
                      })"
                    :columns="direction === 'left' ? leftColumns : rightColumns"
                    :data-source="filteredItems"
                    :scroll="{ y: 250, x: 100 }"
                    :loading="loading"
                    size="small"
                    :style="{ pointerEvents: listDisabled ? 'none' : null }"
                    :custom-row="
                      ({ key, disabled: itemDisabled }) => ({
                        on: {
                          click: () => {
                            if (itemDisabled || listDisabled) return;
                            itemSelect(key, !selectedKeys.includes(key));
                          },
                        },
                      })"
                  />
                </template>
              </a-transfer>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>
  </div>
</template>

<script>
import antTree from "@/components/tree_/Tree";
import difference from "lodash/difference";


const leftTableColumns = [
  {
    title: "姓名",
    dataIndex: "name",
    width: 100,
  },
  {
    title: "辅警编号",
    dataIndex: "number",
    width: 100,
  },
  {
    title: "所属组织",
    dataIndex: "description",
    width: 100,
  },
];
const rightTableColumns = [
  {
    title: "姓名",
    dataIndex: "name",
    width: 100,
  },
  {
    title: "辅警编号",
    dataIndex: "number",
    width: 100,
  },
];
const tree = [
  {
    key: "key-01",
    title: "研发中心",
    icon: "mail",
    count: "10",
    scopedSlots: { title: "custom" },
    children: [
      {
        key: "key-01-01",
        title: "后端组",
        icon: null,
        scopedSlots: { title: "custom" },
        children: [
          {
            key: "key-01-01-01",
            title: "JAVA",
            icon: null,
            scopedSlots: { title: "custom" },
          },
          {
            key: "key-01-01-02",
            title: "PHP",
            icon: null,
            scopedSlots: { title: "custom" },
          },
          {
            key: "key-01-01-03",
            title: "Golang",
            icon: null,
            scopedSlots: { title: "custom" },
          },
        ],
      },
      {
        key: "key-01-02",
        title: "前端组",
        icon: null,
        scopedSlots: { title: "custom" },
        children: [
          {
            key: "key-01-02-01",
            title: "React",
            icon: null,
            scopedSlots: { title: "custom" },
          },
          {
            key: "key-01-02-02",
            title: "Vue",
            icon: null,
            scopedSlots: { title: "custom" },
          },
          {
            key: "key-01-02-03",
            title: "Angular",
            icon: null,
            scopedSlots: { title: "custom" },
          },
        ],
      },
      {
        key: "key-02",
        title: "财务部",
        icon: "dollar",
        scopedSlots: { title: "custom" },
        children: [
          {
            key: "key-02-01",
            title: "会计核算",
            icon: null,
            scopedSlots: { title: "custom" },
          },
          {
            key: "key-02-02",
            title: "成本控制",
            icon: null,
            scopedSlots: { title: "custom" },
          },
          {
            key: "key-02-03",
            title: "内部控制",
            icon: null,
            scopedSlots: { title: "custom" },
            children: [
              {
                key: "key-02-03-01",
                title: "财务制度建设",
                icon: null,
                scopedSlots: { title: "custom" },
              },
              {
                key: "key-02-03-02",
                title: "会计核算",
                icon: null,
                scopedSlots: { title: "custom" },
              },
            ],
          },
        ],
      },
    ],
  },
];
export default {
  name: "Step1",
  components: {
    antTree
  },
  data() {
    return {
      mockData:[],
      targetKeys: [],
      disabled: false,
      showSearch: true,
      leftColumns: leftTableColumns,
      rightColumns: rightTableColumns,
      value: "",
      replaceFields: {
        children: "children",
        title: "title",
        key: "key",
        value: "key",
      },
      tree,
      loading: false,
      searchVal: "",
      selectedRowKeys: [],
      selectedRows: [],
    };
  },
  mounted(){
      const mockData = [];
        for (let i = 0; i < 20; i++) {
        mockData.push({
            id: `${i * 6}`,
            key:"",
            title:"",
            name: `张三${i + 1}`,
            number:"FJ0512",
            description: `组织${i + 1}`,
        });
        }

        const originTargetKeys = mockData
        .filter((item) => +item.id % 3 > 1)
        .map((item) => item.id);
        this.mockData=mockData;
        this.targetKeys=originTargetKeys;
        },
        
  methods: {
    onChange(nextTargetKeys) {
      this.targetKeys = nextTargetKeys;
    },

    triggerDisable(disabled) {
      this.disabled = disabled;
    },

    triggerShowSearch(showSearch) {
      this.showSearch = showSearch;
    },
    getRowSelection({ disabled, selectedKeys, itemSelectAll, itemSelect }) {
      return {
        getCheckboxProps: (item) => ({
          props: { disabled: disabled || item.disabled },
        }),
        onSelectAll(selected, selectedRows) {
          const treeSelectedKeys = selectedRows
            .filter((item) => !item.disabled)
            .map(({ key }) => key);
          const diffKeys = selected
            ? difference(treeSelectedKeys, selectedKeys)
            : difference(selectedKeys, treeSelectedKeys);
          itemSelectAll(diffKeys, selected);
        },
        onSelect({ key }, selected) {
          itemSelect(key, selected);
        },
        selectedRowKeys: selectedKeys,
      };
    },
    nextStep() {
      this.$emit("nextStep");
    },
    // 搜索
    onSearch() {
      console.log(this.searchVal);
      console.log(this.targetKeys)
      
    },
  }
};
</script>

<style scoped lang="less">
.searchInput {
  margin-bottom: 24px;
}
</style>
