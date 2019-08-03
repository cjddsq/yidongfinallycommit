
// 总的思路是首先readyToChangePage(6, 3);来初始化页面，默认读第一页显示，
// 通过readyToShowData(limit, page)来显示具体某一页，这个函数里面有五种排序方法，分别是
// 1.默认排序，即按ID大小排
// 2.按价格升序排
// 3.按价格降序排
// 4.按热度升序排
// 5按热度降序排
// 这五种排序都是通过sort(idList)函数来实现，注意sort函数要用同步排序，不然就会出现混乱，因为把它们重新放在一个数组里，
// 可以减少接口的调用，
// 减少等待时间，在显示具体某一页之前要把之前的事件清除掉，要不就可能造成接口的重复调用。
// 页面是根据页数和每页限制的数量通过showCertainPage(limit, totalgoods, page)和showSortPage()
// 来动态创建和添加信息的，还有通过wantPage(limit, totalpages, page)来实现跳转到某一页，思路是相当于点击了
// 多少次上一页和下一页。还有通过checkPages(number, totalpages)来检查上一页和下一页是否还可以点击，如果不能
// 点击了，就为上一页和下一页添加样式。
// 初始化页面
readyToChangePage(6, 3);
function readyToShowData(limit, page) {
    $.ajax(
        {
            url: "http://123.207.52.59:8088/paging",
            type: "GET",
            data: {
                limit: limit,
                page: page,
            },
            dataType: "json",
            success: function (data) {
                // 向上取整
                var totalpages = Math.ceil(data.data.count / limit);
                var arr = sort(data.data.idList);
                var arr1 = arr.SortById();

                // 传入默认排序的函数
                showSortPage(arr1, page, limit, data.data.count);
                // 以下四个是按价格升降和热度升降的函数
                clickSortByPriceUp(arr, limit, page, data.data.count);
                clickSortByPriceDown(arr, limit, page, data.data.count);
                clickSortByHotUp(arr, limit, page, data.data.count);
                clickSortByHotDown(arr, limit, page, data.data.count);
                // 改变每页的限制数量
                changePageLimit(data.data.count);
                // 是我要直接跳转到那一页
                wantPage(limit, totalpages, page);
                // 如果第一页被选了，就不能点击上一页了，如果下一页备被选了，就不能点击下一页了
                checkPages(page, totalpages);
            }
        }
    )
}
function changePageLimit(count) {
    // 像这种最好是监听select的变化，而不是给select中的每一个option添加一个点击事件，因为谷歌不支持
    // 这是事件委托
    $("#number").bind("change", function () {
        // 获取当前的val
        index = $("#number").val();
        $(".page").remove();
        // 清除点击事件
        $("#last-page").unbind();
        $("#next-page").unbind();
        readyToChangePage(index, Math.ceil(count / index));
    });
}
function clickSortByPriceUp(arr, limit, page, count) {
    $("#sortPriceUp").click(function () {
        var arr2 = arr.SortByPriceUp();
        showSortPage(arr2, page, limit, count);
    });
}
function clickSortByPriceDown(arr, limit, page, count) {
    $("#sortPriceDown").click(function () {
        var arr3 = arr.SortByPriceDown();
        showSortPage(arr3, page, limit, count);
    });
}
function clickSortByHotUp(arr, limit, page, count) {
    $("#sortHotUp").click(function () {
        var arr4 = arr.SortByHotUp();
        showSortPage(arr4, page, limit, count);
    });
}
function clickSortByHotDown(arr, limit, page, count) {
    $("#sortHotDown").click(function () {
        var arr5 = arr.SortByHotDown();
        showSortPage(arr5, page, limit, count);
    });
}
// 新构建的数组，为的是减少接口的调用
function sort(idList) {
    var arr = [];
    for(let i = 0; i < idList.length; i++) {
        $.ajax(
            {
                url: "http://123.207.52.59:8088/getInfo",
                type: "GET",
                data: {
                    id: idList[i],
                },
                dataType: "json",
                // 同步，因为我要按ID的大小来排序，不然就会出现先排ID为4的再排ID为3的
                async: false,
                success: function (data) {
                    obj = {
                        Id: idList[i],
                        Price: data.data.price,
                        Hot: data.data.hot,
                        Img: data.data.img,
                        Introduction: data.data.introduction,
                        Name: data.data.name,
                    }
                    arr[i] = obj;
                }
            }
        )
    }
    // 这是闭包
    function sortById(obj1, obj2) {
        if (parseFloat(obj1.Id) < parseFloat(obj2.Id)) {
            return -1;
        } else if (parseFloat(obj1.Id) > parseFloat(obj2.Id)) {
            return 1;
        } else {
            return 0;
        } 
    }
    function sortByPriceUp(obj1, obj2) {
        if (parseFloat(obj1.Price) < parseFloat(obj2.Price)) {
            return -1;
        } else if (parseFloat(obj1.Price) > parseFloat(obj2.Price)) {
            return 1;
        } else {
            return 0;
        }           
    }
    function sortByPriceDown(obj1, obj2) {
        if (parseFloat(obj1.Price) > parseFloat(obj2.Price)) {
            return -1;
        } else if (parseFloat(obj1.Price) < parseFloat(obj2.Price)) {
            return 1;
        } else {
            return 0;
        }     
    }
    function sortByHotUp(obj1, obj2) {
        // parseFloat可以解析一个字符串，并返回一个浮点数
        if (parseFloat(obj1.Hot) < parseFloat(obj2.Hot)) {
            return -1;
        } else if (parseFloat(obj1.Hot) > parseFloat(obj2.Hot)) {
            return 1;
        } else {
            return 0;
        }     
    }
    function sortByHotDown(obj1, obj2) {
        if (parseFloat(obj1.Hot) > parseFloat(obj2.Hot)) {
            return -1;
        } else if (parseFloat(obj1.Hot) < parseFloat(obj2.Hot)) {
            return 1;
        } else {
            return 0;
        } 
    }
    // 这种方法可以返回多种不同情况下的数组
    return {
        SortById: function() {
            arr.sort(sortById);
            return arr;
        },
        SortByPriceUp : function() {
            arr.sort(sortByPriceUp);
            return arr;
        },
        SortByPriceDown: function () {
            arr.sort(sortByPriceDown);
            return arr;
        },
        SortByHotUp: function () {
            arr.sort(sortByHotUp);
            return arr;
        },
        SortByHotDown: function () {
            arr.sort(sortByHotDown);
            return arr;
        },
    }
}
// 动态创建页面并且把信息传写进去
function showSortPage(arr, page, limit, totalgoods) {
   showCertainPage(limit, totalgoods, page);
    for (let i = 0; i < arr.length; i++) {
        var commodity = document.getElementsByClassName("commodity")[i].getElementsByTagName("img")[0];
        commodity.src = arr[i].Img;
        $(".name").eq(i).append("商品名称:" + arr[i].Name);
        $(".price").eq(i).append("价格:" + arr[i].Price);
        $(".hot").eq(i).append("热度:" + arr[i].Hot);
        $(".introduction").eq(i).append("商品介绍:" + arr[i].Introduction);
    }
    $(".commodity").click(function() {
        // 获取该节点在兄弟节点的位置
        index = $(this).index();
        window.location.href = "fandajin.html?id=" + arr[index].Id;
    }); 
}