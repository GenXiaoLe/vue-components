// 1.分两部分 一个是 构建Store的实例 一个是 构建install组件
// 2.Store 要实现 commit dispatch state 并且把state编程响应式数据
// 3.install 要实现挂载$Store到全局

let Vue;

class Store {
    constructor(options = {}) {
        const store = this;
        const { dispatch, commit } = this;
        // 定义state
        // 将state编程响应式数据
        // 并加一层 使用 get 阻止state被修改 使用$$是因为不会被vue解析
        this._vm = new Vue({
            data: {
                $$state: options.state
            },
        })
        // 创建一个响应式监听getter的实例
        this._vmWatch = new Vue();

        // 为mutations 与 actions赋值
        store._mutations = options.mutations;
        store._actions = options.actions;
        
        store.commit = function(type, payload) {
            return commit.call(store, type, payload);
        }
        store.dispatch = function(type, payload) {
            return dispatch.call(store, type, payload);
        }
    }

    get state() {
        return this._vm._data.$$state
    }

    set state (v) {
        window.console.error('不要直接修改state');
    }
     

    // _type 表示类型 _payload 载荷 用来表示参数
    commit(_type, _payload) {
        this._mutations[_type](this.state, _payload);
    }

    dispatch(_type, _payload) {
        this._actions[_type](this, _payload);
    }

    watch(getter, cb, options) {
        return this._vmWatch.$watch(() => getter(this.state, this.getters), cb, options);
    }
}

const install = function(_Vue) {
    Vue = _Vue;

    //使用mixin, 拿到实例后的相关属性并挂载到prototype上
    Vue.mixin({
        beforeCreate() {
            // 拿到vue挂载到所有属性 以后可以使用this.$store调用实例
            if (this.$options.store) {
                Vue.prototype.$Store = this.$options.store;
            }
        }
    })
}

export default {
    Store,
    install
}