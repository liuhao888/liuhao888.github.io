$(function () {



    // 删除按钮显示
    $('.iptContainer input').on('input',function () {
        var deleteText=$(this).siblings('.deleteText');
        deleteText[0].style.display=this.value==""?'none':'block'
    });
    // 删除按钮事件
    $('.iptContainer .deleteText').click(function () {
        $(this).siblings('input').val('');
        $(this).hide();
    });


    $('.user_img img').click(function () {
        var index=$(this).index();
        $('#shade .shade_header .num-index').html(index+1);
        // 设置容器的偏移量
        $('#shade .shade_body ul').css('left',-index*window.innerWidth+'px');
        shade.style.display='block';
    });

    $('#shade .shade_header .shade_back').click(function () {
        shade.style.display='none';
    });
});


var slider = {
    //判断设备是否支持touch事件
    touch:('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch,
    slider:$('#shade .shade_body ul')[0],

    //事件
    events:{
        slider:$('#shade .shade_body ul')[0],     //this为slider对象
        icons:parseInt($('.num-count').html()),
        icon:$('.num-index'),
        index:0,     //显示元素的索引
        imgWidth:window.innerWidth,

        handleEvent:function(event){
            var self = this;     //this指events对象
            if(event.type == 'touchstart'){
                self.start(event);
            }else if(event.type == 'touchmove'){
                self.move(event);
            }else if(event.type == 'touchend'){
                self.end(event);
            }
        },

        //滑动开始
        start:function(event){
            this.index=parseInt(this.icon.html())-1;

            var touch = event.targetTouches[0];     //touches数组对象获得屏幕上所有的touch，取第一个touch
            startPos = {x:touch.pageX,y:touch.pageY,time:+new Date};    //取第一个touch的坐标值
            isScrolling = 0;   //这个参数判断是垂直滚动还是水平滚动
            this.slider.addEventListener('touchmove',this,false);
            this.slider.addEventListener('touchend',this,false);
        },
        //移动
        move:function(event){
            //当屏幕有多个touch或者页面被缩放过，就不执行move操作
            if(event.targetTouches.length > 1 || event.scale && event.scale !== 1) return;
            var touch = event.targetTouches[0];
            endPos = {x:touch.pageX - startPos.x,y:touch.pageY - startPos.y};
            isScrolling = Math.abs(endPos.x) < Math.abs(endPos.y) ? 1:0;    //isScrolling为1时，表示纵向滑动，0为横向滑动
            if(isScrolling === 0){
                event.preventDefault();      //阻止触摸事件的默认行为，即阻止滚屏
                this.slider.className = '';
                this.slider.style.left = -this.index*this.imgWidth + endPos.x + 'px';
            }
        },
        //滑动释放
        end:function(event){
            var duration = +new Date - startPos.time;    //滑动的持续时间

            if(isScrolling === 0){    //当为水平滚动时

                if(Number(duration) > 10){
                    //判断是左移还是右移，当偏移量大于10时执行
                    if(endPos.x > 10){
                        if(this.index !== 0) this.index -= 1;
                    }else if(endPos.x < -10){
                        if(this.index !== this.icons-1) this.index += 1;
                    }
                }

                this.icon.html(this.index+1);

                this.slider.className = 'f-anim';
                this.slider.style.left = -this.index*this.imgWidth + 'px';
            }

            //解绑事件
            this.slider.removeEventListener('touchmove',this,false);
            this.slider.removeEventListener('touchend',this,false);
        }
    },

    //初始化
    init:function(){
        var self = this;     //this指slider对象
        if(!!self.touch) self.slider.addEventListener('touchstart',self.events,false);    //addEventListener第二个参数可以传一个对象，会调用该对象的handleEvent属性

        // 初始化高度
        var
            ul=$('#shade .shade_body ul'),
            li=ul.children('li'),
            parWidht=window.innerWidth;

        li.width(parWidht);
        ul.width(ul.children().length*parWidht);

        this.events.icons = parseInt($('.num-count').html());
    }
};


function adapt(designWidth, rem2px){
    var d = window.document.createElement('div');
    d.style.width = '1rem';
    d.style.display = "none";
    var head = window.document.getElementsByTagName('head')[0];
    head.appendChild(d);
    var defaultFontSize = parseFloat(window.getComputedStyle(d, null).getPropertyValue('width'));
    d.remove();
    document.documentElement.style.fontSize = window.innerWidth / designWidth * rem2px / defaultFontSize * 100 + '%';
    var st = document.createElement('style');
    var portrait = "@media screen and (min-width: "+window.innerWidth+"px) {html{font-size:"+ ((window.innerWidth/(designWidth/rem2px)/defaultFontSize)*100) +"%;}}";
    var landscape = "@media screen and (min-width: "+window.innerHeight+"px) {html{font-size:"+ ((window.innerHeight/(designWidth/rem2px)/defaultFontSize)*100) +"%;}}"
    st.innerHTML = portrait + landscape;
    head.appendChild(st);
    return defaultFontSize
}
var defaultFontSize = adapt(750, 100);