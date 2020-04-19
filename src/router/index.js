import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import(/* webpackChunkName: "login_home_welcome" */'../components/Login.vue')
const Home = () => import(/* webpackChunkName: "login_home_welcome" */'../components/Home.vue')
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */'../components/Welcome.vue')

const User = () => import(/* webpackChunkName: "user_rights_roles" */'../components/user/User.vue')
const Rights = () => import(/* webpackChunkName: "user_rights_roles" */'../components/power/Rights.vue')
const Roles = () => import(/* webpackChunkName: "user_rights_roles" */'../components/power/Roles.vue')

const Categories = () => import(/* webpackChunkName: "categories_params" */'../components/goods/Categories.vue')
const Params = () => import(/* webpackChunkName: "categories_params" */'../components/goods/Params.vue')

const Goods = () => import(/* webpackChunkName: "goods_add" */'../components/goods/Goods.vue')
const Add = () => import(/* webpackChunkName: "goods_add" */'../components/goods/Add.vue')

const Orders = () => import(/* webpackChunkName: "orders_reports" */'../components/order/Orders.vue')
const Reports = () => import(/* webpackChunkName: "orders_reports" */'../components/reports/Reports.vue')

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: User },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Roles },
        { path: '/categories', component: Categories },
        { path: '/goods', component: Goods },
        { path: '/params', component: Params },
        { path: '/orders', component: Orders },
        { path: '/reports', component: Reports },
        { path: '/goods/add', component: Add }
      ]
    }
  ]
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to将要访问得页面
  // from从哪个路径来，
  // next是一个函数，表示放行
  if (to.path === '/login') return next()
  const token = window.sessionStorage.getItem('token')
  if (!token) return next('/login')
  next()
})

export default router
