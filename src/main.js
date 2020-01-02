import Vue from 'vue'
import App from './App.vue'
import Create from './utils/dialog.js';
import Navtive from './components/dialog/native';
// import { Native } from './utils/install.js';

// Vue.use(Native);
Vue.config.productionTip = false;
Vue.prototype.$create = Create;
Vue.prototype.$native = Navtive;



new Vue({
  render: h => h(App),
}).$mount('#app')
