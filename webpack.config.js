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

