//跨域代理前缀
const API_PROXY_PREFIX={
  lk:'/api/lk',
  rzh:'/api/rzh'
}
const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL : API_PROXY_PREFIX
// const BASE_URL = process.env.VUE_APP_API_BASE_URL
module.exports = {
  GETEDU:`${BASE_URL.lk}/education/`,//根据辅警id查找学习经历
  POSTEDU: `${BASE_URL.lk}/education/`,//新增学习经历
  PUTEDU:`${BASE_URL.lk}/education/`,//修改学习经历
  DELETEEDU:`${BASE_URL.lk}/education/`,//删除学习经历
}
