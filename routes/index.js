var express = require('express');
var router = express.Router();
var sha1 = require('jssha');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/huoChaiRen', function(req, res, next) {
    res.render('huoChaiRen', { title: 'Express' });
});
router.get('/face', function(req, res, next) {
  res.render('face', { title: 'face' });
});
router.get('/wx', function(req, res, next) {
    var token = '3qOCpeh2vimfssLirU';
    var signature = req.param('signature');
    var nonce = req.param('nonce');
    var timestamp = req.param('timestamp');
    var echostr = req.param('echostr');
    var str = [token, timestamp, nonce].sort().join('');
    var sha = sha1(str);

    if (sha === signature) {
        res.send(echostr + '');
    } else {
        res.send("");
    }
});

module.exports = router;
