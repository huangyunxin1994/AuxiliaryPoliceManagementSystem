import TabsView from '@/layouts/tabs/TabsView'
import BlankView from '@/layouts/BlankView'
// import PageView from '@/layouts/PageView'

// 管理路由配置
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
      //管理页面路由配置
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
            authority: {
              role: 'jczl'
            }
          },
          component: BlankView,
          children: [
            {
              path: 'demo1',
              name: '辅警资料',
              meta: {
                invisible: true,
                authority: {
                  role: 'jczl'
                }
              },
              component: () => import('@/pages/demo/Demo'),
            },
            {
              path: 'baseMess',
              name: '基础资料',
              meta: {
                authority: {
                  role: 'jczl'
                }
              },
              component: () => import('@/pages/demo/baseMess/baseMess'),
            }
          ]
        },
        {
          path: 'contract',
          name: '合同管理',
          meta: {
            icon: 'solution',
            authority: {
              role: 'htgl'
            }
          },
          component: BlankView,
          children: [
            {
              path: 'demo2',
              name: '合同管理',
              meta: {
                authority: {
                  role: 'htgl'
                }
              },
              component: () => import('@/pages/contract/contract'),
            }
          ]
        },
        {
          path: 'parent3',
          name: '人事管理',
          meta: {
            icon: 'hourglass',
            authority: {
              role: 'rsgl'
            }
          },
          component: BlankView,
          children: [
            {
              path: 'rank',
              name: '职级管理',
              meta: {
                authority: {
                  role: 'rsgl'
                }
              },
              component: () => import('@/pages/personadmin/rank'),
            },
            {
              path: 'post',
              name: '岗位管理',
              meta: {
                authority: {
                  role: 'rsgl'
                }
              },
              component: () => import('@/pages/personadmin/post'),
            },
            {
              path: 'dimission',
              name: '离职管理',
              meta: {
                authority: {
                  role: 'rsgl'
                }
              },
              component: () => import('@/pages/personadmin/dimission'),
            },
            {
              path: 'profession',
              name: '专业技术辅警资格管理',
              meta: {
                authority: {
                  role: 'rsgl'
                }
              },
              component: () => import('@/pages/personadmin/profession'),
            }
          ]
        },
        {
          path: 'wagesManage',
          name: '工资管理',
          meta: {
            icon: 'pay-circle',
            authority: {
              role: 'gzgl'
            }
          },
          component: BlankView,
          children: [
            {
              path: 'wagesManage',
              name: '工资条发放',
              meta: {
                authority: {
                  role: 'gzgl'
                }
              },
              component: () => import('@/pages/wagesManage/WagesManage'),
            }
          ]
        },
        {
          path: 'education',
          name: '教育培训',
          meta: {
            icon: 'desktop',
            authority: {
              role: 'jypx'
            }
          },
          component: BlankView,
          children: [
            {
              path: 'education',
              name: '培训管理',
              meta: {
                authority: {
                  role: 'jypx'
                }
              },
              component: () => import('@/pages/education/education'),
            },
            {
              path: 'newEducation',
              name: '新建培训',
              meta: {
                invisible: true,
                authority: {
                  role: 'jypx'
                }
              },
              component: () => import('@/pages/education/newEducation/newEducation'),
            },
            {
              path: 'educationDetails',
              name: '培训详情',
              meta: {
                invisible: true,
                authority: {
                  role: 'jypx'
                }
              },
              component: () => import('@/pages/education/educationDetails/educationDetails'),
            }
          ]
        },
        {
          path: 'cardequip',
          name: '证件装备管理',
          meta: {
            icon: 'idcard',
            authority: {
              role: 'zzzb'
            }
          },
          component: BlankView,
          children: [
            {
              path: 'equipageAdmin',
              name: '装备管理',
              meta: {
                authority: {
                  role: 'zzzb'
                }
              },
              component: () => import('@/pages/equipage/equipageAdmin/equipageAdmin'),
            },
            {
              path: 'papersAdmin',
              name: '证件管理',
              meta: {
                authority: {
                  role: 'zzzb'
                }
              },
              component: () => import('@/pages/equipage/papersAdmin/papersAdmin'),
            }
          ]
        },
        {
          path: 'awardduty',
          name: '奖励与追责',
          meta: {
            icon: 'thunderbolt',
            authority: {
              role: 'jcgl'
            }
          },
          component: BlankView,
          children: [
            {
              path: 'award',
              name: '奖励管理',
              meta: {
                authority: {
                  role: 'jcgl'
                }
              },
              component: () => import('@/pages/awardAndDuty/award/Award'),
            },
            {
              path: 'duty',
              name: '责任追究',
              meta: {
                authority: {
                  role: 'jcgl'
                }
              },
              component: () => import('@/pages/awardAndDuty/duty/Duty'),
            }
          ]
        },
        {
          path: 'workandleave',
          name: '加班与请销假',
          meta: {
            icon: 'calculator',
            authority: {
              role: 'jbqj'
            }
          },
          component: BlankView,
          children: [
            {
              path: 'workovertime',
              name: '加班管理',
              meta: {
                authority: {
                  role: 'jbqj'
                }
              },
              component: () => import('@/pages/overtimeAndLeave/workOverTime/WorkOverTime'),
            },
            {
              path: 'askforleave',
              name: '请假管理',
              meta: {
                authority: {
                  role: 'jbqj'
                }
              },
              component: () => import('@/pages/overtimeAndLeave/askForLeave/AskForLeave'),
            },
            {
              path: 'overtimeleavecount',
              name: '加班,请假统计',
              meta: {
                authority: {
                  role: 'jbqj'
                }
              },
              component: () => import('@/pages/overtimeAndLeave/overtimeLeaveCount/OvertimeLeaveCount'),
            }
          ]
        },
        {
          path: 'filenotice',
          name: '文档公告',
          meta: {
            icon: 'folder',
            authority: {
              role: 'wdgg'
            }
          },
          component: BlankView,
          children: [
            {
              path: 'filecenter',
              name: '文档中心',
              meta: {
                authority: {
                  role: 'wdgg'
                }
              },
              component: () => import('@/pages/fileAndNotice/fileCenter/FileCenter'),
            },
            {
              path: 'notice',
              name: '通知公告',
              meta: {
                authority: {
                  role: 'wdgg'
                }
              },
              component: () => import('@/pages/fileAndNotice/notice/Notice'),
            }
          ]
        },
        {
          path: 'setting',
          name: '系统设置',
          meta: {
            icon: 'setting',
            authority: {
              role: 'xtgl'
            }
          },
          component: BlankView,
          children: [
            {
              path: 'organ',
              name: '组织管理',
              meta: {
                authority: {
                  role: 'xtgl'
                }
              },
              component: () => import('@/pages/setting/organManage/OrganManage'),
            },
            {
              path: 'positionAndLevel',
              name: '岗位与职级管理',
              meta: {
                authority: {
                  role: 'xtgl'
                }
              },
              component: () => import('@/pages/setting/positionAndLevel/PositionAndLevel'),
            },
            {
              path: 'salaryItem',
              name: '工资项管理',
              meta: {
                authority: {
                  role: 'xtgl'
                }
              },
              component: () => import('@/pages/setting/salaryItem/SalaryItem'),
            },
            {
              path: 'otherDeploy',
              name: '其他配置项',
              meta: {
                authority: {
                  role: 'xtgl'
                }
              },
              component: () => import('@/pages/setting/otherDeploy/OtherDeploy'),
            }
          ]
        },
      //   {
      //     path: 'exception',
      //     name: '异常页',
      //     meta: {
      //       icon: 'warning',
      //     },
      //     component: BlankView,
      //     children: [
      //       {
      //         path: '404',
      //         name: 'Exp404',
      //         component: () => import('@/pages/exception/404')
      //       },
      //       {
      //         path: '403',
      //         name: 'Exp403',
      //         component: () => import('@/pages/exception/403')
      //       },
      //       {
      //         path: '500',
      //         name: 'Exp500',
      //         component: () => import('@/pages/exception/500')
      //       }
      //     ]
      //   },
      //   {
      //     name: '验权页面',
      //     path: 'auth/demo',
      //     meta: {
      //       icon: 'file-ppt',
      //       // authority: {
      //       //   permission: 'form',
      //       //   role: 'manager'
      //       // },
      //     },
      //     component: () => import('@/pages/demo')
      //   }
      ]
    },
    {
      path: 'subsystem',
      name: '基础资料',
      component: TabsView,
      redirect: '/baseMess/demo1',
      children: [
        {
          path: 'baseMess',
          name: '基础资料',
          meta: {
            icon: 'user'
          },
          component: BlankView,
          children: [
            {
              path: 'demo1',
              name: '基础资料',
              component: () => import('@/pages/subsystem/baseMess/baseMess')
            }
          ]
        },
        {
          path: 'parent2',
          name: '业务信息',
          meta: {
            icon: 'solution'
          },
          component: BlankView,
          children: [
            {
              path: 'demo2',
              name: '奖励与责任追究',
              component: () => import('@/pages/subsystem/businessMess/awardAndDuty'),
            },
            {
              path: 'demo3',
              name: '合同与工资信息',
              component: () => import('@/pages/subsystem/businessMess/contract'),
            },
            {
              path: 'demo4',
              name: '人事信息',
              component: () => import('@/pages/subsystem/businessMess/personnel'),
            },
            {
              path: 'demo5',
              name: '培训记录',
              component: () => import('@/pages/subsystem/businessMess/education'),
            },
            {
              path: 'demo6',
              name: '证件装备',
              component: () => import('@/pages/subsystem/businessMess/equipage'),
            },
            {
              path: 'demo7',
              name: '加班与请假',
              component: () => import('@/pages/subsystem/businessMess/vacate'),
            }
          ]
        }
      ]
    }
  ]
}

export default options
