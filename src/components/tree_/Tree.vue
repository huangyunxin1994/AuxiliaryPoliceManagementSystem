<template>
    <div>
        <a-input-search v-if="allowSearch" style="margin-bottom: 8px" placeholder="请输入搜索内容" @change="onChange" />
        <a-tree
        class="custom-tree"
        :expanded-keys="expandedKeys"
        :auto-expand-parent="autoExpandParent"
        :tree-data="dataSource"
        :selectedKeys="selectedKeys"
        :replace-fields="replaceFields"
        :block-node="blockNode"
        @select="onSelect"
        @expand="onExpand"
        >
            <a-icon slot="switcherIcon" type="down" />
            <template slot="custom" slot-scope="item" class="tree_item">
                <span v-if="item[replaceFields.title].indexOf(searchValue) > -1">
                    {{ item[replaceFields.title].substr(0, item[replaceFields.title].indexOf(searchValue)) }}
                    <span style="color: #f50">{{ searchValue }}</span>
                    {{ item[replaceFields.title].substr(item[replaceFields.title].indexOf(searchValue) + searchValue.length) }}{{ showCount ? '（'+item.count+'）' : ''}}
                </span>
                <span v-else>{{ item[replaceFields.title] }}{{ showCount ? '（'+item.count+'）' : ''}}</span>
               <div class="btnPosition">
                <a-dropdown :trigger="['click']" v-if="allowEdit">
                    <a class="btn" @click="e => e.stopPropagation()"><a-icon type="ellipsis" /></a>
                    <a-menu slot="overlay">
                        <a-menu-item key="1" @click="edit" v-if="user.isSystem !== 1">编辑</a-menu-item>
                        <a-menu-item key="2" @click="add">新增</a-menu-item>
                        <a-menu-item key="3" @click="remove" v-if="item.id!='1'">删除</a-menu-item>
                    </a-menu>
                </a-dropdown>
                <a-tooltip>
                    <template slot="title">
                    查看全部
                    </template>
                    <a class="btnReload" @click.stop="reload" v-if="allowReload&&item.id==dataSource[0].id"><a-icon type="reload" /></a>
                </a-tooltip>
                </div>
            </template>
        </a-tree>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
    props:{
      //树数据 类型：数组|Array
    //   dataSource:Array,
      //是否节点占据一行 类型：布尔值|Boolean
      blockNode:{
          type:Boolean,
          default:true
      },
      //title后是否显示数量 类型：布尔值|Boolean
      showCount:{
          type:Boolean,
          default:false
      },
      //是否允许编辑 类型：布尔值|Boolean
      allowEdit:{
          type:Boolean,
          default:false
      },
      //是否允许重置 类型：布尔值|Boolean
      allowReload:{
          type:Boolean,
          default:true
      },
      //是否允许搜索 类型：布尔值|Boolean
      allowSearch:{
          type:Boolean,
          default:true
      },

      //
      replaceFields:{
          type:Object,
          default(){
              return {
                    children:'children',
                    title:'name',
                    key:'id'
              }
          }
      },
      // 加载数据方法
      getTreeData:{
        type:Function
      }
    },
    data() {
        return {
            selectedKeys:[],
            selectedNode:{},
            dataList:[],
            searchValue:'',
            expandedKeys:[],
            autoExpandParent:true,
            filterTree:'',
            dataSource:[]
        };
    },
    async created(){
       await this.loadTree()
        
    },
    methods: {
      async loadTree(){
            const oid = this.user.organizationId
            await this.$api.organizationService.getOrganization({organizationId:oid}).then((res)=>{
            let tree = res.data.data.data
            tree.forEach(item => {
                item.scopedSlots = { title: "custom" }
            })
            this.dataSource = this.filterArray(res.data.data.data)
            console.log(this.dataSource)
            this.initData(this.dataSource)
            this.dataList.map(i=>this.expandedKeys.push(i.key))
            
                // this.$emit("getTreeData",this.filterTree)
            })
        },
        filterArray(data) {
            data.forEach(function (item) {
                delete item.children;
            });
            var map = {};
            data.forEach(function (item) {
                map[item.id] = item;
            });
            var val = [];
            data.forEach(function (item) {
                var parent = map[item.parentId] || map[item.code];
                if (parent) {
                    (parent.children || (parent.children = [])).push(item);
                } else {
                    val.push(item);
                }
            });
            return val;
        },
        onExpand(expandedKeys) {
            this.expandedKeys = expandedKeys;
            this.autoExpandParent = false;
        },
        //选中树节点
        onSelect(selectedKeys,e) {
            this.selectedKeys = selectedKeys
            this.selectedNode = e.node.dataRef
            let params = {}
            if(this.selectedKeys.length>0){
                params[this.replaceFields.key] = this.selectedNode.id
                params[this.replaceFields.title] = this.selectedNode.name
            }
            this.$emit('loadTreeNode',params)
        },
        //编辑
        edit(){
            this.$emit('editTreeNode',this.selectedNode)
        },
        //新增
        add(){
            this.$emit('addTreeNode',this.selectedNode)
        },
        //删除
        remove(){
            this.$emit('removeTreeNode',this.selectedNode)
        },
        //重置
        reload(){
            this.selectedKeys=[]
            this.selectedNode={}
            let params = {}
            this.$emit('loadTreeNode',params)
        },
        initData(data){
            for (let i = 0; i < data.length; i++) {
                const node = data[i];
                const key = node[this.replaceFields.key];
                const title = node[this.replaceFields.title];
                this.dataList.push({ key, title });
                if (node.children) {
                    this.initData(node.children);
                }
            }
        },
        //搜索
        onChange(e) {
            const value = e.target.value;
            const expandedKeys = this.dataList
                .map(item => {
                    if(value){
                        if (value&&item.title.indexOf(value) > -1) {
                            return this.getParentKey(item.key, this.dataSource);
                        }
                        return null;
                    }else{
                        return item.key
                    }
                
                })
                .filter((item, i, self) => item && self.indexOf(item) === i);
            Object.assign(this, {
                expandedKeys,
                searchValue: value,
                autoExpandParent: true,
            });
        },
        /**
         * 获得父节点key
         * @param key 
         * @param tree
         */
        getParentKey(key,tree){
            let parentKey;
            for (let i = 0; i < tree.length; i++) {
                const node = tree[i];
                if (node.children) { 
                   node.children.some(item => {
                        item[this.replaceFields.key] == key
                   })
                    if (node.children.some(item => item[this.replaceFields.key] == key)) {
                        parentKey = node[this.replaceFields.key];
                    } else if (this.getParentKey(key, node.children)) {
                        parentKey = this.getParentKey(key, node.children);
                    }
                }
            }
            return parentKey;
        }
    },
     computed:{
    ...mapGetters("account", ["user"])
  }
};
</script>
<style lang="less" scoped>

  .custom-tree {
      border-right: 1px solid @border-color-split;
      
      /deep/ .ant-tree-title {
          display: flex;
          justify-content: space-between;
          text-align: center;
        .btnPosition {
            
            font-size: 14px;
            z-index: 1;
            color:@text-color;
            display: flex;
            justify-content: space-between;
            
        }
        .btn {
            display: none;
            color:@text-color
        }
         
        
    }
    /deep/ .ant-tree-node-selected{
        .btn {
            display: inline-block;
        }
        .btnReload{
             margin-left: 10px;
        }
    }
      
  }
</style>