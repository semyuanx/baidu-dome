(function (document, window) {

    /**
     * 指挥官
     * 我只是负责发号命令
     */
    var Commander = function () {
        this.order = null;
        this.self = new BUS();
    }
    /**
     * 创建飞船的方法
     */
    Commander.prototype.send = function (msg) {
        this.self.Adapter(msg);
    }
    Commander.prototype.getShip = function () {
        return this.self.getSpaceship();
    }

    var contain = document.getElementById("contain");

    /**
     * 新型传达器
     */
    var BUS = function () {
        this.spaceship = [];
        this.error = 0.1;
        this.timer = null;
    }
    BUS.prototype.Adapter = function (msg) {
        // 模拟加密 对象变数组
        var obj = [];
        for (var i in msg) {
            obj.push(msg[i]);
        }
        // 如果是创建飞船 则在地面就可以完成
        if (msg["commond"] === "create") {
            //  判断是否存在该飞船 
            for (var i = 0; i < this.spaceship.length; i++) {
                if (this.spaceship[i].id === msg["id"]) { // 该飞船已经被注册
                    return;
                }
            }
            this.createShip(obj); // 传递加密对象给创建方法

            Animate.resetDOM();

            return;
        }
        // 向飞船发射信号
        this.send(obj)
    }
    // 创建一艘飞船
    BUS.prototype.createShip = function (obj) {
        var ship = new Spaceship();
        ship.Adapter(obj) // 飞船内部进行解密 并且初始化
        ship.BUS = this;
        ship.Render = Animate;
        this.spaceship.push(ship); // 将飞船加入到 指挥中心
    }
    // 广播指挥信号 参数是加密的
    BUS.prototype.send = function (obj) {
        var that = this;

        this.timer = setTimeout(function () {
            var result = Math.random();
            while (result < that.error) {
                Message.show("信号发送失败", "on");
                result = Math.random();
                Message.show("———重新发送———",);
            }

            for (var i = 0; i < that.spaceship.length; i++) {
                that.spaceship[i].Adapter(obj);
            }
            Message.show("信号发送成功");


        }, 300)
    }
    BUS.prototype.getSpaceship = function () {
        return this.spaceship;
    }


    //根据浏览器类型设置相应的requestAnimationFrame
    requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    /**
     * 我是渲染动画类
     */
    var shipDOM = document.getElementById("ship");
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
        var resetDOM = function () {
            var dom = "";
            for (var i = 0; i < ms.length; i++) {
                dom += '<div id="spaceship' + ms[i].id + '" ' +
                    'class="space-ship orbit-ship' + ms[i].id + '">' +
                    '<div></div><p>100%</p>' +
                    '</div>';

            }
            shipDOM.innerHTML = dom;
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
            resetDOM: resetDOM,
            setArr: setArr,
            renderDOM: renderDOM
        }
    })()
    /**
     * 为按钮绑定事件
     */
    var ButtonEnevt = function (commander) {
        var button = document.getElementsByTagName("button");
        var powerRadio = document.getElementsByName("power");
        var energyRadio = document.getElementsByName("energy");
        for (var i = 0; i < button.length; i++) {
            button[i].addEventListener("click", function (e) {

                var id = e.target.id;
                var execs = /^([\w]*)-([\w]*)/.exec(id);
                var obj = { id: execs[2], commond: execs[1] };

                for (var i = 0; i < powerRadio.length; i++) {
                    if (powerRadio[i].checked) {
                        obj["powerValue"] = powerRadio[i].value;
                    }
                    if (energyRadio[i].checked) {
                        obj["energyValue"] = energyRadio[i].value;
                    }
                }

                commander.send(obj)
            })
        }
    }
    /**
     * 消息记录
     */
    var Message = (function () {
        var msgArr = [];
        var dom = document.getElementById("message");
        var show = function (msg, on) {
            var on = on || "";
            msgArr.push(msg); // 总记录
            var msg = msgArr.slice(msgArr.length - 1); // 最新的消息
            var li = document.createElement("li");
            if (on) {
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
        console.profile("性能分析")
        ButtonEnevt(sem)
        Animate.setArr(sem)
        Animate.renderDOM();
        console.profileEnd()
    }
})(document, window)