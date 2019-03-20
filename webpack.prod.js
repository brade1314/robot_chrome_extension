const webpack=require('webpack');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.config.js');

module.exports = merge(common, {
   plugins: [
     new UglifyJSPlugin({
		sourceMap: true
	 }),
	 new webpack.LoaderOptionsPlugin({
		 minimize: true // 初始化最小模式
	   })
   ]
});