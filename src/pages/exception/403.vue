<template>
  <exception-page :home-route="loginType===1 ? '/auxhome' : '/home'" :style="`min-height: ${minHeight}`" type="403" />
</template>

<script>
import ExceptionPage from '@/components/exception/ExceptionPage'
import {mapState,mapGetters} from 'vuex'
export default {
  name: 'Exp403',
  components: {ExceptionPage},
  computed: {
    ...mapState('setting', ['pageMinHeight']),
    ...mapGetters('account', ['loginType']),
    minHeight() {
      return this.pageMinHeight ? this.pageMinHeight + 'px' : '100vh'
    }
  }
}
</script>

<style scoped lang="less">
</style>
