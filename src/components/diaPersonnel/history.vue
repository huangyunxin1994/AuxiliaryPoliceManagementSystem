<template>
  <div class="new-page">
        <a-card :bordered="false">
            <div class="title">
                <p><span>姓名: </span><span>张三</span></p>
                <p><span>警员编号: </span><span>123456789</span></p>
            </div>
            <s-table
                ref="table"
                rowKey="key"
                :columns="diaColumns"
                :data="loadScheduleData"
                :scroll="{y:600}">
                <template
                    slot="status"
                    slot-scope="status">
                    <a-badge :status="status" :text="status | statusFilter"/>
                </template>
            </s-table>
        </a-card>
  </div>
</template>

<script>
    import STable from '@/components/Table_/'
    export default {
        name: 'OrganManage',
        components:{
            STable
        },
        props:{
            person:{
                type:Object,
                default: function () {
                    return {}
                }
            },
            diaColumns:{
                type:Array,
                default: function () {
                    return []
                }
            },
            diaData:{
                type:Array,
                default: function () {
                    return []
                }
            },
            record: {
                type: Object,
                default: null
            },
        },
        data() {
        return {
            openKeys: ['key-01'],
            loading:false,
            loadScheduleData: () => {
                return new Promise(resolve => {
                resolve({
                    data: this.diaData,
                    pageSize: 10,
                    pageNo: 1,
                    totalPage: 1,
                    totalCount: 10
                })
                }).then(res => {
                return res
                })
            },
            selectedRowKeys: [],
            selectedRows: []
        }
        },
        methods:{
            handleEdit(record){
                console.log(record)
            },
            beforeUpload(file){
                console.log(file)
            }
        },
        filters: {
            statusFilter (status) {
                const statusMap = {
                'processing': '晋升',
                'error': '降级'
                }
                return statusMap[status]
            }
        },
        computed: {
        // ...mapState('setting', ['pageMinHeight']),
        
        rowSelection () {
            return {
            selectedRowKeys: this.selectedRowKeys,
            onChange: this.onSelectChange
            }
        }
        }
    }
</script>

<style scoped lang="less">
// @import "../index";
    .title{
        display: flex;
        justify-content: flex-start;
        & > p{
            margin-right: 20px;
        }
    }
</style>
