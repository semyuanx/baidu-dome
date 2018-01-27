window.onload = (function (doc, win) {
    /**
     * 缓存dom元素
     */
    var rootDOM = doc.getElementById("tree"),
        span = doc.getElementsByTagName("span"),
        searchBtn = doc.getElementById("searchBtn"),
        input = doc.getElementById("input"),
        allLi = null;

    /**
     * 删除元素
     */
    function delDOM(e) {
        var _thisLi = e.target.parentNode.parentNode, // 获取需要删除的li
            parentUl = _thisLi.parentNode,// 获取需要删除的li所在ul
            parentLI = null;

        _thisLi.parentNode.removeChild(_thisLi); // 删除当前li

        if (!parentUl.firstElementChild) { // 如果当前ul内没有li 则当前ul一并删除
            parentLI = parentUl.parentNode;
            parentLI.removeChild(parentUl);
            parentLI.className = "noAfter";
        }
    }
    /**
     * 追加元素
     */
    function addDOM() {
        var parentLi = event.target.parentNode.parentNode,// 获取当前点击对象的父元素li
            confims = prompt("请输入节点名称", "节点"),
            ul = parentLi.children[1];


        if (confims) { //如果输入框有值的情况下 则进入追加dom逻辑
            //生成li
            var li = doc.createElement("li");
            li.innerHTML = '<span>' + confims + '<i>+</i><i>-</i></span>';
            li.className = "noAfter";

            // 查找是否有子元素ul
            if (!ul) {
                ul = doc.createElement("ul");
                parentLi.appendChild(ul);
            }
            ul.appendChild(li);
            parentLi.className = " on"
        }
    }

    /**
     * 点击折叠或打开
     */
    function clickDOM(e) {
        var dom = null;
        if (e.target.nodeName === "SPAN") { // 如果点击的是子元素则重置到外层的li元素
            dom = e.target.parentNode;
        } else if (e.target.nodeName === "LI") {
            dom = e.target;
        } else if (e.target.nodeName === 'I') { // 如果点击的是 I 则表示要添加或者删除 则进入响应发方法 后序逻辑不在运行
            if (e.target.nextElementSibling) { //点击的是添加
                addDOM()
            } else { //点击的是删除
                delDOM(e);
            }
            return; 
        } else { // 如果点的除此之外的dom 就return
            return;
        }
        // 点击 li 的后序逻辑
        resetSpan();
        dom.children[0].style.backgroundColor = "red";
        if (dom.children.length < 2) return; // 如果没有子节点则没有点击事件

        if (!dom.getAttribute("class")) {  // 如果没有on class则增加
            dom.setAttribute("class", "on");
        } else { // 否则就删除
            dom.setAttribute("class", "");
        }
        e.stopPropagation(); // 防止冒泡
    }
    /**
     * 搜索DOM
     */
    function searchDOM() {       
        if (!input.value) {
            alert("请输入要查找的内容");
            return
        }
        var inputVal = input.value.trim(); // 获取输入框的值并去除两端空格
        var domVal = null,
            execVal = null,
            numArr = [],
            num=0;
        allLi = doc.getElementsByTagName("li"); // 获取所有的Li元素
        resetSpan(); // 重置所有span的样式
        for (var i = 0; i < allLi.length; i++) {
            domVal = allLi[i].firstElementChild.innerHTML.trim(); // 获取li下的首个span内的值
            execVal = /^([^<]*)/.exec(domVal)[1].trim(); // 获取span内部的nodeValue值
            if (execVal === inputVal) { // 如果找到dom节点的值与输入框的值相等则添加到数组中
                numArr.push(allLi[i]);
                num++;
            }
        }
        doc.getElementById("num").innerHTML= "一共找到" + numArr.length + "个节点"; // 底部提示
        openDOM(numArr); // 把数组传到展开dom方法内
    }
    /**
     * 找到dom并展开dom
     */
    function openDOM(arr) {
        
        // 逐一展开li
        while (arr.length) {
            var dom = arr[0];
            dom.children[0].style.backgroundColor = "red"; // 为每个span增加样式
            while (dom.nodeName !== "BODY") {
                dom = dom.parentNode;
                if (dom.nodeName === "LI") {
                    if (dom.className.indexOf("on") === -1) {
                        dom.className += " on";
                    }
                }
            }
            arr.shift();
        }

    }

    /**
     * 重置所有span颜色
     */
    function resetSpan() {
        var spans = doc.getElementsByTagName("span");
        for (var i = 0; i < spans.length; i++) {
            spans[i].style.backgroundColor = "#ffffff";
        }
    }
    /**
     * 绑定事件
     */
    function addEvent() {
        rootDOM.addEventListener("click", clickDOM);
        searchBtn.addEventListener("click", searchDOM);
    }
    /**
     * 页面初始化取消左边箭头
     */
    function resetAfter() {
        var lis = doc.getElementsByTagName("li");
        for (var i = 0; i < lis.length; i++) {
            if (!lis[i].children[1]) { // 如果没有子节点则增加 noAfter 类
                var _class = lis[i].className;
                lis[i].className = _class + " noAfter";
            }
        }
    }
    /**
     * 初始化
     */
    function init() {
        resetAfter();
        addEvent();
    }
    init();
})(document, window)