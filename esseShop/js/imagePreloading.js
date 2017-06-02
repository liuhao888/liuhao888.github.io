/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 14-12-12
 * Time: 下午6:10
 * 图片的预加载
 * To change this template use File | Settings | File Templates.
 */
/**************
 * 预加载
 **************/
function _PreLoadImg(b, e) {
    var c = 0,
        a = {},
        d = 0;
    for (src in b) {
        d++;
    }
    for (src in b) {
        a[src] = new Image();
        a[src].onload = function() {
            if (++c >= d) {
                e(a)
            }
        };
        a[src].src = b[src];
    }
}

_PreLoadImg([
    //"pic/043.png",
    "pic/04.png"
    ],function(){
    setTimeout(function(){
        var main = document.getElementById('comment'),
            loader = document.getElementById('loading'),
            container = document.getElementById('container');

        main.removeChild(loader);
        container.style.display = 'block';
    },0);
});
