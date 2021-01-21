//跨域代理前缀
const API_PROXY_PREFIX={
  lk:'/api/lk',
  rzh:'/api/rzh',
  fwq:'/api/fwq'
}
const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL :  API_PROXY_PREFIX.fwq
// const BASE_URL = process.env.VUE_APP_API_BASE_URL
module.exports = {
  GETCERTEQUPUSER:`${BASE_URL}/CertificateEquipment/certificateEquipment`,//获取新增证件或装备发放和未发放人员列表
  POSTCERTEQUP: `${BASE_URL}/CertificateEquipment/certificateEquipment`,//新增发放证件或装备
  PUTCERTEQUP:`${BASE_URL}/CertificateEquipment/certificateEquipment`,//回收证件或装备
  GETCERTEQUPLIST:`${BASE_URL}/CertificateEquipment/history`,//获取证件或装备列表
  GETCERTEQUPTYPES:`${BASE_URL}/CertificateEquipment/list`,//获取证件或装备的类型
}
