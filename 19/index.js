(function (doc) {
    /**
     * 因为排序的执行步骤需要以页面的形式展现出来 所以需要对页面的dom进行排序
     */

    // 原始数组
    var arr = [50, 40, 60, 20, 70];

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
            innerHTML += '<li style="height:' + arr[i] + 'px" data-sort = "' + arr[i] + '" data-id="' + i + '"></li>';
        }
        ul.innerHTML = innerHTML;
    }
    /* 生成随机数 */
    function randomForTest() {
        arr = [];
        for (var i = 0; i < 20; i++) {
            arr.push(Math.floor(Math.random() * 91 + 10));
        }
        renderArr();
    }
    /**
     * 打乱数组
     */
    var mess = function () {
        arr.sort(function () {
            return 0.5 - Math.random()
        })
        // 调用渲染函数
        renderArr();
    }
    /**
     * 冒泡排序
     * 用定时器模拟for循环
     * 相邻的两个进行排序
     * 第一次循环得出倒数第一个
     * 第二次循环得出倒数第二个
     * ....
     * 最后一次循环得出第一个 排序完毕
     */
    var bubbling = function () {
        var lis = ul.querySelectorAll("li"),
            j = 0, i, temp, timer, deelp = 50;
        //正常数组的冒泡排序    
        // for (var i = 0; i < arr.length - 1; i++) {
        //     for (var j = 0; j < arr.length - i - 1; j++) {
        //         if (arr[j] > arr[j + 1]) {                
        //             var temp = arr[j];

        //             arr[j] = arr[j+1];

        //             arr[j+1] = temp;                           

        //         }
        //     }
        // }
        i = lis.length - 1;
        timer = setInterval(function () {
            if (i < 1) { // 如果是最后一次遍历 则取消当前时间调用函数
                clearInterval(timer)
            }
            if (j == i) {
                i--;
                j = 0;
            }

            if (lis[j].offsetHeight > lis[j + 1].offsetHeight) {
                swap(lis[j], lis[j + 1])
            }
            j++;
        }, deelp);
    }
    /**
     * 两个dom交换节点
     */
    var swap = function (li1, li2) {
        var temp = li1.offsetHeight;
        li1.offsetHeight = li2.offsetHeight;
        li1.style.height = li2.offsetHeight + "px";
        li2.offsetHeight = temp;
        li2.style.height = temp + "px";
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
        arr.splice(index, 1);
        // 调用渲染函数
        renderArr();
    }
    /**
     * 判断输入框是否为整数
     */

    var checkInput = function () {
        if (!inputVal.value.match(/^\d+$/)
            && inputVal.value >= 10
            && inputVal.value <= 100) {
            alert('请输入一个符合规则的整数');
            return;
        }
    }
    /**
     * 为对象增加截取字符串方法
     */
    // Object.prototype.splice = function (index, len) {
    //     var arr = [];
    //     for (var i = 0; i < this.length; i++) {
    //         if (i == index) {
    //             for (var j = 0; j < len; j++) {
    //                 arr.push(this[i + j])
    //             }
    //         }
    //     }
    //     return arr;
    // }

    /**
     * 快速排序
     */
    var quickSort = function () {
        var tm = 0;
        function sortFun(lis) {
            if (lis.length <= 1) {
                return lis;
            }
            var left = [],
                right = [],
                priveIndex = Math.floor(lis.length / 2),
                prive = lis.splice(priveIndex, 1);

            for (var i = 0; i < lis.length; i++) {
                if (lis[i] > prive) {
                    left.push(lis[i]);
                } else {
                    right.push(lis[i]);
                }
            }
            return [].concat(sortFun(left), prive, sortFun(right))
        }
        arr = sortFun(arr);
        renderArr();
    }
    /**
     * 插入排序
     */
    var insertSort = function () {
        var len = arr.length,
            i, j, tmp, result;

        // 设置数组副本
        for (i = 1; i < len; i++) {
            tmp = arr[i];
            j = i - 1;
            while (j >= 0 && tmp < arr[j]) {
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = tmp;
        }


        renderArr();
    }


    /**
     * 为按钮 及 元素绑定事件
     */
    //缓存按钮dom
    var leftIntoButton = doc.getElementById("leftInto"),
        rightIntoButton = doc.getElementById("rightInto"),
        leftOutButton = doc.getElementById("leftOut"),
        rightOutButton = doc.getElementById("rightOut"),
        messButton = doc.getElementById("mess"),
        bubblingButton = doc.getElementById("bubbling"),
        quickButton = doc.getElementById("quick"),
        insertButton = doc.getElementById("insert");

    binClick = function () {
        // 左入事件
        leftIntoButton.addEventListener("click", leftInto);
        // 右入事件
        rightIntoButton.addEventListener("click", rightInto)
        // 左出
        leftOutButton.addEventListener("click", leftOut);
        // 右出
        rightOutButton.addEventListener("click", rightOut);
        // 点击元素删除
        ul.addEventListener("click", function (e) {
            if (e.target.nodeName == "LI") {
                var _val = e.target.getAttribute("data-id");
                delArr(_val);
            }
        }, true);
        // 打乱数组
        messButton.addEventListener("click", mess)
        // 冒泡排序
        bubblingButton.addEventListener("click", bubbling);
        //  快速排序
        quickButton.addEventListener("click", quickSort);
        // 插入排序
        insertButton.addEventListener("click", insertSort);
    }

    /**
     * 初始化
     */
    var init = function () {
        binClick();
        renderArr();
        randomForTest();
    }
    init();

    /**
     * 
     * @param {*数组去重} li 
     */
    function delAgents(li) {
        var aa = {};
        var bb = [];
        for (var i = 0; i < li.length; i++) {
            if (!aa[li[i]]) {

                aa[li[i]] = true;
                bb.push(li[i]);
            }
        }
        return bb;
    }
    delAgents([1, 2, 3, 4, 1, 2, 3, 4, 5])
    /**
     * 统计字符串出现个数
     */
    function findMaxDupChar(str) {
        var strArr = str.split("");
        var obj = {};
        for (var i = 0; i < strArr.length; i++) {
            if (!obj[str[i]]) {
                obj[str[i]] = 1;
            } else {
                obj[str[i]] += 1;
            }
        }
        var mx = 0, key = "";
        for (var i in obj) {
            if (obj[i] > mx) {
                key = i;
                mx = obj[i];
            }
        }
        return key;
    }


})(document)



var a = 'dsdaqwrrerwfsdfs';
function finMaxDcus(txt) {
    var obj = {},
        re = [], // 保存相同个数的字符串
        newArr = []; // 得到出现最多的字符串
    for (var i = 0; i < txt.length; i++) {
        if (!obj[txt.charAt(i)]) {
            obj[txt.charAt(i)] = 1;
        } else {
            obj[txt.charAt(i)] += 1;
        }
    }
    // 得到出现字符串的最大个数 并保存相同个数
    var temps = 0;
    for (var i in obj) {
        if(re.length<1){
            re.push(i);
        }else{
            if(obj[i]==obj[re[0]]){
                re.push(i)
            }else if(obj[i]>obj[re[0]]){
                re = [];
                re.push(i);
            }
        }

    }
    return re;
}
finMaxDcus(a);


var newTime = new Date();
console.log("现在是"+
    newTime.getFullYear()+"年"+
    (newTime.getMonth()+1)+"月"+
    newTime.getDate()+"日"+
    newTime.getHours()+"时"+
    newTime.getMinutes()+"分"+
    newTime.getSeconds()+"秒");
console.log(Math.floor((newTime.getMonth() + 3) / 3))



