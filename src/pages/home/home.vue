<template>
  <div class="" >
    <a-row :gutter="24">
      <a-col :sm="12" :md="8" :lg="8" :xl="6" :xxl="4" :style="{ marginBottom: '24px' }">
        <div style="background:#578EBE" class="antd-pro-pages-home-quickCard" :showfooter="false" @click="handleRoute('personAdmin/rank')">
          <a-icon type="audit" />
          <span>职级评定</span>
        </div>
      </a-col>
      <a-col :sm="12" :md="8" :lg="8" :xl="6" :xxl="4" :style="{ marginBottom: '24px' }">
        <div style="background:#F29503" class="antd-pro-pages-home-quickCard" :showfooter="false" @click="handleRoute('personAdmin/post')">
          <a-icon type="file-sync" />
          <span>岗位调动</span>
        </div>
      </a-col>
      <a-col :sm="12" :md="8" :lg="8" :xl="6" :xxl="4" :style="{ marginBottom: '24px' }">
        <div style="background:#44B6AE" class="antd-pro-pages-home-quickCard" :showfooter="false" @click="handleRoute('wagesManage/wagesManage')">
          <a-icon type="pay-circle" />
          <span>工资管理</span>
        </div>
      </a-col>
      <a-col :sm="12" :md="8" :lg="8" :xl="6" :xxl="4" :style="{ marginBottom: '24px' }">
        <div style="background:#8775A7" class="antd-pro-pages-home-quickCard" :showfooter="false" @click="handleRoute('contract/contract')">
          <a-icon type="file-search" />
          <span>合同管理</span>
        </div>
      </a-col>
      <a-col :sm="12" :md="8" :lg="8" :xl="6" :xxl="4" :style="{ marginBottom: '24px' }">
        <div style="background:#4F5C65" class="antd-pro-pages-home-quickCard" :showfooter="false" @click="handleRoute('workandleave/workovertime')">
          <a-icon type="calculator" />
          <span>加班管理</span>
        </div>
      </a-col>
      <a-col :sm="12" :md="8" :lg="8" :xl="6" :xxl="4" :style="{ marginBottom: '24px' }">
        <div style="background:#14AAE4" class="antd-pro-pages-home-quickCard" :showfooter="false" @click="handleRoute('workandleave/askforleave')">
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
            <a-col :xl="8" :lg="24" :md="24" :sm="24" :xs="24">
                <a-card class="antd-pro-pages-home-salesCard" :loading="loading" :bordered="false">
                    <div class="antd-pro-pages-home-salesCard-title" slot="title" :style="{'border-color':theme.color}">通知</div>
                    <div class="ant-table-wrapper">
                        <list :iconColor="theme.color" icon="sound" :list="noticeList" :user="user" @refresh="refresh"/>
                    </div>
                </a-card>
            </a-col>
            <a-col :xl="8" :lg="24" :md="24" :sm="24" :xs="24">
                <a-card class="antd-pro-pages-home-salesCard" :loading="loading" :bordered="false">
                    <div class="antd-pro-pages-home-salesCard-title" slot="title" :style="{'border-color':theme.color}">公告</div>
                    <div class="ant-table-wrapper">
                        <list :iconColor="theme.color" icon="profile" :list="afficheList"/>
                    </div>
                </a-card>
            </a-col>
             <a-col :xl="8" :lg="24" :md="24" :sm="24" :xs="24">
                <a-card class="antd-pro-pages-home-salesCard" :loading="loading" :bordered="false">
                    <div class="antd-pro-pages-home-salesCard-title" slot="title" :style="{'border-color':theme.color}">文档中心</div>
                    <div class="ant-table-wrapper">
                         <file-list :iconColor="theme.color" icon="folder" :list="fileList"/>
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
import {mapState,mapGetters} from 'vuex'
import bar from '@/components/chart/Bar'
import list from '@/components/list/List'
import fileList from '@/components/list/fileList'
export default {
  name: 'Analysis',
  components:{
      bar,
      list,
      fileList
  },
  data () {
    return {
      visible:false,
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
      businessList:[],//待办
      noticeList:[],//通知
      afficheList:[],//公告
      fileList:[]
    }
  },
  methods:{
    handleRoute(path){
      this.$router.push(path)
    },
    refresh(){
      this.getUserMessList()
    },
    // 获取管理员个人消息通知列表(通知)
    async getUserMessList(){
      let _this = this
      let query = {
        id:this.user.id
      }
      const requestParameters = Object.assign({}, query);
       _this.$api.messageService
        .getUSerList(requestParameters)
        .then((res) => {
          let list = res.data.data.list
          this.noticeList = list
        });
    },
    // 获取代办列表(代办)
    async getUserDbList(){
      let _this = this
      let query = {
        oid:this.user.isSystem !==1 && this.user.organizationId || "",
        id:this.user.id
      }
      const requestParameters = Object.assign({}, query);
       _this.$api.messageService
        .getDbList(requestParameters)
        .then((res) => {
           let arr = []
          res.data.data.list.map(i=>{
            if(i.count>0){
              i.content += "(" + i.count + ")"
              i.type = 2
              arr.push(i)
            }
          })
          this.businessList = arr
        });
    },
    // 公告
    async getAfficheList(){
      let  _this = this
      let query = {
        oid:this.user.isSystem !==1 && this.user.organizationId || "",
        type:2,
        expire:1
      }
      const requestParameters = Object.assign({}, query);
      _this.$api.documentAnnouncementService
          .getNotice(requestParameters)
          .then((res) => {
            res.data.data.list.forEach(item => {
              item.notice = 1
              item.contentA = item.content
              item.content = item.title
            });
            // return res.data;
            _this.afficheList = res.data.data.list
          });
    },
    async getFile(){
      let query = {
        oid:this.user.isSystem !==1 && this.user.organizationId || "",
        type:2
      }
      const requestParameters = Object.assign({}, query);
      this.$api.documentAnnouncementService
          .getDocument(requestParameters)
          .then((res) => {
            // return res.data;
            this.fileList = res.data.data.list
          });
    }
  },
  created() {
    setTimeout(() => this.loading = !this.loading, 1000)
  },
  async mounted(){
    await this.getUserMessList()
    await this.getUserDbList()
    await this.getAfficheList()
    await this.getFile()
  },
  computed: {
      ...mapState('setting', ['theme','isMobile','pageMinHeight']),
      ...mapGetters("account",["user"]),// 获取登录者信息
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
      cursor: pointer;
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