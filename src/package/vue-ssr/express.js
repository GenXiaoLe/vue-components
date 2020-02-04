// 1. 引入 express
// 2. 调用 express 返回实例
// 3. 监听启用端口
// 4. 控制台使用node xxx.js 指令启动

// 1. 引入vue-server-renderer
// 2. 调用createRenderer方法返回创建实例
// 3. renderToString 传入 vue实例 由于返回是个promise 直接调用then 接受数据 输出

// 引入favicon 使用server.use处理favicon地址

// 引入fs，根据地址栏名称动态添加模版

const express = require('express');
const path = require('path');
const fs = require('fs');
const renderer = require('vue-server-renderer');
const Vue = require('vue');

const server = express();
const renderTo = renderer.createRenderer();

// 处理favicon
const favicon = require('serve-favicon');
server.use(favicon(path.join(__dirname, '../../../public', 'favicon.ico')));

server.get('*', (req, res) => {
    // eslint-disable-next-line no-console
    console.log(req.url)

    const pageName = req.url.substring(1) || 'index';
    const page = fs.readFileSync(`${pageName}.html`);

    const app = new Vue({
        template: page.toString(),
        data: {
            foo: 'vue ssr'
        },
    });

    renderTo.renderToString(app)
        .then(html => {
            res.send(html);

            app.$mount('#app', true);
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