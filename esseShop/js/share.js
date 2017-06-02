
$(function () {
    //made in leiqi
    var _qzoneurl = "#";
    var qqOrWx = "";
    var qqOrWxName = "";
    var _weibourl = "http://service.weibo.com/share/share.php?url=" + top.location.href + "&title=" + document.title + "&appkey=1343713053&searchPic=true";//微博的地址
    if (IsWeiXin()) {
        _qzoneurl = "#";
        qqOrWxName = "微信朋友圈";
        qqOrWx = "icon-share-qzone";
    } else {
        _qzoneurl = "http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=" + top.location.href + "&title=" + document.title + "&desc=&summary=&site=";//qq空间的地址
        qqOrWx = "icon-share-qqzone";
        qqOrWxName = "QQ空间";
    }

    var _qqweibourl = "http://s.share.baidu.com/?click=1&url=" + top.location.href + "&uid=0&to=tqq&type=text&pic=&title=" + document.title + "&key=&desc=&comment=&relateUid=&searchPic=0&sign=on&l=19ulcjik119ulcjjj919ulfuffc&linkid=ieasrtit3v9&firstime=";//微博腾讯
    var _qqurl = "http://connect.qq.com/widget/shareqq/index.html?url=" + top.location.href + "&title=" + document.title + "&desc=&summary=&site=baidu";//qq的地址
    var _titlename = ""//分享内容标题
    var _sharlink = ""//分享内容的连接
    window._bd_share_config = { "common": { "bdSnsKey": {}, "bdText": "", "bdMini": "2", "bdMiniList": false, "bdPic": "", "bdStyle": "0", "bdSize": "16" }, "share": {} }; with (document) 0[(getElementsByTagName('head')[0] || body).appendChild(createElement('script')).src = 'http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion=' + ~(-new Date() / 36e5)];
    $("body").append("<div  class='share'> </div>");
    $(".share").prepend("<div class='share_bg'></div>");
    $(".share").append("<div class='share_com'></div>");
    $(".share_com").prepend("<h2>分享给好友</h2>");
    $(".share_com").append("<ul></ul> ");
    $(".share_com ul").append(" <li><a  class='icon-share-weibo bds_tsina'  href='" + _weibourl + "' data-cmd='tsina'><i></i>微博</a> </li> <li><a class='" + qqOrWx + "' href='" + _qzoneurl + "'><i></i>" + qqOrWxName + "</a> </li> " + "<li><a  class='icon-share-qqweibo' href='" + _qqweibourl + "'><i></i>腾讯微博</a> </li> <li><a  class='icon-share-qq' href='" + _qqurl + "'><i></i>qq好友</a> </li> ")
    $(".share_com").append("<p><a href='javascript:;' class='btn_2'>取消</a></p>")


    var d = document.documentElement.clientHeight;
    $(".btn_2").click(function () {
        $(".share_bg").hide();
        $(".share_com").animate({ bottom: -80 }).hide();
        $("body").height(d).css("overflow", "auto");

    });

    $(".header_share").click(function () {
        $(".share_bg").show();
        $(".share_com").animate({ bottom: 0 }).show();
        $("body").height(d).css("overflow", "hidden");

    })

    $(".share_div").height(d);
    $(".icon-share-qzone").click(function () {
        if (IsWeiXin()) {
            $(".share_div").show();
        }
    });
    $(".share_div").click(function () {
        $(".share_div").fadeOut();
    })
});
function IsWeiXin() {
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return true;
    } else {
        return false;
    }
}