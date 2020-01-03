import Vue from 'vue'
import App from './App.vue'
import AlertDialog from './utils/plugin/AlertDialog.js';

Vue.config.productionTip = false;
Vue.use(AlertDialog);
// Vue.prototype.$Notice = AlertDialog;

new Vue({
  render: h => h(App),
}).$mount('#app')
