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
            <template slot="custom" slot-scope="item">
                <span v-if="item[replaceFields.title].indexOf(searchValue) > -1">
                    {{ item[replaceFields.title].substr(0, item[replaceFields.title].indexOf(searchValue)) }}
                    <span style="color: #f50">{{ searchValue }}</span>
                    {{ item[replaceFields.title].substr(item[replaceFields.title].indexOf(searchValue) + searchValue.length) }}{{ showCount ? '（'+item.count+'）' : ''}}
                </span>
                <span v-else>{{ item[replaceFields.title] }}{{ showCount ? '（'+item.count+'）' : ''}}</span>
                <a-dropdown :trigger="['click']" v-if="allowEdit">
                    <a class="btn" @click="e => e.stopPropagation()"><a-icon type="ellipsis" /></a>
                    <a-menu slot="overlay">
                        <a-menu-item key="1" @click="edit">编辑</a-menu-item>
                        <a-menu-item key="2" @click="add">新增</a-menu-item>
                        <a-menu-item key="3" @click="remove" v-if="item.key!='key-01'">删除</a-menu-item>
                    </a-menu>
                </a-dropdown>
                <a-tooltip>
                    <template slot="title">
                    查看全部
                    </template>
                    <a class="btnReload" @click.stop="reload" v-if="allowReload&&item.key=='key-01'"><a-icon type="reload" /></a>
                </a-tooltip>
                
            </template>
        </a-tree>
    </div>
</template>

<script>

export default {
    props:{
      //树数据 类型：数组|Array
      dataSource:Array,
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
          default:false
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
                    title:'title',
                    key:'key'
              }
          }
      }
    },
    data() {
        return {
            selectedKeys:[],
            selectedNode:{},
            dataList:[],
            searchValue:'',
            expandedKeys:[],
            autoExpandParent:true
        };
    },
    mounted(){
        this.initData(this.dataSource)
    },
    methods: {
        onExpand(expandedKeys) {
            console.log(expandedKeys)
            this.expandedKeys = expandedKeys;
            this.autoExpandParent = false;
        },
        onSelect(selectedKeys,e) {
            this.selectedKeys = selectedKeys
            this.selectedNode = e.node.dataRef
            let params = {}
            params[this.replaceFields.key] = this.selectedKeys[0]
            console.log(params)
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
            this.$emit('reloadTreeNode')
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
                console.log(this.dataList)
            }
        },
        //搜索
        onChange(e) {
            const value = e.target.value;
            const expandedKeys = this.dataList
                .map(item => {
                if (value&&item.title.indexOf(value) > -1) {
                    return this.getParentKey(item.key, this.dataSource);
                }
                return null;
                })
                .filter((item, i, self) => item && self.indexOf(item) === i);
            Object.assign(this, {
                expandedKeys,
                searchValue: value,
                autoExpandParent: true,
            });
            console.log(this.expandedKeys)
        },
        /**
         * 获得父节点key
         * @param key 
         * @param tree
         */
        getParentKey(key,tree){
            console.log(key)
            console.log(tree)
            let parentKey;
            for (let i = 0; i < tree.length; i++) {
                const node = tree[i];
                if (node.children) {
                   console.log(this.replaceFields.key) 
                   node.children.some(item => {
                        item[this.replaceFields.key] == key
                        console.log(item[this.replaceFields.key] +","+key)
                   })
                    if (node.children.some(item => item[this.replaceFields.key] == key)) {
                        parentKey = node[this.replaceFields.key];
                    } else if (this.getParentKey(key, node.children)) {
                        parentKey = this.getParentKey(key, node.children);
                    }
                }
            }
            console.log(parentKey)
            return parentKey;
        }
    },
};
</script>
<style lang="less">

  .custom-tree {
      border-right: 1px solid @border-color-split;
      
      /deep/ .ant-tree-node-content-wrapper {
        position: relative;
        /deep/ .btn {
            display: none;
            position: absolute;
            top: 0;
            right: 10px;
            font-size: 20px;
            z-index: 1;
            color:@text-color
        }
        /deep/ .btnReload {
            position: absolute;
            top: 0;
            right: 10px;
            font-size: 14px;
            z-index: 1;
            color:@text-color
        }
    }
    /deep/ .ant-tree-node-selected{
         /deep/ .btn {
            display: block;
        }
    }
      
  }
</style>