
const Vue = require('vue')
const fs = require('fs-extra')
const path = require('path')
const webpack = require('webpack')
const { createBundleRenderer } = require('vue-server-renderer')

var hljs = require('highlight.js');
const md = require('markdown-it')({
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(str, { language: lang }).value;
            } catch (__) { }
        }
        return ''; // use external default escaping
    }
});


const serverConfig = require('./webpack.config.server.js')
const createClientConfig = require('./webpack.config.client.js')

// vue ssr生成 server-bundle.json + client-manifest.json
function compile(config) {
    return new Promise((resolve, reject) => {
        webpack(config, (err, stats) => {
            if (err) {
                return reject(err)
              }
              if (stats.hasErrors()) {
                stats.toJson().errors.forEach(err => {
                  console.error(err)
                })
                reject(new Error(`Failed to compile with errors.`))
                return
              }
              resolve()
        })
    })
}

// 查询srDir下所有md文件相对路径
async function resolvePages(srDir) {
    const { globby } = await import('globby') // require('globby')
    const files = await globby(['**/*.md'], {
        cwd: srDir
    })
    return files
}


const context = {
    title: 'vue ssr',
    meta: `
        <meta name="keyword" content="vue,ssr">
        <meta name="description" content="vue srr demo">
    `,
    sub: '/blog'
};

// ssr静态页面 配置
function createRender(config) {
    const template = require('fs').readFileSync(path.resolve(__dirname, './ssr/index.template.html'), 'utf-8')
    const serverBundle = require( path.resolve(__dirname, './tmp/server-bundle.json'))
    const clientManifest = require(path.resolve(__dirname, './tmp/client-manifest.json'))

    const renderer = createBundleRenderer(serverBundle, {
        template,
        clientManifest
    })
    return renderer
}


// 将每个md文件转成html片段，分别插入到ssr静态页面
// let config = {
//     docs: path.resolve(pwd, 'docs' ),
//     dest: path.resolve(pwd, 'blog' ),
//     sub: '/blog'
// }
async function press(config) {
    let clientConfig = createClientConfig(config)
    
    await compile([clientConfig, serverConfig])

    let files = await resolvePages(config.docs)

    const renderer = createRender(config)

    for (const file of files) {
        // md to html
        let content = await fs.readFile(path.resolve(config.docs, file), 'utf-8')
        var docHtml = md.render(content);

        // md-html write to html use ssr template
        context.docHtml = docHtml
        context.sub = config.sub
        renderer.renderToString(context, async (err, html) => {
            if (err) throw err
            let destFile = path.resolve(config.dest, file.replace(/.md$/, '.html'))
            await fs.ensureFile(destFile)
            fs.writeFile(destFile, html)
        })
    }
}


module.exports = press
