import Vue from 'vue';
import Notice from '@/components/dialog/Notice';

function create(Component, props) {
    // 1.使用extend构建实例
    let Ctr = Vue.extend(Component);
    let comp =  new Ctr({propsData: props}).$mount();
    document.body.appendChild(comp.$el);
    comp.remove = function() {
        document.body.removeChild(comp.$el);
        comp.$destroy();
    }
    return comp;

    // 2.使用render构建实例
    // let vm = new Vue({
    //     render: h => h(Component, { props })
    // }).$mount();

    // document.body.appendChild(vm.$el);

    // const comp = vm.$children[0];

    // comp.remove = function() {
    //     document.body.removeChild(vm.$el);
    //     vm.$destroy();
    // }

    // return comp;
}

// 1. 直接导出在main.js中挂载到Vue.prototype上成为公共方法
// export default create;
// 2. 改造成插件, 在main.js中Vue.use()引入成为插件
export default {
    install(Vue) {
        Vue.prototype.$notice = props => create(Notice, props);
    }
};