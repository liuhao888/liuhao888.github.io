"use strict";
function setCookie(cname,val){
    var date=new Date();
    date.setDate(date.getDate()+14);
    document.cookie=cname+"="+val+";expires="+date.toGMTString();
}
function getCookie(cname){
    var str=document.cookie;
    //在str中查找cname的位置i
    var i=str.indexOf(cname);
    //如果i!=-1
    if(i!=-1){
        //i+cname的字符个数+1
        i+=cname.length+1;
        //查找str中i之后下一个;的位置endi
        var endi=str.indexOf(";",i);
        //返回：截取str中i到endi的子字符串
        return str.slice(i,endi!=-1?endi:str.length);
    }
}
var game ={
    ctx:null,
    canvas:null,

    data:null,//保存r行*c列的二维数组
    saveData:null,
    RN:4,
    CN:4,
    CSIZE:100,//保存格子的大小
    OFFSET:16,
    score:0,//保存当前得分
    top:0,//保存最高分
    state:1,//保存游戏状态
    RUNNING:1,
    GAMEOVER:0,
    PLAYING:2,//动画播放中
    //强调：
    //1.对象自己的方法，用到对象自己的属性，必须加this
    //2.每个属性和方法之间都要用逗号分隔
    init:function(){
        //得到保存在cookie中的 最高分
        this.top=getCookie("top")||0;

        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');


        //计算容器宽度CN*(CSIZE+OFFSET)+OFFSET
        this.canvas.width=this.CN*(this.CSIZE+this.OFFSET)+this.OFFSET;
        //计算容器高度RN*(CSIZE+OFFSET)+OFFSET
        this.canvas.height=this.RN*(this.CSIZE+this.OFFSET)+this.OFFSET;


    },
    start:function(){//启动游戏
        this.init();
        this.score=0;//重置分数为0
        this.state=this.RUNNING;//重置游戏状态为RUNNING
        //创建空数组保存到data中
        this.data=[];
        this.saveData=[];
        //r从0开始，到RN结束；向data中压入一个空数组
        for(var r=0;r<this.RN;r++){
            this.data.push([]);
            this.saveData.push([]);
            //c从0开始，到 <CN结束；向data中r行的组数组压入一个0
            for(var c=0;c<this.CN;c++){
                this.data[r].push(0);
                this.saveData[r].push(0);
            }
        }

        //调用randomNum随机生成一个数
        this.randomNum();
        //调用randomNum随机生成一个数
        this.randomNum();
        //调用updateView方法，将data数据更新到页面

        this.updateView();

        //为当前页面绑定键盘按下事件

        document.onkeydown=(function(e){
            //e 事件对象
            //获得按键编号:e.keyCode
            //this--->document
            switch(e.keyCode){
                //编号为37，就moveLeft
                case 37:this.moveLeft(); break;
                //编号为38，就moveUp
                case 38:this.moveUp();break;
                //编号为39，就moveRight
                case 39:this.moveRight(); break;
                //编号为40，就moveDown
                case 40:this.moveDown();break;
            }
        }.bind(this));//this--->game


    },
    //在data中一个随机的空位置生成2或4
    randomNum:function(){
        while(true){//反复
            //在0~RN-1之间生成一个随机整数，保存在r中
            var r=parseInt(Math.random()*this.RN);
            //在0~CN-1之间生成一个随机整数，保存在c中
            var c=parseInt(Math.random()*this.CN);
            //如果data中r行c列为0，将data中r行c列赋值为：
            if(this.data[r][c]==0){
                //0~1随机生成一个小数，如果<0.5 ？就赋值为2，否则就赋值为4
                this.data[r][c]=Math.random()<0.5?2:4;
                break;//退出循环
            }
        }
    },

    updateView:function(){
        this.drawBackground();
        //遍历data：
        for(var r=0,bgColor,w=0,fs,x,y;r<this.RN;r++){
            for(var c=0;c<this.CN;c++){
                //如果data中r行c列不是0，
                if(this.data[r][c]!=0){
                    // 配置颜色
                    switch (this.data[r][c]){
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

                    x=this.OFFSET+(this.OFFSET*c+c*this.CSIZE);
                    y=this.OFFSET+(this.OFFSET*r+r*this.CSIZE);

                    this.drawRoundedRect(x,y,this.CSIZE,this.CSIZE,6,bgColor);


                    if(this.data[r][c]===2 || this.data[r][c]===4){
                        this.ctx.fillStyle = bgColor="#776e65";
                        fs=60;
                    }else {
                        this.ctx.fillStyle = bgColor="#fff";
                        fs=40;
                    }

                    this.ctx.font=fs+"px SimHei";
                    w=this.ctx.measureText(this.data[r][c]).width;
                    this.ctx.fillText(this.data[r][c],x+this.CSIZE/2-w/2,y+this.CSIZE/2+fs/2);

                }
            }
        }

        document.getElementById("score").innerHTML=this.score;
        //找到id为top的div，设置其内容为top
        document.getElementById("top").innerHTML=this.top;
        /*

        //如果游戏状态为GAMEOVER
        if(this.state==this.GAMEOVER){
            //设置gameOver的style的display为block
            gameOver.style.display="block";
            //找到id为fScore的span，设置其内容为score
            document.getElementById("fScore").innerHTML=this.score;
        }else{
            //否则，设置gameOver的style的display为none
            gameOver.style.display="none";
        }
        */

    },
    
    
    moveLeft:function(){//左移所有行

        this.move(
            function(){
                for(var r=0;r<this.RN;r++){
                    //调用moveLeftInRow左移第r行
                    this.moveLeftInRow(r);
                }
            }.bind(this)
        );

    },
    moveLeftInRow:function(r){
        //左移第r行
        //遍历data中r行每个元素到<CN-1结束
        for(var c=0;c<this.CN-1;c++){
            //查找data中r行c列位置右侧下一个不为0的位置,保存在nextc中
            var nextc=this.getNextInRow(r,c);
            //如果nextc等于-1，就退出循环
            if(nextc==-1){break;}
            else{//否则
                //如果data中r行c列的值为0
                if(this.data[r][c]==0){
                    //将nextc位置的值替换为c位置的值
                    this.data[r][c]=this.data[r][nextc];
                    animation.addTask(r,c,r,nextc);
                    //目标位置r,c  起始位置r ,nextc
                    //将nextc位置的值置为0
                    this.data[r][nextc]=0;
                    //将c的值留在原地
                    c--;
                }
                //否则,如果c位置的值等于nextc位置的值
                else if(this.data[r][c]==this.data[r][nextc]){
                    //将c位置的值*2
                    this.data[r][c]*=2;
                    animation.addTask(r,c,r,nextc);
                    this.score+=this.data[r][c];
                    //将nextc位置的值置为0
                    this.data[r][nextc]=0;
                }
            }
        }
    },
    getNextInRow:function(r,c){
        //查找r行c列右侧下一个不为0的位置
        //nextc从c+1开始，遍历data中r行的每个元素，到<CN结束
        for(var nextc=c+1;nextc<this.CN;nextc++){
            //如果nextc位置的值不为0，返回nextc
            if(this.data[r][nextc]!=0)
                return nextc;
        }
        return -1;//遍历结束，返回-1
    },
    move:function(fun){
        if(this.state=this.RUNNING){
            for(var r=0;r<this.data.length;r++){
                for(var c=0;c<this.data[r].length;c++){
                    this.saveData[r][c]=this.data[r][c];
                }
            }


            var before=String(this.data);
            //遍历data中每一行
            fun();
            //遍历之后，为data拍照保存在after中
            var after=String(this.data);
            //如果发生了变化before!=after
            if(before!=after){
                //修改游戏状态为PLAYING
                this.state=this.PLAYING;
                //启动动画

                animation.play(
                    function(){
                        //调用randomNum生成随机数
                        this.randomNum();
                        //如果游戏结束，就修改游戏状态为GAMEOVER

                        if(this.isGameOver()){
                            this.state=this.GAMEOVER;
                            //如果score>top
                            if(this.score>this.top){
                                //设置cookie中的top变量，值为score
                                setCookie("top",this.score);
                            }
                        }

                        this.updateView();//更新页面
                        this.state=this.RUNNING;//修改状态回RUNNING
                    }.bind(this)
                );

                console.log(this.data.join("\n"))
            }
        }
    },


    isGameOver:function(){
        //遍历data
        for(var r=0;r<this.RN;r++){
            for(var c=0;c<this.CN;c++){
                //如果当前元素是0，返回false
                if(this.data[r][c]==0){return false;}
                //如果c<CN-1&&当前元素等于右侧元素，返回false
                if(c<this.CN-1&&this.data[r][c]==this.data[r][c+1]){return false;}
                //如果r<RN-1&&当前元素等于右侧元素，返回false
                if(r<this.RN-1&&this.data[r][c]==this.data[r+1][c]){return false;}
            }
        }
        //遍历结束，返回
        return true;
    },
    moveRight:function(){
        this.move(
            function(){
                for(var r=0;r<this.RN;r++){
                    //调用moveLeftInRow左移第r行
                    this.moveRightInRow(r);
                }
            }.bind(this)
        );
    },
    moveRightInRow:function(r){

        for(var c=this.CN-1;c>0;c--){
            var prevc=this.getPrevInRow(r,c);
            if(prevc==-1){break;}
            else{
                if(this.data[r][c]==0){
                    this.data[r][c]=this.data[r][prevc];
                    animation.addTask(r,c, r,prevc);
                    this.data[r][prevc]=0;
                    c++;
                }else if(this.data[r][c]==this.data[r][prevc]){
                    this.data[r][c]*=2;
                    animation.addTask(r,c, r,prevc);
                    this.score+=this.data[r][c];
                    this.data[r][prevc]=0;
                }
            }
        }
    },
    getPrevInRow:function(r,c){

        for(var prevc=c-1;prevc>=0;prevc--){
            if(this.data[r][prevc]!=0){
                return prevc;
            }
        }
        return -1;
    },

    moveUp:function(){
        this.move(
            function(){
                for(var c=0;c<this.CN;c++){
                    this.moveUpInCol(c);
                }
            }.bind(this)
        );
    },
    moveUpInCol:function(c){
        for(var r=0;r<this.RN-1;r++){
            var nextr=this.getNextInCol(r,c);
            if(nextr==-1){break;}
            else{
                if(this.data[r][c]==0){
                    this.data[r][c]=this.data[nextr][c];
                    animation.addTask(r,c, nextr,c);
                    this.data[nextr][c]=0;
                    r--;
                }
                else if(this.data[r][c]==this.data[nextr][c]){
                    this.data[r][c]*=2;
                    animation.addTask(r,c, nextr,c);
                    this.score+=this.data[r][c];
                    this.data[nextr][c]=0;
                }
            }
        }
    },
    getNextInCol:function(r,c){
        for(var nextr=r+1;nextr<this.RN;nextr++){
            if(this.data[nextr][c]!=0)
                return nextr;
        }
        return -1;
    },

    moveDown:function(){
        this.move(
            function(){
                for(var c=0;c<this.CN;c++){
                    this.moveDownInCol(c);
                }
            }.bind(this)
        );
    },
    moveDownInCol:function(c){
        for(var r=this.RN-1;r>0;r--){
            var prevr=this.getPrevInCol(r,c);
            if(prevr==-1){break;}
            else{
                if(this.data[r][c]==0){
                    this.data[r][c]=this.data[prevr][c];
                    animation.addTask(r,c, prevr,c);
                    this.data[prevr][c]=0;
                    r++;
                }else if(this.data[r][c]==this.data[prevr][c]){
                    this.data[r][c]*=2;
                    animation.addTask(r,c, prevr,c);
                    this.score+=this.data[r][c];
                    this.data[prevr][c]=0;
                }
            }
        }
    },
    getPrevInCol:function(r,c){
        for(var prevr=r-1;prevr>=0;prevr--){
            if(this.data[prevr][c]!=0)
                return prevr;
        }
        return -1;
    },

    // 绘制圆角矩形
    drawRoundedRect:function (x,y,w,h,r,bgColor) {
        this.ctx.beginPath();
        this.ctx.fillStyle = bgColor;
        this.ctx.moveTo(x+r,y);

        this.ctx.arcTo(x+w,y,x+w,y+h,r);
        this.ctx.arcTo(x+w,y+h,x,y+h,r);
        this.ctx.arcTo(x,y+h,x,y,r);
        this.ctx.arcTo(x,y,x+r,y,r);

        this.ctx.fill();
        this.ctx.closePath();
    },
    // 绘制背景
    drawBackground:function () {
        // 抹掉重来
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        // 绘制背景
        this.drawRoundedRect(0,0,this.canvas.width,this.canvas.height,10,"#bbada0");
        // 背景格子
        for(var r=0,x=0,y=0;r<this.RN;r++){
            for(var c=0;c<this.CN;c++){
                x = this.OFFSET+(this.OFFSET*c+c*this.CSIZE);
                y = this.OFFSET+(this.OFFSET*r+r*this.CSIZE);
                this.drawRoundedRect(x,y,this.CSIZE,this.CSIZE ,6,"#ccc0b3");
            }
        }

        this.ctx.textBaseline="bottom";
    }

};



window.onload=function () {
    game.start();
};