<template>
  <div class="footer">
    <div class="copyright">
      Copyright<a-icon type="copyright" />{{copyright}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageFooter',
  props: ['copyright', 'linkList']
}
</script>

<style lang="less" scoped>
  .footer{
    padding: 12px 16px;
    text-align: center;
    .copyright{
      color: @text-color-second;
      font-size: 14px;
    }
    .links{
      margin-bottom: 8px;
      a:not(:last-child) {
        margin-right: 40px;
      }
      a{
        color: @text-color-second;
        -webkit-transition: all .3s;
        transition: all .3s;
      }
    }
  }
</style>
