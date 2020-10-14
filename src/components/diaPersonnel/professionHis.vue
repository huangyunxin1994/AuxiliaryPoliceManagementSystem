<template>
  <div class="new-page">
        <a-card :bordered="false">
            <div class="title">
                <div>
                    <p><span>姓名: </span><span>李四</span></p>
                    <p><span>警员编号: </span><span>123456789</span></p>
                </div>
                <div>
                    <a-button type="primary" @click="addProfession">新增记录</a-button>
                </div>
            </div>
            <s-table
                ref="table"
                rowKey="key"
                :columns="scheduleColumns"
                :data="loadScheduleData"
                :scroll="{y:600}">
            </s-table>
        </a-card>
  </div>
</template>

<script>
    import STable from '@/components/Table_/'
    import fromModel from '@/components/formModel/formModel'
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
                    title: '专业技术任职资格',
                    dataIndex: 'profession',
                    key: 'profession',
                    width: 80,
                },
                {
                    title: '资格审批单位',
                    dataIndex: 'unit',
                    key: 'unit',
                    width: 100
                },
                {
                    title: '获得资格日期',
                    dataIndex: 'date',
                    key: 'date',
                    width: 100,
                }
            ],
            loadScheduleData: () => {
                return new Promise(resolve => {
                resolve({
                    data: [
                    {
                        key: '1',
                        profession: '雅思证书',
                        unit: '南宁总局',
                        date: '2020-05-02'
                    },
                    {
                        key: '2',
                        profession: '雅思证书',
                        unit: '南宁总局',
                        date: '2020-05-02'
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
            selectedRows: [],
            formTitle:[
                {label:'专业技术任职资格称号',name:'profession',type:'input',placeholder:'请输入专业技术任职资格称号',disabled:true},
                {label:'资格审批单位',name:'unit',type:'input',placeholder:'请输入资格审批单位',disabled:true},
                {label:'获得资格日期',name:'date',type:'picker',placeholder:'请选择获得资格日期'}
            ],
            addProRules:{
                profession:[{ required: true, message: '请输入专业技术任职资格称号', trigger: 'blur'}],
                unit: [{ required: true, message: '请输入资格审批单位', trigger: 'blur'}],
                date: [{ required: true, message: '请选择获得资格日期', trigger: 'change' }]
            }
        }
        },
        methods:{
            handleEdit(record){
                console.log(record)
            },
            beforeUpload(file){
                console.log(file)
            },
            addProfession(){
                // console.log("新增记录")
                this.$dialog(fromModel,
                    // component props
                    {
                    formTitle:this.formTitle,
                    rules:this.addProRules,
                    fn:() => {
                    return new Promise(resolve => {
                        resolve({
                        data: [
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
                    on: {
                        ok () {
                            console.log('ok 回调')
                        },
                        cancel () {
                            console.log('cancel 回调')
                        },
                        close () {
                            console.log('modal close 回调')
                        }
                    }
                    },
                    // modal props
                    {
                        title: '编辑',
                        width: 700,
                        centered: true,
                        maskClosable: false,
                        okText:"提交",
                        zIndex:100100
                    }
                )
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
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        & > div{
            display: flex;
            justify-content: flex-start;

            & p{
                margin-right: 20px;
            }
        }
    }
</style>
