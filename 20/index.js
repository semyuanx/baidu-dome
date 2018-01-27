(function (doc) {
    // 页面数据 
    var arr = ['1234', '456'];

    // 缓存页面dom节点
    var ul = doc.getElementById("arrList");
    var inserBtn = doc.getElementById("inserBtn");
    var queryBtn = doc.getElementById("queryBtn");
    var input = doc.getElementById("input");
    var textarea = doc.getElementById("textarea");

    // 渲染函数
    var renderDOM = function () {
        var  match = input.value.trim();
        var dom = arr.map(function(data){
            var r = data;
            if(match != null && match.length > 0){
                r = r.replace(new RegExp(match,'g'),'<span>'+match+'</span>')
            }
            return '<li>'+r+'</li>';
        }).join('')

        ul.innerHTML = dom;
    }
    // 插入函数
    var addData = function () {
        var val = textarea.value;
        var dataArr = val.split(/[^0-9a-zA-Z\u4e00-\u9fa5]+/);
        dataArr.map(function(data){
            if(data!==""){
               arr.push(data);
            }
        })
        renderDOM();
    }
    // 绑定按钮
    var binEvent = function () {
        inserBtn.addEventListener("click",addData);
        queryBtn.addEventListener("click",renderDOM)
    }
    // 初始刷
    var init = function () {     
        binEvent();
        renderDOM();
    }
    init();
})(document)