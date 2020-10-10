<template>
  <div>
    <a-modal 
        v-model="visible" 
        title="新增学习经历" 
        on-ok="handleOk">
      <template slot="footer">
        <a-button key="back" @click="handleCancel">
          取消
        </a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="handleOk">
          提交  
        </a-button>
      </template>
      <div class="content">
        <a-form-model
            ref="ruleForm"
            :model="form"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
        >
            <div v-for="(item,index) in studyTitle" :key="index">
                <a-form-model-item :label="item.label" :labelCol="{span: 7}" :wrapperCol="{span: 13}">
                    <a-input v-model="form[item.title]" v-if="item.type=='input'" />
                    <a-select v-model="form[item.title]" :placeholder="item.placeholder" v-else-if="item.type=='select'">
                       <a-select-option v-for="(i,j) in item.selectItem" :key="j" :value="i.value">
                                {{i.value}}
                        </a-select-option>
                    </a-select>
                    <a-date-picker
                        v-model="form[item.title]"
                        show-time
                        type="date"
                        placeholder="请选择入职时间"
                        style="width: 100%;"
                        v-else-if="item.type=='time'"
                    />
                </a-form-model-item>
            </div>
        </a-form-model>
      </div>
    </a-modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
        loading: false,
        visible: false,
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
        studyTitle:[
            {title:'school',label:'毕业院校',type:'input',placeholder:'请输入毕业院校'},
            {title:'department',label:'所在院系',type:'input',placeholder:'请输入所在院系'},
            {title:'studyForm',label:'学习形式',type:'input',placeholder:'请输入学习形式'},
            {title:'studyLength',label:'学制',type:'input',placeholder:'请输入学制'},
            {title:'startTime',label:'入学日期',type:'time',placeholder:'请选择入学日期'},
            {title:'endTime',label:'毕业日期',type:'time',placeholder:'请选择毕业日期'},
            {title:'specialty',label:'所学专业',type:'input',placeholder:'请输入所学专业'},
            {title:'studyHis',label:'学历',type:'input',placeholder:'请输入学历'},
            {title:'degree',label:'学位',type:'select',placeholder:'请选择学位',selectItem:[{value:'学士'},{value:'硕士'},{value:'博士'},{value:'博士后'}]},
            {title:'degreeTime',label:'学位授予日期',type:'time',placeholder:'请选择学位授予日期'}
        ],
        form:{
            school:'',
            department:'',
            studyForm:'',
            studyLength:'',
            startTime:'',
            endTime:'',
            specialty:'',
            studyHis:'',
            degree:'',
            degreeTime:''
        },
        rules:{}
    };
  },
  methods: {
    showModal() {
      this.visible = true;
    },
    handleOk() {
      this.loading = true;
      setTimeout(() => {
        this.visible = false;
        this.loading = false;
      }, 3000);
    },
    handleCancel() {
      this.visible = false;
    },
  },
};
</script>