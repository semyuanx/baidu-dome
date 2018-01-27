(function (doc, win) {
    /**
     * 删除按钮
     */
    var delBtn = doc.getElementById("delBtn"),
        /**
         * 增加按钮
         */
        addBtn = doc.getElementById("addBtn"),
        /**
         * 输入框
         */
        input = doc.getElementById("input"),
        /**
         * 获取div的根元素
         */
        rootDOM = doc.getElementById("root"),
        /**
         * 缓存选中的dom
         */
        activeDOM = null,
        /**
         * 所有dom节点
         */
        allDOM = doc.getElementsByTagName("div"),
        /**
         * 页面数据数组
         */
        arr = [],
        /**
         * 搜索框
         */
        searchInput = doc.getElementById("search"),
        /**
         * 搜索按钮
         */
        searchBtn = doc.getElementById("searchBtn"),
        /**
         * 时间控制器
         */
        timer = null;
    /**
     * 初始化所有div背景颜色为白色
     */
    function resetDOM() {
        if(arr.length<1)return;
        for (var i = 0; i < allDOM.length; i++) {
            arr[i].style.backgroundColor = "#ffffff";
        }
    }
    /**
     * 点击div 功能
     */
    function clickDOM(e) {
        alert(e)
        if (e.target.style.backgroundColor == 'red') {
            e.target.style.backgroundColor = "#ffffff";
            activeDOM = null;
        } else {
            activeDOM = e.target;
            for(var i =0;i<allDOM.length;i++){
                allDOM[i].style.backgroundColor = "#ffffff";
            }
            e.target.style.backgroundColor = "red";
        }
    }
    /**
     * 删除功能
     */
    function delArr() {
        if (!activeDOM) {
            alert("请选择需要删除的DOM");
            return;
        }
        activeDOM.parentNode.removeChild(activeDOM);
        activeDOM = null;
    }
    /**
     * 添加按钮
     */
    function addDOM() {
        if (!activeDOM) {
            alert("请选择DOM节点");
            return;
        }
        if (!input.value) {
            alert("请输入要添加的内容");
            return;
        }
        var newDiv = document.createElement("div");
        newDiv.innerHTML = input.value;
        activeDOM.appendChild(newDiv);

        rootDOM.removeEventListener("click",clickDOM);
        rootDOM.addEventListener("click",clickDOM);
    }
    /**
     * 搜索dom
     */
    function searchDOM() {
        if (!searchInput.value) {
            alert("请输入搜索内容");
            return
        }
        resetDOM();
        arr =[];
        addArr(rootDOM);
        renderTimer();
    }
    /**
     * 向数组添加数据
     */
    function addArr(dom) {   
        arr.push(dom);    
        if (dom.firstElementChild) {
            addArr(dom.firstElementChild)
        }
        if (dom.nextElementSibling && dom.nextElementSibling.nodeName === "DIV" ) {
              addArr(dom.nextElementSibling  )
        }   
    }
    /**
     * 渲染动画
     */
    function renderTimer(){
        var i=0;
        timer = setInterval(function(){
            
            if(i == arr.length) {
                if(arr[i-1].firstChild.nodeValue.trim() != searchInput.value.trim()){
                    arr[i-1].style.backgroundColor = "#ffffff";               
                }   
                clearInterval(timer);
                return;
            }
            arr[i].style.backgroundColor = "red";
            if(i>0 && arr[i-1].firstChild.nodeValue.trim() != searchInput.value.trim()){
                arr[i-1].style.backgroundColor = "#ffffff"; 
            }
            if(arr[i].firstChild.nodeValue.trim() == searchInput.value.trim()){
                arr[i].style.backgroundColor = "#333333";
                console.log("找到了")
            }
            i++;        
        },500);
    }
    /**
    * 页面绑定事件
    */
    function addEvent() {
        rootDOM.addEventListener("click", clickDOM);
        delBtn.addEventListener("click", delArr);
        addBtn.addEventListener("click", addDOM);
        searchBtn.addEventListener("click", searchDOM)
    }

    /**
     * 页面初始化
     */
    function init() {  
        addEvent();
    }
    init();
})(document, window)