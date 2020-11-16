//跨域代理前缀
const API_PROXY_PREFIX={
  lk:'/api/lk',
  rzh:'/api/rzh',
  fwq:'/api/fwq'
}
const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL : API_PROXY_PREFIX.lk
// const BASE_URL = process.env.VUE_APP_API_BASE_URL
module.exports = {
  GETACCOUNTABILITYS:`${BASE_URL}/accountability/`,//查询责任追究列表
  POSACCOUNTABILITY: `${BASE_URL}/accountability/`,//批量新增责任追究信息
  DELETEACCOUNTABILITY:`${BASE_URL}/accountability/`,//根据id删除责任追究信息
  GETACCOUNTABILITY:`${BASE_URL}/accountability/`,//根据辅警id查询责任追究信息
}
