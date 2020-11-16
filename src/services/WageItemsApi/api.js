//跨域代理前缀
const API_PROXY_PREFIX={
  lk:'/api/lk',
  rzh:'/api/rzh',
  fwq:'/api/fwq'
}
const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL : API_PROXY_PREFIX.lk
// const BASE_URL = process.env.VUE_APP_API_BASE_URL
module.exports = {
  GETDATA:`${BASE_URL}/wage-items/`,//查询工资项
  POSTDATA: `${BASE_URL}/wage-items/`,//添加工资项
  DELETEDATA:`${BASE_URL}/wage-items/`,//删除工资项
  PUTDATA:`${BASE_URL}/wage-items/`,//编辑工资项
  POSTREL:`${BASE_URL}/wage-items/release`,//发布
}
