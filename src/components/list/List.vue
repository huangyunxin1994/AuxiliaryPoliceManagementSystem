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
        <a slot="title" href="https://www.antdv.com/">{{ item.name }}</a>
       
      </a-list-item-meta>
      <div>{{ item.date }}</div>
    </a-list-item>
  </a-list>
</template>
<script>
const data = [
  {
    title: 'Ant Design Title 1',
  },
  {
    title: 'Ant Design Title 2',
  },
  {
    title: 'Ant Design Title 3',
  },
  {
    title: 'Ant Design Title 4',
  },
  {
    title: 'Ant Design Title 3',
  },
  {
    title: 'Ant Design Title 4',
  },
];

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
        loading: true,
        data,
        };
    }
};
</script>
<style>
.demo-loadmore-list {
  min-height: 350px;
}
</style>
