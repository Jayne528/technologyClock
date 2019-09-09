
window.onload = function() {

    //環境變數
    var updateFPS = 30;
    var showMouse = true;
    var time = 0;
    var bgcolor = "black";

    //控制
    var controls = {
        value : 0,
    }

    // var gui = new dat.GUI();
    // gui.add(controls, "value", -2, 2).step(0.01).onChange(function(value) {

    // });

    //--------------vec2 向量------------------

    class Vec2 {
        constructor(x, y){
            this.x = x || 0;
            this.y = y || 0;
        }

        set(x, y) {
            this.x = x;
            this.y = y;
        }
        
        move(x, y) {
            this.x += x;
            this.y += y;
        }

        add(v) {
            return new Vec2(this.x + v.x, this.y + v.y)
        }
        sub(v) {
            return new Vec2(this.x - v.x, this.y - v.y)
        }
        mul(s) {
            return new Vec2(this.x*s, this.y*s)
        }

        //新的向量長度
        set length(nv) {
            var temp = this.unit.mul(nv); //this.unit.mul(nv) 是1
            this.set(temp.x, this.y);
        }

        get length() {
            return Math.sqrt(this.x*this.x + this.y*this.y);
        }

        clone() {
            return new Vec2(this.x, this.y);
        }
        //轉成字串
        toString() {
            // return "("+this.x+","+this.y+")";
            return `(${this.x}, ${this.y})`;
        }
        //比較
        equal(){
            return this.x == v.x && this.y == v.y;
        }

        get angle() {
            return Math.atan2(this.y, this.x);
        }

        get unit() {
            return this.mul(1/this.length);
        }


    }
//------------------------------------------------------------
    var canvas = document.getElementById("canvas");
    var cx = canvas.getContext("2d");
   
    //設定畫圓
    cx.circle = function(v, r) {
        this.arc(v.x, v.y, r, 0, Math.PI*2);
    }
    //設定畫線
    cx.line = function (v1, v2) {
        this.moveTo(v1.x, v1.y);
        this.lineTo(v2.x, v2.y);

    }

    // canvas的設定
    function initCanvas() {
 
        ww = canvas.width = window.innerWidth;
        wh = canvas.height =window.innerHeight;
    }
    initCanvas();

    var degToPi = Math.PI/180;
    class Circle {
        constructor(args) {
            var def = {
                p: new Vec2(),
                r: 100,
                color: "white",
                //預設都是會連起來
                lineTo: function(obj, i) {
                    return true;
                },
                //預設線粗度1
                getWidth: function (obj, i) {
                    return 1;
                },
                //預設角度不會旋轉
                anglePan: function (obj, i) {
                    return 0;
                },
                //是否為垂直線
                vertical: false,
                //垂直線段長度
                getVerticalWidth: function (obj, i) {
                    return 2;
                },
                // sin 波震幅
                ramp: 0,

            }
            Object.assign(def,args);
            Object.assign(this,def);
        }
        draw() {
            cx.beginPath();
            for (var i =1; i<=360;i++) {
                var angle1 = i + this.anglePan();
                var angle2 = i-1 + this.anglePan();

                // use_r 做不同變化 有不同效果
                var use_r = this.r + this.ramp*Math.sin(i/10);
                var use_r2 = this.r + this.ramp*Math.sin((i-1)/10);

                var x1 = use_r * Math.cos(angle1*degToPi);
                var y1 = use_r * Math.sin(angle1*degToPi);
                
                var x2 = use_r2 * Math.cos(angle2*degToPi);
                var y2 = use_r2 * Math.sin(angle2*degToPi);

                if(this.lineTo(this,i)) {
                    cx.beginPath();
                    cx.moveTo(x1, y1);
                    cx.lineTo(x2, y2);
                    cx.strokeStyle = this.color;;
                    cx.lineWidth = this.getWidth(this,i);
                    cx.stroke();
                }

                if (this.vertical) {

                    var l = this.getVerticalWidth(this,i);
                    var x3 = (use_r + l)* Math.cos(angle1*degToPi);
                    var y3 = (use_r + l)* Math.sin(angle1*degToPi);

                    cx.beginPath();
                    cx.moveTo(x1, y1);
                    cx.lineTo(x3, y3);
                    cx.strokeStyle = this.color;
                    cx.stroke();
                }
            }
        }
    }

    var cirs = [];

    //邏輯的初始化
    function init() {
        cirs.push(new Circle({
            r:150,
            color: "rgba(255, 255, 255, 0.4)",
        }));
        cirs.push(new Circle({
            r:220,
            //odj 物件本身， i物件第幾個，i % 2 ==0 是true 才畫線 ，(i % 10 < 5) 粗虛線
            lineTo: function(obj, i) {
                return (i % 2 ==0);
            },
            color: "rgba(255, 255, 255, 0.4)",
        }));
        cirs.push(new Circle({
            r:80,
            lineTo: function(obj, i) {
                return !(i % 180 < 30);
            },
        }));
        cirs.push(new Circle({
            r:320,
            ramp:15,
            color: "rgba(255, 255, 255, 0.8)",
        }));
        cirs.push(new Circle({
            r:190,
            getWidth:function(obj,i) {
                return i%150 <50 ?5:1;  //每150度如果小於50，就傳回5，不是就傳回1
            },
            color: "rgba(255, 255, 255, 0.8)",
            anglePan: function(obj, i) {
                //來回移動
                return -40*Math.sin(time/200)
            }
        }));
        cirs.push(new Circle({
            r:300,
            lineTo:function(obj,i) {
                return false;
            },
            vertical: true,
            getVerticalWidth: function(obj, i) {
                if (i%10 == 0) {
                    return 10 
                }
                if (i%5 == 0) {
                    return 5 
                }
               
                return 2 
                
            },
            color: "rgba(255, 255, 255, 0.8)",
            anglePan: function(obj, i) {
                //來回移動
                return 40*Math.sin(time/200)
            }
        }));
        cirs.push(new Circle({
            r:280,
            lineTo:function(obj, i) {
                return i%50 == 0;
            },
            getWidth: function(obj, i) {
                return 10;
            },
            anglePan: function(obj, i) {
                return (-time/20)%5;
            },
            color: "rgba(255, 255, 255, 0.8)",
        }));


    }

    //遊戲邏輯的更新
    function update() {

        time++;
    }

    //畫面更新
    function draw() {

        //清空背景
        cx.fillStyle = bgcolor;
        cx.fillRect(0, 0, ww, wh);

        //----在這繪製--------------------------------

        cx.save();
            cx.translate(ww/2, wh/2);
            cirs.forEach(function(cir) {
                cx.save();
                    var pan = mousePos.sub(new Vec2(ww/2, wh/2)).mul(2/cir.r);
                    cx.translate(pan.x, pan.y);
                  cir.draw();
                cx.restore();
            })

            cx.fillStyle = "white";
            cx.fillRect(0, -20, 100, 20);
            cx.fillStyle = "black";
            cx.fillText(Date.now(), 5, -5);

            var h = new Date().getHours();
            var m = new Date().getMinutes();
            var s = new Date().getSeconds();

            //時鐘角度
            //時針
            var angleHour = degToPi*360/12 *h - Math.PI/2;
            cx.beginPath();
            cx.moveTo(0, 0);
            cx.lineTo(50*Math.cos(angleHour), 50*Math.sin(angleHour));
            cx.lineWidth = 5;
            cx.strokeStyle = "red";
            cx.stroke();

            //分針
            var angleMinute = degToPi*360/60 * m - Math.PI/2;
            cx.beginPath();
            cx.moveTo(0, 0);
            cx.lineTo(100*Math.cos(angleMinute), 100*Math.sin(angleMinute));
            cx.lineWidth = 2;
            cx.strokeStyle = "white";
            cx.stroke();

            //秒針
            var angleSecond = degToPi*360/60 * s - Math.PI/2;
            cx.beginPath();
            cx.moveTo(0, 0);
            cx.lineTo(140*Math.cos(angleSecond), 140*Math.sin(angleSecond));
            cx.lineWidth = 1;
            cx.strokeStyle = "white";
            cx.stroke();

        cx.restore();

        var crosses = [
            new Vec2(50, 50),
            new Vec2(ww-50, 50),
            new Vec2(50, wh-50),
            new Vec2(ww-50, wh-50),
        ]

        crosses.forEach(function(cross) {

            cx.beginPath();
            cx.save();
                cx.translate(cross.x, cross.y);
                cx.moveTo(-10, 0);
                cx.lineTo(10, 0);
                cx.moveTo(0, -10);
                cx.lineTo(0, +10);
                cx.lineWidth = 2;
                cx.strokeStyle = "white";
                cx.stroke();
           

            cx.restore();
        })



        //----------------------------------------

        //滑鼠
        cx.fillStyle = "red";
        cx.beginPath();
        cx.circle(mousePos,3);
        cx.fill();

        //滑鼠線
        cx.save();
            cx.beginPath();
            cx.translate(mousePos.x, mousePos.y);
              
                cx.strokeStyle = "red";
                var len = 20;
                cx.line(new Vec2(-len, 0), new Vec2(len, 0));

                cx.fillText (mousePos, 10, -10);
                cx.rotate(Math.PI/2);
                cx.line(new Vec2(-len, 0), new Vec2(len, 0));
                cx.stroke();

        cx.restore();

        requestAnimationFrame(draw)
    }

    //頁面載完依序呼叫
    function loaded() {

        initCanvas();
        init();
        requestAnimationFrame(draw);
        setInterval(update, 1000/updateFPS);
    }

    // window.addEventListener('load', loaded);
    //頁面縮放
    window.addEventListener('resize', initCanvas);


    //滑鼠 事件更新
    var mousePos = new Vec2(0, 0);
    var mousePosDown = new Vec2(0, 0);
    var mousePosUP = new Vec2(0, 0);

    window.addEventListener("mousemove",mousemove);
    window.addEventListener("mouseup",mouseup);
    window.addEventListener("mousedown",mousedown);

    function mousemove(evt) {
        // mousePos.set(evt.offsetX, evt.offsetY);
        mousePos.set(evt.x, evt.y);
        

    }
    function mouseup(evt) {
        // mousePos.set(evt.offsetX, evt.offsetY);
        mousePos.set(evt.x, evt.y);
        mousePosUP = mousePos.clone();
        
    }
    function mousedown(evt) {
        // mousePos.set(evt.offsetX, evt.offsetY);
        mousePos.set(evt.x, evt.y);
        mousePosDown = mousePos.clone();
    }

    loaded();
}
