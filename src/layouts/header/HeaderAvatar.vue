<template>
  <a-dropdown>
    <div class="header-avatar" style="cursor: pointer">
      <a-avatar class="avatar" size="small" shape="circle" :src="user.avatar" v-if="user.avatar"/>
       <a-avatar class="avatar" size="small" shape="circle" icon="user" :style="{backgroundColor:theme.color}" v-else/>
      <span class="name">{{user.name}}</span>
    </div>
    <a-menu :class="['avatar-menu']" slot="overlay">
      <a-menu-item @click="changUser">
        <a-icon type="user" />
        <span>修改资料</span>
      </a-menu-item>
       <a-menu-divider />
      <a-menu-item @click="changPass">
        <a-icon type="lock" />
        <span>修改密码</span>
      </a-menu-item>
      <a-menu-divider />
      <a-menu-item @click="logout">
        <a-icon style="margin-right: 8px;" type="poweroff" />
        <span>退出登录</span>
      </a-menu-item>
    </a-menu>
  </a-dropdown>
</template>

<script>
import {mapState, mapGetters} from 'vuex'
// import {userApi} from '@/services/api'
import TaskForm from "@/components/formModel/formModel";

export default {
  name: 'HeaderAvatar',
  computed: {
    ...mapState("setting", ['theme']),
    ...mapGetters('account', ['user','loginType']),
  },
  methods: {
    changPass(){
      const _this=this
        let validateOldPass = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入原密码'));
        } else {
          if (value!== this.user.password) {
            callback(new Error('您输入的原密码不正确'));
          }
          callback();
        }
      };
      let validateNewPass = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入新密码'));
        } else {
          callback();
        }
      };
     
      let modalProps = {
        title: "修改密码",
        width: 700,
        centered: true,
        maskClosable: false,
        okText: "提交",
      };
      let fn;
      if(this.loginType===2){
        fn = (parameter) => {
          return this.$api.organizationService
            .putPassword(parameter)
            .then((res) => {
              if(res.data.code === 0)
              res.data.msg = '修改密码成功，请重新登录'
              return res.data;
            });
        }
      }else{
        fn = (parameter) => {
          return this.$api.auxiliaryPoliceService
            .putAuxiliaryPolice(parameter)
            .then((res) => {
              if(res.data.code === 0)
              res.data.msg = '修改密码成功，请重新登录'
              return res.data;
            });
        }
      }
      const defaultModalProps = {
        record: {
          id:this.user.id
        },
        formTitle: [{
          label: "原密码",
          name: "oldPass",
          type: "input",
          placeholder: "请输入原密码",
        },
        {
           label: "新密码",
            name: "password",
            type: "input",
            placeholder: "请输入新密码",
        },{
           label: "再输入一次",
            name: "again",
            type: "input",
            validata:'checkpass',
            required:true,
            placeholder: "请再输入一次",
        }],
        rules: {
          oldPass: [{ required: true,validator: validateOldPass, trigger: "blur" }],
          password: [{ required: true, validator: validateNewPass, trigger: "blur" }]
        },
        submitFun: fn,
        on: {
          ok() {
            //console.log("ok 回调");
            _this.$api.userService.logout()
             _this.$router.push('/login')
          },
          cancel() {
            //console.log("cancel 回调");
          },
          close() {
            //console.log("modal close 回调");
          },
        },
      };
      this.$dialog(
        TaskForm,
        // component props
        defaultModalProps,
        // modal props
        modalProps
      );
    },
    changUser(){
      const _this=this
      let modalProps = {
        title: "修改资料",
        width: 700,
        centered: true,
        maskClosable: false,
        okText: "提交",
      };
      let fn;
      if(this.loginType===2){
        fn = (parameter) => {
          return this.$api.organizationService
            .putPassword(parameter)
            .then((res) => {
              if(res.data.code === 0)
              res.data.msg = '修改资料成功，请重新登录'
              return res.data;
            });
        }
      }else{
        fn = (parameter) => {
          return this.$api.auxiliaryPoliceService
            .putAuxiliaryPolice(parameter)
            .then((res) => {
              if(res.data.code === 0)
              res.data.msg = '修改资料成功，请重新登录'
              return res.data;
            });
        }
      }
      const defaultModalProps = {
        record: {
          id:this.user.id,
          name:this.user.name,
          phone:this.user.phone,
        },
        formTitle: [{
          label: "姓名",
          name: "name",
          type: "input",
          placeholder: "请输入姓名",
        },{
          label: "手机号",
          name: "phone",
          type: "input",
          placeholder: "请输入手机号",
        },],
        rules: {
          name: [{ required: true,message:'请输入姓名' , trigger: "blur" }],
          phone: [{ required: true,message:'请输入手机号' , trigger: "blur" }],
        },
        submitFun: fn,
        on: {
          ok() {
            //console.log("ok 回调");
            _this.$api.userService.logout()
             _this.$router.push('/login')
          },
          cancel() {
            //console.log("cancel 回调");
          },
          close() {
            //console.log("modal close 回调");
          },
        },
      };
      this.$dialog(
        TaskForm,
        // component props
        defaultModalProps,
        // modal props
        modalProps
      );
    },
    logout() {
      this.$api.userService.logout()
      this.$router.push('/login')
      
    }
  }
}
</script>

<style lang="less">
  .header-avatar{
    display: inline-flex;
    .avatar, .name{
      align-self: center;
    }
    .avatar{
      margin-right: 8px;
    }
    .name{
      font-weight: 500;
    }
  }
  .avatar-menu{
    width: 150px;
  }

</style>
