import Vue from 'vue';
import VurRouter from '@/package/kVueRouter/KVueRouter.js';
import About from '@/pages/about';
import Form from '@/pages/form';

Vue.use(VurRouter);

let router = [
    {
        path: '/',
        components: Form
    },
    {
        path: '/about',
        components: About
    }
]

const Router = new VurRouter(router);

export default Router;