import TabsView from '@/layouts/tabs/TabsView'
import BlankView from '@/layouts/BlankView'
// import PageView from '@/layouts/PageView'

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
      redirect: 'home',
      children: [
        {
          path: 'home',
          name: '首页',
          meta: {
            icon: 'home'
          },
          component: () => import('@/pages/home/home')
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
              name: '辅警资料',
              component: () => import('@/pages/demo/Demo'),
            }
          ]
        },
        {
          path: 'parent2',
          name: '合同管理',
          meta: {
            icon: 'solution'
          },
          component: BlankView,
          children: [
            {
              path: 'demo2',
              name: '合同管理',
              component: () => import('@/pages/contract/contract'),
            }
          ]
        },
        {
          path: 'parent3',
          name: '人事管理',
          meta: {
            icon: 'hourglass'
          },
          component: BlankView,
          children: [
            {
              path: 'rank',
              name: '职级管理',
              component: () => import('@/pages/personadmin/rank'),
            },
            {
              path: 'post',
              name: '岗位管理',
              component: () => import('@/pages/personadmin/post'),
            },
            {
              path: 'dimission',
              name: '离职管理',
              component: () => import('@/pages/personadmin/dimission'),
            },
            {
              path: 'profession',
              name: '专业技术辅警资格管理',
              component: () => import('@/pages/personadmin/profession'),
            }
          ]
        },
        {
          path: 'parent4',
          name: '工资管理',
          meta: {
            icon: 'pay-circle'
          },
          component: BlankView,
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
          component: BlankView,
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
          component: BlankView,
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
          component: BlankView,
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
          component: BlankView,
          children: [
            {
              path: 'workovertime',
              name: '加班管理',
              component: () => import('@/pages/overtimeAndLeave/workOverTime/WorkOverTime'),
            },
            {
              path: 'askforleave',
              name: '请假管理',
              component: () => import('@/pages/overtimeAndLeave/askForLeave/AskForLeave'),
            },
            {
              path: 'overtimeleavecount',
              name: '加班,请假统计',
              component: () => import('@/pages/overtimeAndLeave/overtimeLeaveCount/OvertimeLeaveCount'),
            }
          ]
        },
        {
          path: 'parent9',
          name: '文档中心',
          meta: {
            icon: 'folder'
          },
          component: BlankView,
          children: [
            {
              path: 'filecenter',
              name: '文档中心',
              component: () => import('@/pages/fileAndNotice/fileCenter/FileCenter'),
            },
            {
              path: 'notice',
              name: '通知公告',
              component: () => import('@/pages/fileAndNotice/notice/Notice'),
            }
          ]
        },
        {
          path: 'setting',
          name: '系统设置',
          meta: {
            icon: 'setting'
          },
          component: BlankView,
          children: [
            {
              path: 'organ',
              name: '组织管理',
              component: () => import('@/pages/setting/organManage/OrganManage'),
            },
            {
              path: 'positionAndLevel',
              name: '岗位与职级管理',
              component: () => import('@/pages/setting/positionAndLevel/PositionAndLevel'),
            },
            {
              path: 'salaryItem',
              name: '工资项管理',
              component: () => import('@/pages/setting/salaryItem/SalaryItem'),
            },
            {
              path: 'otherDeploy',
              name: '其他配置项',
              component: () => import('@/pages/setting/otherDeploy/OtherDeploy'),
            }
          ]
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
