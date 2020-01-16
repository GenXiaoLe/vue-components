const Module = class Module {
    constructor(rawModule) {
        this._children = {};
        this.state = rawModule.state || {};
        this._rawModule = rawModule;
    }

    getChildren(key) {
        return this._children[key];
    }

    addChildren(key, module) {
        this._children[key] = module;
    }

    forEachMutations(fn) {
        this.forEachVal(this._rawModule.mutations, (key, val) => fn(key, val))
    }

    forEachActions(fn) {
        if (this._rawModule.actions) {
            this.forEachVal(this._rawModule.actions, (key, val) => fn(key, val))
        }
    }

    forEachChild(fn) {
        this.forEachVal(this._children, (key, val) => fn(key, val))
    }

    forEachVal(val, fn) {
        if (val) {
            Object.keys(val).forEach(key => fn(key, val[key]))
        }
    }
}

const ModuleCellection = class ModuleCellection {
    constructor(options) {
        this.root = null;
        this.register([], options)
    }

    get(path) {
        return path.reduce((module, key) => {
            return module.getChildren(key);
        }, this.root);
    }

    register(_path, _module) {
        let rawModule = new Module(_module);

        if (_path.length === 0) {
            this.root = rawModule;
        } else {
            let parent = this.get(_path.slice(0, -1));
            parent.addChildren(_path[_path.length - 1], rawModule);
        }

        if (_module.modules) {
            Object.keys(_module.modules).forEach(key => {
                this.register(_path.concat(key), _module.modules[key]);
            })
        }
    }
}

export default ModuleCellection;