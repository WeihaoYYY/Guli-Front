'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://localhost:9001/"',  //访问后端的地址
  OSS_PATH: '"https://uni032.oss-cn-hongkong.aliyuncs.com"'  //阿里云的地址
})
