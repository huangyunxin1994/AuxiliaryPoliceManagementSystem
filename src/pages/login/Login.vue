<template>
  <common-layout>
    <div class="top">
      <div class="header">
        <img alt="logo" class="logo" src="@/assets/img/logo.png" />
        <span class="title">{{ systemName }}</span>
      </div>
      <div class="desc">欢迎使用辅警管理系统</div>
    </div>
    <div class="login">
      <a-form @submit="onSubmit" :form="form">
        <a-tabs
          v-model="LoginType"
          size="large"
          :tabBarStyle="{ textAlign: 'center' }"
          style="padding: 0 2px"
        >
          <a-tab-pane tab="辅警登录" key="1" >
            <a-form-item>
              <a-input
                autocomplete="autocomplete"
                size="large"
                placeholder="请输入账户名"
                v-decorator="[
                  'name',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入账户名',
                        whitespace: true,
                      },
                    ],
                  },
                ]"
              >
                <a-icon slot="prefix" type="user" />
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-input
                size="large"
                placeholder="请输入密码"
                autocomplete="autocomplete"
                type="password"
                v-decorator="[
                  'password',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入密码',
                        whitespace: true,
                      },
                    ],
                  },
                ]"
              >
                <a-icon slot="prefix" type="lock" />
              </a-input>
            </a-form-item>
          </a-tab-pane>
          <a-tab-pane tab="管理员登录" key="2">
            <a-form-item>
              <a-input
                autocomplete="autocomplete"
                size="large"
                placeholder="请输入账户名"
                v-decorator="[
                  'name',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入账户名',
                        whitespace: true,
                      },
                    ],
                  },
                ]"
              >
                <a-icon slot="prefix" type="user" />
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-input
                size="large"
                placeholder="请输入密码"
                autocomplete="autocomplete"
                type="password"
                v-decorator="[
                  'password',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入密码',
                        whitespace: true,
                      },
                    ],
                  },
                ]"
              >
                <a-icon slot="prefix" type="lock" />
              </a-input>
            </a-form-item>
          </a-tab-pane>
        </a-tabs>
        <div>
          <a-checkbox :checked="AutoLogin" @change="changeAutoLogin">记住密码</a-checkbox>
          <!-- <a style="float: right">忘记密码</a> -->
        </div>
        <a-form-item>
          <a-button
            :loading="logging"
            style="width: 100%; margin-top: 24px"
            size="large"
            htmlType="submit"
            type="primary"
            >登录</a-button
          >
        </a-form-item>
      </a-form>
    </div>
  </common-layout>
</template>

