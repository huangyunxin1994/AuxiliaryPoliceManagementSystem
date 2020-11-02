//跨域代理前缀
const API_PROXY_PREFIX={
  lk:'/api/lk',
  rzh:'/api/rzh'
}
const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL : API_PROXY_PREFIX
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
  
}
