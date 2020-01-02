import Vue from 'vue';

function create(Component, props) {
    // 使用extend构建实例
    let Ctr = Vue.extend(Component);
    let comp =  new Ctr({propsData: props}).$mount();
    document.body.appendChild(comp.$el);
    comp.remove = function() {
        document.body.removeChild(comp.$el);
        comp.$destroy();
    }
    return comp;

    // 使用render构建实例
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

export default create;