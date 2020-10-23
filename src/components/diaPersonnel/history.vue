<template>
  <div class="new-page">
        <a-card :bordered="false">
            <div class="title">
                <p><span>姓名: </span><span>{{person.policeName}}</span></p>
                <p><span>警员编号: </span><span>{{person.number}}</span></p>
            </div>
            <s-table
                ref="table"
                rowKey="key"
                :columns="diaColumns"
                :data="loadScheduleData"
                :scroll="{ y: 600, x: 800 }">
                <template
                    slot="state"
                    slot-scope="state">
                    <!-- <a-badge :status="state" :text="state | statusFilter"/> -->
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
            // diaData:{
            //     type:Array,
            //     default: function () {
            //         return []
            //     }
            // },
            record: {
                type: Object,
                default: null
            },
        },
        data() {
            return {
                openKeys: ['key-01'],
                loading:false,
                // 查询条件参数
                queryParam: {
                    type:this.person.type,
                    userId:this.person.userId
                },
                loadScheduleData: (params) => {
                    let param = Object.assign(params,this.queryParam)
                        return this.$api.personAdminService.getRankPostHistory(param).then((res)=>{
                            console.log(res)
                            res.data.data.list.map((i,k)=>{
                                i.key=k+1
                            })
                        return res.data
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
                '0':'初始职级',
                '1': '晋升',
                '2': '降级'
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
