//跨域代理前缀
const API_PROXY_PREFIX={
  lk:'/api/lk',
  rzh:'/api/rzh'
}
const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL : API_PROXY_PREFIX
// const BASE_URL = process.env.VUE_APP_API_BASE_URL
module.exports = {
  GETDATA:`${BASE_URL.lk}/OvertimeLeave/OvertimeLeave`,//获取加班或请假的分页列表
  PUTDATA: `${BASE_URL.lk}/OvertimeLeave/OvertimeLeave`,//审批请假或加班
  POSTBYAUX:`${BASE_URL.lk}/OvertimeLeave/OvertimeLeave/auxiliaryPolice`,//辅警申请请假或者加班
  POSTBYUSER:`${BASE_URL.lk}/OvertimeLeave/OvertimeLeave/Statistics`,//管理员新增辅警请假或加班申请
  STATISTICS:`${BASE_URL.lk}/OvertimeLeave/OvertimeLeave/user`//获取加班或请假统计分页列表
}
