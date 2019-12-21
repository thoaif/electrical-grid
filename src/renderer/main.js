/* eslint-disable */
import 'bulma-pro/bulma.sass'

import 'material-design-icons/iconfont/material-icons.css'
import Vue from 'vue'
import App from './App.vue'
import './assets/style/animations.scss'
import './assets/style/main.scss'
import router from './router/index'
import store from './store/index'
const { ipcRenderer } = window.electron

const isDev = process.env.NODE_ENV === 'development'

Vue.config.devtools = isDev
Vue.config.performance = isDev
Vue.config.productionTip = isDev

// tslint:disable-next-line: no-unused-expression
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
})

console.log(window.hello)

// handle menu event updates from main script
ipcRenderer.on('change-view', (event, data) => {
  console.log('change-view')
  if (data.route) {
    router.push(data.route)
  }
})
