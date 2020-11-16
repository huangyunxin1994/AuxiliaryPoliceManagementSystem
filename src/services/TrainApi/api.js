//跨域代理前缀
const API_PROXY_PREFIX={
  lk:'/api/lk',
  rzh:'/api/rzh',
  fwq:'/api/fwq'
}
const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL : API_PROXY_PREFIX.lk
// const BASE_URL = process.env.VUE_APP_API_BASE_URL
module.exports = { 
  GETLIST:`${BASE_URL}/train/`,//查询培训列表
  POSTEDUCATION:`${BASE_URL}/train/`,//查询培训列表
  DELETEEDUCATION:`${BASE_URL}/train/`,//删除培训
  GETDETAILSDATA:`${BASE_URL}/train/details`,//根据id查找培训详情
  GETDETAILSBYAUX:`${BASE_URL}/train/s`,//根据辅警id查找培训详情
  PUTEDUCATION:`${BASE_URL}/train/`,//填写结果
}
