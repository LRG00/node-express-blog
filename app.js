const express = require("express");
const path = require("path");
const mongoose = require('mongoose')
const bodyParser = require("body-parser");
const DB_URL = 'mongodb://localhost:27017/test'
mongoose.connect(DB_URL)
mongoose.connection.on('connected', () => console.log('已启动mongo'))
// 初始化app
const app = express();
// Body Parser 中间件
// 解析 application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// 解析 application/json
app.use(bodyParser.json());
// 设置静态文件
app.use(express.static(path.join(__dirname, "public")));
// 设置模板引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
// 引入article models
const Article = require("./models/article");
// 路由
app.get('/', function (req, res) {
  Article.find({}, (err, articles)=>{
    if(err){
      console.log(err)
      return
    } else {
      res.render("index", { title: '文章管理', articles });
    }
  })
  
});

app.get('/articles', function (req, res) {
  res.render("add_article", { title: "文章列表" });
});

app.get('/articles/add', function (req, res) {
  res.render("add_article", { title: "添加文章" });
});
app.post('/articles/add', function (req, res) {
  const { title, author, content } = req.body
  const article = new Article()
  article.title = title
  article.author = author
  article.content = content
  article.save((err)=>{
    if(err){
      console.log(err)
      return
    }else{
      res.redirect('/')
    }
  })
});
// 启动服务
app.listen(3000, function () {
  console.log('Server started on port 3000...');
});