<template>
  <a-layout-sider :theme="sideTheme" :class="['side-menu', 'beauty-scroll', isMobile ? null : 'shadow']" width="256px" :collapsible="collapsible" v-model="collapsed" :trigger="null">
    <div :class="['logo', theme]">
      <router-link :to="loginType === 1 ? '/auxhome' : '/home'">
        <img src="@/assets/img/logo.png">
        <h1>{{systemName}}</h1>
      </router-link>
    </div>
    <i-menu :theme="theme" :collapsed="collapsed" :options="menuData" @select="onSelect" class="menu" :openKeys="loginType === 1 ? ['/baseMess','/servicemess']: undefined"/>
  </a-layout-sider>
</template>

<script>
import IMenu from './menu'
import {mapState,mapGetters} from 'vuex'
export default {
  name: 'SideMenu',
  components: {IMenu},
  props: {
    collapsible: {
      type: Boolean,
      required: false,
      default: false
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    },
    menuData: {
      type: Array,
      required: true
    },
    theme: {
      type: String,
      required: false,
      default: 'dark'
    }
  },
  computed: {
    sideTheme() {
      return this.theme == 'light' ? this.theme : 'dark'
    },
    ...mapState('setting', ['isMobile', 'systemName']),
    ...mapGetters('account',['loginType'])
  },
  methods: {
    onSelect (obj) {
      this.$emit('menuSelect', obj)
    }
  }
}
</script>

<style lang="less" scoped>
@import "index";
h1{
  font-weight: 600;
}
</style>
