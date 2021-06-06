/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  // {
  //   path: '/',
  //   component: () => import('@/views/layouts/index'),
  //   redirect: '/home',
  //   name: 'Home',
  //   meta: {
  //     title: '首页',
  //     keepAlive: false
  //   },
  //   children: [
  //     {
  //       path: '/me',
  //       name: 'Me',
  //       component: () => import('@/views/home/me'),
  //       meta: { title: '我的', keepAlive: true }
  //     }
  //   ]
  // },
  {
    path: '/hiprint',
    name: 'hiprint',
    component: () => import('@/views/hiprint/index'),
    meta: { title: '模板', keepAlive: true }
  },
  // {
  //   path: '*',
  //   name: 'NotFound',
  //   component: () => import('@/views/exception/404'),
  //   meta: { title: '页面未找到', keepAlive: true }
  // }
]
