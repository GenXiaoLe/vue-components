import Vuex from '@/package/kVuex/KVuex.js';
import Vue from 'vue';
import Count from './count.js';

Vue.use(Vuex);

const vuex = new Vuex.Store(Count);

export default vuex;