<template>
  <a-list
    class=""
    item-layout="horizontal"
    :data-source="list"
  >
    <a-list-item slot="renderItem" slot-scope="item">
      <a-icon :type="icon" theme="twoTone" :two-tone-color="iconColor" style="margin-right:20px;font-size:14px;"/>
      <a-list-item-meta
        
      >
        <a slot="title" name="file" :download="item.name" :href="BASE_URL+'/DocumentAnnouncement/document/download?documentId='+item.id">{{ item.name }}</a>
       
      </a-list-item-meta>
      <div>{{ item.date }}</div>
    </a-list-item>
  </a-list>
</template>
<script>

export default {
    props:{
        //图标
        icon:String,
        //图标颜色，根据主题颜色变
        iconColor:{
            type:String,
            default:'#000'
        },
        list:Array
    },
    data() {
        return {
          BASE_URL:""
        };
    },
    created(){
      this.BASE_URL = process.env.VUE_APP_API_BASE_URL
    }
};
</script>
<style>
.demo-loadmore-list {
  min-height: 350px;
}
</style>
