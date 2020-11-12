<template>
  <page-layout :avatar="user.avatar" :style="{'min-height':pageMinHeight}">
    <div slot="headerContent">
      <div class="title">{{timeFix}}，{{user.name}}</div>
      <div>{{user.postName}} | {{user.organizationName}}</div>
    </div>
    <template>
      <a-row style="margin: 0 -12px">
         <a-col style="padding: 0 12px" :xl="8" :lg="24" :md="24" :sm="24" :xs="24">
          <a-row style="margin: 0 -12px">
            <a-col style="padding: 0 12px" :sm="12" :style="{ marginBottom: '24px' }">
              <div style="background:#44B6AE" class="antd-pro-pages-home-quickCard"  @click="handleRoute('servicemess/contract')">
                <a-icon type="pay-circle" />
                <span>工资查询</span>
              </div>
            </a-col>
            <a-col style="padding: 0 12px" :sm="12" :style="{ marginBottom: '24px' }">
              <div style="background:#4F5C65" class="antd-pro-pages-home-quickCard"  @click="handleRoute('servicemess/overtimeleave')">
                <a-icon type="calculator" />
                <span>加班请假</span>
              </div>
            </a-col>
          </a-row>
          <a-card :loading="loading" :bordered="false"  class="antd-pro-pages-home-salesCard" style="height:490px">
            <div class="antd-pro-pages-home-salesCard-title" slot="title" :style="{'border-color':theme.color}">文档中心</div>
            <div class="members">
              <file-list :iconColor="theme.color" icon="folder" :list="fileList"/>
            </div>
          </a-card>
        </a-col>
        <a-col style="padding: 0 12px" :xl="16" :lg="24" :md="24" :sm="24" :xs="24">
          <!-- <a-card class="project-list" :loading="loading" style="margin-bottom: 24px;" :bordered="false" :body-style="{padding: 0}">
            <div class="antd-pro-pages-home-salesCard-title" slot="title" :style="{'border-color':theme.color}">待处理事项</div>
            <a slot="extra">查看全部</a>
            <div>
              <div v-if="projects.length===0" style="text-align:center;height:100px;line-height:100px">
                暂无需要处理的事项
              </div>
              <a-card-grid :key="i" v-for="(item, i) in projects">
                <a-card :bordered="false" :body-style="{padding: 0}">
                  <a-card-meta :description="item.desc">
                    <div slot="title" class="card-title">
                      <a-avatar size="small" :src="item.logo" />
                      <span>Alipay</span>
                    </div>
                  </a-card-meta>
                  <div class="project-item">
                    <a class="group" href="/#/">科学搬砖组</a>
                    <span class="datetime">9小时前</span>
                  </div>
                </a-card>
              </a-card-grid>
            </div>
          </a-card> -->
          <a-row style="margin: 0 -12px">
            <a-col style="padding: 0 12px" :xl="12" :lg="12" :md="24">
              <a-card :loading="loading" :bordered="false"  class="antd-pro-pages-home-salesCard">
                <div class="antd-pro-pages-home-salesCard-title" slot="title" :style="{'border-color':theme.color}">通知</div>
                <a-list>
                  <a-list-item :key="index" v-for="(item, index) in noticeList">
                    <a-icon
                        type="sound"
                        theme="twoTone"
                        :two-tone-color="theme.color"
                        style="margin-right: 20px; font-size: 14px"
                      />
                    <a-list-item-meta>
                      <!-- <a-avatar slot="avatar" :src="item.user.avatar" /> -->
                      <a slot="title" @click="handleDel(item.id)">{{ item.content }}</a>
                      <div slot="description">{{ formatTime(item.createTime)}}</div>
                    </a-list-item-meta>
                  </a-list-item>
                </a-list>
              </a-card>
            </a-col>
            <a-col style="padding: 0 12px" :xl="12" :lg="12" :md="24">
              <a-card :loading="loading" :bordered="false"  class="antd-pro-pages-home-salesCard">
                <div class="antd-pro-pages-home-salesCard-title" slot="title" :style="{'border-color':theme.color}">公告</div>
                 <list :iconColor="theme.color" icon="profile" :list="afficheList" style="height:500px"/>
              </a-card>
            </a-col>
          </a-row>
        </a-col>
        
       
      </a-row>
    </template>
  </page-layout>
