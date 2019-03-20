const webpack=require('webpack');//一个Node.js核心模块，用于操作文件路径
const path=require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const env = process.env.NODE_ENV;

module.exports={
	mode: "production",
	entry: {//已多次提及的唯一入口文件
		background:path.resolve(__dirname,"./background.js"),
		options:path.resolve(__dirname,"./options.js"),
		autoplay:path.resolve(__dirname,"./autoplay.js")
	},
	devServer: {
		contentBase: './out'
   },
	output: {
		//path: __dirname,
		path: path.resolve(__dirname,'out'),//打包后的文件存放的地方
		filename: '[name].js',//打包后输出文件的文件名
	},
	plugins: env === 'production'? // 根据package.json传入的环境参数判断
	[
		 new CleanWebpackPlugin(),//清空输出目录的原html文件
		 new HtmlWebpackPlugin({ // build新html页面
			title: '课程自动播放插件',
			template:'./options.html',
			filename:'options.html'
		 }),
		new ExtractTextPlugin({filename: '[name].css'}),
		new webpack.DefinePlugin({ 'process.env': { NODE_ENV: JSON.stringify(env)} })
    ] :
	[
		 new CleanWebpackPlugin(),
		 new HtmlWebpackPlugin({
			title: '课程自动播放插件',
			template:'./options.html',
			filename:'options.html'
		 }),
		new ExtractTextPlugin({filename: 'bootstrap.min.css'}),
        new webpack.DefinePlugin({ 'process.env': {NODE_ENV : JSON.stringify(env)} })
    ],
	optimization: {// 指定公共bundle 的名称。
        splitChunks: {
            cacheGroups: {
                commons: {
                    name: "commons",
                    chunks: "initial",
                    minChunks: 2
                }
            }
        }
    },
	module: {
		rules: [
		{
			test: /\.js$/,
			exclude: /(node_modules|bower_components)/,
			use: {
				loader: 'babel-loader',
				options: {
				  presets: ['@babel/preset-env']
				}
			}
		},
		{
			test: /\.css$/,
			use: ExtractTextPlugin.extract({
			   fallback: "style-loader",
			   use: "css-loader"
			})
		},
		{
			test: /\.(png|gif|jpg|ico)/,
			use: 'file-loader'
		},
		]
	},

};