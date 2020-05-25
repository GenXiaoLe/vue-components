// 1.分两部分 一个是 构建Store的实例 一个是 构建install组件
// 2.Store 要实现 commit dispatch state 并且把state编程响应式数据
// 3.install 要实现挂载$Store到全局
// 4.实现getter 利用Vue的计算属性
// 5.解决modules的使用 本质上是在原先store的类上做一下改造 创建一个全新的module类将所有的方法全部挂载到原先定义的_mutations和_actions上 不管是直接传入options 还是options里面使用modules 都挂载到sotre上
import KModuleCllection from './KModuleCllection';

let Vue;

class Store {
    constructor(options = {}) {
        const { dispatch, commit } = this;

        // 为mutations 与 actions赋值
        this._mutations = options.mutations || {};
        this._actions = options.actions || {};
        this._wapperGetter = options.getters;
        // 初始化options中的modules 创建一个全新的_modules类
        this._modules = new KModuleCllection(options);

        const store = this;
        const computed = {};
        // 实现getter
        this.getters = {};
        Object.keys(this._wapperGetter).forEach(key => {
            let fn = store._wapperGetter[key];
            computed[key] = function() {
                return fn(store.state);
            };

            Object.keys(this._wapperGetter).forEach(key => {
                Object.defineProperty(store.getters, key, {
                    get: () => store._vm[key]
                });
            });
        });

        this.installModule(this, this._modules.root.state, this._modules.root);

        // 定义state
        // 将state编程响应式数据
        // 并加一层 使用 get 阻止state被修改 使用$$是因为不会被vue解析
        const state = this._modules.root.state;
        this._vm = new Vue({
            data: {
                $$state: state
            },
            computed
        });
        
        this.commit = function(type, payload) {
            return commit.call(store, type, payload);
        }
        this.dispatch = function(type, payload) {
            return dispatch.call(store, type, payload);
        }

        window.console.log(this);
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

    // 创建module 把所有module实例上的方法全挂载到store上
    // 接收当前的store实例 构建好的module实例中root根的state module实例中root
    installModule(store, state, module) {
        // 首先进行一下合并 将每个module的state和root上的state合并
        Object.assign(store._modules.root.state, state);

        // 循环每个节点上的mutations
        module.forEachMutations((key, mutations) => {
            store._mutations[key] = mutations;
        })

        // 循环每个节点上的actions
        module.forEachActions((key, actions) => {
            store._actions[key] = actions;
        })

        // 如果有子modules 则统统循环遍历初始化挂载
        module.forEachChild((key, children) => {
            this.installModule(store, children.state, children) 
        })
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