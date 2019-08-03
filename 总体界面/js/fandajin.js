// 我要把ID提取出来
var id = window.location.search.substr(1).split("id=")[1];
// 如果有ID的话
if (id) {
    showDetailPhoto(id);
}
// 把所有的图片放在一起
function showDetailPhoto(id) {
    $.ajax({
        url: "http://123.207.52.59:8088/getImg",
        type: "GET",
        data: {
            id: id,
        },
        dataType: "json",
        success: function (data) {
            fangDaJing(data.data.detailedImg[0], data.data.detailedImg[1]);
        }
    })
}
function fangDaJing(photo1, photo2) {
    if(photo1 && photo2) {
        $(".small img").attr("src", photo1);
        $(".big img").attr("src", photo2);
        $("#img-1").attr("src", photo1);
        $("#img-1").hover(function () {
            $(".small img").attr("src", photo1)
            $(".big img").attr("src", photo2)
        });
    } else {
        $(".small img").attr("src", "images/q3.jpg");
        $(".big img").attr("src", "images/q1.jpg");
        $("#img-1").attr("src", "images/q4.jpg");
        $("#img-1").hover(function () {
            $(".small img").attr("src", "images/q3.jpg");
            $(".big img").attr("src", "images/q1.jpg");
        })
    }
}
$("#img-2").hover(function () {
    $(".small img").attr("src", "images/q7.jpg");
    $(".big img").attr("src", "images/q6.jpg");
})
$("#img-3").hover(function () {
    $(".small img").attr("src", "images/q12.jpg");
    $(".big img").attr("src", "images/q11.jpg");
})
$("#img-4").hover(function () {
    $(".small img").attr("src", "images/q3.jpg");
    $(".big img").attr("src", "images/q1.jpg");
})
$("#img-5").hover(function () {
    $(".small img").attr("src", "images/q12.jpg");
    $(".big img").attr("src", "images/q11.jpg");
})
    // 监听鼠标mouseover事件
$('.all .small').on('mouseover', function () {
    $('.all span').css('display', 'block');
    $('.all .big').css('display', 'block');
})
// 监听鼠标mouseout事件  
$('.all .small').on('mouseout', function () {
    $('.all span').css('display', 'none');
    $('.all .big').css('display', 'none');
 })
$(function() {
    // 除以二视为了让鼠标在中心
    var sp = $(".all span").width()/2;
    var osm = $(".all .small").width();
    $(".all .small").mousemove(function(e) {
        var ox = $(".all .small").offset().left;
        var oy = $(".all .small").offset().top;
        var ex = e.pageX;
        var ey = e.pageY;
        var sx = ex - ox;
        var sy = ey - oy;
        // 对左边进行限制
        if (sx < sp) {
            sx = sp;
        }
        // 对右边进行限制
        if (sx > osm - sp) {
            sx = osm - sp;
        }
        // 对上边进行限制
        if (sy < sp) {
            sy = sp;
        }
        // 对下边进行限制
        if (sy > osm - sp) {
            sy = osm - sp;
        }
        $(".all span").css({left: sx - sp, top: sy - sp});
        // 加负号视为了反向移动
        $(".all .big img").css({left: -osm/(2 * sp) * (sx-sp),
            top: -osm / (2 * sp) * (sy - sp)})
    });
    
})
