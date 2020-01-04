import Vue from 'vue'
import App from './App.vue'
import AlertDialog from './utils/plugin/AlertDialog.js';
import router from './router';
import store from './store';

Vue.config.productionTip = false;
Vue.use(AlertDialog);
// Vue.prototype.$Notice = AlertDialog;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
