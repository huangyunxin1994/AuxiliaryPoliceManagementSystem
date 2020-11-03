//跨域代理前缀
const API_PROXY_PREFIX={
  lk:'/api/lk',
  rzh:'/api/rzh'
}
const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL : API_PROXY_PREFIX.lk
// const BASE_URL = process.env.VUE_APP_API_BASE_URL
module.exports = {
  GETFAMILY:`${BASE_URL}/family/`,//根据辅警id查找家庭信息
  POSTFAMILY: `${BASE_URL}/family/`,//新增家庭信息
  PUTFAMILY:`${BASE_URL}/family/`,//修改家庭信息
  DELETEFAMILY:`${BASE_URL}/family/`,//删除家庭信息
}
