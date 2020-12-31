<template>
  <div>
    <a-modal
    ref="modal"
      v-model="visible"
      :title="title"
      on-ok="handleOk"
      on-cancel="handleCancel"
      :destroy-on-close="true"
      :mask-closable="false"
      :afterClose="close"
      :width="errList.length > 0 ? 900 : 400"
      centered 
    >
      <template slot="footer">
        <a-button key="back" @click="handleCancel" v-show="errList.length">
          取消
        </a-button>
        <a-button
          key="submit"
          type="primary"
          :loading="loading"
          @click="handleOk"
          v-show="errList.length"
        >
          继续
        </a-button>
        <a-button
          type="primary"
          @click="handleCancel"
          v-show="done"
        >
          完成
        </a-button>
        
      </template>
      <a-row>
        <a-col :span="errList.length > 0 ? 6 : 24" >
          <a-steps
            direction="vertical"
            :current="current"
            :status="(errList.length > 0 && 'error') || 'process'"
          >
            <a-step title="验证基础资料">
              <a-icon slot="icon" :type="step[0]" />
            </a-step>
            <a-step title="验证学习经历">
              <a-icon slot="icon" :type="step[1]" />
            </a-step>
            <a-step title="验证工作经历">
              <a-icon slot="icon" :type="step[2]" />
            </a-step>
            <a-step title="验证家庭及社会关系">
              <a-icon slot="icon" :type="step[3]" />
            </a-step>
            <a-step title="导入完成">
              <a-icon slot="icon" :type="step[4]" />
            </a-step>
          </a-steps>
        </a-col>
        <a-col v-show="errList.length > 0" :span="18">
          <a-list
            item-layout="horizontal"
            :data-source="errList"
            style="max-height: 500px; overflow-y: auto"
          >
            <a-list-item slot="renderItem" slot-scope="item">
              <a-list-item-meta
                :description="'辅警：' + item.name + '，编号:' + item.number"
              >
                <!-- <span slot="title"></span> -->
                <a-icon slot="close-circle" />
              </a-list-item-meta>
              <div style="width:100%" slot="actions"><a-form-model :label-col="labelCol" :wrapper-col="wrapperCol">
                  <a-form-model-item
                    :label="i.name | statusFilter"
                    v-for="(i, index) in item.editList"
                    :key="index"
                  >
                    <a-date-picker
                      v-model="item[i.name]"
                      v-if="i.type === 'datepick'"
                      placeholder="请选择内容"
                      size="small"
                      style="width: 100%"
                      valueFormat="YYYY-MM-DD"
                    />
                    <a-select
                      v-model="item[i.name]"
                      v-else-if="i.type === 'select'"
                      size="small"
                    >
                      <a-select-option
                        :value="j.name"
                        v-for="(j, index) in i.select"
                        :key="j.id || index"
                        placeholder="请选择内容"
                      >
                        {{ j.name }}
                      </a-select-option>
                    </a-select>
                    <a-input-number
                      v-model="item[i.name]"
                      v-else-if="i.type === 'number'"
                      style="width: 100%"
                      size="small"
                      placeholder="请输入内容"
                    />
                    <a-input
                      v-model="item[i.name]"
                      placeholder="请输入内容"
                      size="small"
                      v-else-if="i.type === 'input'"
                    />
                  </a-form-model-item>
                </a-form-model></div>
              <div style="width:25%">
                {{ item.title }}
              </div>
            </a-list-item>
          </a-list>
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>
<script>
// import { validateIdNo, validatePhone } from "@/config/default/rules";
import importExcel from '@/components/importExcel/importExcel'
export default {
  components:{
    importExcel
  },
  props:{
    data:Array,
    importParam:Object
  },
  data() {
    return {
      submitData: [],
      submitParam:{},
      title: "批量导入",
      show: false,
      loading: false,
      visible: false,
      current: 0,
      step: [
        "loading",
        "question-circle",
        "question-circle",
        "question-circle",
        "question-circle",
      ],
      interval: undefined,
      errList: [],
      matchPrein: {
        rankName: [],
        postName: [],
        education: [
          { name: '小学' },
          { name: "初中" },
          { name: "高中" },
          { name: "大专" },
          { name: "大学本科" },
          { name: "研究生" },
        ],
        politicalStatus: [
          { name: "中共党员" },
          { name: "中共预备党员" },
          { name: "共青团员 " },
          { name: "群众" },
        ],
        learningForm:[
          { name: "全日制" },
          { name: "在职教育" }
        ],
        schoolSystem:[
          { name: "2年制" },
          { name: "3年制" },
          { name: "4年制" },
          { name: "5年制" }
        ],
        orderly:[
          { name: "是"},
          { name: "否"},
        ],
        relationship:[
          { name: "父子" },
          { name: "母子" },
          { name: "父女" },
          { name: "母女" },
          { name: "兄弟" },
          { name: "兄妹" },
          { name: "姐弟" },
          { name: "姐妹" }
        ]
               
      },
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
      importStep:1,
      done:false
    };
  },
  methods: {
    handleShow() {
      this.matchPrein.rankName = this.$parent.rankNameList
      this.matchPrein.postName = this.$parent.postNameList
      this.errList = [];
      this.visible = true;
      this.submitData = Object.assign([], this.data);
      this.submitParam = Object.assign({}, this.importParam);
      console.log(this.submitParam)
      this.validateData();
      // this.data[this.current].map(i=>{

      // })
      //     this.interval = setInterval(()=>{
      //       this.step[this.current] = 'check-circle'
      //       this.current ++
      //       this.step[this.current] = 'loading'
      //       if(this.current === 1)
      //         this.show = true
      //   },5000)
    },
    //验证数据
    async validateData() {
      this.step[this.current] = "loading";
      this.errList = [];
      setTimeout(async () => {
      if (this.current === 0) {
        
          const samNum = await this.validateSameNum();
          if (samNum) {
            const nullItem = await this.validateNumItem();
            if (nullItem) {
              const format = await this.validateFormatItem();
              if (format) {
                const matchPrein = await this.validateMatchPrein();
                if (matchPrein) {
                  console.log(this.submitData)
                  this.submitData[this.current].map(i=>{
                    i.organizationId = this.submitParam.organizationId
                    i.organizationName = this.submitParam.organizationName
                    if(i.rankName){
                      const rankItem = this.matchPrein.rankName.find(item=>item.name === i.rankName)
                      i.rankId =  rankItem.id
                    }
                    if(i.postName){
                      const postItem = this.matchPrein.postName.find(item=>item.name === i.postName)
                      i.postId =  postItem.id
                    }
                    if(i.idCard){
                      const idMess = this.IdCard(i.idCard)
                      i.birthday = idMess.birth;
                      i.sex = idMess.sex;
                      i.age = idMess.age;
                    }
                  })
                  this.step[this.current] = "check-circle";
                  this.current++;
                  this.step[this.current] = "loading";
                  this.validateData()
                }
              }
            }
          }
       
      }else if(this.current > 0 && this.current <=3){ 
       const containNum = await this.validateContainNum();
       if(containNum){
         const formatItem = await this.validateFormatItem()
         if(formatItem){
           const matchPrein =  await this.validateMatchPrein()
           if (matchPrein) {
                  this.submitData[this.current].map(i=>{
                    if(i.startTime){
                      i.startDate = i.startTime
                      delete i.startTime
                    }
                    if(i.endTime){
                      i.endData = i.endTime
                      delete i.endTime
                    }
                    if(i.orderly){
                      i.orderly = i.orderly === '是' ? 1 : 2
                    }
                    if(i.idCard){
                      const idMess = this.IdCard(i.idCard)
                      i.birthday = idMess.birth;
                      i.sex = idMess.sex;
                      i.age = idMess.age;
                    }
                  })
                  this.step[this.current] = "check-circle";
                  this.current++;
                  this.step[this.current] = "loading";
                  this.validateData()
            }
         }
       }
      }else{
        //这里是提交方法
        let param ={
          basic:this.submitData[0],
          education:this.submitData[1],
          work:this.submitData[2],
          family:this.submitData[3],
        }
         const formData = new FormData();
         formData.append("requestBody ", JSON.stringify(param) )
        this.$api.auxiliaryPoliceService.postAuxiliaryData(formData ).then(res=>{
          console.log(res)
          if(res.data.code === 0){
            this.step[this.current] = "check-circle";
            this.done = true
          }else{
            this.step[this.current] = "close-circle";
            this.done = true
          }
        })
        // console.log(this.submitData)
        
      }
       }, 1000);
    },
    //判断是否与基础信息表中辅警编号一致(编号在基础信息表中不存在)
    validateContainNum(){
      const baseData = this.submitData[0];
      const allData = this.submitData[this.current];
      let baseNum =[]
      baseData.map(i => baseNum.push(i.number))
      //判断基础信息表中辅警编号是否包含个人表单中辅警编辑
      const noContainArr =  allData.filter(i=> !baseNum.includes(i.number)) 
      
      if(noContainArr.length>0){
        noContainArr.map(i=>{
          i.title="存在辅警编号不匹配基础资料";
          i.editList = [{name:"number",type:'input'}]
        })
        this.errList = [...this.errList, ...noContainArr];
        console.log( this.errList)
        this.step[this.current] = "close-circle";
        return false
      }else{
        this.step[this.current] = "loading";
        return true
      }
    },
    //判断基础信息表中是否有重复辅警编号
    async validateSameNum() {
      if(!this.visible){
        this.current = 0
        this.errList=[]
        return
      }
      const allData = this.submitData[this.current];
      let sameArr = allData
        .map(({ number }) => number)
        .filter((item, i, arr) => {
          let a = i * 1 + 1;
          let index = arr.indexOf(item, a);
          if (index != -1) {
            return item;
          }
        });
      //当sameArr的长度大于0时表示有重复辅警编号
      if (sameArr.length > 0) {
        sameArr.map((i) => {
          const arr = allData.filter((j) => j.number === i);
          arr.map((k) => {
            k.title = "辅警编号重复";
            k.editList = [{name:"number",type:'input'}];
          });
          this.errList = [...this.errList, ...arr];
        });
        this.step[this.current] = "close-circle";
        return false;
      } else {
        const auxNum = await this.$api.auxiliaryPoliceService.getAuxiliaryNum().then(res=>{
          return res.data.data.list
        })
        let newArr = [];
        for (let i = 0; i < auxNum.length; i++) {
            for (let j = 0; j < allData.length; j++) {
                if(allData[j].number === auxNum[i].number){
                    newArr.push(allData[j]);
                }
            }
        }
        console.log(newArr)
        if(newArr.length>0){
          newArr.map(i=>{
            i.title = "辅警编号已存在数据库";
            i.editList = [{name:"number",type:'input'}];
          })
          this.errList = [...this.errList, ...newArr];
          this.step[this.current] = "close-circle";
          return false;
        }else{
          this.step[this.current] = "loading";
        }
      }
      return true;
    },
    //判断基础信息中是否存在空字段
    validateNumItem() {
      if(!this.visible){
        this.current = 0
        this.errList=[]
        return
      }
      const arr = this.submitData[this.current];
      let check = true;
      arr.map((i) => {
        let nullArr = [];
        Object.keys(i).map((key) => {
          if (!i[key] || i[key] === "") {
            if (
              key === "rankName" ||
              key === "postName" ||
              key === "education" ||
              key === "politicalStatus"
            )
              nullArr.push({
                name: key,
                type: "select",
                select: this.matchPrein[key],
              });
            else if (key === "entryTime")
              nullArr.push({ name: key, type: "datepick" });
            else if (key === "phone")
              nullArr.push({ name: key, type: "number" });
            else nullArr.push({ name: key, type: "input" });
          }
        });
        if (nullArr.length > 0) {
          i.title = "存在字段为空";
          i.editList = nullArr;
          this.errList.push(i);
          check = false;
        }
      });
      if (check) {
        this.step[this.current] = "loading";
        return true;
      } else {
        this.step[this.current] = "close-circle";
        return false;
      }
    },
    //判断基础信息中字段格式是否正确
    validateFormatItem() {
      if(!this.visible){
        this.current = 0
        this.errList=[]
        return
      }
      const arr = this.submitData[this.current];
      let check = true;
      arr.map((i) => {
        let nullArr = [];
        Object.keys(i).map((key) => {
          if (key === "idCard") {
            const validate = this.validateIdNo(i[key]);
            if (!validate) nullArr.push({ name: key, type: "input" });
          }
          if (key === "phone") {
            const validate = this.validatePhone(i[key]);
            if (!validate) nullArr.push({ name: key, type: "number" });
          }
          if (key === "height") {
            const validate = this.validateNumber(i[key]);
            if (!validate) nullArr.push({ name: key, type: "input" });
          }
          if (key === "entryTime"||key === 'startDate'||key === 'endDate'||key === 'academicTime') {
            if (i[key].indexOf("NaN") > -1) {
              i[key] = "";
              nullArr.push({ name: key, type: "datepick" });
            }
          }
        });
        if (nullArr.length > 0) {
          i.title = "存在字段输入有误";
          i.editList = nullArr;
          this.errList.push(i);
          check = false;
        }
      });
      if (check) {
        this.step[this.current] = "loading";
        return true;
      } else {
        this.step[this.current] = "close-circle";
        return false;
      }
    },
    //验证字段是否与预设字段相符
    validateMatchPrein() {
      if(!this.visible){
        this.current = 0
        this.errList=[]
        return
      }
      const arr = this.submitData[this.current];
      let check = true;
      arr.map((i) => {
        let noMatchArr = [];
        Object.keys(i).map((key) => {
          if (key === "rankName") {
            if (!this.matchPrein.rankName.some((item) => item.name === i[key]))
              noMatchArr.push({
                name: key,
                type: "select",
                select: this.matchPrein[key],
              });
          }
          if (key === "postName") {
            if (!this.matchPrein.postName.some((item) => item.name === i[key]))
              noMatchArr.push({
                name: key,
                type: "select",
                select: this.matchPrein[key],
              });
          }
          if (key === "education") {
            if (!this.matchPrein.education.some((item) => item.name === i[key]))
              noMatchArr.push({
                name: key,
                type: "select",
                select: this.matchPrein[key],
              });
          }
          if (key === "politicalStatus") {
            if (
              !this.matchPrein.politicalStatus.some(
                (item) => item.name === i[key]
              )
            )
              noMatchArr.push({
                name: key,
                type: "select",
                select: this.matchPrein[key],
              });
          }
          if(key === 'learningForm'){
            if (i[key]&&i[key]!==''&&
              !this.matchPrein.learningForm.some(
                (item) => item.name === i[key]
              )
            )
              noMatchArr.push({
                name: key,
                type: "select",
                select: this.matchPrein[key],
              });
          }
          if(key === 'schoolSystem'){
            if (i[key]&&i[key]!==''&&
              !this.matchPrein.schoolSystem.some(
                (item) => item.name === i[key]
              )
            )
              noMatchArr.push({
                name: key,
                type: "select",
                select: this.matchPrein[key],
              });
          }
          if(key === 'orderly'){
            if (i[key]&&i[key]!==''&&
              !this.matchPrein.orderly.some(
                (item) => item.name === i[key]
              )
            )
              noMatchArr.push({
                name: key,
                type: "select",
                select: this.matchPrein[key],
              });
          }
          if(key === 'relationship'){
            if (i[key]&&i[key]!==''&&
              !this.matchPrein.relationship.some(
                (item) => item.name === i[key]
              )
            )
              noMatchArr.push({
                name: key,
                type: "select",
                select: this.matchPrein[key],
              });
          }
        });
        if (noMatchArr.length > 0) {
          i.title = "存在字段与预设不匹配";
          i.editList = noMatchArr;
          this.errList.push(i);
          check = false;
        }
      });
      if (check) {
        this.step[this.current] = "loading";
        return true;
      } else {
        this.step[this.current] = "close-circle";
        return false;
      }
    },
    handleOk() {
      console.log(this.submitData);
      this.validateData();
      //   this.loading = true;
      //   setTimeout(() => {
      //     this.visible = false;
      //     this.loading = false;
      //   }, 3000);
    },
    handleCancel() {
      this.visible = false;
      this.$emit("reloadData")
    },
    close() {
      this.$nextTick(()=>{
        this.current = 0;
        this.done = false
        this.step = [
          "loading",
          "question-circle",
          "question-circle",
          "question-circle",
          "question-circle",
        ];
      console.log(this.current);
      })
      
    },
    //验证身份证号
    validateIdNo(value) {
      const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      if (!reg.test(value) && value != "") {
        return false;
      } else {
        return true;
      }
    },
    validatePhone(value) {
      const reg = /^[1][3-9][0-9]{9}$/;

      if (!reg.test(value) && value != "") {
        return false;
      } else {
        return true;
      }
    },
    validateNumber(value) {
      let numberReg = /^\d+$|^\d+[.]?\d+$/;
      if (value !== "") {
        if (!numberReg.test(value)) {
          return false;
        } else {
          return true;
        }
      } else {
        return false;
      }
    },
    
    //通过身份证获取生日性别年龄
    IdCard(UUserCard) {
      // 获取生日
      let birth =
        UUserCard.substring(6, 10) +
        "-" +
        UUserCard.substring(10, 12) +
        "-" +
        UUserCard.substring(12, 14);
      // 获取性别
      let sex = "";

      
      if (parseInt(UUserCard.substr(16, 1)) % 2 == 1) {
        //男
        sex = 1;
        // return "男";
      } else {
        //女
        sex = 2;
        // return "女";
      }
      // 获取年龄
      var myDate = new Date();
      var month = myDate.getMonth() + 1;
      var day = myDate.getDate();
      var age = myDate.getFullYear() - UUserCard.substring(6, 10) - 1;
      if (
        UUserCard.substring(10, 12) < month ||
        (UUserCard.substring(10, 12) == month &&
          UUserCard.substring(12, 14) <= day)
      ) {
        age++;
      }
      let obj = {
        birth: birth,
        sex: sex,
        age: age,
      };
      return obj;
    },
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        name: "姓名",
        number: "辅警编号",
        idCard: "身份证号",
        postName: "所属岗位",
        rankName: "所属职级",
        nation: "民族",
        education: "学历",
        nativePlace: "籍贯",
        height: "身高（cm）",
        entryTime: "入职日期",
        politicalStatus: "政治面貌",
        phone: "手机号码",
        learningForm:"学习形式",
        schoolSystem:"学制",
        startDate:'入学日期',
        endDate:'毕业日期',
        startTime:'工作起始日期',
        endTime:'工作结束日期',
      };
      return statusMap[status];
    },
  },
};
</script>
<style scoped lang="less">
/deep/ .ant-form-item {
  margin-bottom: 0;
}
/deep/ .ant-list-item-action{
  width: 40%;
  margin-left: 24px;
  li{
    width:100%
  }
}
</style>