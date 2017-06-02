$(function () {
    var mySwiper = new Swiper ('.swiper-container', {
        autoplay: 5000,//可选选项，自动滑动
        loop: true,
        // 如果需要分页器
        pagination: '.swiper-pagination',
        paginationClickable: true

    });


    function changeDiv(isFocus) {
        $('.home').fadeToggle();
        $('.search').fadeToggle();
        isFocus? $('.search .iptContainer input').focus():
                $('.search .iptContainer input').blur();
    }
    $('.home .header .iptContainer').click(changeDiv.bind(this,true));
    $('.search .header_back').click(changeDiv.bind(this,false));

    
    function shortcutSwitch(isShow) {
        var ndShade=$(".header .header_shade"),
            ndUl=$(".header .header_shortcut"),
            ulHeight=0;


        ndShade.toggle(200);

        if(isShow){
            var ndLi=ndUl.children('li');
            ulHeight=ndLi.length*(parseFloat(ndLi.css("height")));

            ndUl.show().animate({
                height:ulHeight+"px"
            });
        }else {

            ndUl.animate({
                height:ulHeight+"px"
            },function () {
                this.hide();
            }.bind(ndUl));
        }



    }
    $(".header .header_shade").click(shortcutSwitch.bind(this,false));
    $(".header .header_home").click(shortcutSwitch.bind(this,true));


});