//跨域代理前缀
const API_PROXY_PREFIX='/api'
const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL : API_PROXY_PREFIX
const MOCK_URL = 'http://192.168.1.8:8181'
// const BASE_URL = process.env.VUE_APP_API_BASE_URL
console.log(BASE_URL)
module.exports = {
  LOGIN: `${MOCK_URL}/login`,
  ROUTES: `${MOCK_URL}/routes`
}
