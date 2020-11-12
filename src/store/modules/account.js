export default {
  namespaced: true,
  state: {
    user: undefined,
    permissions: null,
    roles: null,
    routesConfig: null,
    loginType:undefined,
    autoLogin:false,
    account:undefined,
    password:undefined
  },
  getters: {
    user: state => {
      if (!state.user) {
        try {
          const user = sessionStorage.getItem(process.env.VUE_APP_USER_KEY)
          state.user = JSON.parse(user)
        } catch (e) {
          console.error(e)
        }
      }
      return state.user
    },
    permissions: state => {
      if (!state.permissions) {
        try {
          const permissions = sessionStorage.getItem(process.env.VUE_APP_PERMISSIONS_KEY)
          state.permissions = JSON.parse(permissions)
          state.permissions = state.permissions ? state.permissions : []
        } catch (e) {
          console.error(e.message)
        }
      }
      return state.permissions
    },
    roles: state => {
      if (!state.roles) {
        try {
          const roles = sessionStorage.getItem(process.env.VUE_APP_ROLES_KEY)
          state.roles = JSON.parse(roles)
          state.roles = state.roles ? state.roles : []
        } catch (e) {
          console.error(e.message)
        }
      }
      return state.roles
    },
    routesConfig: state => {
      if (!state.routesConfig) {
        try {
          const routesConfig = sessionStorage.getItem(process.env.VUE_APP_ROUTES_KEY)
          state.routesConfig = JSON.parse(routesConfig)
          state.routesConfig = state.routesConfig ? state.routesConfig : []
        } catch (e) {
          console.error(e.message)
        }
      }
      return state.routesConfig
    },
    loginType: state => {
      if (!state.loginType) {
        try {
          const loginType = localStorage.getItem(process.env.VUE_APP_LOGIN_TYPE)
          state.loginType = JSON.parse(loginType)
        } catch (e) {
          console.error(e)
        }
      }
      return state.loginType
    },
    autoLogin: state => {
      if (!state.autoLogin) {
        try {
          const autoLogin = localStorage.getItem(process.env.VUE_APP_AUTO_LOGIN)
          console.log(autoLogin)
          state.autoLogin = JSON.parse(autoLogin)
        } catch (e) {
          console.error(e)
        }
      }
      return state.autoLogin
    },
    account: state => {
      if (!state.account) {
        try {
          const account = localStorage.getItem(process.env.VUE_APP_ACCOUNT)
          state.account = JSON.parse(account)
        } catch (e) {
          console.error(e)
        }
      }
      return state.account
    },
    password: state => {
      if (!state.password) {
        try {
          const password = localStorage.getItem(process.env.VUE_APP_PASSWORD)
          state.password = JSON.parse(password)
        } catch (e) {
          console.error(e)
        }
      }
      return state.password
    },
  },
  mutations: {
    setUser (state, user) {
      state.user = user
      sessionStorage.setItem(process.env.VUE_APP_USER_KEY, JSON.stringify(user))
    },
    setPermissions(state, permissions) {
      state.permissions = permissions
      sessionStorage.setItem(process.env.VUE_APP_PERMISSIONS_KEY, JSON.stringify(permissions))
    },
    setRoles(state, roles) {
      state.roles = roles
      sessionStorage.setItem(process.env.VUE_APP_ROLES_KEY, JSON.stringify(roles))
    },
    setRoutesConfig(state, routesConfig) {
      state.routesConfig = routesConfig
      sessionStorage.setItem(process.env.VUE_APP_ROUTES_KEY, JSON.stringify(routesConfig))
    },
    setloginType (state, loginType) {
      state.loginType = loginType
      localStorage.setItem(process.env.VUE_APP_LOGIN_TYPE, JSON.stringify(loginType))
    },
    setAutoLogin (state, autoLogin) {
      state.autoLogin = autoLogin
      localStorage.setItem(process.env.VUE_APP_AUTO_LOGIN, JSON.stringify(autoLogin))
    },
    setAccount (state, account) {
      state.account = account
      localStorage.setItem(process.env.VUE_APP_ACCOUNT, JSON.stringify(account))
    },
    setPassword (state, password) {
      state.password = password
      localStorage.setItem(process.env.VUE_APP_PASSWORD, JSON.stringify(password))
    },
  }
}
