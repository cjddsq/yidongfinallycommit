
var num = 0;
var time;
// 默认第一个li被选择
$("ol li").eq(0).css("background-color", "#ff0");
$("#banner ul li").eq(0).css("display", "block");
//  换图的函数
time = setInterval(func, 3000); 
function func() {
     ++num;
    num = num == $("#banner ul li").length ? 0 : num;
    $("ol li").css("background-color", "#fff");
    $("#banner ul li").css("display", "none");
    //  给本张图片添加样式
    $("ol li").eq(num).css("background-color", "#ff0");
    $("#banner ul li").eq(num).css("display", "block");
}
//  绑定点击span处理函数
$("#right").click(function(){
     ++num;
    num = num % ($("#banner ul li").length);
    if (num == 0) {
        num = 0;
        //清除所有样式
        $("ol li").css("background-color", "#fff");
        $("#banner ul li").css("display", "none");
        $("ol li").eq(num).css("background-color", "#ff0");
        $("#banner ul li").eq(num).css("display", "block");
    } else{
        $("ol li").css("background-color", "#fff");
        $("#banner ul li").css("display", "none");
        $("ol li").eq(num).css("background-color", "#ff0");
        $("#banner ul li").eq(num).css("display", "block");
    }
});
// 绑定点击span处理函数
$("#left").click(function() {
    --num;
    if (num < 0) {
        num = ($("#banner ul li").length - 1);
    }
        $("ol li").css("background-color", "#fff");
        $("#banner ul li").css("display", "none");
        $("ol li").eq(num).css("background-color", "#ff0");
        $("#banner ul li").eq(num).css("display", "block");
});
//  给li绑定事件
$("ol li").click(function () {
    num = $(this).index();
    //清除所有样式
    $("ol li").css("background-color", "#fff");
    $("#banner ul li").css("display", "none");
    //  给本张图添加样式
    $("ol li").eq(num).css("background-color", "#ff0");
    $("#banner ul li").eq(num).css("display", "block");
});
$("#banner-1").mouseover(function() {
   clearInterval(time);
   $("#left").css("diaplay", "block");
   $("#right").css("diaplay", "block");
   $("#left").css("background-color", "#f40");
   $("#right").css("background-color", "#f40");
});
$("#banner-1").mouseout(function () {
    //重启定时器
    time = setInterval(func, 3000);
    $("#left").css("diaplay", "none");
    $("#right").css("diaplay", "none");
    $("#left").css("background-color", "");
    $("#right").css("background-color", "");
});