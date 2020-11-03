//跨域代理前缀
const API_PROXY_PREFIX={
  lk:'/api/lk',
  rzh:'/api/rzh'
}
const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL : API_PROXY_PREFIX.lk
// const BASE_URL = process.env.VUE_APP_API_BASE_URL
module.exports = {
  GETDOC:`${BASE_URL}/DocumentAnnouncement/document`,//获取文档列表
  POSTDOC: `${BASE_URL}/DocumentAnnouncement/document`,//新建文档并上传
  PUTDOC:`${BASE_URL}/DocumentAnnouncement/document`,//修改文档
  DELETEDOC:`${BASE_URL}/DocumentAnnouncement/document/`,//删除文档
  DOWNLAODDOC:`${BASE_URL}/DocumentAnnouncement/document/download`,//下载文档文件

  GETNOC:`${BASE_URL}/DocumentAnnouncement/notice`,//获取公告列表
  POSTNOC: `${BASE_URL}/DocumentAnnouncement/notice`,//新建公告并上传
  PUTNOC:`${BASE_URL}/DocumentAnnouncement/notice`,//修改公告
  DELETENOC:`${BASE_URL}/DocumentAnnouncement/notice/`,//删除公告
  DOWNLAODNOC:`${BASE_URL}/DocumentAnnouncement/notice/download`,//下载公告文件
}
