function createNewElement(parentNode, TagName, className) {
    var element = document.createElement(TagName);
    if (className) {
        element.className = className;
    }
    parentNode.appendChild(element);
}
// 页码栏初始化并进行讨论
function showInitPages(totalpages) {
    var pagecontrol = document.getElementsByClassName("pagebar")[0];
    // 添加页码
    var nextpage = document.getElementById("next-page");
    if (totalpages <= 5) {
        for (var i = 0; i < totalpages; i++) {
        var page_temp = document.createElement("div");
        page_temp.className = "page";
        pagecontrol.insertBefore(page_temp, nextpage);
        // 把页码添加到页面上
        var page = document.getElementsByClassName("page")[i];
        page.innerHTML = i + 1;
        }
    }
    // 当页码数大于5时
    else {
        for (var i = 0; i < 5; i++) {
            var page_temp = document.createElement("div");
            page_temp.className = "page";
            pagecontrol.insertBefore(page_temp, nextpage);
            var page = document.getElementsByClassName("page")[i];
            // 下面来分析每一种具体情况
            if(i < 3) {
                page.innerHTML = i + 1;
            } else if (i == 3) {
                page.innerHTML = "...";
            } else if(i == 4) {
                page.innerHTML = totalpages;
            }
        }
    }
    // 添加说明文本“共 x 页”
    var total = document.getElementsByClassName("total")[0];
    total.innerHTML = "共 " + totalpages + " 页"; 
}
// 如果是第一页则为上一页添加样式，如果是下一页则为下一页添加样式
function checkPages(number, totalpages) {
    if (number == 1) {
        document.getElementById("last-page").style.backgroundColor = "#ff0000";
        document.getElementById("next-page").style.backgroundColor = "";
    }
    // 考虑只有一页的情况
    if (number == 1 && totalpages == 1) {
        document.getElementById("last-page").style.backgroundColor = "#ff0000";
        document.getElementById("next-page").style.backgroundColor = "#ff0000";
    } else if (number == totalpages) {
        document.getElementById("last-page").style.backgroundColor = "";
        document.getElementById("next-page").style.backgroundColor = "#ff0000";
    } else if (number != 1 && number != totalpages) {
        document.getElementById("last-page").style.backgroundColor = "";
        document.getElementById("next-page").style.backgroundColor = "";
    }
}
// 直接跳转到第几页
function wantPage(limit, totalpages, page) {
    var wantPageNumber = document.getElementsByClassName("wantPageNumber")[0];
    // 激活输入框并按下回车键时
    wantPageNumber.onkeydown = function () {
        // 按下回车时
        if (event.keyCode == 13) {
            // 判断此时要跳转的页数是否为空
            if (wantPageNumber.value != "") {
                // 判断要跳转的页数是否大于总数
                if (wantPageNumber.value <= totalpages) {
                    // 判断是跳转到比当前页数大的页面还是比当前页数小的页
                    if (wantPageNumber.value < document.getElementById("selected").innerHTML) {
                        // 注意for中的限制条件不能是for中执行的函数可以改变的
                        // 相当于点击了多少次上一页
                        var count = document.getElementById("selected").innerHTML - wantPageNumber.value;
                        for(let i = 0; i < count; i++) {
                            wantNumberLast(totalpages);
                        }
                    }
                    if (wantPageNumber.value > document.getElementById("selected").innerHTML) {
                        var count = wantPageNumber.value - document.getElementById("selected").innerHTML;
                        // 相当于点击了多少次下一页;
                        for(let i = 0; i < count; i++) {
                            wantNumberNext(totalpages);
                        }
                    }
                    // 先把之前的事件给清除，以免造成接口的重复调用
                    $("#number").unbind();
                    $("#sortPriceUp").unbind();
                    $("#sortPriceDown").unbind();
                    $("#sortHotUp").unbind();
                    $("#sortHotDown").unbind();
                    // 展示具体的页面
                    readyToShowData(limit, wantPageNumber.value);
                    // 如果是第一页就不能点击上一页了，如果是最后一页就不能点击下一页了
                    checkPages(page, totalpages);
                } else {
                    alert("请输入小于或等于总页数的数值");
                }
            }
        }

    }
}
function wantNumberLast(totalpages) {
    var pages = document.getElementsByClassName("page");
    if (totalpages <= 5) {
        for (var i = 0; i < totalpages; i++) {
            if (pages[i].id == "selected" && i != 0) {
                pages[i].id = "";
                pages[i - 1].id = "selected";
                break;
            }
        }
    } else {
        // 第二页（左二）跳转至第一页（左一）
        if (pages[1].id == "selected") {
            pages[1].id = "";
            pages[0].id = "selected";
        } else if (pages[2].id == "selected" && pages[2].innerHTML == 3) {
            pages[2].id = " ";
            pages[1].id = "selected";
        } else if (pages[2].id == "selected" && pages[2].innerHTML == 4) {
            pages[1].innerHTML = 2;
            pages[2].innerHTML = 3;
            pages[3].innerHTML = "...";
        } else if (pages[2].id == "selected" && pages[2].innerHTML > 4
            && pages[2].innerHTML < totalpages - 2) {
            pages[2].innerHTML = pages[2].innerHTML - 1;
        } else if (pages[2].id == "selected" && pages[2].innerHTML == totalpages - 2) {
            pages[2].innerHTML = totalpages - 3;
            pages[3].innerHTML = "···";
        } else if (pages[3].id == "selected") {
            pages[3].id = " ";
            pages[2].id = "selected";
        } else if (pages[4].id == "selected") {
            pages[4].id = " ";
            pages[3].id = "selected";
        }
    }
}
function wantNumberNext(totalpages, want) {
    var pages = document.getElementsByClassName("page");
    if (totalpages <= 5) {
        for (var i = 0; i < totalpages; i++) {
            if (pages[i].id == "selected" && i != totalpages - 1) {
                pages[i].id = " ";
                pages[i + 1].id = "selected";
                break;
            }
        }
    } else {
        if (pages[0].id == "selected") {
            pages[0].id = " ";
            pages[1].id = "selected";
        } else if (pages[1].id == "selected") {
            pages[1].id = " ";
            pages[2].id = "selected";
        } else if (pages[2].id == "selected" && pages[2].innerHTML == 3) {
            pages[1].innerHTML = "...";
            pages[2].innerHTML = 4;
            if (totalpages == 6) {
                pages[3].innerHTML = 5;
            }
        } else if (pages[2].id == "selected" && pages[2].innerHTML > 3
            && pages[2].innerHTML < totalpages - 3) {
            pages[2].innerHTML = want;
        } else if (pages[2].id == "selected" && pages[2].innerHTML == totalpages - 3) {
            pages[2].innerHTML = totalpages - 2;
            pages[3].innerHTML = totalpages - 1;
        } else if (pages[2].id == "selected" && pages[2].innerHTML == totalpages - 2) {
            pages[2].id = " ";
            pages[3].id = "selected";
            if (pages[2].innerHTML == 4) {
                pages[3].innerHTML = 5;
            }
        } else if (pages[3].id == "selected") {
            pages[3].id = " ";
            pages[4].id = "selected";
        }
    }
}
// 进行页面的切换
function readyToChangePage(limit, totalpages) {
    showInitPages(totalpages);
    var pages = document.getElementsByClassName("page");
    // 初始状态是第一页显示
    pages[0].id = "selected";
    // 这里要特别注意，这些事情出点击每页限制个数，热度，价格，这些的点击事件、
    // 不然会造成接口的重复调用
    $("#number").unbind();
    $("#sortPriceUp").unbind();
    $("#sortPriceDown").unbind();
    $("#sortHotUp").unbind();
    $("#sortHotDown").unbind();
    // 调用数据
    readyToShowData(limit, 1);
    // 点击上一页是的切换     
    $("#last-page").click(function() { 
        if(totalpages <= 5) {
            for (var i = 0; i < totalpages; i++) {
                if (pages[i].id == "selected" && i != 0) {
                    pages[i].id = "";
                    pages[i - 1].id = "selected";
                    $("#number").unbind();
                    $("#sortPriceUp").unbind();
                    $("#sortPriceDown").unbind();
                    $("#sortHotUp").unbind();
                    $("#sortHotDown").unbind();
                    readyToShowData(limit, i);
                    break;
                }
            }
        } else {
            // 第二页（左二）跳转至第一页（左一）
            if (pages[1].id == "selected") 
            {
                pages[1].id = "";
                pages[0].id = "selected";
                $("#number").unbind();
                $("#sortPriceUp").unbind();
                $("#sortPriceDown").unbind();
                $("#sortHotUp").unbind();
                $("#sortHotDown").unbind();
                readyToShowData(limit, 1);
            } else if (pages[2].id == "selected" && pages[2].innerHTML == 3) {
                pages[2].id = "";
                pages[1].id = "selected";
                $("#number").unbind();
                $("#sortPriceUp").unbind();
                $("#sortPriceDown").unbind();
                $("#sortHotUp").unbind();
                $("#sortHotDown").unbind();
                readyToShowData(limit, 2);
            } else if (pages[2].id == "selected" && pages[2].innerHTML == 4) {
                pages[1].innerHTML = 2;
                pages[2].innerHTML = 3;
                pages[3].innerHTML = "...";
                $("#number").unbind();
                $("#sortPriceUp").unbind();
                $("#sortPriceDown").unbind();
                $("#sortHotUp").unbind();
                $("#sortHotDown").unbind();
                readyToShowData(limit, 3);
            } else if (pages[2].id == "selected" && pages[2].innerHTML > 4 
                && pages[2].innerHTML < totalpages - 2) {
                pages[2].innerHTML = pages[2].innerHTML - 1;
                $("#number").unbind();
                $("#sortPriceUp").unbind();
                $("#sortPriceDown").unbind();
                $("#sortHotUp").unbind();
                $("#sortHotDown").unbind();
                readyToShowData(limit, totalpages);
            } else if (pages[2].id == "selected" && pages[2].innerHTML == totalpages - 2) {
                pages[2].innerHTML = totalpages - 3;
                pages[3].innerHTML = "···";
                $("#number").unbind();
                $("#sortPriceUp").unbind();
                $("#sortPriceDown").unbind();
                $("#sortHotUp").unbind();
                $("#sortHotDown").unbind();
                readyToShowData(limit, totalpages - 3);
            } else if(pages[3].id == "selected") {
                pages[3].id = "";
                pages[2].id = "selected";
                $("#number").unbind();
                $("#sortPriceUp").unbind();
                $("#sortPriceDown").unbind();
                $("#sortHotUp").unbind();
                $("#sortHotDown").unbind();
                readyToShowData(limit, totalpages - 2);
            } else if(pages[4].id == "selected") {
                pages[4].id = " ";
                pages[3].id = "selected";
                $("#number").unbind();
                $("#sortPriceUp").unbind();
                $("#sortPriceDown").unbind();
                $("#sortHotUp").unbind();
                $("#sortHotDown").unbind();
                readyToShowData(limit, totalpages - 1);
            }
        }
    });
    // 点击下一页时
    $("#next-page").click(function() {
            if (totalpages <= 5) {
            for (var i = 0; i < totalpages; i++) {
                if(pages[i].id == "selected" && i != totalpages - 1) {
                    pages[i].id = " ";
                    pages[i + 1].id = "selected";
                    $("#number").unbind();
                    $("#sortPriceUp").unbind();
                    $("#sortPriceDown").unbind();
                    $("#sortHotUp").unbind();
                    $("#sortHotDown").unbind();
                    readyToShowData(limit, i + 2);
                    break;
                }
            }
        } else {
            if(pages[0].id == "selected") {
                pages[0].id = " ";
                pages[1].id = "selected";
                $("#number").unbind();
                $("#sortPriceUp").unbind();
                $("#sortPriceDown").unbind();
                $("#sortHotUp").unbind();
                $("#sortHotDown").unbind();
                readyToShowData(limit, 2);
            } else if(pages[1].id == "selected") {
                pages[1].id = " ";
                pages[2].id = "selected";
                $("#number").unbind();
                $("#sortPriceUp").unbind();
                $("#sortPriceDown").unbind();
                $("#sortHotUp").unbind();
                $("#sortHotDown").unbind();
                readyToShowData(limit, 3);
            } else if (pages[2].id == "selected" && pages[2].innerHTML == 3) {
                pages[1].innerHTML = "...";
                pages[2].innerHTML = 4;
                if (totalpages == 6) {
                    pages[3].innerHTML = 5;
                }
                $("#number").unbind();
                $("#sortPriceUp").unbind();
                $("#sortPriceDown").unbind();
                $("#sortHotUp").unbind();
                $("#sortHotDown").unbind();
                readyToShowData(limit, 4);
            } else if (pages[2].id == "selected" && pages[2].innerHTML > 3 
                && pages[2].innerHTML < totalpages - 3) {
                pages[2].innerHTML = pages[2].innerHTML + 1;
                $("#number").unbind();
                $("#sortPriceUp").unbind();
                $("#sortPriceDown").unbind();
                $("#sortHotUp").unbind();
                $("#sortHotDown").unbind();
                readyToShowData(limit, pages[2].innerHTML);
            } else if (pages[2].id == "selected" && pages[2].innerHTML == totalpages - 3) {
                pages[2].innerHTML = totalpages - 2;
                pages[3].innerHTML = totalpages - 1;
                $("#number").unbind();
                $("#sortPriceUp").unbind();
                $("#sortPriceDown").unbind();
                $("#sortHotUp").unbind();
                $("#sortHotDown").unbind();
                readyToShowData(limit, totalpages - 2);
            } else if (pages[2].id == "selected" && pages[2].innerHTML == totalpages - 2) {
                pages[2].id = "";
                pages[3].id = "selected";
                if (pages[2].innerHTML == 4) {
                    pages[3].innerHTML = 5;
                }
                $("#number").unbind();
                $("#sortPriceUp").unbind();
                $("#sortPriceDown").unbind();
                $("#sortHotUp").unbind();
                $("#sortHotDown").unbind();
                readyToShowData(limit, totalpages - 1);
            } else if (pages[3].id == "selected") {
                pages[3].id = " ";
                pages[4].id = "selected";
                $("#number").unbind();
                $("#sortPriceUp").unbind();
                $("#sortPriceDown").unbind();
                $("#sortHotUp").unbind();
                $("#sortHotDown").unbind();
                readyToShowData(limit, totalpages);
            }
        }
    });
    // 直接点击小圆点时实现页面跳转
    if (totalpages <= 5) {
        total = totalpages;
    } else {
        total = 5;
    }
    for (var i = 0; i < total; i++) {
        (function (i) {
            // 点击页码时
            pages[i].addEventListener("click", show2);
                function show2() {
                    if (pages[i].innerHTML == "...") {
                       return false;
                   }   
                   for (var j = 0; j < total; j++) {
                    if (pages[j].id == "selected" || pages[j].id == "temp") {
                        if (j == i) {
                            return false;
                        }
                        pages[j].id = "";
                    }
                }
                pages[i].id = "selected";
                $("#number").unbind();
                $("#sortPriceUp").unbind();
                $("#sortPriceDown").unbind();
                $("#sortHotUp").unbind();
                $("#sortHotDown").unbind();
                readyToShowData(limit, pages[i].innerHTML);
                if (i == 0 && totalpages > 5) {
                    for (var k = 0; k < 5; k++) {
                        if (k < 3) {
                            pages[k].innerHTML = k + 1;
                        } else if (k == 3) {
                            pages[k].innerHTML = "...";
                        } else if (k == 4) {
                            pages[k].innerHTML = totalpages;
                        }
                    }
                }
                if (i == 4 && totalpages > 5) {
                    // 页面数大于5且点击最后一页
                    for (var k = 0; k < 5; k++) {
                        if (k == 0) {
                            pages[k].innerHTML = 1;
                        } else if (k == 1) {
                            pages[k].innerHTML = "...";
                        } else if (k > 1) {
                            pages[k].innerHTML = totalpages + k - 4;
                        }
                    }
                }
            }
            // 指针移动到页码上方时
            pages[i].addEventListener("mouseover", show3);
                function show3() {
                    // 让省略号不能点击
                    if (pages[i].innerHTML == "...")  {
                        return false;
                     }
                   for (var j = 0; j < total; j++) {
                    if (pages[j].id == "selected" && j != i) {
                        pages[j].id = "temp";
                        pages[i].id = "hover";
                        pages[i].style.cursor = "pointer";
                    } 
                }
            }
            // 指针离开页码上方时
            pages[i].addEventListener("mouseout", show4);
                function show4(){
                    if (pages[i].innerHTML == "...") {
                       return false;
                    }
                    for (var j = 0; j < total; j++) {
                       if (pages[j].id == "temp" && j != i) {
                           pages[j].id = "selected";
                           pages[i].id = "";
                        }    
                   
                    }
                }
        })(i);
    }
}
// 展示具体的页面
function showCertainPage(pagesnumber, totalgoods, pages) {
    // 移除原来的页面
    var wrap = document.getElementsByClassName("shopbar-1")[0]
    if (wrap.getElementsByClassName("goods")[0]) {
        wrap.removeChild(wrap.getElementsByClassName("goods")[0]);
    }
    createNewElement(wrap, "div", "goods");
    var wrapper = document.getElementsByClassName("goods")[0];
    if (pages * pagesnumber <= totalgoods) {
        for (var i = 0; i < pagesnumber; i++) {
            createNewElement(wrapper, "div", "commodity");
            // 添加外层元素
            // 创建商品的首页
            var commodity = document.getElementsByClassName("commodity")[i];
            // 创建存放商品图片的容器
            createNewElement(commodity, "img", "goodsPhoto");
            // 创建存放商品信息的容器
            createNewElement(commodity, "div", "goodsMessages");
            var goodsMessages = document.getElementsByClassName("goodsMessages")[i];
            // 创建存放商品名字的容器
            createNewElement(goodsMessages, "div", "name");
            // 创建存放商品价格的容器
            createNewElement(goodsMessages, "div", "price");
            // 创建存放热度的容器
            createNewElement(goodsMessages, "div", "hot");
            // 创建存放介绍的容器
            createNewElement(goodsMessages, "div", "introduction");
        }
    } 
    if (pages * pagesnumber > totalgoods 
        && (pages - 1) * pagesnumber < totalgoods) {
        for (var i = 0; i < (totalgoods - (pages - 1) * pagesnumber); i++) {
            createNewElement(wrapper, "div", "commodity");
            // 添加外层元素
            // 创建商品的首页
            var commodity = document.getElementsByClassName("commodity")[i];
            // 创建存放商品图片的容器
            createNewElement(commodity, "img");
            // 创建存放商品信息的容器
            createNewElement(commodity, "div", "goodsMessages");
            var goodsMessages = document.getElementsByClassName("goodsMessages")[i];
            // 创建存放商品名字的容器
            createNewElement(goodsMessages, "div", "name");
            // 创建存放商品价格的容器
            createNewElement(goodsMessages, "div", "price");
            // 创建存放热度的容器
            createNewElement(goodsMessages, "div", "hot");
            // 创建存放介绍的容器
            createNewElement(goodsMessages, "div", "introduction");
        }
    }
}