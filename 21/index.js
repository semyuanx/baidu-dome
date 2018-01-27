(function (doc, window) {
    console.log(doc);
    /**
     * tag原始数据数组
     */
    var tagData = [];
    /**
     * 兴趣爱好
     */
    var hobbyData = [];

    /**
     *  保存 DOM id 到临时内存
     */
    var tagUl = doc.getElementById('ul1');  // tag 数据
    var hobbyUl = doc.getElementById('ul2'); // hobby 数据
    var tagInput = doc.getElementById('tagInput'); // tag 输入框
    var hobbyTextarea = doc.getElementById("hobbyTextarea"); // hobbyTextarea 多行输入
    var subBtn = doc.getElementById("subBtn");  // 确定兴趣爱好

    /**
     * 渲染函数
     * 参数：数据  容器
     */
    function renderDOM(data, box) {
        // if(data.length<1) return;
        var dom = data.map(function (val, key) {
            return '<li attr-data=' + key + '>' + val + '</li>';
        }).join("");
        box.innerHTML = dom;
    }
    /**
     *  鼠标移上去 函数
     */
    function mouseoverDOM() {
        if (event.target.nodeName === 'LI') {
            var dom = event.target;
            dom.innerHTML = '点击删除:' + dom.innerHTML;
        }
    }
    /**
     *  鼠标移走 函数
     */
    function mouseupDOM(event) {
        if (event.target.nodeName === 'LI') {
            var dom = event.target;
            dom.innerHTML = dom.innerHTML.replace(/点击删除:/, '');
        }
    }
    /**
     * 数组添加
     * 
     */
    function pushArr(arr, val) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == val) {
                alert("重复了")
                return false;
            }
        }
        arr.push(val);
        if (arr.length > 10) arr.shift(); // 数组多了就删除      
        return true
    }

    /**
     * tag 输入框输入
     */
    function changeInput() {
        var _target = event.target,
            pushSuccess = false;
        if (event.keyCode === 13) {
            pushSuccess = pushArr(tagData, _target.value)
        }
        var val = /[\s|,|，|\n]/.exec(event.target.value);
        if (val) {
            _target.value = _target.value.replace(val[0], '');
            pushSuccess = pushArr(tagData, _target.value)
        }

        if (pushSuccess) {
            event.target.value = '';
            renderDOM(tagData, tagUl);
        }
    }


    /**
     *  点击删除函数
     */
    function delTagData(event) {
        var index = event.target.getAttribute('attr-data');
        tagData.remove(index);
        renderDOM(tagData, tagUl);
    }
    /**
     * 数组删除某个元素
     * 参数: 下标
     */
    Array.prototype.remove = function (index) {
        if (index < 0 || index > this.length) return;
        this.splice(index, 1)
    }
    /**
     * 确定兴趣安好按钮
     */
    function subBtnClick(){
        var hobbyVal = hobbyTextarea.value;
        var reg = hobbyVal.match(/([\w|\u4e00-\u9fa5]+)/g); // 除[0-9A-Za-z_]以外的都可以作为分隔符
        hobbyData = hobbyData.concat(reg)
        hobbyData = hobbyData.delRepect();
       
        if(hobbyData.length>10){
            hobbyData.splice(-hobbyData.length,(hobbyData.length-10));
        }
        
        renderDOM(hobbyData, hobbyUl);
    }
    /**
     * 数组去重
     */
    Array.prototype.delRepect = function(){
        var obj = {},
            arr = [];
        for(var i =0;i<this.length;i++){
            if(!obj[this[i]]){
                obj[this[i]] = true;
                arr.push(this[i])
            }
        }
        return arr;
    }


    /**
     * 初始化
     */
    function init() {
        renderDOM(tagData, tagUl)

        tagUl.addEventListener('mouseover', mouseoverDOM);
        tagUl.addEventListener('mouseout', mouseupDOM);
        tagUl.addEventListener("click", delTagData);
        tagInput.addEventListener('keyup', changeInput);
        subBtn.addEventListener('click',subBtnClick);
        hobbyUl.addEventListener('mouseover', mouseoverDOM);
        hobbyUl.addEventListener('mouseout', mouseupDOM);
    }

    init();

})(document, window);