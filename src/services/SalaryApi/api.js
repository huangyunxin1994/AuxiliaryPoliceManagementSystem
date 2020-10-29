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

  GETSALARY:`${BASE_URL.lk}/salary/`,//查询工资条
  POSTSALARY:`${BASE_URL.lk}/salary/`,//上传工资条
  GETSALARYFILETER:`${BASE_URL.lk}/salary/filter`,//查询该管理员已经导入过工资条的组织
  GETFORMWORK:`${BASE_URL.lk}/salary/formwork`,//查看工资模板
  GETSYNCHRO:`${BASE_URL.lk}/salary/synchro`,//同步工资条
}