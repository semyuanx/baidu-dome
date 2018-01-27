window.onload = function () {
    /* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

    // 以下两个函数用于随机模拟生成测试数据
    function getDateStr(dat) {
        var y = dat.getFullYear();
        var m = dat.getMonth() + 1;
        m = m < 10 ? '0' + m : m;
        var d = dat.getDate();
        d = d < 10 ? '0' + d : d;
        return y + '-' + m + '-' + d;
    }
    function randomBuildData(seed) {
        var returnData = {};
        var dat = new Date("2016-02-01");
        var datStr = ''
        for (var i = 1; i < 93; i++) {
            datStr = getDateStr(dat);
            returnData[datStr] = Math.ceil(Math.random() * seed);
            dat.setDate(dat.getDate() + 1);
        }
        return returnData;
    }

    var aqiSourceData = {
        "北京": randomBuildData(500),
        "上海": randomBuildData(300),
        "广州": randomBuildData(200),
        "深圳": randomBuildData(100),
        "成都": randomBuildData(300),
        "西安": randomBuildData(500),
        "福州": randomBuildData(100),
        "厦门": randomBuildData(100),
        "沈阳": randomBuildData(500)
    };
    // 用于渲染图表的数据
    var chartData = {};

    // 记录当前页面的表单选项
    var pageState = {
        nowSelectCity: "上海",
        nowGraTime: "day"
    }

    /**
     * 渲染图表
     */
    var histogram = document.getElementById("histogram");
    function renderChart() {
        var dom = "",
            _width, // 每个柱状图宽度
            count = 0,
            heightArr = []; // 统计有多少个数据
        for (var i in chartData) {
            dom += '<span style="color:green"><i>'+i+'</i></span>';
            heightArr.push(chartData[i])
            count++;
        }
        _width = 100 / count; //计算宽度
        histogram.innerHTML = dom; // 容器装载dom节点

        //  设置样式
        for (var j = 0; j < count; j++) {
            var childNode = histogram.childNodes[j];
            childNode.style.width = _width + "%";
            if(pageState.nowGraTime=="day"){
                console.log(childNode.childNodes)
                childNode.style.height = heightArr[j]  + "px";
            }else if(pageState.nowGraTime=="week"){
                childNode.style.height = heightArr[j]/5  + "px";
            }else if(pageState.nowGraTime=="month"){
                childNode.style.height = heightArr[j]/10  + "px";
            }
           
        }
    }
    /**
     * 日、周、月的radio事件点击时的处理函数
     */
    var radio = document.getElementsByName("gra-time");
    function graTimeChange() {
        // 确定是否选项发生了变化    
        var choseVal = this.value;
        if(choseVal!==pageState.nowGraTime){
            pageState.nowGraTime = choseVal;
            initAqiChartData();

        }
    }

    /**
     * select发生变化时的处理函数
     */
    function citySelectChange() {
        // 确定是否选项发生了变化 
        if(this.value!==pageState.nowSelectCity){
            pageState.nowSelectCity = this.value;
            initAqiChartData();
        }
    }

    /**
     * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
     */
    function initGraTimeForm() {
        for(var i = 0;i<radio.length;i++){
            radio[i].addEventListener("click",graTimeChange)
        }
    }

    /**
     * 初始化城市Select下拉选择框中的选项
     */
    function initCitySelector() {
        // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
        var count = 0,
            dom = '';
        // 下拉框容器
        var select_dom = document.getElementById("city-select");
        for (var i in aqiSourceData) {
            dom += '<option id="city' + count + '">' + i + '</option>';
            count++;
        }
        select_dom.innerHTML = dom;
        // 给select设置事件，当选项发生变化时调用函数citySelectChange
        select_dom.addEventListener("change", citySelectChange)
    }

    /**
     * 初始化图表需要的数据格式
     */
    function initAqiChartData() {
        // 初始化数据
        chartData = {}; 
        // 将原始的源数据处理成图表需要的数据格式
        var dataObj = {},
            key = pageState.nowSelectCity,
            weekObj = {}; //键值
        // 把对象的key储存为一个数组
        var keyArr = Object.getOwnPropertyNames(aqiSourceData[key]);
        // 获取key数组的长度 等同于 数据源对象的长度  
        var keyArrLen = keyArr.length;
        switch (pageState.nowGraTime) {
            /**
             *  处理天数数据
             */
            case "day":
                chartData = aqiSourceData[key];
                break;
            /**
             *  处理星期数据
             */
            case "week":
                // 一共有多少星期
                var weekCount = 0;

                //统计每个星期的总数
                var a = 0;
                //为chartData设置下标
                var key_val = 0;

                // 获取起始日期是周几   ..... 可以在这里补逻辑
                var today = new Date(keyArr[0]),
                    todayWeek = today.getDay();


                // 循环统计 为charData赋值; 
                for (var i in aqiSourceData[key]) {
                    weekCount++;
                    a += aqiSourceData[key][i];

                    if (weekCount % 7 === 0) {
                        key_val++;
                        chartData[i + "-" + key_val] = a;
                        a = 0;
                    }

                }

                /*
                *   当最后一个星期不满7天时 按7天进行计算
                */
                // 统计有多少天被添加到数组 
                var nowDataLen = key_val * 7;
                if ((keyArrLen - nowDataLen) < 7 && keyArrLen % 7 !== 0) {
                    // 获取差几天 
                    var differDay = keyArrLen - nowDataLen,
                        differCount = 0;//相差天数 的数据总和

                    // 统计最后一个星期的数据进行累加
                    for (var i = 0; i < differDay; i++) {
                        differCount += aqiSourceData[key][keyArr[nowDataLen + i]];
                    }
                    chartData[keyArr[(nowDataLen)] + "-" + (key_val + 1)] = differCount;
                }
                break;
            /**
            * 处理月的日期
            * 以自然月为粒度 
            */
            case "month":   
                var monthData = aqiSourceData[key],// 缓存数据源
                    monthDataCount=0, // 统计单月总和
                    monthDataTime; // 统计月数
                for (var i = 0; i < keyArrLen; i++) {
                    monthDataCount += monthData[keyArr[i]];
                    if(i % 30 === 0){
                        chartData[keyArr[i]] = monthDataCount;
                        monthDataCount = 0;
                        monthDataTime++;
                    }                
                }
                // 超过30天的需要重新按新的一个月来统计
                if(keyArrLen % 30 >0){
                    var sur = keyArrLen % 30,
                        surCount = 0;
                    for(var i =1;i<=sur;i++){
                        surCount += monthData[keyArr[keyArrLen-i]]; 
                    }
                    chartData[keyArr[keyArrLen-1]] = surCount;
                }
                break;
            default:
                break;
        }
        // 处理好的数据存到 chartData 中

        renderChart();
    }

    /**
     * 初始化函数
     */
    function init() {
        initGraTimeForm()
        initCitySelector();
        initAqiChartData();
    }

    init();
}