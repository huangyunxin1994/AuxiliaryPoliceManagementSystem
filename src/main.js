import Vue from 'vue'
import App from './App.vue'
import {initRouter} from './router'
import './theme/index.less'
import Antd from 'ant-design-vue'
import Viser from 'viser-vue'
import Dialog from '@/components/Dialog'
// import '@/mock'
import api from "./services"
import store from './store'
import 'animate.css/source/animate.css'
import Plugins from '@/plugins'
import {initI18n} from '@/utils/i18n'
import bootstrap from '@/bootstrap'
 import moment from'moment'; 
 import 'moment/locale/zh-cn'; 
 import Vuex from 'vuex'
 moment.locale('zh-CN');
const router = initRouter(store.state.setting.asyncRoutes)
const i18n = initI18n('CN', 'US')

Vue.use(Antd)
Vue.use(Vuex)
Vue.config.productionTip = false
Vue.use(Viser)
Vue.use(Plugins)
Vue.use(Dialog)//this.$dialog
Vue.prototype.$api = api;
bootstrap({router, store, i18n, message: Vue.prototype.$message})

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app')
