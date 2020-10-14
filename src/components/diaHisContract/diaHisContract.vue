<template>
  <div class="new-page">
        <!-- <a-card :bordered="false">
            
        </a-card> -->
        <a-card :bordered="false">
            <div class="title">
                <p><span>姓名: </span><span>李四</span></p>
                <p><span>警员编号: </span><span>123456789</span></p>
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
                        action=""
                        :before-upload="beforeUpload"
                        :show-upload-list="false"
                    >
                        <a @click="handleEdit (record)">上传</a>
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
        data() {
        return {
            openKeys: ['key-01'],
            loading:false,
            scheduleColumns: [
                {
                title: '序号',
                dataIndex: 'key',
                key: 'key',
                width: 60,
                },
                {
                title: '起始合同日期',
                dataIndex: 'name',
                key: 'name',
                width: 80,
                },
                {
                title: '试用结束日期',
                dataIndex: 'code',
                key: 'code',
                width: 100
                },
                {
                title: '合同终止日期',
                dataIndex: 'post',
                key: 'post',
                width: 100,
                },
                {
                title: '合同期限(月)',
                dataIndex: 'phone',
                key: 'phone',
                width: 150,
                },
                {
                table: '操作',
                dataIndex: 'action',
                scopedSlots: {customRender: 'action'},
                width: 150
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
                        post: '辅警',
                        phone: '13584585258',
                        status: 'processing'
                    },
                    {
                        key: '2',
                        account: 'test',
                        name: '李四',
                        code: 'FJ0585',
                        organ: '青秀区东葛路派出所',
                        post: '辅警',
                        phone: '13584585258',
                        status: 'processing'
                    },
                    {
                        key: '3',
                        account: 'test',
                        name: '王五',
                        code: 'FJ0585',
                        organ: '青秀区东葛路派出所',
                        post: '辅警',
                        phone: '13584585258',
                        status: 'processing'
                    },
                    {
                        key: '4',
                        account: 'test',
                        name: '张三',
                        code: 'FJ0585',
                        organ: '青秀区东葛路派出所',
                        post: '辅警',
                        phone: '13584585258',
                        status: 'processing'
                    },
                    {
                        key: '5',
                        account: 'test',
                        name: '赵六',
                        code: 'FJ0585',
                        organ: '青秀区东葛路派出所',
                        post: '辅警',
                        phone: '13584585258',
                        status: 'error'
                    }
                    ],
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
