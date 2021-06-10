/**
 * 定义框架兼容模块
 */
// rem布局框架设置
new function () {
    function change() {
        document.documentElement.style.fontSize = 100 * document.documentElement.clientWidth / 750 + 'px';
    }
    change();
    window.addEventListener('resize', change, false);
};

function resize() {
    var htmlEle = document.documentElement;
    var htmlWidth = window.innerWidth;
    if (!htmlWidth) return;
    if (htmlWidth >= 750) {
        htmlEle.style.fontSize = '100px';
    } else {
        htmlEle.style.fontSize = 100 * (htmlWidth / 750) + 'px';
    }
}
resize();

/**
 * 定义全局公共方法模块
 */
// 获取URL指定参数
function getQueryVariable(variable)
{
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
    }
    return(false);
}

/**
 * 定义全局变量模块
 */
// 定义全局变量
var isFlag  = true;
var page    = 1;
var id      = getQueryVariable('id');
var token   = getQueryVariable('token');
var appId   = getQueryVariable('appId') ? getQueryVariable('appId') : 1;

// 获取当前设备类型
var u = navigator.userAgent;
var phone_type = 'ios';
if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) { // 安卓手机
    phone_type = 'android';
}
