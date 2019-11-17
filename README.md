# webpack
## webpack：构建工具（在webpack里面一切都是模块）
#### 1.作用：
	1.区分环境：开发环境、生产环境分离
	2.优化功能：CSS、JS压缩、 Image base64编码(字符串)
	3.每一个js文件相当于http请求，把所有js文件打包成一个JS文件
#### 2.安装webpack
	1.安装node   查看版本：node-v
	2.全局安装：npm install -g webpack(不推荐全局安装)
	3.进入项目目录：
	npm init -y(初始化文件 package.json)
	npm install --save-dev webpack
	查看版本：webpack -v
	注意：mac需要在命令前面加 sudo
#### 3.webpack核心文件--webpack.config.js
#### 4.安装webpack之后
##### (1)修改package.json文件
	"scripts": {
			"build": "webpack", // 打包
			"dev": "webpack-dev-server" // 运行
	},
##### (2)修改webpack.config.js文件
	const path = require('path');
	const HtmlWebpackPlugin = require('html-webpack-plugin');
	const ExtractTextPlugin = require("extract-text-webpack-plugin");
	const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

	module.exports = {
		// 入口文件的配置项
		entry: {
			entry: './src/index.js'
		},
		// 出口文件的配置项
		output: {
			// 把当前文件的输出路径指向dist
			path: path.resolve(__dirname, 'dist'),
			publicPath: '/',
			filename: '[name].js'
		},
		// 模块，例如解读CSS，图片如何转换，压缩, 配置加载器
		module: {
			rules: [
				{
					// 以.css结尾的文件，匹配style-loader、css-loader加载器
					test: /\.css$/,
					// js、css打包到一个文件中 两种写法
					// 写法一
					// use: ['style-loader', 'css-loader']
					// 写法二
					// use: [
					//   {
					//     loader: 'style-loader'
					//   },{
					//     loader: 'css-loader'
					//   }
					// ]
					// js、css文件分离
					use: ExtractTextPlugin.extract({
						fallback: "style-loader",
						use: "css-loader"
					})
				},{
					// 匹配图片文件后缀名称
					test: /\.(png|jpg|gif)/,
					// 指定使用的loader和loader的配置参数
					use: [{
						loader: 'url-loader',
						options: {
							// 把小于500000B的文件打成Base64的格式，写入js；如果大于500000B，则放在images文件夹下
							// 文件小于小于500000B的时只用到url-loader，大于500000B的时候会用到file-loader，会自动加载file-loader，不需要手动配置
							limit: 500,
							outputPath: 'images/'
						}
					}]
				},{
					// html文件中的img打包
					test: /\.(htm|html)$/i,
					loader: 'html-withimg-loader'
				}
			]
		},
		// 插件，用于生产模板和各项功能
		plugins: [
			// HTML文件打包
			new HtmlWebpackPlugin({
				// 是对HTML文件进行压缩，去掉属性的双引号
				minify: {
					removeAttributeQuotes: true
				},
				// 为了开发中js有缓存效果，所以加入hash，这样可以有效避免缓存JS
				hash: true,
				// 要打包的HTML模板路径和文件名称
				template: './src/index.html'
			}),
			// css打包
			new ExtractTextPlugin("./css/index.css"),
			// js代码压缩
			// new UglifyJsPlugin()
		],
		// 配置webpack开发服务功能
		devServer: {
			// 设置基本目录结构
			contentBase: path.resolve(__dirname, 'dist'),
			// 服务器的IP地址，可以使用IP，也可以使用localhost
			host: '127.0.0.1',
			// 配置服务端口号
			port: 8081,
			// 服务器压缩是否开启
			compress: true
		}
	};
#### (3)加载器和插件说明
##### a.命名规范
	加载器：xxx-loader
	插件：xxx-webpack-plugin
##### b.安装说明
###### ①HTML 文件打包
	需要安装插件 html-webpack-plugin
	命令行： npm install html-webpack-plugin —save-dev
	字符串为hash值，如果改变会到服务端重新下载，如果不改变会读取缓存
	<div id=div4> <img src=/images/13f25784851ec4543c429c06c926340e.png alt=""> </div>
###### ②CSS文件打包(js、css打包到一个文件中,减少http请求)
	在入口的js文件中：import css from   ‘./css/index.css’;
	需要安装加载器 style-loader: 用来处理css文件中的url()等，url挂在js中
	需要安装加载器 css-loader: 用来将css插入到页面的style标签
	安装style-loader: npm install —save-dev style-loader
	安装css-loader: npm install —save-dev css-loader
	实际上，css打包之后是打包在js文件中的，虽然打包到js文件中，但是还是通过style标签将css插入到页面
###### ③CSS文件打包(js、css分离)
	需要安装插件 extract-text-webpack-plugin
	github地址：https://github.com/webpack-contrib/extract-text-webpack-plugin
###### ④Js代码压缩
	生产环境下压缩js文件，上线的时候压缩代码，使文件体积比较小
	使用插件：uglifyjs-webpack-plugin 不需要安装，webpack中已经集成
	const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
	new UglifyJsPlugin()
###### ⑤CSS 中引入图片
	命令：npm install —save-dev file-loader url-loader
	重新打包，发现dist目录下出现images文件夹
###### ⑥HTML 文件中的图片打包
	github地址：https://github.com/wzsxyz/html-withimg-loader
#### 5.webpack3和webpack4区别
UglifyJsPlugin 现在不需要使用这个plugin了，只需要使用optimization.minimize为true就行，production mode下面自动为true
optimization.minimizer可以配置你自己的压缩程序
