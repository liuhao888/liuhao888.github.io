
$(function () {

    // 获取当前地址城市
    //新浪提供API，未详细测试
    $.getScript('http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js',function(){
        // alert(remote_ip_info.country);//国家
        // alert(remote_ip_info.province);//省份
        $('.positionCity').html('<a href="#">定位城市：<span class="position-city">'+remote_ip_info.city+'</span> </a>')
    });






});
