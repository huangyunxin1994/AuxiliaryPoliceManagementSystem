//跨域代理前缀
const API_PROXY_PREFIX={
  lk:'/api/lk',
  rzh:'/api/rzh'
}
const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL : API_PROXY_PREFIX
// const BASE_URL = process.env.VUE_APP_API_BASE_URL
module.exports = {
  GETREWARDS:`${BASE_URL}/reward/`,//查询奖励列表
  POSREWARD: `${BASE_URL}/reward/`,//批量新增奖励信息
  DELETEREWARD:`${BASE_URL}/reward/`,//根据id删除奖励信息
  GETREWARD:`${BASE_URL}/reward/`,//根据辅警id查询奖励信息
}
