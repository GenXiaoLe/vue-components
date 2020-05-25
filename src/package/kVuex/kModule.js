// 实例化一个Module 里面可以存储自身属性，state以及子集的Module 

// 一个Module的数据格式

// Module => {
//     state: {},
//     _children: {
//         Module,
//         Module,
//         Module,
//     },
//     _rawModule: options
// }

// options => {
//     state: {},
//     mutations: {},
//     actions: {},
//     getter: {},
// }

const Module = class Module {
    constructor(rawModule) {
        this._children = {};
        this.state = rawModule.state || {};
        this._rawModule = rawModule;
    }

    //根据key值获取子集
    getChildren(key) {
        return this._children[key];
    }

    //将key以及module添加到子集的hash表
    addChildren(key, module) {
        this._children[key] = module;
    }

    // 遍历当前module的所有mutations方法 并执行回调
    forEachMutations(fn) {
        this.forEachVal(this._rawModule.mutations, fn)
    }

    // 遍历当前module的所有actions方法 并执行回调
    forEachActions(fn) {
        if (this._rawModule.actions) {
            this.forEachVal(this._rawModule.actions, fn)
        }
    }

    // 遍历当前module所有的子集 并执行回调
    forEachChild(fn) {
        this.forEachVal(this._children, fn)
    }

    // 遍历object内部的内容 传入当前key值以及具体内容 并执行回调
    forEachVal(val, fn) {
        if (val) {
            Object.keys(val).forEach(key => fn(key, val[key]))
        }
    }
}

export default Module