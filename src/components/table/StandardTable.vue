<template>
  <div class="standard-table">
    <div class="alert">
      <a-alert type="info" :show-icon="true" v-if="selectedRows">
        <div class="message" slot="message">
          已选择&nbsp;<a>{{selectedRows.length}}</a>&nbsp;项 <a class="clear" @click="onClear">清空</a>
          <template  v-for="(item, index) in needTotalList" >
            <div v-if="item.needTotal" :key="index">
              {{item.title}}总计&nbsp;
              <a>{{item.customRender ? item.customRender(item.total) : item.total}}</a>
            </div>
          </template>
        </div>
      </a-alert>
    </div>
    <a-table
      :bordered="bordered"
      :loading="loading"
      :columns="columns"
      :dataSource="dataSource"
      :rowKey="rowKey"
      :scroll="scroll"
      :pagination="pagination"
      :expandedRowKeys="expandedRowKeys"
      :expandedRowRender="expandedRowRender"
      @change="onChange"
      :rowSelection="selectedRows ? {selectedRowKeys: selectedRowKeys, onChange: updateSelect} : undefined"
    >
      <template slot-scope="text, record, index" :slot="slot" v-for="slot in Object.keys($scopedSlots).filter(key => key !== 'expandedRowRender') ">
        <slot :name="slot" v-bind="{text, record, index}"></slot>
      </template>
      <template :slot="slot" v-for="slot in Object.keys($slots)">
        <slot :name="slot"></slot>
      </template>
      <template slot-scope="record, index, indent, expanded" :slot="$scopedSlots.expandedRowRender ? 'expandedRowRender' : ''">
        <slot v-bind="{record, index, indent, expanded}" :name="$scopedSlots.expandedRowRender ? 'expandedRowRender' : ''"></slot>
      </template>
    </a-table>
  </div>
</template>

<script>
export default {
  name: 'StandardTable',
  props: {
    bordered: Boolean,
    loading: [Boolean, Object],
    columns: Array,
    dataSource: Array,
    // 表格行 key 的取值，可以是字符串或一个函数
    rowKey: {
      type: [String, Function],
      default: 'key'
    },
    // 是否显示分页
    pagination: {
      type: [Object, Boolean],
      default: true
    },
    // 选择后进行操作，完成后清空选择，通过 rowSelection.selectedRowKeys 来控制选中项。
    selectedRows: Array,
    // 展开的行，控制属性
    expandedRowKeys: Array,
    // 额外的展开行
    expandedRowRender: Function,
    scroll: {
      type: Object,
      default() {
        return {
           x : 400
        }
      }
    },
  },
  data () {
    return {
      needTotalList: []
    }
  },
  methods: {
    updateSelect (selectedRowKeys, selectedRows) {
      this.$emit('update:selectedRows', selectedRows)
      this.$emit('selectedRowChange', selectedRowKeys, selectedRows)
    },
    initTotalList (columns) {
      const totalList = columns.filter(item => item.needTotal)
        .map(item => {
          return {
            ...item,
            total: 0
          }
        })
      return totalList
    },
    onClear() {
      this.updateSelect([], [])
      this.$emit('clear')
    },
    onChange(pagination, filters, sorter, {currentDataSource}) {
      this.$emit('change', pagination, filters, sorter, {currentDataSource})
    }
  },
  created () {
    this.needTotalList = this.initTotalList(this.columns)
  },
  watch: {
    selectedRows (selectedRows) {
      this.needTotalList = this.needTotalList.map(item => {
        return {
          ...item,
          total: selectedRows.reduce((sum, val) => {
            return sum + val[item.dataIndex]
          }, 0)
        }
      })
    }
  },
  computed: {
    selectedRowKeys() {
      return this.selectedRows.map(record => {
        return (typeof this.rowKey === 'function') ? this.rowKey(record) : record[this.rowKey]
      })
    }
  }
}
</script>

<style scoped lang="less">
.standard-table{
  .alert{
    margin-bottom: 16px;
    .message{
      a{
        font-weight: 600;
      }
    }
    .clear{
      float: right;
    }
  }
}
</style>
