import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
//import './assets/theme/theme-green/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
//import NProgress from 'nprogress'
//import 'nprogress/nprogress.css'
import routes from './routes'
import Mock from './mock'
Mock.bootstrap();
import 'font-awesome/css/font-awesome.min.css'

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)

//NProgress.configure({ showSpinner: false });

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {//在每次路由前触发
  //NProgress.start();
  if (to.path == '/login') {
    sessionStorage.removeItem('user');
  }
  let user = JSON.parse(sessionStorage.getItem('user'));
  if (!user && to.path != '/login') {
    next({ path: '/login' })
  } else {
    next()
  }
})

//router.afterEach(transition => {
//NProgress.done();
//});

Vue.directive('focusNextOnEnter', {//自定义指令 用于回车换标签
  bind: function(el, {
    value
  }, vnode) {

    el.addEventListener('keyup', (ev) => {

      if (ev.keyCode === 13) {
        //let nextInput = vnode.context.$refs[value]
        let nextInput = vnode.context.$refs[value].$refs.input//由于用的是组件所以要获取组件中的input .$refs.input
        if (nextInput && typeof nextInput.focus === 'function') {

          nextInput.focus()
          nextInput.select()
        }
      }
    })
  }
})

new Vue({
  //el: '#app',
  //template: '<App/>',
  router,
  store,
  //components: { App }
  render: h => h(App)
}).$mount('#app')
