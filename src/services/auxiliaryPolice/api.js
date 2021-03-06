//跨域代理前缀
const API_PROXY_PREFIX={
  lk:'/api/lk',
  rzh:'/api/rzh',
  fwq:'/api/fwq'
}
const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL :  API_PROXY_PREFIX.fwq
// const BASE_URL = process.env.VUE_APP_API_BASE_URL
module.exports = {
  // GETDATA:`${BASE_URL}/OvertimeLeave/OvertimeLeave`,//获取加班或请假的分页列表
  // PUTDATA: `${BASE_URL}/OvertimeLeave/OvertimeLeave`,//审批请假或加班
  // POSTBYAUX:`${BASE_URL}/OvertimeLeave/OvertimeLeave/auxiliaryPolice`,//辅警申请请假或者加班
  // POSTBYUSER:`${BASE_URL}/OvertimeLeave/OvertimeLeave/Statistics`,//管理员新增辅警请假或加班申请
  // STATISTICS:`${BASE_URL}/OvertimeLeave/OvertimeLeave/user`,//获取加班或请假统计分页列表

  GETDATA:`${BASE_URL}/auxiliary-police/`,//获取辅警列表信息
  POSTDATA:`${BASE_URL}/auxiliary-police/`,//添加辅警
  PUTDATA:`${BASE_URL}/auxiliary-police/`,//修改辅警
  POSTHEAD:`${BASE_URL}/auxiliary-police/head`, //修改头像
  POSTAUXDATA:`${BASE_URL}/auxiliary-police/auxiliaryPolice`, //批量导入辅警资料
  GETAUXDATA:`${BASE_URL}/auxiliary-police/auxiliaryPolice`, //获取所有辅警的编号
  POSTAUXFORMDATA:`${BASE_URL}/auxiliary-police/auxiliaryPoliceInformation`, //批量导入辅警资料
  
}
