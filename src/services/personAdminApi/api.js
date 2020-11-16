//跨域代理前缀
const API_PROXY_PREFIX={
  lk:'/api/lk',
  rzh:'/api/rzh',
  fwq:'/api/fwq'
}
const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL : API_PROXY_PREFIX.lk
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

  GETRANKDATA:`${BASE_URL}/PersonnelManagement/RankPost`,//获取岗配置列表
  GETRANKPOSTHIS:`${BASE_URL}/PersonnelManagement/RankPost/person`,//获取职级或岗位个人列表
  CHANGERANKPOST:`${BASE_URL}/PersonnelManagement/RankPost`,//变更职级或岗位

  GETDIMISSIONDATA:`${BASE_URL}/PersonnelManagement/quit`,//获取离职人员列表
  POSTDIMISSION:`${BASE_URL}/PersonnelManagement/quit`,//获取离职人员列表
  PUTPDIMISSION:`${BASE_URL}/PersonnelManagement/quit`,//离职修改证件装备回收状态

  GETPROFESSIONDATA:`${BASE_URL}/PersonnelManagement/major`, //获取专业技术辅警资格列表
  POSTPROFESSION:`${BASE_URL}/PersonnelManagement/major`, //新增专业辅警任职人员
  GETPERSONROFESSIOND:`${BASE_URL}/PersonnelManagement/major/person`, //获取专业技术辅警资格个人列表
  
}
