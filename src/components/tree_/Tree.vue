<template>
    <a-tree
      class="custom-tree"
      :tree-data="dataSource"
      :default-expanded-keys="['key-01']"
      :selectedKeys="selectedKeys"
      :replace-fields="replaceFields"
      :block-node="blockNode"
      @select="onSelect"
    >
        <a-icon slot="switcherIcon" type="down" />
        <template slot="custom" slot-scope="item">
            <span>{{ item.title }}{{ showCount ? '（'+item.count+'）' : ''}}</span>
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
            showLine: true,
            selectedKeys:[]
        };
    },
    methods: {
        onSelect(selectedKeys) {
            this.selectedKeys = selectedKeys
            let params = {}
            params.key = this.selectedKeys
            this.$emit('loadTreeNode',params)
        },
        //编辑
        edit(){
            let params = {}
            params.key = this.selectedKeys
            this.$emit('editTreeNode',params)
        },
        //新增
        add(){
            let params = {}
            params.key = this.selectedKeys
            this.$emit('addTreeNode',params)
        },
        //删除
        remove(){
            let params = {}
            params.key = this.selectedKeys
            this.$emit('removeTreeNode',params)
        },
        //重置
        reload(){
            this.selectedKeys=[]
            this.$emit('reloadTreeNode')
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
            z-index: 1050;
            color:@text-color
        }
        /deep/ .btnReload {
            position: absolute;
            top: 0;
            right: 10px;
            font-size: 14px;
            z-index: 1050;
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