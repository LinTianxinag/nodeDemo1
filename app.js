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
var client  = redis.createClient('6379', '116.62.236.103');


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

var refreshAccessToken = function () {
  console.log("启动定时器-------------");
    getAccessToken();
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
        client.select('access_token', function(error){
            if(error) {
                console.log(error);
            } else {
                // set
                client.set('access_token', '0', function(error, res) {
                    if(error) {
                        console.log(error);
                    } else {
                        console.log(res);
                    }
                });
            }
        });

    });
}

refreshAccessToken();

module.exports = app;
