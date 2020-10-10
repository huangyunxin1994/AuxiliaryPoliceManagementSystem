<template>
  <div class="" >
    <a-row :gutter="24">
      <a-col :sm="12" :md="8" :lg="8" :xl="6" :xxl="4" :style="{ marginBottom: '24px' }">
        <div style="background:#578EBE" class="antd-pro-pages-home-quickCard" :showfooter="false" :loading="loading" title="" total="职级评定">
          <a-icon type="audit" />
          <span>职级评定</span>
        </div>
      </a-col>
      <a-col :sm="12" :md="8" :lg="8" :xl="6" :xxl="4" :style="{ marginBottom: '24px' }">
        <div style="background:#F29503" class="antd-pro-pages-home-quickCard" :showfooter="false" :loading="loading" total="">
          <a-icon type="file-sync" />
          <span>岗位调动</span>
        </div>
      </a-col>
      <a-col :sm="12" :md="8" :lg="8" :xl="6" :xxl="4" :style="{ marginBottom: '24px' }">
        <div style="background:#44B6AE" class="antd-pro-pages-home-quickCard" :showfooter="false" :loading="loading" total="">
          <a-icon type="pay-circle" />
          <span>工资管理</span>
        </div>
      </a-col>
      <a-col :sm="12" :md="8" :lg="8" :xl="6" :xxl="4" :style="{ marginBottom: '24px' }">
        <div style="background:#8775A7" class="antd-pro-pages-home-quickCard" :showfooter="false" :loading="loading" total="">
          <a-icon type="file-search" />
          <span>合同管理</span>
        </div>
      </a-col>
      <a-col :sm="12" :md="8" :lg="8" :xl="6" :xxl="4" :style="{ marginBottom: '24px' }">
        <div style="background:#4F5C65" class="antd-pro-pages-home-quickCard" :showfooter="false" :loading="loading" total="">
          <a-icon type="calculator" />
          <span>加班管理</span>
        </div>
      </a-col>
      <a-col :sm="12" :md="8" :lg="8" :xl="6" :xxl="4" :style="{ marginBottom: '24px' }">
        <div style="background:#14AAE4" class="antd-pro-pages-home-quickCard" :showfooter="false" :loading="loading" total="">
          <a-icon type="hourglass" />
          <span>请假管理</span>
        </div>
      </a-col>
    </a-row>
    <div class="antd-pro-pages-home-twoColLayout" :class="!isMobile && 'desktop'">
        <a-row :gutter="24">
            <a-col :xl="8" :lg="24" :md="24" :sm="24" :xs="24" >
                <a-card class="antd-pro-pages-home-salesCard" :loading="loading" :bordered="false" >
                    <div class="antd-pro-pages-home-salesCard-title" slot="title" :style="{'border-color':theme.color}">辅警人员变化统计</div>
                    <div class="ant-table-wrapper">
                        <!-- <mini-smooth-area :style="{ height: '100%' }" :dataSource="searchUserData" :scale="searchUserScale" /> -->
                        <bar :data="barData" :scale="searchUserScale"/>
                    </div>
                </a-card>
            </a-col>
        
            <a-col :xl="8" :lg="24" :md="24" :sm="24" :xs="24">
            <a-card class="antd-pro-pages-home-salesCard" :loading="loading" :bordered="false">
                <div class="antd-pro-pages-home-salesCard-title" slot="title" :style="{'border-color':theme.color}">业务处理情况</div>
                <div class="ant-table-wrapper">
                    <v-chart :force-fit="true" :height="284" :data="pieData" :scale="pieScale" :padding="['auto', 'auto', '40', '50']">
                        <v-tooltip :showTitle="false" dataKey="item*percent" />
                        <v-axis />
                        <!-- position="right" :offsetX="-140" -->
                        <v-legend dataKey="item"/>
                        <v-pie position="percent" :offsetX="-140" color="item" :vStyle="pieStyle" />
                        <v-coord type="theta" :radius="0.75" :innerRadius="0.6" />
                    </v-chart>
                </div>
            </a-card>
            </a-col>
            <a-col :xl="8" :lg="24" :md="24" :sm="24" :xs="24">
                <a-card class="antd-pro-pages-home-salesCard" :loading="loading" :bordered="false">
                    <div class="antd-pro-pages-home-salesCard-title" slot="title" :style="{'border-color':theme.color}">业务信息</div>
                    <div class="ant-table-wrapper">
                         <list :iconColor="theme.color" icon="message" :list="businessList"/>
                    </div>
                </a-card>
            </a-col>
        </a-row>
        <a-row :gutter="24">
            <a-col :xl="16" :lg="24" :md="24" :sm="24" :xs="24">
                <a-card class="antd-pro-pages-home-salesCard" :loading="loading" :bordered="false">
                    <div class="antd-pro-pages-home-salesCard-title" slot="title" :style="{'border-color':theme.color}">通知公告</div>
                    <div class="ant-table-wrapper">
                        <list :iconColor="theme.color" icon="sound" :list="noticeList"/>
                    </div>
                </a-card>
            </a-col>
             <a-col :xl="8" :lg="24" :md="24" :sm="24" :xs="24">
                <a-card class="antd-pro-pages-home-salesCard" :loading="loading" :bordered="false">
                    <div class="antd-pro-pages-home-salesCard-title" slot="title" :style="{'border-color':theme.color}">文档中心</div>
                    <div class="ant-table-wrapper">
                         <list :iconColor="theme.color" icon="folder" :list="fileList"/>
                    </div>
                </a-card>
            </a-col>
        </a-row>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
