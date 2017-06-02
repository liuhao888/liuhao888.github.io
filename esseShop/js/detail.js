

$(function () {

    $('.header .header_collect').click(function (e) {
        e.preventDefault();
        $(this).toggleClass('accomplish');
    });
    
    var scrH=$(window).height(); //获取屏幕高度
    //弹出二维码
    $('.header .header_share').click(function(){
    	$('body,html').css({'height':scrH,'overflow':'hidden'});
    	$('.share_bg').css('height',scrH).show();
    	$('.share_com').show();
    	QRcode();
    })
    //取消 关闭二维码
    $('.share_com .share_off').click(function(){
    	$('body,html').css({'height':'auto','overflow':'visible'});
    	$('.share_bg').hide();
    	$('.share_com').hide();
    	$('.share_com .share_code img').remove();
    })
    //点击 屏幕其他位置
    $('.share .share_bg').click(function(){
    	console.log(1111)
    	$('body,html').css({'height':'auto','overflow':'visible'});
    	$('.share_bg').hide();
    	$('.share_com').hide();
    	$('.share_com .share_code img').remove();
    })
    //二维码方法
    function QRcode() {
        var container=$(".share_com .share_code");

    // 生成二维码
        container.qrcode({
            text: "http://baidu.com",
            width: 500,
            height: 500
        });
        var imgSrc = $('canvas').hide()[0].toDataURL("image/png");
        var img=new Image;
        img.src=imgSrc;
        container.append(img);
        container.css('height',container.width());
    }
    
    slider.init();

});




