# webpack实践
webpack是一个前端模组化构建工具，它可以帮助我们实现前端项目的工程化开发，相信我，工程化真的很重要。目前的版本为4.17.1，关于webpack4的一些特性大家可以看[这里](https://www.webpackjs.com/concepts/)。
## 1. 初始化项目
新建一个项目文件夹
```
mkdir webpack-dev-env && cd webpack-dev-env
```
执行以下命令(个人比较习惯用yarn，当然用npm也没问题)
```
yarn init -y
```
此时可以看到多出一个package.json文件，这个文件就是npm的项目配置文件
## 2. 安装webpack
```
yarn add webpack -D
```
在package.json中看到
```json
{
  …
  "devDependencies": {
    "webpack": "^4.17.1"  //版本号以安装时为准
  }
}
```
## 3. 安装[webpack-cli](https://webpack.docschina.org/api/cli/)
此工具可以通过CLI或者配置文件（默认值：webpack.config.js）获取配置并传递给Webpack进行打包。
```
yarn add webpack-cli -D
```
然后再package.json中添加
```json
"scripts": {
  "build": "webpack"
}
```
执行
```javascript
npm run build
```
此时我们发现控制台出现以下错误
```
ERROR in Entry module not found: Error: Can't resolve './src' in '~\webpack-dev-env'
```
也就是说webpack默认打包入口在'./src'文件夹下的'index.js'，这是webpack4的一个新特性。此外还有一个warning
```
WARNING in configuration
The 'mode' option has not been set, webpack will fallback to 'production' for this value. Set 'mode' option to 'development' or
 'production' to enable defaults for each environment.
You can also set it to 'none' to disable any default behavior. Learn more: https://webpack.js.org/concepts/mode/
```
大意为'mode'未设置，webpack默认会使用'production'模式，即生产模式。现在我们将build命令修改为
```
"build": "webpack --mode=production"
```
且新建src文件夹，并在文件夹内创建'index.js',内容为
```js
console.log('hello webpack!')
```
此时执行'npm run build'，我们发现打包成功，切打包文件自动被放到'dist/main.js'，由于使用了生产模式，所以webpack会开启一系列额外的优化，包括minification, scope hoisting, tree-shaking等。
## 4. webpack配置文件
你当然可以直接通过命令行来运行webpack，并完全使用默认配置，但在大多数场景我们仍需要进行一些个性化配置，这时将这些设置直接卸载命令行中就显得不合时宜了，这时我们可以通过编写webpack.config.js，来规范化我们的webpack配置，这也是目前最主流的做法。

在根目录下创建config文件夹，之后新建webpack.dev.js和webpack.prod.js分别作为开发环境和生产环境下的配置文件。我们主要以开发环境的配置为主，生产环境的配置其实大同小异。将webpack.dev.js修改为
```js
const path = require("path")
module.exports = {
    mode:'development',
    // 入口文件地址
    entry:{
        //将src/index.js设置为入口文件，main可任意设置，这里设为文件名相同
        main:'./src/index.js'
    },
    // 出口文件配置
    output:{
        // 最终打包路径
        path:path.resolve(__dirname,'../dist'),
        // 打包文件的名称,name为入口文件的名称
        filename:'[name].js'
    }
}
```
build命令修改为
```
"build": "webpack --config=config/webpack.config.js"
```
我们可以看到dist文件下出现了我们打包后的main.js文件。

## 5. 使用HtmlWebpackPlugin
我们在dist下新建一个index.html文件，内容为
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <div id="root"></div>
    <script src="./main.js" type="text/javascript" />
</body>
</html>
```
将html在浏览器中打开即可。

我们之前通过手写html文件，并将打包后的main.js引入，但是如果出现类似打包文件名称发生变更的情况，就需要重新更改引入项，有没有什么方法能自动生成html文件，并自动引入依赖文件呢？答案就是html-webpack-plugin。
安装html-webpack-plugin：
```
yarn add html-webpack-plugin -D
```
在public文件夹下新建index.html作为模板文件，内容为：
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <div id="root"></div>
</body>
</html>
```
放入favicon.ico文件，webpack.config.js加入html-webpack-plugin插件
```js
const path = require("path")
//自动生成html文件并注入script标签引用
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    mode:'development',
    // 入口文件地址
    entry:{
        //将src/index.js设置为入口文件，main可任意设置，这里设为文件名相同
        main:'./src/index.js'
    },
    // 出口文件配置
    output:{
        // 最终打包路径
        path:path.resolve(__dirname,'../dist'),
        // 打包文件的名称,name为入口文件的名称
        filename:'[name].js'
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
            // script标签插入位置
            // true 默认值，script标签位于html文件的 body 底部
            // body script标签位于html文件的 body 底部
            // head script标签位于html文件的 head中
            // false 不插入生成的js文件，这个几乎不会用到的
            inject:true,
            //将给定的图标加入到输出的html文件
            favicon:'./public/favicon.ico'
        })
    ],
}
```
打包后的dist/index.html为
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
<link rel="shortcut icon" href="favicon.ico"></head>
<body>
    <div id="root"></div>
<script type="text/javascript" src="main.js"></script></body>
</html>
```
我们可以看到JS和icon文件自动被引入进来
## 6. 使用webpack-dev-server
之前的操作可以让我们顺利的用webpack打包项目文件，但是在开发过程中每次打包后才能看到最终效果无疑会造成严重的效率损失，那么有什么方法能让我们实时的看到代码更改所产生的效果呢？答案就是[webpack-dev-server](https://webpack.js.org/configuration/dev-server/)

首先进行安装，执行
```
yarn add webpack-dev-server -D
```
在webpack.config.js中加入
```js
// webpack开发服务器
    devServer:{
        //设置开发服务起的目标地址
        contentBase:path.resolve(__dirname,'../dist'),
        //服务器访问地址
        host:'localhost',
        //服务器端口
        port:8088,
        //是否启用服务器压缩
        compress:true
    }
```
在package.json的script下增加
```
"start": "webpack-dev-server --config=config/webpack.config.js",
```
执行
```
npm start
```
这时我们就能在8088端口下实时调试我们的代码了

## 7. 兼容ES6语法
ES6语法的推出是前端领域一件振奋人心的大事件，极大的提高了JS的工程化性能，让我们能够更好的组织我们的代码并让团队协作变得更加舒适。但由于目前浏览器的支持度不一，所以很难进行大规模应用。 webpack本身只是一个构建工具，并不会对我们代码本身的语法层面进行处理，但是其提供的强大的可扩展性却让一切变得可能，通过各种各样的loader工具，我们可以方便的对各类文件进行转译，其中babel-loader可以将我们的JS或类JS语法进行转译，ES6转ES5自然不在话下。在babel-loader我们就可以毫无顾虑的体验ES6带来的各种便利，而无须担心兼容性问题。

### 安装babel-loader
```
yarn add babel-loader @babel/core -D
```
在module.rules新增一条：
```js
{
    //匹配js或jsx类型文件
    test:/\.js$/,
    //使用babel-loader进行转义
    use:['babel-loader'],
    //设置目标文件
    include:path.resolve(__dirname,'../src'),
    //设置排除文件
    exclude:path.resolve(__dirname,'../node_modules')
}
```
上述配置告诉webpack，当文件为js时，则使用babel-loader进行转译，目标文件夹为`src`,且排除`node_modules`文件夹下的内容，提高编译效率。
### 安装@babel/preset-env
用于解析ES6语法
```
yarn add @babel/preset-env -D
```
### 建立`.babelrc`文件
```js
{
    "presets": [
        // es6运行环境
         "@babel/preset-env"
    ]
}
```
### 安装[@babel/polyfill](http://babeljs.io/docs/en/babel-polyfill)
此时已经可以运行ES6语法了，但是这里有一个问题，babel只负责语法转换，比如将ES6的语法转换成ES5。但如果有些对象、方法，浏览器本身不支持，比如：
1. 全局对象：Promise、WeakMap 等。
2. 全局静态函数：Array.from、Object.assign 等。
3. 实例方法：比如 Array.prototype.includes 等。
此时，就需要引入babel-polyfill来模拟实现这些对象、方法。
```
yarn add @babel/polyfill -D
```
entry项修改为
```js
// 入口文件地址
entry:{
    //为项目添加垫片
    polyfill:'@babel/polyfill',
    //将src/index.js设置为入口文件，main可任意设置，这里设为文件名相同
    main:'./src/index.js'
}
```
### 安装[@babel/plugin-transform-runtime](http://babeljs.io/docs/en/babel-plugin-transform-runtime)
到了这里似乎已经很完美，但是我们来思考一个问题，babel-polyfill实际上是在全局添加变量来作为那些浏览器未实现API的一个模拟，但是这样必然导致污染全局命名空间，这个时候就轮到babel-plugin-transform-runtime登场了。它能够实现局部加载垫片，避免污染全局空间，且能避免babel编译的工具函数在所有包中重复出现，减少包的体积。但是同样也有一些缺点，那就是不能使用类似`"foobar".includes("foo")`的实例方法。
```
yarn add @babel/plugin-transform-runtime -D
```
### 安装[@babel/runtime](http://babeljs.io/docs/en/babel-runtime)
@babel/plugin-transform-runtime一般仅用于开发环境，但是runtime本身会被代码所依赖，因此需要将@babel/runtime安装到生产环境的依赖项中
```
yarn add @babel/runtime
```
注意这里没有-D。
接下来让我们实验一下ES6语法，在src下新建Rect_class.js文件，内容为：
```js
class Rect {
    constructor(x, y) {
      this.width = x;
      this.height = y;
    }
    area() {
      return this.width * this.height;
    }
    perimeter(){
        return (this.width + this.height)*2
    }

}
export default Rect;
```
逻辑很简单，就是用ES6新增的class方法实现了一个矩形的类，然后再index.js中引入：
```js
    import Rect from './Rect_class'

    const rectObject = new Rect(3,4)
    console.log('周长： ',rectObject.perimeter())
    console.log('面积： ',rectObject.area())
```
执行`npm start`我们可以在控制台打印出：
```
周长：  14
面积：  12
```
下面再运行build，看一下打包后的结果，核心部分变成了：
```js
var Rect =
/*#__PURE__*/
function () {
  function Rect(x, y) {
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, Rect);

    this.width = x;
    this.height = y;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(Rect, [{
    key: "area",
    value: function area() {
      return this.width * this.height;
    }
  }, {
    key: "perimeter",
    value: function perimeter() {
      return (this.width + this.height) * 2;
    }
  }]);

  return Rect;
}();
```
可见我们的ES6代码已经成功转成ES6。
## 8. css模块化
一直以来前端的模块化一直限定在JS上，而另一位重要成员css则由于天然的弱编程能力，难以实现模块化，但是webpack强大的扩展能力让css模块化成为了可能，需要的仅仅只是为css文件添加相应的loader
### 安装css-loader
```
yarn add css-loader -D
```
css-loader作用是让我们的css文件能够用`import`的方式实现模块化传递。
### 安装style-loader
```
yarn add style-loader -D
```
`style-loader`能够让`css-loader`载入的css文件以`<style></style>`的形式插入到`<header></header>`中。
配置module.rules
```js
{
    //匹配css文件
    test:/\.css$/,
    use:[
        //生成一个内容为最终解析完的css代码的style标签，放到head标签里
        'style-loader',
        //解析css模块引入
        'css-loader',
    ]
}
```
接下来我们src下新建index.css
```css
body{
    background:red;
}
```
在index.js中加入
```js
import './index.css'
```
启动后我们打开浏览器控制台，发现css文件中的内容已经通过`<style></style>`插入到`<header></header>`中。
### 安装postcss-loader
[PostCSS](https://www.ibm.com/developerworks/cn/web/1604-postcss-css/index.html)本身是一个功能比较单一的工具。它提供了一种方式用 JavaScript 代码来处理 CSS。它负责把 CSS 代码解析成抽象语法树结构（Abstract Syntax Tree，AST），再交由插件来进行处理。通过PostCSS能够极大的提高CSS的开发效率。

webpack通过`postcss-loader`来对`.css`文件进行处理，并添加在`style-loader`和`css-loader`之后。首先进行安装：
```
yarn add -D postcss-loader
```
postcss有一些非常好用的插件：
1. Autoprefixer
其作用是为 CSS 中的属性添加浏览器特定的前缀。为了兼容不同浏览器的不同版本，在编写 CSS 样式规则声明时通常需要添加额外的带前缀的属性。这是一项繁琐而无趣的工作。Autoprefixer 可以自动的完成这项工作。
2. cssnext
cssnext 插件允许开发人员在当前的项目中使用 CSS 将来版本中可能会加入的新特性。cssnext 负责把这些新特性转译成当前浏览器中可以使用的语法。从实现角度来说，cssnext 是一系列与 CSS 将来版本相关的 PostCSS 插件的组合。比如，***cssnext 中已经包含了对 Autoprefixer 的使用***，因此使用了 cssnext 就不再需要使用 Autoprefixer。

我们一步到位直接安装postcss-cssnext
```
yarn add -D postcss-cssnext
```
在根目录下新建`postcss.config.js`作为postcss的配置文件，postcss-loader会首先优先使用webpack配置文件中的loader选项，然后再检查`postcss.config.js`，将postcss的配置文件单独分离出来有助于构建意图更为清晰(.babelrc也是一样)。`postcss.config.js`内容为：
```js
module.exports = {
    plugins: {
        //兼容css4语法
        'postcss-cssnext': {}
    }
}
```

## 9. style文件抽离
在实际开发过程中，将style直接插入到JS或Html中是非常不经济的做法，对于缓存，CDN等技术均无法很好的支持，所以我们还需要想办法把style文件单独打包出来，以link的方式引入，这就需要用到[extract-text-webpack-plugin](https://github.com/webpack-contrib/extract-text-webpack-plugin)或者[mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin),这里我们使用前者，需要注意的是该插件目前仅支持到webpack3，要想在webpavk4中使用需要安装next版本：

```
yarn add -D extract-text-webpack-plugin@next
```
在webpack.config.js中做如下更改
1. 引入extract-text-webpack-plugin
```js
//将css抽离成单独的文件
const ExtractTextPlugin = require('extract-text-webpack-plugin');
```
2. 更改module.rules
```js
{
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
}
```
3. 增加plugin
```js
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
})
```
我们发现dist/css下出现了main.css文件：
```css
body {
  background: red;
}
div {
  -webkit-box-sizing: border-box;
          box-sizing: border-box;
}
```
box-sizing自动添加了前缀，打开dist/index.html，head部分插入了:
```html
<link href="css/main.css" rel="stylesheet">
```
完全符合我们的预期~

## 10. 解析less文件
由于个人比较习惯使用less来编写style文件，所以这里在做一下配置
1. 安装[less](http://lesscss.org/)和[less-loader](https://github.com/webpack-contrib/less-loader)
```
yarn add -D less less-loader
```
2. 配置module.rules
```js
{
    //匹配less文件
    test:/\.less$/,
    // #extract,从一个已存在的 loader 中，创建一个提取(extract) loader
    use:ExtractTextPlugin.extract({
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
}
```
## 11. 配置react环境
### 1. react和react-dom
这两个包在React 0.14版本以前是合并在一起的，那么为什么会分开呢？其实React本质是会生成一个抽象语法树(AST),而这个AST其实是一个相对独立的存在，包含了所有需要渲染的信息，其实AST本身并不关心具体的渲染过程，而react-dom本质上就是实现一个AST到DOM的映射，它与react本身的逻辑没有直接关系，将其单独抽离出来就为web和native端的组件共享提供了更好的支持，试想一下我们再来一个react-native，是不是就可以将AST映射到移动端呢？这也很好的体现了react的口号：***write once run anywhere***。

接下来是具体的安装：
```
yarn add react react-dom
```

新建src/App.js
```js
import React from "react";
import ReactDOM from "react-dom";
const App = () => {
  return (
    <div>
      <p>React here!</p>
    </div>
  );
};
export default App;
ReactDOM.render(<App />, document.getElementById("root"));
```
具体功能很简单，显示'React here!'，
在src/index.js引入
```js
import App from './App'
```
运行`npm run build`,发现控制台会显示如下错误信息：
```
ERROR in ./src/App.js
Module build failed (from ./node_modules/babel-loader/lib/index.js):
SyntaxError: D:\workspace_github\webpack-dev-env\src\App.js: Unexpected token (5:4)

  3 | const App = () => {
  4 |   return (
> 5 |     <div>
    |     ^
  6 |       <p>React here!</p>
  7 |     </div>
  8 |   );
```
原因是这里我们使用了React配套的JSX语法，而webpack根本不认识它，但没关系，我们有强大的loader体系

### 2. @babel/preset-react
`@babel/preset-react`能够解释并转译JSX语法。
1. 安装` @babel/preset-react`:
```
yarn add -D  @babel/preset-react
```
2. 配置`.banelrc`
增加@babel/preset-react项
```js
{
    "presets": [
        //es6运行环境
        "@babel/preset-env",
        //react运行环境
        "@babel/preset-react"
    ],
    "plugins":[
        //运行时编译es6，入口文件引用作为辅助和内建，
        //1.自动添加垫片到你的当前代码模块而非全局，以避免编译输出的重复问题
        //2.为你的代码创建一个沙盒环境，将内置插件起了别名 core-js，这样就可以无缝的使用它们，并且无需使用 polyfill
        "@babel/plugin-transform-runtime"
    ]
}
```
现在start或build都能运行无误了，大家可以尝试一下.

## 12. 文件加载
我们在开发过程中时常会用到一些文件资源，例如图片等。这时就要用到file-loader或url-loader.
[file-loader](https://webpack.docschina.org/loaders/file-loader/)可以处理文件对象，并将处理后的文件变成文件内容的MD5 hash，后缀名为源文件的后缀名。[url-loader](https://webpack.docschina.org/loaders/url-loader/) 封装了file-loader，其工作时会分为两类情况：
1. 文件大小小于limit参数，url-loader将会把文件转为DataURL
2. 文件大小大于limit，url-loader会调用file-loader进行处理，参数也会直接传给file-loader。因此我们只需要安装url-loader即可。

这里我们选用url-loader来进行文件处理。

### 安装url-loader
```
yarn add -D url-loader
```
2. 配置mudule.rules
```js
{
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
```
接下来在src/img放入一张图片，命名为saber.jpg(可任意命名)，在src/App.js中引入
```js
import React from "react";
import ReactDOM from "react-dom";
import Saber from './img/saber.jpg';
const App = () => {
  return (
    <div>
      <img src={Saber} alt='亚瑟王' />
    </div>
  );
};
export default App;
ReactDOM.render(<App />, document.getElementById("root"));
```
此时运行`npm run build`，发现控制台报错，大意是缺少一些模块，然后在node_modules/url-loader和`node_modules`下查找，发现并没有`file-loader`的依赖，因此估计是缺少`file-loader`，那么尝试一下安装`file-loader`:
```
yarn add -D file-loader
```
之后运行`npm run build`，一切正常，我们的图片也被正常打包到`dist/img`下，命名为`saber.41ba48fec44b8185322755f64d4f3af7.jpg`

## 13. 配置静态资源加载路径

在实际开发中，我们的打包文件未必会放到服务器的根目录下，若需要将打包文件放入子文件夹时，我们会发现项目会报错，因为项目中静态资源的加载路径默认是指向根目录。那么有没有什么方式可以对静态资源文件进行配置呢？有的，那就是`publicPath`，该选项可以为项目中的所有资源指定一个基础路径，默认值是`/`，即服务器根目录。因此我们若确定最终打包文件所在服务器的路径，可以写入绝对路径，例如：
```JS
// 出口文件配置
output:{
    // 最终打包路径
    path:path.resolve(__dirname,'../dist'),
    // 打包文件的名称,name为入口文件的名称
    filename:'[name].js',    
    // 为项目中的所有资源指定一个基础路径
    publicPath: '/subfold'
},
```
此时所有静态资源会默认指向`/subfold`, 如果不确定最终路径，则可以传入相对路径：`publicPath: './'`。这时项目静态资源文件的加载路径默认为所在目录的相对路径
