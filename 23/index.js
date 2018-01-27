(function (doc, window) {

    // 设置数组保存dom
    var arr = [],
        name = [],
        timer = null,
        input = doc.getElementById("input"),
        btn = doc.getElementById("search"),
        btn1 = doc.getElementById("search2");

    var div = doc.getElementById("root");

    /**
     * 向数组添加数据  深度优先
     */
    function addData(dom) {
        var temp = null,
            p = null;
        arr.push(dom);
        if (dom.firstElementChild) {
            addData(dom.firstElementChild);
            temp = dom.firstElementChild.nextElementSibling;
            while (temp) {
                addData(temp);
                temp = temp.nextElementSibling;
            }
        }

    }
    /**
     * 广度优先
     */
    function addData1(dom) {
        var temp = null,
            p = null,
            doms = [];
        if (dom) {
            doms.push(dom);
        }

        while (doms.length > 0) {
            p = doms.shift();
            arr.push(p);
            if (p.firstElementChild) {
                doms.push(p.firstElementChild)
                p = p.firstElementChild
                while (p.nextElementSibling) {
                    doms.push(p.nextElementSibling)
                    p = p.nextElementSibling;

                }
            }
        }
    }

    /**
     * 循环读取数据，并改变内部颜色
     */
    function renderDOM() {
        var i = 0,
            val = input.value.trim();
        timer = setInterval(function () {
            if (!arr[i]) {
                resetDOM();
                clearInterval(timer);
                return;
            }
            if (i > 0) {
                arr[i - 1].style.backgroundColor = "#fff";
            }
            if (val == name[i]) {
                arr[i].setAttribute('class', 'red');
                arr[i].style.backgroundColor = "red";
                alert("找到了")
                clearInterval(timer);
                return;
            }

            arr[i].style.backgroundColor = "#333333";
            i++;

        }, 500);

    }
    /**
     * 初始化DOM
     */
    function resetDOM() {
        clearInterval(timer);
        for (var i = 0; i < arr.length; i++) {
            arr[i].style.backgroundColor = "#fff";
        }
        arr = [];
    }

    /**
     * 为按钮绑定事件
     */
    function addClick() {
        // 深度优先 
        btn.addEventListener("click", function () {
            resetDOM();
            addData(div);
            renderDOM();
        })
        // 广度优先
        btn1.addEventListener('click', function () {
            resetDOM();
            addData1(div);
            renderDOM();
        })
    }

    /**
     * 初始化
     */
    function init() {
        addClick();
    }
    init();
})(document, window)