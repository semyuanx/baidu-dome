(function (doc) {

    // 原始数组
    var arr = [10, 15, 20];

    /**
     * 渲染DOM
     */
    //缓存dom节点
    var ul = doc.getElementById("showArr");
    var inputVal = doc.getElementById("inputVal");
    var renderArr = function () {
        //dom 常量
        var innerHTML = "";
        for (var i = 0; i < arr.length; i++) {
            innerHTML += '<li data-id="' + i + '">' + arr[i] + '</li>';
        }
        ul.innerHTML = innerHTML;
    }

    /**
     * 左侧入
     */
    var leftInto = function () {
        checkInput();
        arr.unshift(inputVal.value);
        // 调用渲染函数
        renderArr();
    }
    /**
     * 右侧入
     */
    var rightInto = function () {
        checkInput();
        arr.push(inputVal.value);
        // 调用渲染函数
        renderArr();
    }
    /**
     * 左侧出
     */
    var leftOut = function () {
        if (arr.length < 1) {
            alert("还没有元素哦！");
            return;
        }
        arr.splice(0, 1);
        // 调用渲染函数
        renderArr();
    }
    /**
     * 右侧出
     */
    var rightOut = function () {
        if (arr.length < 1) {
            alert("还没有元素哦！");
            return;
        }
        arr.splice(arr.length - 1, 1);
        // 调用渲染函数
        renderArr();
    }
    /**
     * 删除指定元素
     */
    var delArr = function (index) {
        arr.splice(index,1);
        // 调用渲染函数
        renderArr();
    }
    /**
     * 判断输入框是否为整数
     */
    
    var checkInput = function(){
        if(!inputVal.value.match(/^\d+$/)){
            alert('请输入一个整数');
            return;
        }
    }

    /**
     * 为按钮 及 元素绑定事件
     */
    //缓存按钮dom
    var leftIntoButton  = doc.getElementById("leftInto"),
        rightIntoButton = doc.getElementById("rightInto"),
        leftOutButton   = doc.getElementById("leftOut"),
        rightOutButton  = doc.getElementById("rightOut");
       
     binClick = function(){
        // 左入事件
        leftIntoButton.addEventListener("click",leftInto);
        // 右入事件
        rightIntoButton.addEventListener("click",rightInto)
        // 左出
        leftOutButton.addEventListener("click",leftOut);
        // 右出
        rightOutButton.addEventListener("click",rightOut);
        // 点击元素删除
        ul.addEventListener("click",function(e){      
            if(e.target.nodeName == "LI"){
                var _val = e.target.getAttribute("data-id");
                delArr(_val);
            }
        },true)
    }

    /**
     * 初始化
     */
    var init = function () {
        binClick();
        renderArr();
    }
    init();
})(document)