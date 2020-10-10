<template>
  <a-form-model
    ref="ruleForm"
    :model="form"
    :rules="rules"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
  >
    <a-form-model-item v-for="(item,index) in formTitle" :key="index" :label="item.label" :prop="item.name" :ref="item.refName">
      <!-- 输入框  -->
      <a-input
        v-model="form[item.name]"
        v-if="item.type=='input'"
        :placeholder="item.placeholder"
      />
      <!-- 下拉框 -->
      <a-select v-model="form[item.name]" v-else-if="item.type=='select'" :placeholder="item.placeholder">
        <a-select-option  v-for="(i,j) in item.select" :key="j" :value='i.name'>
          {{i.name}}
        </a-select-option>
      </a-select>
      <!-- 时间框 -->
      <a-date-picker
        v-model="form[item.name]"
        v-else-if="item.type=='picker'"
        show-time
        type="date"
        :placeholder="item.placeholder"
        style="width: 100%;"
      />
      <!-- 开关 -->
      <a-switch v-else-if="item.type=='switch'" v-model="form[item.name]" />
      <!-- 复选框 -->
      <a-checkbox-group v-model="form[item.name]" v-else-if="item.type=='checkbox'">
        <a-checkbox  name="type" v-for="(i,j) in item.select" :key="j" :value='i.name'>
          {{i.name}}
        </a-checkbox>
      </a-checkbox-group>
      <!-- 单选框 -->
      <a-radio-group v-model="form[item.name]" v-else-if="item.type=='radio'">
        <a-radio  v-for="(i,j) in item.select" :key="j" :value='i.name'>
          {{i.name}}
        </a-radio>
      </a-radio-group>
      <!-- 文本域 -->
      <a-input v-model="form[item.name]" type="textarea" v-else-if="item.type=='textarea'" :placeholder="item.placeholder"/>
    </a-form-model-item>
  </a-form-model>
</template>
<script>
import pick from 'lodash.pick'
export default {
  props: {
    formTitle:{
      type: Array,
      default: () => []
    },
    // form:{
    //   type:Object,
    //   default:null
    // },
    rules:{
      type:Object,
      default:null
    },
    record: {
      type: Object,
      default: null
    },
  },
  created(){
    this.formTitle.forEach(i=>{
      this.form[i.name] = ''
      this.dataSource.push(i.name)
    })
  },
  mounted () {
    console.log(this.record)
    console.log(this.dataSource)
    console.log(pick(this.record, this.dataSource))
    console.log(this.form)
    if(this.record){
      this.form = pick(this.record, this.dataSource)
    }
    
  },
  data() {
    return {
      labelCol: { span: 8 },
      wrapperCol: { span: 12 },
      other: '',
      form: {},
      dataSource:[]
    };
  },
  methods: {
    onSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    onFieldBlur(){
      console.log("哈哈哈")
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
    },
    onOk () {
      console.log('监听了 modal ok 事件')
      return new Promise(resolve => {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            console.log('submit!');
            resolve(true)
          } else {
            console.log('error submit!!');
            resolve(false)
            // return false;
          }
        });
      })
    },
  },
};
</script>