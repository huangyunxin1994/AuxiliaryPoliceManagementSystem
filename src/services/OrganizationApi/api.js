//跨域代理前缀
const API_PROXY_PREFIX={
  lk:'/api/lk',
  rzh:'/api/rzh'
}
const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL : API_PROXY_PREFIX.lk
module.exports = {
  GETORGAN:`${BASE_URL}/organization/`,//查询该组织所有下级及人数
  POSTORGAN:`${BASE_URL}/organization/`,//添加组织
  PUTORGAN:`${BASE_URL}/organization/`,//修改组织信息
  DELETEORGAN:`${BASE_URL}/organization/`,//删除组织信息
  GETROLE:`${BASE_URL}/organization/menu`,//查询角色
  GETUSER:`${BASE_URL}/organization/user`,//查找管理员信息
  POSTUSER:`${BASE_URL}/organization/user`,//添加管理员
  PUTUSER:`${BASE_URL}/organization/user`,//添加管理员
  PUTRESET:`${BASE_URL}/organization/reset`,//重置密码
  DELETEUSER:`${BASE_URL}/organization/user`,//删除用户
  PUTPASSWORD:`${BASE_URL}/organization/user/s`,//修改密码
 
  
}
