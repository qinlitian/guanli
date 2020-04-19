import Vue from 'vue'
import App from './App.vue'
import router from './router'
import TreeTable from 'vue-table-with-tree-grid'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

import './assets/css/global.css'

// 导入字体图标
import './assets/fonts/iconfont.css'

// 导入挂在axios
import axios from 'axios'

// 请求进度条展示
import NProgress from 'nprogress'

// 配置请求得根路径
axios.defaults.baseURL = 'http://www.lideminrecall.com/api/'
// 请求拦截，为请求得headers添加Authorization属性
axios.interceptors.request.use(config => {
  // 发起请求展示进度条
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

axios.interceptors.response.use(config => {
  // 响应结束进度条
  NProgress.done()
  return config
})

Vue.prototype.$http = axios

// 定义过滤器处理时间
Vue.filter('dateFormat', (originVal) => {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

Vue.component('tree-table', TreeTable)

// 注册全局富文本编辑器
Vue.use(VueQuillEditor /* { default global options } */)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
