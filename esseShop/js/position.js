
$(function () {

    //获取所有属性，并按字符排序
    var AZ=Object.keys(cityList).sort();
    var str="";

    for(key in AZ){
        str+='<li class="city-'+AZ[key]+'"> <p class="city_title">'+AZ[key]+'</p> <div class="cityContainer "> ';

        for(var i=0;i<cityList[AZ[key]].length;i++){
            // 如果不能选择区县，直接跳转
            // str+='<a href="#" class="city">'+cityList[AZ[key]][i].name+' </a>';

            // 如果可以选择区县
            str+='<div class="city area_container">'+cityList[AZ[key]][i].name+'<div class="areaList"> <a href="#">新都区</a> <a href="#">金牛区</a> <a href="#">郫都区</a> <a href="#">高新区</a> <a href="#">青羊区</a> <a href="#">武侯区</a> </div> </div>';
        }

        str+='</div> </li>';
    }

    $('.selectCity').html(str);

        str="<span class='city-top'>#</span>";
    var i=0,
        top={'top':$('.header').height()},
        attr='';

    for(;i<AZ.length;i++){
        attr=AZ[i];
        str+="<span class='city-"+attr+"'>"+attr+"</span>";
        top[attr]=ltop($('li.city-'+attr)[0]);
    }

    $('.selectBtn').html(str);

    // 输入模糊查找城市
    $('.header .iptContainer input').on('input',function () {
        var obj={},lStr1='',lStr2='',val=$(this).val().toLowerCase(),str='<div class="cityContainer ">';

        if(val==''){
            return false;
        }

        $('.mybody').hide();
        $('.search').show();

        for(var k in cityList){

            for(var i=0;i<cityList[k].length;i++){
                obj=cityList[k][i];
                lStr1=obj.abbr.toLowerCase();
                lStr2=obj.pinyin.toLowerCase();

                if(lStr1.indexOf(val)!=-1 || lStr2.indexOf(val)!=-1 || obj.name.indexOf(val)!=-1){
                    // 如果不能选择区县，直接跳转
                    // str+='<a href="#" class="city">'+obj.name+' </a>';

                    // 如果可以选择区县
                    str+='<div class="city area_container">'+obj.name+'<div class="areaList"> <a href="#">新都区</a> <a href="#">金牛区</a> <a href="#">郫都区</a> <a href="#">高新区</a> <a href="#">青羊区</a> <a href="#">武侯区</a> </div> </div>';
                }

            }

        }

        str+='</div>';
        $('.search .search_body').html(str);

    });
    $('.search .search_back').click(function () {
        $('.mybody').show();
        $('.search').hide();
        $('.header .iptContainer input').val('');
        $('.header .iptContainer .deleteText').hide();
    });


    // 获取当前地址城市
    //新浪提供API，未详细测试
    $.getScript('http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js',function(){
        // alert(remote_ip_info.country);//国家
        // alert(remote_ip_info.province);//省份
        $('.positionCity').html('<a href="#">定位城市：<span class="position-city">'+remote_ip_info.city+'</span> </a>')
    });


    $('.selectCity,.search .search_body').on('click','.area_container',function () {
        $(this).children('.areaList').slideToggle();
    });

    //获取一个元素到页面顶部的高
    function ltop(ele) {
        var mangeTop = 0;
        var pent = ele;
        while (pent.tagName != 'BODY') {
            mangeTop += pent.offsetTop;
            pent = pent.offsetParent;
        }
        return mangeTop;
    }

    // 电梯效果
    $('.selectBtn').on("click","span",function () {
        $('.selectBtn .active').removeClass('active');
        $(this).addClass('active');
        var htm=$(this).html();
        window.scrollTo(0,htm=='#'?0:(top[htm]-top.top));
    });

    // 滑动效果
    window.onscroll = function () {
        var scrollTop2 = document.body.scrollTop || document.documentElement.scrollTop;
        if (scrollTop2 > top.top ) {
            var attr='';
            for(key in top){
                if(scrollTop2 > top[key]-top.top-10){
                    attr=key;
                }else {
                    break;
                }
            }


            $('.selectBtn .active').removeClass('active');
            if((attr=='' || attr=="top")){
                $('.selectBtn .city-top').addClass('active');
            }else {
                $('.selectBtn .city-'+attr).addClass('active');
            }

        }

    };

});
