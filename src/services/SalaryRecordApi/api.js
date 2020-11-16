//跨域代理前缀
const API_PROXY_PREFIX={
  lk:'/api/lk',
  rzh:'/api/rzh',
  fwq:'/api/fwq'
}
const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL : API_PROXY_PREFIX.lk
// const BASE_URL = process.env.VUE_APP_API_BASE_URL
module.exports = {
  GETSALARYRECORD:`${BASE_URL}/salary-record/`,//查询已打勾月份
  POSTSALARYRECORD:`${BASE_URL}/salary-record/`,//新增打勾记录月份
}
