#!/usr/bin/env node



const path = require('path')
const pwd = process.cwd()

const press = require('../build.js')


let config = {
  docs: path.resolve(pwd, 'docs' ),
  dest: path.resolve(pwd, 'blog' ),
  sub: '/blog'
}
console.log("src:" + config.docs);
console.log("dest:" + config.dest);

async function aa(){
    await press(config)
}

aa()

