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
          <a slot="title" @click="handleClick">{{ item.name }}</a>
        </a-list-item-meta>
        <div>{{ item.date }}</div>
      </a-list-item>
    </a-list>
    <a-modal title="区政协召开2017年委员地区组工作会议" :visible="visible" @cancel="hanldeCancel" :footer="null" centered>
      <a-row>
        <a-col :span="12" >
          发布时间:2020-06-18
        </a-col>
        <a-col :span="12" >
          发布人:张三
        </a-col>
      </a-row>
      <a-divider />
      <p>
        下载所需的两个文件：Blob.js、Export2Excel.js

https://download.csdn.net/download/badao_liumang_qizhi/10767801

新建vendor，名称不一定非是vendor，建议但不非得将此目录放在与单页面同级的目录。将上面两个js文件放在vendor目录中。

比如：

这里要使用的单页面是merchantBIllFlow.vue,所以在此同级目录下新建vendor目录，将上面两个js文件放在此目录下。
      </p>
      <a-divider />
      附件：<a ><a-icon type="paper-clip" />2017年委员地区组工作会议纪要文件</a>
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
  },
  data() {
    return {
      visible:false,
      loading: true,
      data,
    };
  },
  methods: {
    handleClick() {
      this.visible=true
    },
    hanldeCancel(){
      this.visible=false
    }
  },
};
</script>
<style>
.demo-loadmore-list {
  min-height: 350px;
}
</style>
