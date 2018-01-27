(function () {
    /**
     * 基本参数
     */
    var CHARGE_SPEED = [2, 4, 6], //充电速度
        DISCHARGE_SPEED = [2, 4, 6]; //放电速度


    /**
     * 飞船
     */
    var Spaceship = function () {
        this.id = 0;
        this.power = 100; //能量
        this.state = "stop"; // 状态
        this.deg = 0;// 飞船初始位置
        this.timer = null; // 通用计时器
        this.charge_speed = 0; // 充电速度
        this.discharge_speed = 0; // 放电速度
        this.BUS = null;
        this.Render =null;
    }
    /**
     * 飞船解密信号
     */
    Spaceship.prototype.Adapter = function (obj) {
        // 模拟解密 数组到对象 
        var type = {};
        type["id"] = obj[0];
        type["commond"] = obj[1];
        type["powerValue"] = obj[2];
        type["energyValue"] = obj[3];
        // 如果是创建命令
        if (type["commond"] === "create") {
            this.listen("create", type);
            return;
        }
        // 如果id 和我一样 我就执行命令吧
        if (type["id"] === this.id) {
            this.listen(type["commond"], type);
        }


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
                        that.power = 0;   
                        that.powerSystem().stop();
                        return;
                    }
                    that.deg += that.charge_speed; // 飞船角度
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
            destroy: function (id) { 
                if(!that.BUS.spaceship) return;
                for (var i = 0; i < that.BUS.spaceship.length; i++) {
                    if(that.BUS.spaceship[i].id === id){  
                        that.BUS.spaceship.splice(i,1)
                    }
                } 
                that.Render.resetDOM();
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
                that.power += that.charge_speed;
                if (that.power >= 100) {
                    that.power = 100;
                    return;
                }

            },
            expendPower: function () { // 能量消耗
                
                if (that.porwer < 0) {
                    that.porwer = 0;
                    return;
                }
                that.power -= that.discharge_speed;
            }
        }
    }
    /**
     * 信号接收
     */
    Spaceship.prototype.listen = function (message, obj) {

        switch (message) {
            case "create":
                this.id = obj["id"];
                this.charge_speed = CHARGE_SPEED[obj["powerValue"]];
                this.discharge_speed = CHARGE_SPEED[obj["energyValue"]];
                break;
            case "start":

                this.powerSystem().start();
                break;
            case "stop":
                this.powerSystem().stop();
                break;
            case "destroy":
                this.powerSystem().destroy(obj.id);
                break;
            default:
                alert("信号错误")
                break;
        }
    }
    window.Spaceship = Spaceship;
})()