const barData = []
const barData2 = []
for (let i = 0; i < 12; i += 1) {
  barData.push({
    x: `${i + 1}月`,
    y: Math.floor(Math.random() * 1000) + 200
  })
  barData2.push({
    x: `${i + 1}月`,
    y: Math.floor(Math.random() * 1000) + 200
  })
}

const rankList = []
for (let i = 0; i < 7; i++) {
  rankList.push({
    name: '白鹭岛 ' + (i + 1) + ' 号店',
    total: 1234.56 - i * 100
  })
}

const searchUserData = []
for (let i = 0; i < 7; i++) {
  searchUserData.push({
    x: moment().add(i, 'days').format('YYYY-MM-DD'),
    y: Math.ceil(Math.random() * 10)
  })
}
const searchUserScale = [
  {
    dataKey: 'x',
    alias: '时间'
  },
  {
    dataKey: 'y',
    alias: '用户数',
    min: 0
  }]

const searchTableColumns = [
  {
    dataIndex: 'index',
    title: '排名',
    width: 90
  },
  {
    dataIndex: 'keyword',
    title: '搜索关键词'
  },
  {
    dataIndex: 'count',
    title: '用户数'
  },
  {
    dataIndex: 'range',
    title: '周涨幅',
    align: 'right',
    sorter: (a, b) => a.range - b.range,
    scopedSlots: { customRender: 'range' }
  }
]
const searchData = []
for (let i = 0; i < 50; i += 1) {
  searchData.push({
    index: i + 1,
    keyword: `搜索关键词-${i}`,
    count: Math.floor(Math.random() * 1000),
    range: Math.floor(Math.random() * 100),
    status: Math.floor((Math.random() * 10) % 2)
  })
}

const DataSet = require('@antv/data-set')

const sourceData = [
  { item: '已处理', count: 32.2 },
  { item: '未处理', count: 21 },
]

const pieScale = [{
  dataKey: 'percent',
  min: 0,
  formatter: '.0%'
}]

