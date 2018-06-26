/**
 * Created by Administrator on 2018/6/26.
 */
var refreshAccessToken = function () {
    var refreshInt = setInterval(function () {
        console.log("开始刷新获取新的token");
    },100*60*1000)
}
module.exports = refreshAccessToken;