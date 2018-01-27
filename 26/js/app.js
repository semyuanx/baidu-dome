(function (document, window) {
    /**
     * 基本参数
     */
    var SPACESHIP_SPEED = 1, //飞船速度
        CHARGE_SPEED = 2, //充电速度
        DISCHARGE_SPEED = 1, //放电速度
        POWERBAR_GOOD = '#f70ed3f', // 点亮良好状态颜色
        POWERBAR_BAD = '#fb0000',  // 电量差状态颜色
        FAILURE_RATE = 0.3; // 失败记录


    /**
     * 飞船
     */
    var Spaceship = function (id) {
        this.id = id;
        this.power = 100; //能量
        this.state = "stop"; // 状态
        this.deg = 0;// 飞船初始位置
        this.timer = null; // 通用计时器
    }
    /**
     * 动力系统
     */
    Spaceship.prototype.powerSystem = function () {
        var that = this;
        return {
            start: function () {
                if (that.state == "start") return; // 如果已经在运行了则不可重复运行
                that.state = "start";
                clearInterval(that.timer);
                that.timer = setInterval(function () { // 飞船运行的时间控制器
                    if (that.power <= 0) { // 如果能量用完了 则终止时间控制器    
                        that.powerSystem().stop();
                        return;
                    }
                    that.deg += SPACESHIP_SPEED; // 飞船角度
                    if (that.deg >= 360) that.deg = 0; // 如果角度大于360则重置为0
                    that.energy().expendPower(); // 消耗能量
                }, 100)
            },
            stop: function () {
                if (this.state === "stop") return; // 如果飞船已经处于停滞状态 的不进行后续操作
                that.state = "stop";
                clearInterval(that.timer); // 取消飞船的时间控制器
                if (that.power < 100) { // 如果能量小于100 则在停止状态下增加能量
                    that.timer = setInterval(function () {
                        if (that.power >= 100) {
                            // that.powerSystem().start();
                            clearInterval(that.timer);
                            return;
                        }
                        that.energy().addPower();
                    }, 100);
                }
            },
            destroy: function () {

            }

        }
    }
    /**
     * 能源系统
     */
    Spaceship.prototype.energy = function () {
        var that = this;
        return {
            addPower: function () { // 能量供给
                that.power += CHARGE_SPEED;
                if (that.power >= 100) {
                    that.power = 100;
                    return;
                }

            },
            expendPower: function () { // 能量消耗
                that.power -= DISCHARGE_SPEED;
                if (that.porwer < 0) {
                    that.porwer = 0;
                    return;
                }
            }
        }
    }
    /**
     * 信号接收
     */
    Spaceship.prototype.listen = function (message) {
        switch (message) {
            case "start":
                this.powerSystem().start();
                break;
            case "stop":
                this.powerSystem().stop();
                break;
            case "destroy":
                this.powerSystem().destroy();
                break;
            default:
                alert("信号错误")
                break;
        }
    }



    /**
     * 指挥官
     * 我只是负责发号命令
     */
    var Commander = function () {
        this.order = null;
        this.self = new Mediator();
    }
    /**
     * 创建飞船的方法
     */
    Commander.prototype.send = function (msg) {
        this.self.send(msg);
    }
    Commander.prototype.getShip = function () {
        return this.self.getSpaceship();
    }

    var contain = document.getElementById("contain");
    /**
     * Mediator 
     * 我只是执行命令的下达
     */
    var Mediator = function () {
        this.spaceship = [];
        this.error = 0.3;
    }
    /**
           * 处理长官发过来的指令
           */
    Mediator.prototype.send = function (obj) {

        var that = this;
        setTimeout(function () {  // 模拟指令的延时传达
            var result = Math.random() < that.error;
            switch (obj.commond) {
                case 'create':
                    for (var i = 0; i < that.spaceship.length; i++) {
                        if (that.spaceship[i].id == obj.id) {
                            return;
                        }
                    }
                    if(result){
                        Message.show("发送飞行信号失败","on")
                        return;
                    }
                    var ship = new Spaceship(obj.id);
                    that.spaceship.push(ship);
                    var spaceshipDiv = document.createElement("div");
                    spaceshipDiv.id = "spaceship" + ship.id;
                    spaceshipDiv.className = "space-ship orbit-ship" + ship.id;
                    spaceshipDiv.innerHTML = "<div></div><p>100%</p>";
                    contain.appendChild(spaceshipDiv);

                    Message.show("创建" + (parseInt(ship.id) + 1) + "号飞船成功")
                    break;
                case 'start':
                    for (var i = 0; i < that.spaceship.length; i++) {
                        if (that.spaceship[i].id === obj.id) {
                            if (that.spaceship[i].state === "start") return;
                            if(result){
                                Message.show("发送飞行信号失败","on")
                                return;
                            }
                            that.spaceship[i].listen("start");
                            Message.show("飞船" + (parseInt(obj.id) + 1) + "号开始飞行")
                        }
                    }
                    break;
                case 'stop':
                    for (var i = 0; i < that.spaceship.length; i++) {
                        if (that.spaceship[i].id === obj.id) {
                            if (that.spaceship[i].state === "stop") return;
                            if(result){
                                Message.show("发送停止信号失败","on")
                                return;
                            }
                            that.spaceship[i].listen("stop");
                            Message.show("飞船" + (parseInt(obj.id) + 1) + "号停止")
                        }
                    }

                    break;
                case 'destroy':
                    for (var i = 0; i < that.spaceship.length; i++) {
                        if (that.spaceship[i].id === obj.id) {
                            var dom = document.getElementById("spaceship" + that.spaceship[i].id);
                            that.spaceship.splice(i, 1);
                            dom.parentElement.removeChild(dom);
                            Message.show("飞船" + (parseInt(obj.id) + 1) + "销毁成功")
                        }
                    }
                default:
                    break;
            }
        }, 1000);

    }
    /**
     * 获取飞船
     */
    Mediator.prototype.getSpaceship = function () {
        return this.spaceship;
    }

    //根据浏览器类型设置相应的requestAnimationFrame
    requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    /**
     * 我是渲染动画类
     */
    var Animate = (function () {
        var ms = [];
        var renderDOM = function () {

            setTimeout(function () {
                renderDOM();
            }, 0);

            // requestAnimationFrame(renderDOM);
            drawing()
        }
        var setArr = function (data) {
            ms = data.getShip();
        }
        var drawing = function () {
            if (ms.length < 1) return;

            for (var i = 0; i < ms.length; i++) {
                var ship = document.getElementById("spaceship" + ms[i].id);
                ship.style.webkitTransform = "rotate(" + ms[i].deg + "deg)";
                ship.style.mozTransform = "rotate(" + ms[i].deg + "deg)";
                ship.style.msTransform = "rotate(" + ms[i].deg + "deg)";
                ship.style.oTransform = "rotate(" + ms[i].deg + "deg)";
                ship.style.transform = "rotate(" + ms[i].deg + "deg)";
                ship.firstElementChild.style.width = ms[i].power + "px";
                ship.lastElementChild.innerHTML = ms[i].power + "%";
            }
        }
        return {
            setArr: setArr,
            renderDOM: renderDOM
        }
    })()
    /**
     * 为按钮绑定事件
     */
    var ButtonEnevt = function (commander) {
        var button = document.getElementsByTagName("button");
        for (var i = 0; i < button.length; i++) {
            button[i].addEventListener("click", function (e) {
                var id = e.target.id;
                var execs = /^([\w]*)-([\w]*)/.exec(id);
                var obj = { id: execs[2], commond: execs[1] };
                commander.self.send(obj)
            })
        }
    }
    /**
     * 消息记录
     */
    var Message = (function () {
        var msgArr = [];
        var dom = document.getElementById("message");
        var show = function (msg,on) {
            var on = on || "";
            msgArr.push(msg); // 总记录
            var msg = msgArr.slice(msgArr.length - 1); // 最新的消息
            var li = document.createElement("li");
            if(on){
                li.className = "on";
            }
            li.innerHTML = msg;
            if (dom.childNodes[0]) {
                dom.insertBefore(li, dom.childNodes[0])
            } else {
                dom.appendChild(li);
            }

        }
        return {
            show: show
        }
    })()

    window.onload = function () {
        var sem = new Commander();
        ButtonEnevt(sem)
        Animate.setArr(sem)
        Animate.renderDOM();
    }
})(document, window)