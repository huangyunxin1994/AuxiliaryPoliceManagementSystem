//跨域代理前缀
const API_PROXY_PREFIX={
  lk:'/api/lk',
  rzh:'/api/rzh',
  fwq:'/api/fwq'
}
const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL :  API_PROXY_PREFIX.fwq
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

  GETLIST:`${BASE_URL}/CertificateEquipment/history`,//获取证件或装备列表
  POSTEDUCATION:`${BASE_URL}/CertificateEquipment/certificateEquipment`,//新增发放证件或装备
}
