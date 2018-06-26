var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var tasks = require('./service/scheduleTask');
var http=require('http');
var axios=require('axios');
var redis   = require('redis');
var client  = redis.createClient('6379', '127.0.0.1');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

/**
 * 启动定时获取token的方法
 * */

// redis 链接错误
client.on("error", function(error) {
    console.log(error);
});
var authRedis = function () {
    client.auth("Xiangyun2013");
}
authRedis();

var refreshAccessToken = function () {
  console.log("启动定时器--------------");
    client.select('accesstoken', function(error,data){
        if(error) {
            console.log(error);
        } else {
            if(data){
                console.log('存在access_token：暂时不用获取');
            }else{
                getAccessToken();
            }
        }
    });
    var refreshInt = setInterval(function () {
        getAccessToken();
    },100*60*1000);
}

var getAccessToken = function () {
    console.log("获取新的accesstoken 时间"+new Date());
    // 获取access_token
    var url = 'https://api.weixin.qq.com/cgi-bin/token';
    axios.get( url , {
        params:{
            grant_type:'client_credential',
            appid:'wxc95c20bdf518bd5f',
            secret:'ec1c7bc4e2161ecd3027c86d8d74565b'
        }
    }).then(function (userinfo) {
        console.log(userinfo.data);
        if(userinfo.data.access_token){
            console.log("accesstoken: 获取到token" + userinfo.data.access_token);
            client.set('accesstoken', userinfo.data.access_token, function(error, res) {
                if(error) {
                    console.log(error);
                } else {
                    console.log(res);
                    console.log("accesstoken： 开始设置时间 ");
                    client.expire('accesstoken', 120*60*1000);//这里时间多一些，这样获取的时候这个token还在
                }
            });
        }


    });
}

refreshAccessToken();

module.exports = app;
