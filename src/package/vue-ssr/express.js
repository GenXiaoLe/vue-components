// 1. 引入 express
// 2. 调用 express 返回实例
// 3. 监听启用端口
// 4. 控制台使用node xxx.js 指令启动

// 1. 引入vue-server-renderer
// 2. 调用createRenderer方法返回创建实例
// 3. renderToString 传入 vue实例 由于返回是个promise 直接调用then 接受数据 输出

const express = require('express');
const renderer = require('vue-server-renderer');
const Vue = require('vue');

const server = express();
const renderTo = renderer.createRenderer();

const app = new Vue({
    template: '<i>hello world</i>'
})

server.get('/', (req, res) => {
    renderTo.renderToString(app)
        .then(html => {
            res.send(html);
        })
        .catch(error => {
            // eslint-disable-next-line no-console
            console.log(error);
        })
})

server.listen('80', () => {
 // eslint-disable-next-line no-console
 console.log('server running');
})