
$(function () {
    // 分类切换
    $('.result_header .handle').click(function (e) {
        if(e){e.stopPropagation();  }//阻止冒泡

        $('.shade').toggle();
        var present=$(this).parent().siblings().children('.active')[0];
        if(present){
            $('.result_header>div>.active').removeClass('active').siblings('.classify').hide();
            $('.shade').show();
        }
        $(this).toggleClass('active');
        $(this).siblings('.classify').fadeToggle();

    });
    $('.shade').click(function () {
        var span=$('.result_header>div>span.active');
        span.removeClass('active');
        span.siblings('.classify').hide();
        $(this).hide();
    });



    // 点击分类
    $('.result_header .classify').on('click','li',function (e) {
        if(e){e.stopPropagation();  }//阻止冒泡


        var parent=$(this).parents('.classify'),
            ul=$(this).parent(),
            span=parent.siblings('.handle');

        span.html($(this).find('.classify_name').html()).removeClass('active');

        ul.find('.active').removeClass('active');
        $(this).addClass('active');
        parent.hide();
        $('.shade').hide();

        // 将当前li排到最前

        ul.addClass('stick');

    });


    $('.result_header .classify').each(function (i,elem) {
        var li=$(elem).find('li'),liHeight=li.height();
        if(li.length*liHeight > window.innerHeight-liHeight*3){
            elem.style.height=window.innerHeight+'px';
            $(elem).addClass('allResult-classify');
        }
    });

});