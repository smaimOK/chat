// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import 'vuetify/dist/vuetify.min.css'
import Vuetify from 'vuetify'

import VueSocketio from 'vue-socket.io-extended'
import io from 'socket.io-client'

Vue.use(VueSocketio, io('192.168.0.104:3000'))

Vue.config.productionTip = false

Vue.use(Vuetify)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