</template>

<script>
import PageLayout from '@/layouts/PageLayout'
import HeadInfo from '@/components/tool/HeadInfo'
import {mapState,mapGetters} from 'vuex'
import {timeFix} from '@/utils/utils'
import fileList from '@/components/list/fileList'
import list from '@/components/list/List'
// import {request, METHOD} from '@/utils/request'

export default {
  name: 'WorkPlace',
  components: {HeadInfo, PageLayout, fileList, list},
  data () {
    return {
      projects: [],
      loading: true,
      activities: [],
      teams: [],
      fileList:[],
      noticeList:[],
      afficheList:[],//公告
      timeFix: timeFix(),
      message: ''
    }
  },
  computed: {
    ...mapState('setting', ['theme','isMobile','pageMinHeight']),
    ...mapGetters('account', ['user']),
  },
  created() {
    this.getFile()
    this.getPoliceMessList()
    this.getAfficheList()
    // request('/user/welcome', METHOD.GET).then(res => this.welcome = res.data)
    // request('/work/activity', METHOD.GET).then(res => this.activities = res.data)
    // request('/work/team', METHOD.GET).then(res => this.teams = res.data)
    // request('/project', METHOD.GET).then(res => {
        // this.projects = res.data
        this.loading = false
      // })
  },
  methods:{
    handleRoute(path){
      this.$router.push(path)
    },
    getFile(){
      let query = {
        oid:this.user.organizationId
      }
      const requestParameters = Object.assign({}, query);
      this.$api.documentAnnouncementService
          .getDocument(requestParameters)
          .then((res) => {
            // return res.data;
            this.fileList = res.data.data.list
          });
    },
    // 获取辅警个人消息通知列表(通知)
    async getPoliceMessList(){
      let _this = this
      let query = {
        id:this.user.id
      }
      const requestParameters = Object.assign({}, query);
       _this.$api.messageService
        .getPoliceList(requestParameters)
        .then((res) => {
          let list = res.data.data.list
          this.noticeList = list
        });
    },
     // 公告
     async getAfficheList(){
      let  _this = this
      let query = {
        oid:this.user.organizationId
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
    handleDel(id){
      const _this=this
       this.$confirm({
          title: "警告",
          content: `是否删除该条通知?`,
          okText: "删除",
          okType: "danger",
          centered: true,
          cancelText: "取消",
          onOk() {
            let param = {
              id:id
            }
            _this.$api.messageService.deleteMess(param).then((res)=>{
              if(res.data.code == 0){
                _this.$message.success(res.data.msg);
                _this.getPoliceMessList()
              }else{
                _this.$message.error(res.data.msg);
              }
            }).catch((err) => {
              _this.$message.error(err.data.msg);
            });
          },
          onCancel() {},
        });
      
    },
    formatTime(time){
      if(!time)
        return undefined
      time = new Date(time.replace(/-/g,"/")).getTime()
      if (time.length === 10) {
        time = parseInt(time) * 1000
      }
      const d = new Date(time)
      const now = Date.now()
      const diff = (now - time) / 1000
      if (diff < 30) {
        return '刚刚'
      } else if (diff < 3600) {
        return Math.ceil(diff / 60) + '分钟前'
      } else if (diff < 3600 * 24) {
        return Math.ceil(diff / 3600) + '小时前'
      } else if (diff < 3600 * 24 * 2) {
        return '1天前'
      }
      
      return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时'+
      d.getMinutes() +
      '分' 
      )
    }
  }
}
</script>

<style lang="less" scoped>
@import "index";
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
  .antd-pro-pages-home-salesCard {
      height: 638px;
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
</style>
