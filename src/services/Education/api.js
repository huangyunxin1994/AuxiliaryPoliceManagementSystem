//跨域代理前缀
const API_PROXY_PREFIX={
  lk:'/api/lk',
  rzh:'/api/rzh'
}
const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL : API_PROXY_PREFIX
// const BASE_URL = process.env.VUE_APP_API_BASE_URL
module.exports = {
  // GETPOST:`${BASE_URL}/Other/rankest/post/list`,//获取岗配置列表
  // POSTPOST: `${BASE_URL}/Other/rankest/post`,//添加岗位
  // PUTPOST:`${BASE_URL}/Other/rankest/post`,//修改岗位
  // DELETEPOST:`${BASE_URL}/Other/rankest/post/`,//删除岗位

  // GETRANK:`${BASE_URL}/Other/rankest/rank/list`,//获取岗配置列表
  // POSTRANK:`${BASE_URL}/Other/rankest/rank`,//添加职级
  // PUTRANK:`${BASE_URL}/Other/rankest/rank`,//修改职级
  // DELETERANK:`${BASE_URL}/Other/rankest/rank/`,//删除职级 

  GETLIST:`${BASE_URL.lk}/train/`,//查询培训列表
  POSTEDUCATION:`${BASE_URL.lk}/train/`,//查询培训列表
  DELETEEDUCATION:`${BASE_URL.lk}/train/`,//删除培训
  GETDETAILSDATA:`${BASE_URL.lk}/train/details`,//根据id查找培训详情
  PUTEDUCATION:`${BASE_URL.lk}/train/`,//填写结果
}
