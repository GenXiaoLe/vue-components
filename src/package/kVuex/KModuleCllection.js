// 实现同时兼容直接挂载options和利用modules实现模块化传入
// 如果是直接传入配置项options 则不作处理 直接挂载this.root上传出
// 如果传入的是modules 则需要配置一个树形的数据结构 包括所有的module

// 实例每个module的具体方法
import Module from './kModule';

const ModuleCellection = class ModuleCellection {
    constructor(options) {
        this.root = null;
        this.register([], options)
    }

    get(path) {
        // 层层递进 从最外层开始 获取当前module的父module 如果是空数组[] 则父元素即root 返回默认值root即可
        return path.reduce((module, key) => {
            return module.getChildren(key);
        }, this.root);
    }

    // 构建一个module组成的策略表 每层都包括他自身的action commit getter以及所有子元素的这些属性值
    register(_path, _module) {
        // _path主要表示一个深度数组 将每一个modules自身以及父元素的key值保存在里面
        // _module是传入的options

        // 先将配置项进行Module实例
        let rawModule = new Module(_module);

        // 首次进来先赋值为根module
        if (_path.length === 0) {
            this.root = rawModule;
        } else {
            // 之后递归都是子module
            // 找出当前module的父module
            let parent = this.get(_path.slice(0, -1));
            // 将当前的module添加到Module的hash表中
            parent.addChildren(_path[_path.length - 1], rawModule);
        }

        // 如果options对象里包含modules 则进行递归遍历 直到所有的子元素都被遍历完为止
        if (_module.modules) {
            // modules => { count: { state: {}, ... } }
            Object.keys(_module.modules).forEach(key => {
                // 合并_path，这样_path里面就包括了自身以及父元素，并递归传入当前的_path数组以及module(options)
                this.register(_path.concat(key), _module.modules[key]);
            })
        }
    }
}

export default ModuleCellection;