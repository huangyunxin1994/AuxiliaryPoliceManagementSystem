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
          <div slot="description">{{ formatTime(item.releaseTime) ||  formatTime(item.createTime)}}</div>
        </a-list-item-meta>
        
      </a-list-item>
    </a-list>
    <a-modal :title="itemData.title" :visible="visible" @cancel="hanldeCancel" :footer="null" centered>
      <a-row>
        <a-col :span="12" >
          发布时间:{{formatTime(itemData.releaseTime)}}
        </a-col>
        <a-col :span="12" >
          发布人:{{itemData.publisher}}
        </a-col>
      </a-row>
      <a-divider />
      <div v-html="text2"></div>
      <!-- <pre>
        {{itemData.contentA}}
      </pre> -->
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
const routerObj = {
  1:"/contract/contract",//合同
  4:"/wagesManage/wagesManage",//工资
  6:"/cardequip/papersAdmin",//证件
  7:"/cardequip/equipageAdmin",//装备
  10:"/workandleave/workovertime",//加班
  11:"/workandleave/askforleave",//请假
  14:"/contract/contract"//合同
}
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
      routerObj,
      visible:false,
      loading: true,
      data,
      itemData:'',
      BASE_URL:'',
      text2:"",
    };
  },
  watch:{
    user(){
    },
    visible(newVal){
      if(newVal)
      this.submitText()
    }
  },
  methods: {
    // js部分
    submitText(){
        let arr = [];
        this.itemData.contentA.split('\n').forEach(item=>arr.push(`<p>${item.trim()}</p>`));
        this.text2 =  arr.join('<br>');
    },
    handleClick(item) {
      if(item.type == 2){
        //待办
        this.$router.push({
            path:this.routerObj[item.state]
          });
       
      }else if(item.type == 1){//通知
        const _this = this;
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
                _this.$emit("refresh")
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
    
    
  },
  mounted(){
    this.BASE_URL = process.env.VUE_APP_API_BASE_URL
  }
  
};
</script>
<style>
.demo-loadmore-list {
  min-height: 350px;
}
</style>
