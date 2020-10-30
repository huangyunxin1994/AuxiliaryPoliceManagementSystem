<template>
  <div>
    <a-list class="" item-layout="horizontal" :data-source="list">
      <a-list-item slot="renderItem" slot-scope="item">
        <a-icon
          :type="icon"
          theme="twoTone"
          :two-tone-color="iconColor"
          style="margin-right: 20px; font-size: 14px"
        />
        <a-list-item-meta>
          <a slot="title" @click="handleClick(item)">{{ item.content }}</a>
        </a-list-item-meta>
        <div>{{ item.createTime }}</div>
      </a-list-item>
    </a-list>
    <a-modal :title="itemData.title" :visible="visible" @cancel="hanldeCancel" :footer="null" centered>
      <a-row>
        <a-col :span="12" >
          发布时间:{{itemData.releaseTime}}
        </a-col>
        <a-col :span="12" >
          发布人:{{itemData.publisher}}
        </a-col>
      </a-row>
      <a-divider />
      <p>
        {{itemData.contentA}}
      </p>
      <a-divider />
      <!-- 附件：<a ><a-icon type="paper-clip" />{{itemData.name}}</a> -->
      附件：<a  name="file" :download="itemData.name" :href="BASE_URL+'/DocumentAnnouncement/notice/download?noticeId='+itemData.id">{{ itemData.name }}</a>
    </a-modal>
  </div>
</template>
<script>
const data = [
  {
    title: "Ant Design Title 1",
  },
  {
    title: "Ant Design Title 2",
  },
  {
    title: "Ant Design Title 3",
  },
  {
    title: "Ant Design Title 4",
  },
  {
    title: "Ant Design Title 3",
  },
  {
    title: "Ant Design Title 4",
  },
];

export default {
  props: {
    //图标
    icon: String,
    //图标颜色，根据主题颜色变
    iconColor: {
      type: String,
      default: "#000",
    },
    list: Array,
    user:{
      type:Object,
      default(){
        return{

        }
      }
    }
  },
  data() {
    return {
      visible:false,
      loading: true,
      data,
      itemData:'',
      BASE_URL:''
    };
  },
  watch:{
    user(newVal){
      console.log(newVal)
    }
  },
  methods: {
    handleClick(item) {
      console.log(item)
      
      if(item.type == 2){
        console.log("哈哈哈哈")
        //待办
        if(item.state == 1){//合同
          this.$router.push({
            path:"/contract/demo2"
          });
        }else if(item.state == 2){//职级
          this.$router.push({
            path:"/parent3/rank"
          });
        }else if(item.state == 3){//岗位
          this.$router.push({
            path:"/parent3/post"
          });
        }else if(item.state == 4){//工资
          this.$router.push({
            path:"/wagesManage/wagesManage"
          });
        }else if(item.state == 5){//培训
          this.$router.push({
            path:"/education/education"
          });
        }else if(item.state == 6){//证件
          this.$router.push({
            path:"/cardequip/papersAdmin"
          });
        }else if(item.state == 7){//装备
          this.$router.push({
            path:"/cardequip/equipageAdmin"
          });
        }else if(item.state == 8){//奖励
          this.$router.push({
            path:"/awardduty/award"
          });
        }else if(item.state == 9){//责任追究
          this.$router.push({
            path:"/awardduty/duty"
          });
        }else if(item.state == 10){//加班
          this.$router.push({
            path:"/workandleave/workovertime"
          });
        }else if(item.state == 11){//请假
          this.$router.push({
            path:"/workandleave/askforleave"
          });
        }else if(item.state == 12){//组织
          this.$router.push({
            path:"/setting/organ"
          });
        }else if(item.state == 13){//专业技术资格
          this.$router.push({
            path:"/parent3/profession"
          });
        }
      }else if(item.type == 1){//通知
        const _this = this;
        console.log(_this.user)
        this.$confirm({
          title: "警告",
          content: `是否删除该条通知?`,
          okText: "删除",
          okType: "danger",
          centered: true,
          cancelText: "取消",
          onOk() {
            let param = {
              userId:_this.user.id,
              msgId:item.id
            }
            _this.$api.messageService.deleteNotice(param).then((res)=>{
              if(res.data.code == 0){
                _this.$message.success(res.data.msg);
                return res.data
              }else{
                _this.$message.error(res.data.msg);
              }
            }).catch((err) => {
              _this.$message.error(err.data.msg);
            });
          },
          onCancel() {},
        });
      }else if(item.notice == 1){
        this.visible=true
        this.itemData = item
      }
    },
    hanldeCancel(){
      this.visible=false
      this.itemData = ''
    }
  },
  mounted(){
    this.BASE_URL = process.env.VUE_APP_API_BASE_URL2
    console.log( this.BASE_URL)
  },
};
</script>
<style>
.demo-loadmore-list {
  min-height: 350px;
}
</style>
