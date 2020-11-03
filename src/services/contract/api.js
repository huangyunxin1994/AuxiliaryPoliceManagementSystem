//跨域代理前缀
const API_PROXY_PREFIX={
  lk:'/api/lk',
  rzh:'/api/rzh'
}
const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL : API_PROXY_PREFIX.lk
// const BASE_URL = process.env.VUE_APP_API_BASE_URL
module.exports = {
  // GETDATA:`${BASE_URL}/OvertimeLeave/OvertimeLeave`,//获取加班或请假的分页列表
  // PUTDATA: `${BASE_URL}/OvertimeLeave/OvertimeLeave`,//审批请假或加班
  // POSTBYAUX:`${BASE_URL}/OvertimeLeave/OvertimeLeave/auxiliaryPolice`,//辅警申请请假或者加班
  // POSTBYUSER:`${BASE_URL}/OvertimeLeave/OvertimeLeave/Statistics`,//管理员新增辅警请假或加班申请
  // STATISTICS:`${BASE_URL}/OvertimeLeave/OvertimeLeave/user`,//获取加班或请假统计分页列表

  GETDATA:`${BASE_URL}/contract/`,//获取合同管理信息列表
  POSTdATA:`${BASE_URL}/contract/`,//批量添加合同信息
  GETDETAILS:`${BASE_URL}/contract/details`,//根据辅警id查询合同信息
  PODTEXTENSION:`${BASE_URL}/contract/renewal`,//续约合同
  DOWNLAODNOC:`${BASE_URL}/contract/downloadFile`,//下载文件
  POSTFILES:`${BASE_URL}/contract/uploadFile`,//文件上传
}
