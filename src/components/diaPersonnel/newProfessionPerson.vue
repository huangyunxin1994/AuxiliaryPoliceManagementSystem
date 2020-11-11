<template>
    <div>
        <a-card :bordered="false">
            <a-row :gutter="24">
                <from-model
                    :formTitle="formTitle"
                    :rules="addProRules"
                    >
                </from-model>
            </a-row>
        </a-card>
        <a-card :bordered="false" class="bottomCard">
            <a-row :gutter="24">
                <a-col :xl="8">
                    <ant-tree 
                        :dataSource="tree" 
                        :allowEdit="false" 
                        :allowReload="true"
                        :allowSearch="true"
                        @editTreeNode="editTreeNode" 
                        @addTreeNode="addTreeNode" 
                        @removeTreeNode="removeTreeNode">
                    </ant-tree>
                </a-col>
                <a-col :xl="16">
                    <a-input-search
                        placeholder=""
                        enter-button="确定"
                        size="large"
                        class="searchInput"
                        @search="onSearch"
                    />
                    <s-table
                        ref="table"
                        rowKey="key"
                        :columns="scheduleColumns"
                        :data="loadScheduleData"
                        :scroll="{y:600}"
                        :showPagination=true>
                    </s-table>
                </a-col>
            </a-row>
        </a-card>
    </div>
</template>

<script>
import {mapState} from 'vuex'
import fromModel from '@/components/formModel/formModel'
import STable from '@/components/Table_/'
import antTree from '@/components/tree_/Tree'

const tree = [{
        'key': 'key-01',
        'title': '研发中心',
        'icon': 'mail',
        'count': '10',
        'scopedSlots': { title: 'custom' },
        'children': [{
        'key': 'key-01-01',
        'title': '后端组',
        'icon': null,
        'scopedSlots': { title: 'custom' },
        children: [{
            'key': 'key-01-01-01',
            'title': 'JAVA',
            'icon': null,
            'scopedSlots': { title: 'custom' },
        },
        {
            'key': 'key-01-01-02',
            'title': 'PHP',
            'icon': null,
            'scopedSlots': { title: 'custom' },
        },
        {
            'key': 'key-01-01-03',
            'title': 'Golang',
            'icon': null,
            'scopedSlots': { title: 'custom' },
        }
        ]
        }, {
        'key': 'key-01-02',
        'title': '前端组',
        'icon': null,
        'scopedSlots': { title: 'custom' },
        children: [{
            'key': 'key-01-02-01',
            'title': 'React',
            'icon': null,
            'scopedSlots': { title: 'custom' },
        },
        {
            'key': 'key-01-02-02',
            'title': 'Vue',
            'icon': null,
            'scopedSlots': { title: 'custom' },
        },
        {
            'key': 'key-01-02-03',
            'title': 'Angular',
            'icon': null,
            'scopedSlots': { title: 'custom' },
        }
        ]
        }, {
        'key': 'key-02',
        'title': '财务部',
        'icon': 'dollar',
        'scopedSlots': { title: 'custom' },
        'children': [{
            'key': 'key-02-01',
            'title': '会计核算',
            'icon': null,
            'scopedSlots': { title: 'custom' },
            }, {
            'key': 'key-02-02',
            'title': '成本控制',
            'icon': null,
            'scopedSlots': { title: 'custom' },
            }, {
            'key': 'key-02-03',
            'title': '内部控制',
            'icon': null,
            'scopedSlots': { title: 'custom' },
            'children': [{
                'key': 'key-02-03-01',
                'title': '财务制度建设',
                'icon': null,
                'scopedSlots': { title: 'custom' },
            },
            {
                'key': 'key-02-03-02',
                'title': '会计核算',
                'icon': null,
                'scopedSlots': { title: 'custom' },
            }]
        }]
    }]
}]
export default {
    components:{
        fromModel,
        STable,
        antTree
    },
    data(){
        return{
            formTitle:[
                {label:'专业技术任职资格称号',name:'profession',type:'input',placeholder:'请输入专业技术任职资格称号'},
                {label:'资格审批单位',name:'unit',type:'input',placeholder:'请输入资格审批单位'},
                {label:'获得资格日期',name:'date',type:'picker',placeholder:'请选择获得资格日期'}
            ],
            addProRules:{
                profession:[{ required: true, message: '请输入专业技术任职资格称号', trigger: 'blur'}],
                unit: [{ required: true, message: '请输入资格审批单位', trigger: 'blur'}],
                date: [{ required: true, message: '请选择获得资格日期', trigger: 'change' }]
            },
            tree,
            loading:false,
            scheduleColumns: [
                {
                    title: '姓名',
                    dataIndex: 'name',
                    key: 'name',
                    width: 80,
                },
                {
                    title: '辅警编号',
                    dataIndex: 'num',
                    key: 'num',
                    width: 60,
                },
                {
                    title: '所属组织',
                    dataIndex: 'organ',
                    key: 'organ',
                    width: 160,
                }
            ],
            loadScheduleData: () => {
                return new Promise(resolve => {
                resolve({
                    data: [
                        {
                            key: '1',
                            name: '张三',
                            num: '123',
                            organ:'青秀分局'
                        },
                        {
                            key: '2',
                            name: '张三',
                            num: '123',
                            organ:'青秀分局'
                        },
                        {
                            key: '3',
                            name: '张三',
                            num: '123',
                            organ:'青秀分局'
                        },
                        {
                            key: '4',
                            name: '张三',
                            num: '123',
                            organ:'青秀分局'
                        },
                        {
                            key: '5',
                            name: '张三',
                            num: '123',
                            organ:'青秀分局'
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
        }
    },
    methods:{
        //编辑树节点
        editTreeNode(){
        },
        //添加树节点
        addTreeNode(){
        },
            //删除树节点
        removeTreeNode(){
        },
        // 搜索
        onSearch(){
        },
    },
    computed:{
        ...mapState('setting', ['pageMinHeight']),
        // rowSelection () {
        //     return {
        //         selectedRowKeys: this.selectedRowKeys,
        //         onChange: this.onSelectChange
        //     }
        // }
    }
}
</script>

<style lang="less" scoped>
    .searchInput{
        margin-bottom: 20px;
    }
    .bottomCard{
        margin-bottom: 20px;
    }
</style>