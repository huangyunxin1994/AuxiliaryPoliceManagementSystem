//跨域代理前缀
const API_PROXY_PREFIX={
  lk:'/api/lk',
  rzh:'/api/rzh',
  fwq:'/api/fwq'
}
const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL : API_PROXY_PREFIX.lk
module.exports = {
  // GETORGAN:`${BASE_URL}/organization/`,//查询该组织所有下级及人数
  // POSTORGAN:`${BASE_URL}/organization/`,//添加组织
  // PUTORGAN:`${BASE_URL}/organization/`,//修改组织信息
  // DELETEORGAN:`${BASE_URL}/organization/`,//删除组织信息
  // GETROLE:`${BASE_URL}/organization/menu`,//查询角色
  // GETUSER:`${BASE_URL}/organization/user`,//查找管理员信息
  // POSTUSER:`${BASE_URL}/organization/user`,//添加管理员
  // PUTUSER:`${BASE_URL}/organization/user`,//添加管理员
  // PUTRESET:`${BASE_URL}/organization/reset`,//重置密码

  DELETEMESS:`${BASE_URL}/Msg/auxiliaryPolice/`,//删除辅警个人消息通知
  GETPOLICELIST:`${BASE_URL}/Msg/auxiliaryPolice/list`,//获取辅警个人消息通知列表
  GETDBLIST:`${BASE_URL}/Msg/user/dbList`,//管理员获取代办列表
  GETLIST:`${BASE_URL}/Msg/user/list`,//获取管理员个人消息通知列表
  POSTNOTICE:`${BASE_URL}/Msg/user/notice`,//管理员通知删除
  DELETENOTICE:`${BASE_URL}/Msg/auxiliaryPolice/`,//辅警通知删除
  GETSTATISDATA:`${BASE_URL}/Msg/organizationStatistics`,//获取首页当前管理员前8周的组织人数统计
  GETDISTRIBUTE:`${BASE_URL}/Msg/organizationStatistics/all`//获取首页当前管理员下一级组织人数统计
  
  
}