<script>
import CommonLayout from "@/layouts/CommonLayout";
// import {login} from '@/services/user'
import { setAuthorization } from "@/utils/request";
import { loadRoutes } from "@/utils/routerUtil";
import { mapGetters, mapMutations } from "vuex";
const timeList = [
  {
    CN: "早上好",
    HK: "早晨啊",
    US: "Good morning",
  },
  {
    CN: "上午好",
    HK: "上午好",
    US: "Good morning",
  },
  {
    CN: "中午好",
    HK: "中午好",
    US: "Good afternoon",
  },
  {
    CN: "下午好",
    HK: "下午好",
    US: "Good afternoon",
  },
  {
    CN: "晚上好",
    HK: "晚上好",
    US: "Good evening",
  },
];
export default {
  name: "Login",
  components: { CommonLayout },
  data() {
    return {
      logging: false,
      error: "",
      AutoLogin:false,
      showError:false,
      form: this.$form.createForm(this),
      LoginType: "1",
    };
  },
  computed: {
    ...mapGetters('account', ['account','password','autoLogin','loginType']),
    systemName() {
      return this.$store.state.setting.systemName;
    },
  },
  mounted(){
    const autoLogin = localStorage.getItem(process.env.VUE_APP_AUTO_LOGIN)
    const loginType = localStorage.getItem(process.env.VUE_APP_LOGIN_TYPE)
    this.AutoLogin = autoLogin==='true' && true || false;
    this.LoginType = loginType==='2' && '2' || '1';
    
    if(this.AutoLogin){
      this.form.setFieldsValue({name:this.account,password:this.password})
    }
  },
  methods: {
    ...mapMutations("account", [
      "setUser",
      "setPermissions",
      "setRoles",
      "setloginType",
      "setAutoLogin",
      "setAccount",
      "setPassword"
    ]),
    onSubmit(e) {
       e.preventDefault();
      this.form.validateFields((err) => {
        if (!err) {
          this.logging = true;
          const name = this.form.getFieldValue("name");
          const password = this.form.getFieldValue("password");
          const type = this.LoginType;
          // login(name, password).then(this.afterLogin)
          this.$api.userService
            .login(name, password, type)
            .then(this.afterLogin);
        }
      });
    },
    afterLogin(res) {
      this.logging = false;
      const loginRes = res.data;
      if (loginRes.code >= 0) {
        const { data, list, type } = loginRes.data;
        loginRes.data.token = "Authorization:" + Math.random();
        loginRes.message = this.timeFix().CN + "，欢迎回来";
        loginRes.data.expireAt = new Date(
          new Date().getTime() + 60 * 60 * 1000
        );
      //  `${process.env.VUE_APP_API_BASE_URL}/img/${data.photoPath}`;

        data.avatar = data.photoPath && `${process.env.VUE_APP_API_BASE_URL}/img/${data.photoPath}` || "";
        this.setUser(data);
        let roleArr = [];
        if (type === 2) {
          list.map((i) => {
            let param = {};
            param.id = i&&i.code||"";
            roleArr.push(param);
          });
          if(data.isSystem===1){
            roleArr=[
              { id: "jczl" },
              { id: "htgl" },
              { id: "rsgl" },
              { id: "gzgl" },
              { id: "jypx" },
              { id: "zzzb" },
              { id: "jcgl" },
              { id: "jbqj" },
              { id: "wdgg" },
              { id: "xtgl" },
            ]
          }
          roleArr.push({ id: "gly" });
        } else {
          roleArr.push({ id: "fj" });
        }
        this.setRoles(roleArr);
        this.setloginType(type);
        this.setAutoLogin(this.AutoLogin),
        this.setAccount(data.account)
        this.setPassword(data.password)
        setAuthorization({
          token: loginRes.data.token,
          expireAt: new Date(loginRes.data.expireAt),
        });
        const routesConfig = [];
        this.$message.success(loginRes.message, 3);
        loadRoutes(
          { router: this.$router, store: this.$store, i18n: this.$i18n },
          routesConfig
        );
        if(type===2){
          this.$router.push("/");
        }else{
          this.$router.push("/auxhome");
        }
      } else {
        this.$message.error(loginRes.msg) ;
      }
    },
    changeAutoLogin(){
      this.AutoLogin = !this.AutoLogin
    },
    timeFix() {
      const time = new Date();
      const hour = time.getHours();
      return hour < 9
        ? timeList[0]
        : hour <= 11
        ? timeList[1]
        : hour <= 13
        ? timeList[2]
        : hour <= 20
        ? timeList[3]
        : timeList[4];
    },
  },
};
</script>

<style lang="less" scoped>
.common-layout {
  .top {
    text-align: center;
    .header {
      height: 44px;
      line-height: 44px;
      a {
        text-decoration: none;
      }
      .logo {
        height: 44px;
        vertical-align: top;
        margin-right: 16px;
      }
      .title {
        font-size: 33px;
        color: @title-color;
        font-family: "Myriad Pro", "Helvetica Neue", Arial, Helvetica,
          sans-serif;
        font-weight: 600;
        position: relative;
        top: 2px;
      }
    }
    .desc {
      font-size: 14px;
      color: @text-color-second;
      margin-top: 12px;
      margin-bottom: 40px;
    }
  }
  .login {
    width: 368px;
    margin: 0 auto;
    @media screen and (max-width: 576px) {
      width: 95%;
    }
    @media screen and (max-width: 320px) {
      .captcha-button {
        font-size: 14px;
      }
    }
    .icon {
      font-size: 24px;
      color: @text-color-second;
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: @primary-color;
      }
    }
  }
}
</style>
