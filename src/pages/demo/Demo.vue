<template>
  <!-- <div class="new-page" :style="`min-height: ${pageMinHeight}px`"> -->
  <div class="page-header-index-wide page-header-wrapper-grid-content-main">
    <a-row :gutter="24">
      <a-col :md="24" :lg="8" :xl="5">
        <a-card :bordered="true">
          <div class="account-center-avatarHolder">
            <div class="username" v-if="policeName">{{ policeName }}</div>
            <!-- <div class="avatar">
              <img
                v-if="imageUrl == ''"
                src="http://192.168.1.111:8181/img/1.png"
              />
              <img v-else :src="imageUrl" alt="" />
            </div> -->
              <a-upload
                name="file"
                listType="picture-card"
                class="avatar-uploader"
                :showUploadList="false"
                :customRequest="uploadImage"
                :beforeUpload="beforeUpload"
                accept="image/jpeg,image/jpg,image/png"
              >
                <div class="avatar">
                  <a-avatar :size="108" :src="imageUrl" v-if="imageUrl!==''" />
                  <a-avatar :size="108" icon="user" v-else />
                  <a-icon
                    class="uploading-icon"
                    :class="avatarLoading && 'show'"
                    type="loading"
                  />
                  <div class="upload-icon">
                    <a-icon :style="{fontSize : '24px'}" type="camera" theme="twoTone"/>
                    <!-- <img src="../../../assets/images/camera.png" /> -->
                  </div>
                </div>
              </a-upload>
          </div>
          <a-divider />

          <div class="account-center-tags">
            <div class="tagsTitle">个人信息</div>
            <div class="members">
              <a-row>
                <a-col :span="24">
                  <a-button class="abutton" type="link" @click="tabIndex = 1">
                    <a-avatar
                      size="small"
                      src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png"
                    />
                    <span
                      class="member"
                      :style="{ color: tabIndex === 1 ? theme.color : '' }"
                    >
                      基础资料
                    </span>
                  </a-button>
                </a-col>
              </a-row>
            </div>
          </div>
          <a-divider :dashed="true" />

          <div class="account-center-team">
            <div class="teamTitle">业务信息</div>
            <div class="members">
              <a-row>
                <a-col :span="24" v-for="(item, index) in teams" :key="index">
                  <a-button
                    class="abutton"
                    type="link"
                    @click="tabIndex = parseInt(index + 2)"
                  >
                    <a-avatar
                      size="small"
                      src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png"
                    />
                    <span
                      class="member"
                      :style="{
                        color:
                          tabIndex === parseInt(index + 2) ? theme.color : '',
                      }"
                      >{{ item.name }}</span
                    >
                  </a-button>
                </a-col>
              </a-row>
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :md="24" :lg="16" :xl="19">
        <aux-msg-form :policeId="policeId" v-if="tabIndex === 1"></aux-msg-form>
        <award-duty
          :policeId="policeId"
          v-else-if="tabIndex === 2"
        ></award-duty>
        <contract :policeId="policeId" v-else-if="tabIndex === 3"></contract>
        <personnel :policeId="policeId" v-else-if="tabIndex === 4"></personnel>
        <education :policeId="policeId" v-else-if="tabIndex === 5"></education>
        <equipage :policeId="policeId" v-else-if="tabIndex === 6"></equipage>
        <vacate :policeId="policeId" v-else-if="tabIndex === 7"></vacate>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { mapState } from "vuex";
