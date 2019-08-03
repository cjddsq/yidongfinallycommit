function createNewElement(parentNode, TagName, className, id) {
    var element = document.createElement(TagName);
    if (className) {
        element.className = className;
    }
    if (id) {
        element.id = id;
    }
    // 把该节点添加父元素中去
    parentNode.appendChild(element);
    return element;
}
// 创建一个扩展函数
function extend() {
    var length = arguments.length;
    // 如果传进来的参数有多个，我要把它们合并到第一个，所以就取0
    var target = arguments[0] || {};
    // 判断变量的类型，如果既不是对象又不是函数，就没有方法合并，直接返回空值
    if (typeof target != "object" && typeof target != "function") {
        return {};
    }
    // 如果传进来的只有一个，直接就返回本身
    if (length == 1) {
        return this;
    }
    for (var i = 1; i < length; i++) {
        var source = arguments[i];
        // 遍历，使用for in循环时，返回的是所有可以通过对象访问的，可枚举的属性
        for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                // if(Object.getOwnPropertyNames.call(source, key)) {
                target[key] = source[key];
            }
        }
    }
    return target;
}
// 组合使用构造函数模式和原型模式options是一个自定义的
// 这是构造函数模式,第一个字母，一般大写
function Rating(maskNode, options) {
    this.maskNode = maskNode;
    this.options = extend(this.defaultOptions, options);
}
// 这使用的是更简洁的原型模式，但是construction的属性会发生改变
Rating.prototype = {
    // constructor是构造函数属性,强行指向Rating
    constructor: Rating,
    defaultOptions: {
        starWidth: 80,
        totalStars: 5,
        totalScore: 5,
        message: ["很差", "差", "一般", "好", "很好"],
        // 一开始的星星
        initialStars: 0,
        // 是否可读
        isWritable: true
    },
    // 一开始的分数
    currentScore: 0,
    // 接下来创建HTML，使其符合结构和行为分离
    createHTMLElements: function () {
        var ulNode = createNewElement(this.maskNode, "ul", null, null);
        // 通过for循环创建节点
        for (let i = 0; i < this.options.totalStars; i++) {
            createNewElement(ulNode, "li", 'star', null)
        }
    },
    setCSS: function () {
        // 宽度等于星星的个数*星星的宽度
        this.maskNode.style.width = this.options.initialStars * this.options.starWidth + "px";
    },
    showScoreAndMessage: function (score) {
        var scoreArea = document.getElementById("score");
        var messageArea = document.getElementById("message");
        totalScore = this.options.totalScore;
        totalIndex = this.options.message.length;
        // 下面要算出数组的下标
        index = parseInt((score / totalScore) * totalIndex);
        // 保留一位浮点数
        scoreArea.innerHTML = score > 0 ? score.toFixed(1) + "分" : "";
        messageArea.innerHTML = score > 0 ? this.options.message[index] : "";
    },
    addEvent: function () {
        var name = "my object";
        var stars = document.getElementsByClassName("star");
        for (let i = 0; i < this.options.totalStars; i++) {
            // 这个_this值的是全局变量而不是star[i]
            var _this = this;
            stars[i].addEventListener("mousemove", function (e) {
                mouseLeft = e.clientX;
                // 对象为空就停止
                for (obj = stars[i], starLeft = 0; obj != null;) {
                    // 用+=是为了防止覆盖前面的距离
                    starLeft += obj.offsetLeft;
                    obj = obj.offsetParent;
                }
                distance = mouseLeft - starLeft;
                _this.maskNode.style.width = (distance / _this.options.starWidth + i) * _this.options.starWidth + 'px';
                score = (((distance / _this.options.starWidth + i) / _this.options.totalStars) * _this.options.totalScore);
                _this.showScoreAndMessage(score);
            });
            stars[i].addEventListener("mouseout", function () {
                _this.maskNode.style.width = _this.currentScore * _this.options.starWidth + 'px';
                _this.showScoreAndMessage(_this.currentScore);
            });
            // 点击时固定在那里
            stars[i].addEventListener("click", function (e) {
                mouseLeft = e.clientX;
                for (obj = stars[i], starLeft = 0; obj != null;) {
                    starLeft += obj.offsetLeft;
                    // offsetParent就是距离该子元素最近的进行过定位的父元素
                    obj = obj.offsetParent;
                }
                distance = mouseLeft - starLeft;
                _this.maskNode.style.width = (distance / _this.options.starWidth + i) * _this.options.starWidth + 'px';
                _this.currentScore = (((distance / _this.options.starWidth + i) / _this.options.totalStars) * _this.options.totalScore);
                _this.showScoreAndMessage(_this.currentScore);
            });
        }
    },
    // 初始化的时候先把HTML和样式给设置好
    init: function () {
        this.createHTMLElements();
        this.setCSS();
        // 先判断一下是否是可以改的，如果不是则没有添加监听事件的必要
        if (this.options.isWritable) {
            this.addEvent();
        }
    },
}
var maskNode = document.getElementById("stars_mask");
// 创建一个实例，但是我要传过去option是一个空对象
new Rating(maskNode, {}).init();