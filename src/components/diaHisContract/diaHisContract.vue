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
                :scroll="{y:600,x:800}">

                <template
                    slot="status"
                    slot-scope="status">
                    <a-badge :status="status" :text="status | statusFilter"/>
                </template>
                <span slot="action" slot-scope="text, record">
                    <!-- <a @click="handleEdit (record)">下载</a> -->
                    <a  name="file" :download="record.name" @click="downContract(record.id)" :disabled="!record.electronicContract">下载</a>
                    <a-divider type="vertical"/>
                    <a-badge dot v-if="!record.electronicContract">
                    <a-upload
                        name="file"
                        :multiple="true"
                        :default-file-list="form.file"
                        action=""
                        :before-upload="beforeUpload"
                        :show-upload-list="false"
                    >
                        <a @click="handleUpData (record)">上传</a>
                    </a-upload>
                    </a-badge>
                    <a-upload
                        v-else
                        name="file"
                        :multiple="true"
                        :default-file-list="form.file"
                        action=""
                        :before-upload="beforeUpload"
                        :show-upload-list="false"
                    >
                        <a @click="handleUpData (record)">上传</a>
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
            BASE_URL:'',
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
                scopedSlots: {customRender: 'action'},
                width: 150
                }
            ],
            loadScheduleData: params => {
                this.queryParam.id = this.person.police_id
                let param = Object.assign(params,this.queryParam)
                return this.$api.contractService.getdetails(param).then((res)=>{
                    res.data.data.list.map((i,k)=>{
                        i.key=k+1
                    })
                    return res.data
                })
            },
            selectedRowKeys: [],
            selectedRows: [],
            fileList:[],
            form:{
                file:[]
            },
            handleData:'',//点击下载时，获取到当前行的值
        }
        },
        mounted(){
            this.BASE_URL = process.env.VUE_APP_API_BASE_URL
        },
        methods:{
            handleEdit(record){
                let param = {
                    contractId:record.id
                }
                this.$api.contractService.downNotice(param).then(()=>{
                }).catch(()=>{
                })
            },
            beforeUpload(file){
                let param = {
                    contractId:this.handleData.id,
                    file:file
                }
                this.$api.contractService.postFiles(param).then((res)=>{
                    if(res.data.code == 0){
                        this.$message.success('上传成功');
                         this.$refs.table.refresh(false)

                    }else{
                        this.$message.error('上传失败，请重试');
                    }
                }).catch(()=>{
                    this.$message.error('上传失败，请重试');
                })
                return false
            },
            handleUpData(record){
                this.handleData = record
            },
            downContract(id){
                this.$api.contractService.downNotice({contractId:id}).then(res=>{
                    if(!res.data.code){
                    window.location.href = `${this.BASE_URL}/contract/downloadFile?contractId=${id}`;
                    // window.location.href = `http://192.168.1.111:8181/contract/downloadFile?contractId=${id}`;
                    }else{
                    this.$message.error(res.data.msg)
                    }
                })
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
