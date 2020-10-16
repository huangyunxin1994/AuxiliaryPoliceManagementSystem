<template>
    <div :style="`min-height: ${pageMinHeight}px`">
      <a-row :gutter="24">
          <a-col :md="24" :sm="24">
              <a-card
                style="width:100%"
                :bordered="false"
                :tabList="tabListNoTitle"
                :activeTabKey="noTitleKey"
                @tabChange="key => handleTabChange(key, 'noTitleKey')"
                >
                <no-recycle v-if="noTitleKey === 'noRecycle'"></no-recycle>
                <already-recycle v-else-if="noTitleKey === 'alreadyRecycle'"></already-recycle>
            </a-card>
          </a-col>
      </a-row>
    </div>
</template>

<script>
import { mapState } from "vuex";
import alreadyRecycle from './equipageChid/alreadyRecycle'
import noRecycle from './equipageChid/noRecycle'


export default{
    components:{
        noRecycle,
        alreadyRecycle
    },
    data(){
        return{
            
            tabListNoTitle: [
                {
                    key: 'noRecycle',
                    tab: '已发放装备'
                },
                {
                    key: 'alreadyRecycle',
                    tab: '已回收装备'
                }
            ],
            noTitleKey: 'noRecycle'
        }
    },
    methods:{
        handleTabChange (key, type) {
            this[type] = key
        },
    },
    computed: {
    ...mapState("setting", ["theme", "pageMinHeight"])
  },
}
</script>

<style lang="less" scoped>
    @import "../index";
  .search-head{
    background-color: @base-bg-color;
    margin: -24px;
    &.head.fixed{
      margin: -24px 0;
    }
    .search-input{
      text-align: center;
    }
  }
  .search-content{
    margin-top: 48px;
  }
</style>
