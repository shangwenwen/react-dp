const HtmlWebpackPlugin = require('html-webpack-plugin'),
  path = require('path'),
  ExtractTextPlugin = require('extract-text-webpack-plugin'),
  OpenBrowserPlugin = require('open-browser-webpack-plugin'),
  webpack = require('webpack');

module.exports = {
  entry: path.resolve(__dirname, 'app/index.js'),
  output: {
    path: __dirname + "/build",
    filename: "bundle.js"
  },
  resolve:{
    extensions:['.js','.jsx']
  },
  module: {
    rules: [{
      //js文件，  babel转换
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      include: /app/,
      loader: "babel-loader",
      options: {
        presets: ["env"]
      }
    }, {
      //css文件导入
      test: /\.css$/,
      exclude: /node_modules/,
      include: /app/,
      use: [{
        loader: 'style-loader'
      }, {
        loader: 'css-loader',
        //设置cssloader后面加入的loader数
        options: {
          importLoaders: 1
        }
      }, {
        loader: 'postcss-loader'
      }]
    }, {
      //less文件 ， sass（scss）文件类似
      //loader的顺序是从下往上，也就是less先执行，最后执行style
      test: /\.less$/,
      exclude: /node_modules/,
      include: /app/,
      use: [{
        loader: 'style-loader'
      }, {
        loader: 'css-loader'
      }, {
        loader: 'postcss-loader'
      }, {
        loader: 'less-loader'
      }]
    }, {
      //图片文件
      test: /\.(png|jpg|svg|gif|jpeg|bmp)$/i,
      use: [{
        loader: 'url-loader',
        options: {
          //
          limit: 5000,
          name: 'assets/[name]-[hash:5].[ext]'
        }
      }/*, {
        //压缩图片文件
        loader: 'image-webpack-loader'
      }*/]
    }]
  },

  //插件定义
  plugins: [

    // html 模板插件
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: __dirname + '/app/index.html'
    }),


    // 可在业务 js 代码中使用 __DEV__ 判断是否是dev模式（dev模式下可以提示错误、测试报告等, production模式不提示）
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(JSON.parse((process.env.NODE_ENV == 'dev') || 'false'))
    }),
    // 热加载插件
    new webpack.HotModuleReplacementPlugin(),

    //webpack里面的loader添加插件
    new webpack.LoaderOptionsPlugin({
      options: {
        //添加postcss-loader的插件
        // postcss: function() {
        //   return [
        //     require('autoprefixer')({
        //       browsers: ['ie>=8', '>1% in CN']
        //     })
        //   ];
        // }
      }
    }),


    // 打开浏览器
    new OpenBrowserPlugin({
      url: 'http://localhost:8686'
    })


  ],

  devServer: {
    proxy: {
      // 凡是 `/api` 开头的 http 请求，都会被代理到 localhost:3000 上，由 koa 提供 mock 数据。
      // koa 代码在 ./mock 目录中，启动命令为 npm run mock
      '/api': {
        target: 'http://localhost:3000',
        secure: false
      }
    },
    contentBase: "./public", //本地服务器所加载的页面所在的目录
    historyApiFallback: true, //不跳转
    inline: true, //实时刷新
    hot: true  // 使用热加载插件 HotModuleReplacementPlugin
  }

};