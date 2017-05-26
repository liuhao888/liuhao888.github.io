"use strict";
function Task(r,c,stepL,stepT){
    this.r=r;this.c=c;this.stepL=stepL;this.stepT=stepT;
}
var animation={
    DURATION:500,
    STEPS:200,
    interval:0,
    timer:null,
    moved:0,
    CSIZE:100,
    OFFSET:16,
    tasks:[],//保存要移动的 div和步长
    init:function(){
        this.interval=this.DURATION/this.STEPS;
    },
    addTask:function(endr,endc,startr,startc){
        /// /将要移动的 div和步长添加到数组
        //计算起始到目标的总距离再/步数
        var stepL=(endc-startc)*(this.CSIZE+this.OFFSET)/this.STEPS;
        var stepT=(endr-startr)*(this.CSIZE+this.OFFSET)/this.STEPS;
        this.tasks.push(new Task(startr,startc,stepL,stepT));
    },
    play:function(callback){//启动动画
        /*启动周期性定时器,设置任务为playStep,同时绑定this,同时绑定参数callback,
         时间间隔为interval,序号保存在timer中*/
        this.timer=setInterval(this.playStep.bind(this,callback),this.interval);
    },
    playStep:function(callback){
        game.drawBackground();

        //遍历data：
        for(var r=0,bgColor,w=0,fs,x,y;r<game.RN;r++){
            for(var c=0;c<game.CN;c++){
                //如果data中r行c列不是0，
                if(game.saveData[r][c]!==0){
                    // 配置颜色
                    switch (game.saveData[r][c]){
                        case 2:
                            bgColor="#eee3da";
                            break;
                        case 4:
                            bgColor="#ede0c8";
                            break;
                        case 8:
                            bgColor="#f2b179";
                            break;
                        case 16:
                            bgColor="#f59563";
                            break;
                        case 32:
                            bgColor="#f67c5f";
                            break;
                        case 64:
                            bgColor="#f65e3b";
                            break;
                        case 128:
                            bgColor="#edcf72";
                            break;
                        case 256:
                            bgColor="#edcc61";
                            break;
                        case 512:
                            bgColor="#9c0";
                            break;
                        case 1024:
                            bgColor="#33b5e5";
                            break;
                        case 2048:
                            bgColor="#09c";
                            break;
                        case 4096:
                            bgColor="#a6c";
                            break;
                        case 8192:
                            bgColor="#93c";
                            break;
                    }

                    x=game.OFFSET+(game.OFFSET*c+c*game.CSIZE);
                    y=game.OFFSET+(game.OFFSET*r+r*game.CSIZE);

                    for(var i=0;i<this.tasks.length;i++){
                        if(r===this.tasks[i].r && c===this.tasks[i].c){
                            x+=this.tasks[i].stepL*this.moved;
                            y+=this.tasks[i].stepT*this.moved;
                            break;
                        }
                    }


                    game.drawRoundedRect(x,y,game.CSIZE,game.CSIZE,6,bgColor);


                    if(game.saveData[r][c]===2 || game.saveData[r][c]===4){
                        game.ctx.fillStyle = bgColor="#776e65";
                        fs=60;
                    }else {
                        game.ctx.fillStyle = bgColor="#fff";
                        fs=40;
                    }

                    game.ctx.font=fs+"px SimHei";
                    w=game.ctx.measureText(game.saveData[r][c]).width;
                    game.ctx.fillText(game.saveData[r][c],x+game.CSIZE/2-w/2,y+game.CSIZE/2+fs/2);

                }
            }

        }


        //遍历结束，将moved+1
        this.moved++;
        //如果moved等于STEPS
        if(this.moved==this.STEPS){
            //停止定时器，清除timer,moved归0
            clearInterval(this.timer);
            this.timer=null;
            this.moved=0;
            this.tasks=[];//重置tasks为空数组
            callback();//调用callback
        }

    }
};
animation.init();




