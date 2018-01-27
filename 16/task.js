window.onload = function () {
    /**
* aqiData，存储用户输入的空气指数数据
* 示例格式：
* aqiData = {
*    "北京": 90,
*    "上海": 40
* };
*/
    var aqiData = {};

    // 去除空格
    String.prototype.trim = function () {
        return this.replace(/\s/gi, '');
    }


    /**
     * 从用户输入中获取数据，向aqiData中增加一条数据
     * 然后渲染aqi-list列表，增加新增的数据
     */
    function addAqiData(key, val) {
        // 如果城市已经存在则 return 
        for (var i in aqiData) {
            if (key == i) {
                alert("已经添加过该城市")
                return
            }
        }
        // 向aqiData 对象添加数据 
        aqiData[key] = parseInt(val);
        console.log(aqiData)
    }

    /**
     * 渲染aqi-table表格
     */
    // 获取dom节点容器
    var table = document.getElementById("aqi-table"); 
    function renderAqiList() {
        var dom = `<tr>
                        <td>城市</td><td>空气质量</td><td>操作</td>
                  </tr>`;
        for (var i in aqiData) {
            dom += `<tr>
                        <td>${i}</td><td>${aqiData[i]}</td><td><button>删除</button></td>
                   </tr>`
        }
        table.innerHTML = dom;
    }

    /**
     * 点击add-btn时的处理逻辑
     * 获取用户输入，更新数据，并进行页面呈现的更新
     */
    // 城市名称
    var cityName = document.getElementById("aqi-city-input");
    // 空气指数 
    var aqiValue = document.getElementById("aqi-value-input");

    function addBtnHandle() {
        // 处理城市名称 
        if (!/^[a-zA-Z\u4e00-\u9fa5]+$/.test(cityName.value.trim())) {
            alert("请填写正确的城市名称");
            return;
        }
        // 处理空气质量input
        if (aqiValue.value.indexOf(".") > -1 || !/^[0-9]+$/.test(aqiValue.value.trim())) {
            alert("请输入一个整数")
            return;
        }
        addAqiData(cityName.value.trim(), aqiValue.value.trim());
        renderAqiList();
    }

    /**
     * 点击各个删除按钮的时候的处理逻辑
     * 获取哪个城市数据被删，删除数据，更新表格显示
     */
    function delBtnHandle(val) {
        // do sth.
        for(var i in aqiData){
            if(i === val){
                delete aqiData[i]; 
            }
        }

        renderAqiList();
    }
    // 增加按钮
    var btn = document.getElementById("add-btn");


    function init() {

        // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
        btn.addEventListener("click", addBtnHandle)
        // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
        table.addEventListener("click",function(e){ // 给整个table 绑定事件
           if(e.target.nodeName==="BUTTON"){ // 点的是删除按钮
                delBtnHandle(e.target.parentElement.parentElement.children[0].innerHTML)
           }
        })
    }

    init();
}