<template>
  <div class="new-page">
        <!-- <a-card :bordered="false">
            
        </a-card> -->
        <a-card :bordered="false">
            <div class="title">
                <p><span>姓名: </span><span>{{person.name}}</span></p>
                <p><span>警员编号: </span><span>{{person.number}}</span></p>
            </div>
            <s-table
                ref="table"
                rowKey="key"
                :columns="scheduleColumns"
                :data="loadScheduleData"
                :scroll="{y:600}">

                <template
                    slot="status"
                    slot-scope="status">
                    <a-badge :status="status" :text="status | statusFilter"/>
                </template>
                <span slot="action" slot-scope="text, record">
                    <a @click="handleEdit (record)">下载</a>
                    <a-divider type="vertical"/>
                    <a-upload
                        name="file"
                        :multiple="true"
                        :default-file-list="form.file"
                        action=""
                        :before-upload="beforeUpload"
                        :show-upload-list="false"
                    >
                        <a >上传</a>
                    </a-upload>
                    
                </span>
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
        },
        data() {
        return {
            openKeys: ['key-01'],
            loading:false,
            queryParam:{
                id:''
            },
            scheduleColumns: [
                {
                title: '序号',
                dataIndex: 'key',
                key: 'key',
                width: 60,
                },
                {
                title: '起始合同日期',
                dataIndex: 'startDate',
                key: 'startDate',
                width: 150,
                },
                {
                title: '试用结束日期',
                dataIndex: 'probation',
                key: 'probation',
                width: 150
                },
                {
                title: '合同终止日期',
                dataIndex: 'endDate',
                key: 'endDate',
                width: 150,
                },
                {
                title: '合同期限(月)',
                dataIndex: 'contractPeriod',
                key: 'contractPeriod',
                width: 150,
                },
                {
                title: '操作',
                dataIndex: 'action',
                scopedSlots: {customRender: 'action'},
                width: 150
                }
            ],
            loadScheduleData: params => {
                console.log(this.person)
                this.queryParam.id = this.person.police_id
                console.log(this.queryParam)
                let param = Object.assign(params,this.queryParam)
                console.log(param)
                return this.$api.contractService.getdetails(param).then((res)=>{
                    res.data.data.list.map((i,k)=>{
                        i.key=k+1
                    })
                    console.log(res)
                    return res.data
                })
            },
            selectedRowKeys: [],
            selectedRows: [],
            fileList:[],
            form:{
                file:''
            }
        }
        },
        methods:{
            handleEdit(record){
                console.log(record)
            },
            beforeUpload(file){
                console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^")
                console.log(file)
                this.fileList=[...this.fileList, file];
                console.log(this.fileList)
                return false
            }
        },
        filters: {
            statusFilter (status) {
                const statusMap = {
                'processing': '是',
                'error': '否'
                }
                return statusMap[status]
            }
        },
        computed: {
        // ...mapState('setting', ['pageMinHeight']),
        
        rowSelection () {
            return {
            selectedRowKeys: this.selectedRowKeys,
            onChange: this.onSelectChange,
            getCheckboxProps: record => ({
                props: {
                disabled: record.status === 'error', // Column configuration not to be checked
                name: record.status,
                },
            }),
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