const dv = new DataSet.View().source(sourceData)
dv.transform({
  type: 'percent',
  field: 'count',
  dimension: 'item',
  as: 'percent'
})
const pieData = dv.rows
import {mapState} from 'vuex'
import bar from '@/components/chart/Bar'
import list from '@/components/list/List'
export default {
  name: 'Analysis',
  components:{
      bar,
      list
  },
  data () {
    return {
       loading: true,
      rankList,

      // 搜索用户数
      searchUserData,
      searchUserScale,
      searchTableColumns,
      searchData,

      barData,
      barData2,

      //
      pieScale,
      pieData,
      sourceData,
      pieStyle: {
        stroke: '#fff',
        lineWidth: 1
      },
      businessList:[
          {id:1,name:"【业务】您有员工待创建合同，请前往处理",date:"2020-06-16"},
          {id:2,name:"【业务】您有员工合同即将到期，请前往处理",date:"2020-06-16"},
          {id:3,name:"【业务】您有组织上月未同步工资条，请前往处理",date:"2020-06-16"},
          {id:4,name:"【业务】您有员工未按时归还证件，请前往处理",date:"2020-06-16"},
          {id:5,name:"【业务】您有员工未按时归还装，请前往处理",date:"2020-06-16"},
          {id:6,name:"【业务】您有新的加班申请待审批，请前往处理",date:"2020-06-16"},
          {id:7,name:"【业务】您有新的请假申请待审批，请前往处理",date:"2020-06-16"},
      ],
      noticeList:[
          {id:1,name:"【通知】区政协召开2017年委员地区组工作会议",date:"2020-06-16"},
          {id:2,name:"【通知】区政协召开2017年委员地区组工作会议",date:"2020-06-16"},
          {id:3,name:"【通知】关于2020年优秀辅警评选申报通知",date:"2020-06-16"},
          {id:4,name:"【通知】关于2020年新晋辅警人员通知",date:"2020-06-16"}
      ],
      fileList:[
          {id:1,name:"【文档】辅警管理规范.PDF",date:"2020-06-16"},
          {id:2,name:"【文档】辅警个人管理概要.docx",date:"2020-06-16"}
      ]
    }
  },
  created() {
    setTimeout(() => this.loading = !this.loading, 1000)
  },
  computed: {
      ...mapState('setting', ['theme','isMobile','pageMinHeight']),
    }
}
</script>

<style lang="less" scoped>
.new-page{
  height: 100%;
  border-radius: 4px;
  //margin-top: -24px;
  h1{
    font-size: 48px;
  }
}
    .antd-pro-pages-home-quickCard{
      color: #fff;
      font-weight: 600;
      padding: 30px 20px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      i{
          font-size: 64px;
          color: rgba(255, 255, 255, .3);
          margin-right: 15px;
      }
      span {
            color: #fff;
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: break-all;
            white-space: nowrap;
            margin-top: 4px;
            margin-bottom: 0;
            font-size: 20px;
            line-height: 38px;
            height: 38px;
        }
  }
  .antd-pro-pages-home-twoColLayout {
    position: relative;
    display: flex;
    display: block;
    flex-flow: row wrap;
  }

  .antd-pro-pages-home-salesCard {
      height: 400px;
      margin-bottom: 24px;
    /deep/ .ant-card-head {
      position: relative;
    }
    /deep/ .ant-card-body{
            height: calc(100% - 57px);
            box-sizing: border-box;
            overflow: auto;
            
    }
    .antd-pro-pages-home-salesCard-title{
        border-style: solid;
        border-width: 5px ;
        border-top:none;
        border-right:none;
        border-bottom:none;
        color: @title-color;
        font-weight: 500;
        font-size: 16px;
        text-indent: 10px;
    }
  }

  .home-iconGroup {
    i {
      margin-left: 16px;
      color:@text-color-secondary;
      cursor: pointer;
      transition: color .32s;
      color: black;
    }
  }
  .analysis-salesTypeRadio {
    position: absolute;
    right: 54px;
    bottom: 12px;
  }
  .extra-wrap{
    .extra-item{
      display: inline-block;
      margin-right: 24px;
      a:not(:first-child){
        margin-left: 24px;
      }
    }
  }
  @media screen and (max-width: 992px){
    .extra-wrap .extra-item{
      display: none;
    }
  }
  @media screen and (max-width: 576px){
    .extra-wrap{
      display: none;
    }
  }

</style>