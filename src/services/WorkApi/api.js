//跨域代理前缀
const API_PROXY_PREFIX={
  lk:'/api/lk',
  rzh:'/api/rzh'
}
const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL : API_PROXY_PREFIX
// const BASE_URL = process.env.VUE_APP_API_BASE_URL
module.exports = {
  GETWORK:`${BASE_URL}/work/`,//根据辅警id查找工作经历
  POSTWORK: `${BASE_URL}/work/`,//新增工作经历
  PUTWORK:`${BASE_URL}/work/`,//修改工作经历
  DELETEWORK:`${BASE_URL}/work/`,//删除工作经历
}
