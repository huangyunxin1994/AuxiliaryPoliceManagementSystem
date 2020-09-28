import TabsView from '@/layouts/tabs/TabsView'
import BlankView from '@/layouts/BlankView'
import PageView from '@/layouts/PageView'

// 路由配置
const options = {
  routes: [
    {
      path: '/login',
      name: '登录页',
      component: () => import('@/pages/login')
    },
    {
      path: '*',
      name: '404',
      component: () => import('@/pages/exception/404'),
    },
    {
      path: '/403',
      name: '403',
      component: () => import('@/pages/exception/403'),
    },
    {
      path: '/',
      name: '首页',
      component: TabsView,
      redirect: 'demo',
      children: [
        {
          path: 'demo',
          name: '首页',
          meta: {
            icon: 'home'
          },
          component: () => import('@/pages/demo')
        },
        {
          path: 'parent1',
          name: '辅警资料',
          meta: {
            icon: 'user',
          },
          component: BlankView,
          children: [
            {
              path: 'demo1',
              name: '演示页面1',
              component: () => import('@/pages/demo'),
            }
          ]
        },
        {
          path: 'parent2',
          name: '合同管理',
          meta: {
            icon: 'solution'
          },
          component: PageView,
          children: [
            {
              path: 'demo2',
              name: '演示页面2',
              component: () => import('@/pages/demo'),
            }
          ]
        },
        {
          path: 'parent3',
          name: '人事管理',
          meta: {
            icon: 'hourglass'
          },
          component: PageView,
          children: [
            {
              path: 'demo2',
              name: '演示页面2',
              component: () => import('@/pages/demo'),
            }
          ]
        },
        {
          path: 'parent4',
          name: '工资管理',
          meta: {
            icon: 'pay-circle'
          },
          component: PageView,
          children: [
            {
              path: 'demo2',
              name: '演示页面2',
              component: () => import('@/pages/demo'),
            }
          ]
        },
        {
          path: 'parent5',
          name: '教育培训',
          meta: {
            icon: 'desktop'
          },
          component: PageView,
          children: [
            {
              path: 'demo2',
              name: '演示页面2',
              component: () => import('@/pages/demo'),
            }
          ]
        },
        {
          path: 'parent6',
          name: '证件装备管理',
          meta: {
            icon: 'idcard'
          },
          component: PageView,
          children: [
            {
              path: 'demo2',
              name: '演示页面2',
              component: () => import('@/pages/demo'),
            }
          ]
        },
        {
          path: 'parent7',
          name: '奖励与责任追究',
          meta: {
            icon: 'thunderbolt'
          },
          component: PageView,
          children: [
            {
              path: 'demo2',
              name: '演示页面2',
              component: () => import('@/pages/demo'),
            }
          ]
        },
        {
          path: 'parent8',
          name: '加班与请销假',
          meta: {
            icon: 'calculator'
          },
          component: PageView,
          children: [
            {
              path: 'demo2',
              name: '演示页面2',
              component: () => import('@/pages/demo'),
            }
          ]
        },
        {
          path: 'parent9',
          name: '文档中心',
          meta: {
            icon: 'folder'
          },
          component: () => import('@/pages/demo')
        },
        {
          path: 'parent10',
          name: '系统设置',
          meta: {
            icon: 'setting'
          },
          component: () => import('@/pages/demo')
        },
        {
          path: 'exception',
          name: '异常页',
          meta: {
            icon: 'warning',
          },
          component: BlankView,
          children: [
            {
              path: '404',
              name: 'Exp404',
              component: () => import('@/pages/exception/404')
            },
            {
              path: '403',
              name: 'Exp403',
              component: () => import('@/pages/exception/403')
            },
            {
              path: '500',
              name: 'Exp500',
              component: () => import('@/pages/exception/500')
            }
          ]
        },
        {
          name: '验权页面',
          path: 'auth/demo',
          meta: {
            icon: 'file-ppt',
            // authority: {
            //   permission: 'form',
            //   role: 'manager'
            // },
          },
          component: () => import('@/pages/demo')
        }
      ]
    }
  ]
}

export default options
