<template>
  <div class="swrap">
    <a-upload
        name="file"
        :multiple="true"
        action=""
        :before-upload="beforeUpload"
        :show-upload-list="false"
      >
      <a-button type="primary" icon="vertical-align-bottom">{{btnName}}</a-button>
    </a-upload>
  </div>
</template>

<script>
  export default{
    props:{
      //表格的标题格式
      tableTitle:{
        type:Array,
        default(){
          return []
        }
      },
      // 按钮名称
      btnName:{
        type:String,
        default:"导入"
      }
    },
    data(){
      return{
        fileTemp:''
      }
    },
    methods:{
      beforeUpload(file){
        let name = file.name
        if(name){
          if(/\.(xls|xlsx)$/.test(name.toLowerCase())){
              this.importfxx(file);
          }else{
            this.$message.error("附件格式错误，请重新上传！", 3)
          }
        }else{
          this.$message.error("附件格式错误，请重新上传！", 3)
        }
        return false
      },
      importfxx(e) {
          let _this = this;
          var rABS = false; //是否将文件读取为二进制字符串
          var f = e;

          var reader = new FileReader();
          FileReader.prototype.readAsBinaryString = function(f) {
              var binary = "";
              var rABS = false; //是否将文件读取为二进制字符串
            //   var pt = this;
              var wb; //读取完成的数据
              var reader = new FileReader();
              reader.onload = function() {
                  var bytes = new Uint8Array(reader.result);
                  var length = bytes.byteLength;
                  for (var i = 0; i < length; i++) {
                      binary += String.fromCharCode(bytes[i]);
                  }
                  //此处引入，用于解析excel
                  var XLSX = require("xlsx");
                  if (rABS) {
                    //   wb = XLSX.read(btoa(fixdata(binary)), {
                    //   //手动转化
                    //   type: "base64"
                    //   });
                  } else {
                      wb = XLSX.read(binary, {
                      type: "binary"
                      });
                  }
                  let allData = []
                  for(let i=0; i<wb.SheetNames.length;i++){
                    let data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[i]]);
                    //data就是读取的数据（不包含标题行即表头，表头会作为对象的下标）
                    //此处可对数据进行处理
                    let arr = [];
                    data.map(v => {
                        let obj = {}
                        // obj[this.tableTitle.name] = v[this.tableTitle.title]
                        _this.tableTitle[i].map(item=>{
                          obj[item.dataIndex] = v[item.title]
                        })
                        arr.push(obj)
                    });
                    allData.push(arr)
                  }
                  // _this.tableData = arr
                  // _this.dalen=arr.length;
                  _this.$emit("getTableData",allData)
                  return allData;
              };
              reader.readAsArrayBuffer(f);
          };
          if (rABS) {
              reader.readAsArrayBuffer(f);
          } else {
              reader.readAsBinaryString(f);
          }
      }
    }
  }
</script>

<style>
</style>
