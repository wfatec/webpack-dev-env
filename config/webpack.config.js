const path = require("path")
//自动生成html文件并注入script标签引用
const HtmlWebpackPlugin = require('html-webpack-plugin')
//将css抽离成单独的文件
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    mode:'development',
    // 入口文件地址
    entry:{
        //为项目添加垫片
        polyfill:'@babel/polyfill',
        //将src/index.js设置为入口文件，main可任意设置，这里设为文件名相同
        main:'./src/index.js'
    },
    // 出口文件配置
    output:{
        // 最终打包路径
        path:path.resolve(__dirname,'../dist'),
        // 打包文件的名称,name为入口文件的名称
        filename:'[name].js',    
        // 为项目中的所有资源指定一个基础路径,当设置了 publicPath 属性后，会导致 webpack-dev-server出现无法热更新的情况，因此，在开发环境下可以先注释掉该属性，在真正发布时才使用。
        // publicPath: './'
    },
    // webpack开发服务器
    devServer:{
        //设置开发服务起的目标地址
        contentBase:path.resolve(__dirname,'../dist'),
        //服务器访问地址
        host:'localhost',
        //服务器端口
        port:8088,
        //是否启用服务器压缩
        compress:true,
    },
    /**
     * 此选项控制是否生成，以及如何生成 source map
     * -----------------------------------------------------
     * @param {string}      'source-map'      原始源代码
     * @param {string}      ''                打包后的代码
     */
    devtool:'source-map',
    //模块，用于对不同文件进行匹配和处理
    module:{
        rules: [
            {
                //匹配js或jsx类型文件
                test:/\.(js|jsx)$/,
                //使用babel-loader进行转义
                use:['babel-loader'],
                //设置目标文件
                include:path.resolve(__dirname,'../src'),
                //设置排除文件
                exclude:path.resolve(__dirname,'../node_modules')
            },{
                //匹配css文件
                test:/\.css$/,
                use:ExtractTextPlugin.extract({
                    /**
                     * 一般情况下，由于ExtractTextPlugin已经将css文件单独打包并引入，不再需要style-loader,
                     * 但是在以下三种情况下会执行fallback：
                     * 1. css不被抽离/ExtractTextPlugin失效
                     * 2. HMR
                     * 3. 异步chuncks/bundles
                     * 
                     * style-loader：生成一个内容为最终解析完的css代码的style标签，放到head标签里
                     */
                    fallback:"style-loader",
                    use:[
                        //解析css模块引入
                        'css-loader',
                        //可以对css进行样式补全等操作
                        'postcss-loader',
                    ]
                })
            },{
                //匹配less文件
                test:/\.less$/,
                // #extract,从一个已存在的 loader 中，创建一个提取(extract) loader
                use:ExtractTextPlugin.extract({
                    //
                    fallback:"style-loader",
                    use:[
                        //生成一个内容为最终解析完的css代码的style标签，放到head标签里
                        // 'style-loader',
                        //解析css模块引入
                        'css-loader',
                        //可以对css进行样式补全等操作
                        'postcss-loader',
                        //将less解析为css
                        'less-loader'
                    ]
                })
            },{
                //匹配png jpg gif类型的文件,忽略大小写
                test: /\.(png|jpg|gif)$/i,
                use: [
                    {
                        /**
                         * 可以处理文件对象，并将处理后的文件变成文件内容的MD5 hash，后缀名为源文件的后缀名。
                         *          类型          名称           默认值                               描述
                         * @param {Number}       limit       'undefined'                  文件小于limit时，以URL方式引入
                         * @param {string}      mimetype       extname          是否把其他后缀名的图片文件，统一转为同一种格式的base64编码   
                         * @param {string}      fallback     file-loader                文件大于limit时，调用file-loader方式处理
                         */
                        loader: 'url-loader',
                        options: {
                            mimetype: 'image/png',
                            limit: '8024',
                            /**
                             * name表示输出的文件名规则，如果不添加这个参数，输出的就是默认值：文件哈希。
                             * 加上[path]表示输出文件的相对路径与当前文件相对路径相同，
                             * 加上[name].[ext]则表示输出文件的名字和扩展名与当前相同。
                             * 加上[hash]表示加上一个hash码，用于唯一标识打包文件
                             * 加上[path]这个参数后，打包后文件中引用文件的路径也会加上这个相对路径。
                             */
                            name: '[name].[hash].[ext]',
                            /**
                             *  outputPath表示输出文件路径前缀。图片经过url-loader打包都会打包到指定的输出文件夹下。
                             * 但是我们可以指定图片在输出文件夹下的路径。比如outputPath=img/，
                             * 图片被打包时，就会在输出文件夹下新建（如果没有）一个名为img的文件夹，
                             * 把图片放到里面。
                             */
                            outputPath:'img/'
                            /**
                             *  publicPath表示打包文件中引用文件的路径前缀，如果你的图片存放在CDN上，
                             * 那么你上线时可以加上这个参数，值为CDN地址，这样就可以让项目上线后的资源引用路径指向CDN了。
                             */
                            //publicPath:'output/'
                        }
                    }
                ]
            }
        ]
    },
    //插件，类似于中间件，可在打包过程中进行功能扩展
    plugins:[
        new HtmlWebpackPlugin({
            //生成html文件的标题
            title:"webpack",
            //html文件的文件名，默认是index.html
            filename:"index.html",
            //生成文件依赖的模板，支持加载器(如handlebars、ejs、undersore、html等)
            template: './public/index.html',
            /**
             * script标签插入位置
             *  true 默认值，script标签位于html文件的 body 底部
             *  body script标签位于html文件的 body 底部
             *  head script标签位于html文件的 head中
             *  false 不插入生成的js文件，这个几乎不会用到的
             */
            inject:true,
            //将给定的图标加入到输出的html文件
            favicon:'./public/favicon.ico'
        }),
        //将css单独打包
        new ExtractTextPlugin({
            /**
             * 生成文件的文件名。可能包含 [name], [id] and [contenthash]
             * [contenthash]在webpack4.3以上需要改成[hash],原因是与在webpack4存在命名冲突
             */
            filename: 'css/[name].css',
            /**
             * filename:  (getPath) => {
             *      return getPath('css/[name].css').replace('css/js', 'css');
             *  },
             *  从所有额外的 chunk提取,当使用 CommonsChunkPlugin 
             *  并且在公共 chunk 中有提取的 chunk（来自ExtractTextPlugin.extract）时，
             *  allChunks **必须设置为 true
             */
            allChunks:true
        }),
    ],
}