<template>
  <div class="new-page">
        <a-card :bordered="false">
            <div class="title">
                <div>
                    <p><span>姓名: </span><span>{{nameMess.policeName}}</span></p>
                    <p><span>警员编号: </span><span>{{nameMess.number}}</span></p>
                </div>
                <div>
                    <a-button type="primary" icon="plus" @click="addProfession">新增记录</a-button>
                </div>
            </div>
            <s-table
                ref="table"
                rowKey="key"
                :columns="scheduleColumns"
                :data="loadScheduleData"
                :scroll="{ y: 600, x: 800 }">
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
        props:{
            nameMess:{
                type: Object,
                default: function () {
                    return {}
                }
            }
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
                    dataIndex: 'qualification',
                    key: 'qualification',
                    width: 80,
                },
                {
                    title: '资格审批单位',
                    dataIndex: 'approvalUnit',
                    key: 'approvalUnit',
                    width: 100
                },
                {
                    title: '获得资格日期',
                    dataIndex: 'acquireDate',
                    key: 'acquireDate',
                    width: 100,
                }
            ],
            queryParam: {
                userId:this.nameMess.userId,
                number:this.nameMess.number,
                policeName:this.nameMess.policeName,
                organizationId:this.nameMess.organizationId || '',
                organizationName:this.nameMess.organizationName
            },
            loadScheduleData: (params) => {
                let param = Object.assign(params,this.nameMess)
                return this.$api.personAdminService.getPersonProfession(param).then((res)=>{
                    res.data.data.list.map((i,k)=>{
                        i.key=k+1
                    })
                    return res.data
                })
            },
            selectedRowKeys: [],
            selectedRows: [],
            formTitle:[
                {label:'专业技术任职资格称号',name:'qualification',type:'input',placeholder:'请输入专业技术任职资格称号'},
                {label:'资格审批单位',name:'approvalUnit',type:'input',placeholder:'请输入资格审批单位'},
                {label:'获得资格日期',name:'acquireDate',type:'picker',placeholder:'请选择获得资格日期'}
            ],
            addProRules:{
                qualification:[{ required: true, message: '请输入专业技术任职资格称号', trigger: 'blur'}],
                approvalUnit: [{ required: true, message: '请输入资格审批单位', trigger: 'blur'}],
                acquireDate: [{ required: true, message: '请选择获得资格日期', trigger: 'change' }]
            }
        }
        },
        methods:{
            handleEdit(){
            },
            beforeUpload(){
            },
            addProfession(){
                const _this = this
                this.$dialog(fromModel,
                    // component props
                    {
                    formTitle:this.formTitle,
                    rules:this.addProRules,
                    submitFun:(params) => {
                        
                        let param = Object.assign(params,this.queryParam)
                        return this.$api.personAdminService.addProfessionMess(param).then((res)=>{
                            return res.data
                        })
                    },
                    on: {
                        ok () {
                           _this.$refs.table.refresh(true);
                        },
                        cancel () {
                            
                        },
                        close () {
                            
                        }
                    }
                    },
                    // modal props
                    {
                        title: '新增记录',
                        width: 700,
                        centered: true,
                        maskClosable: false,
                        okText:"提交"
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
