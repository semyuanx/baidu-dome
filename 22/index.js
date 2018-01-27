(function (doc, window) {
    /**
     * 缓存dom 元素
     */
    var frontBtn = doc.getElementById("front"),
        centreBtn = doc.getElementById("centre"),
        rearBtn = doc.getElementById("rear"),
        rootDOM = doc.getElementById('root'),
        timer = null,
        divList = [];
    frontBtn.addEventListener('click',function(){
        reset()
        preOrder(rootDOM);
        changeColor();
    })
    centreBtn.addEventListener("click",function(){
        reset()
        inserOde(rootDOM);
        changeColor();
    })
    rearBtn.addEventListener("click",function(){
        reset()
        postOrder(rootDOM);
        changeColor();
    })

    /**
     *  前序
     */
    function preOrder(node) {
        if (node) {
            divList.push(node)
            preOrder(node.firstElementChild)
            preOrder(node.lastElementChild)
        }
    }

    /**
     *  中序
     */
    function inserOde(node) {
        if (node) {
             inserOde(node.firstElementChild)
            divList.push(node)
            inserOde(node.lastElementChild)
        }
    }
    /**
     * 后序
     */
    function postOrder(node){
        if (node) {
           postOrder(node.firstElementChild)
           postOrder(node.lastElementChild)
           divList.push(node)        
       }
    }
    /**
     * 颜色变化函数
     */
    function changeColor() {
        var i = 0;
        divList[i].style.backgroundColor = 'blue';
        timer = setInterval(function () {
            i++;
            if (i < divList.length) {
                divList[i - 1].style.backgroundColor = '#fff';
                divList[i].style.backgroundColor = 'blue';
            } else {
                clearInterval(timer);
                divList[divList.length - 1].style.backgroundColor = '#fff';
            }
        }, 500);
    }

    /**
     * 初始化样式
     */
    function reset() {
        var divs = document.getElementsByTagName('div');
        divList = [];
        clearInterval(timer);
        for (var i = 0; i < divs.length; i++) {
            divs[i].style.backgroundColor = "#fff";
        }
    }


})(document, window)