import auxMsgForm from "@/components/auxMsgForm/auxMsgForm";
import awardDuty from "@/pages/subsystem/businessMess/awardAndDuty";
import contract from "@/pages/subsystem/businessMess/contract";
import education from "@/pages/subsystem/businessMess/education";
import equipage from "@/pages/subsystem/businessMess/equipage";
import personnel from "@/pages/subsystem/businessMess/personnel";
import vacate from "@/pages/subsystem/businessMess/vacate";
export default {
  name: "Demo",
  components: {
    auxMsgForm,
    awardDuty,
    contract,
    education,
    equipage,
    personnel,
    vacate,
  },
  data() {
    return {
      BASE_URL: "",
      fileList: [],
      tabIndex: 1,
      policeId: undefined,
      policeName: undefined,
      teams: [
        {
          avatar:
            "https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png",
          name: "奖励与责任追究",
          router: {
            name: "award",
          },
        },
        {
          avatar:
            "https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png",
          name: "合同与工资信息",
          router: {
            name: "concat",
          },
        },
        {
          avatar:
            "https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png",
          name: "人事信息",
          router: {
            name: "person",
          },
        },
        {
          avatar:
            "https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png",
          name: "培训记录",
          router: {
            name: "teach",
          },
        },
        {
          avatar:
            "https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png",
          name: "证件装备",
          router: {
            name: "cert",
          },
        },
        {
          avatar:
            "https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png",
          name: "加班与请假统计",
          router: {
            name: "overtime",
          },
        },
      ],
      imageUrl: "", // 用来存放图片的路径
      avatarLoading:false
    };
  },
  computed: {
    ...mapState("setting", ["theme", "pageMinHeight"]),
  },
  created() {
    console.log(this.$route.query.id);
    this.BASE_URL = process.env.VUE_APP_API_BASE_URL;
    this.policeId = this.$route.query.id;
    this.policeName = this.$route.query.name;
    if (this.$route.query.photoPath)
      this.imageUrl = `${this.BASE_URL}/img/${this.$route.query.photoPath}`;
  },
  methods: {
    // 上传头像前校验
    beforeUpload(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        this.$message.error('只能上传jpg/png格式的头像!')
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('图片不得大于2MB!')
      }
      return isJpgOrPng&&isLt2M
    },
    imageToBase64 (file) {
      var reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        console.log('file 转 base64结果：' + reader.result)
        this.imageUrl = reader.result
      }
      reader.onerror = function (error) {
        console.log('Error: ', error)
      }
    },
    // 上传头像
    uploadImage(file) {
      console.log(file)
      this.avatarLoading = true
      const formData = new FormData()
      formData.append('file', file.file)
      formData.append("policeId ", this.policeId)
      this.$api.auxiliaryPoliceService.postAuxiliaryHead(formData).then(res=>{
        if(res.data.code === 0){
          this.$message.success(res.data.msg)
          this.imageToBase64(file.file)
          this.avatarLoading = false
        }else{
          this.avatarLoading = false
          this.$message.error(res.data.msg)
        }
      })
      // api.upload(formData).then(res => {
      //   if (res) {
      //     this.imageUrl = res.data.data.link
      //     this.saveAvatar() // 保存新头像
      //     this.avatarLoading = false
      //   }
      // }, err => {
      //   this.avatarLoading = false
      // })
    },
  },
};
</script>

<style scoped lang="less">
@import "index";
.avatar-uploader{
  display: flex;
  justify-content: center;
  align-items: center;
  /deep/ .ant-upload-select-picture-card{
    background-color: transparent;
    border:none;
     margin: 0;
  }
  .avatar{
    position: relative;
    .uploading-icon{
      position:absolute;
      display: none;
      font-size: 24px;
      top:calc(54px - 12px);
      left:calc(54px - 12px);
      color: #ffffff;
    }
    .show{
      display: block;
    }
    .upload-icon{
       position: absolute;
      width: 100%;
      text-align: right;
      bottom: 0;
    }
  }
  
}
.saveBtn {
  display: flex;
  justify-content: flex-end;
}
.position-and-level-title {
  border-style: solid;
  border-width: 5px;
  border-top: none;
  border-right: none;
  border-bottom: none;
  color: @title-color;
  font-weight: 500;
  font-size: 16px;
  text-indent: 10px;
  margin-bottom: 24px;
}
// /deep/ .ant-card-head{
//   background-color: #fafafa;
// }
.page-header-wrapper-grid-content-main {
  width: 100%;
  height: 100%;
  min-height: 100%;
  transition: 0.3s;

  .account-center-avatarHolder {
    text-align: center;
    margin-bottom: 24px;

    & > .avatar {
      margin: 0 auto;
      width: 104px;
      height: 104px;
      margin-bottom: 20px;
      border-radius: 50%;
      overflow: hidden;
      img {
        height: 100%;
        width: 100%;
      }
    }

    .username {
      color: rgba(0, 0, 0, 0.85);
      font-size: 24px;
      line-height: 28px;
      font-weight: 500;
      margin-bottom: 14px;
    }
  }

  .account-center-detail {
    p {
      margin-bottom: 8px;
      padding-left: 26px;
      position: relative;
    }

    i {
      position: absolute;
      height: 14px;
      width: 14px;
      left: 0;
      top: 4px;
      background: url(https://gw.alipayobjects.com/zos/rmsportal/pBjWzVAHnOOtAUvZmZfy.svg);
    }

    .title {
      background-position: 0 0;
    }
    .group {
      background-position: 0 -22px;
    }
    .address {
      background-position: 0 -44px;
    }
  }

  .account-center-tags {
    .ant-tag {
      margin-bottom: 8px;
    }
  }

  .account-center-team,
  .account-center-tags {
    .members {
      .abutton {
        display: block;
        margin: 12px 0;
        .member {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.65);
          line-height: 24px;
          max-width: 100px;
          vertical-align: top;
          margin-left: 12px;
          transition: all 0.3s;
          display: inline-block;
        }
      }
    }
  }

  .tagsTitle,
  .teamTitle {
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    margin-bottom: 12px;
  }
}
</style>