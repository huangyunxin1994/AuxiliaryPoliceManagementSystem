//跨域代理前缀
const API_PROXY_PREFIX={
  lk:'/api/lk',
  rzh:'/api/rzh',
  fwq:'/api/fwq'
}
const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL :  API_PROXY_PREFIX.fwq
// const BASE_URL = process.env.VUE_APP_API_BASE_URL
module.exports = {
  POSTDATA:`${BASE_URL}/Other/items/certificateEquipment`,//添加证件或装备
  PUTDATA: `${BASE_URL}/Other/items/certificateEquipment`,//修改证件或装备
  DELETERDATA:`${BASE_URL}/Other/items/certificateEquipment/`,//删除证件或装备
  POSTSETTING:`${BASE_URL}/Other/items/commuting`,//添加上下班时间
  PUTSETTING:`${BASE_URL}/Other/items/commuting`,//修改上下班时间
  GETEQUPDATA:`${BASE_URL}/Other/items/list`,//获取装备配置列表
  GETCREDDATA:`${BASE_URL}/Other/items/list/certificateList`,//获取证件配置列表
  GETCOMMDATA:`${BASE_URL}/Other/items/list/commutingList`,//获取上下班配置列表
  GETSALARYTIME:`${BASE_URL}/Other/items/list/salaryList`,//获取工资表生成时间配置
  POSTSALARYTIME:`${BASE_URL}/Other/items/salary`,//添加工资表生成时间
  GETAUXPOSTRANK:`${BASE_URL}/Other/rankest/auxiliaryPoliceList`,//获取辅警人员列表职级和岗位的类型
  GETPERPOSTRANK:`${BASE_URL}/Other/rankest/list`,//获取人事职级和岗位的类型
  
  
}
