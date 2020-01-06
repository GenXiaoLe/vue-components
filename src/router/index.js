import Vue from 'vue';
import VurRouter from '@/package/kVueRouter/KVueRouter.js';
import About from '@/pages/about';
import Form from '@/pages/form';
import Page1 from '@/pages/detail1';
import Page2 from '@/pages/detail2';

Vue.use(VurRouter);

let router = [
    {
        path: '/',
        components: Form,
    },
    {
        path: '/about',
        components: About,
        children: [
            {
                path: '/about/detail1',
                components: Page1,
            },
            {
                path: '/about/detail2',
                components: Page2,
            }
        ]
    }
]

const Router = new VurRouter(router);

export default Router;