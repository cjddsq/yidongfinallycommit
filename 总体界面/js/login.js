// 思路是通过autoFocus()来实现焦点的切换，通过readyLogIn()来实现正则判断，通过返回的状态
// 判断账号密码是否正确，如果正确，再判断是否选择了七天内自动登录，如果选择了，则设置cookie，否则
// 通过sessionStorage来设置session来保证登录到当前页面关闭为止。
// 点击请登录时弹出的其实是一个遮罩层，但是我为了美观加了一张背景图片，所以并不是跳转页面
var log = document.getElementById("log_out");
var user = document.getElementById("user");
var password = document.getElementById("password");
var input = document.getElementsByClassName("input");
var loginarea = document.getElementsByClassName("loginarea")[0];
var submit = document.getElementById("submit");
var check = document.getElementById("check");
var up = document.getElementById("up");
var b = document.getElementsByClassName("dowebok")[0];
// 如果有cookie，一打开页面就获取cookie并且拿来用
if (cookieUtil.get("init")) {
    // parse是把JSON字符串解析为原生js的值
    var cookie = JSON.parse(cookieUtil.get("init"));
    user.value = cookie.name;
    password.value = cookie.pass;
    input[0].value = user.value;
    input[1].value = password.value;
    logIn(input[0].value, input[1].value);
}
var user = JSON.parse(sessionStorage.getItem("user"));
// 如果cookie中没有数据的话，我要检查sessionStorage中有没有数据，有的话就拿出来用
if(user) {
    // 如果有的话就要把它添加到input输入框中去，好处是每次回自动补充
    input[0].value = user.name;
    input[1].value = user.pass;
    logIn(input[0].value, input[1].value);
}
submit.onclick = function () {
    // 判断是否符合正则要求
    var q = readyLogIn();
    if (q == "1") {
        logIn(input[0].value, input[1].value);
        closeDiv();
    }
    // 禁止提交表单
    loginarea.onsubmit = function () {
        return false;
    }
};
function logIn(account, password) {
    $.ajax(
        {
            url: "http://123.207.52.59:8088/login",
            data: {
                account: account,
                password: password,
            },
            type: "POST",
            dataType: "json",
            success: function (data) {
                // 确定账号密码是否正确
                if (data.status == 1) {
                    var obj = {};
                    obj.name = input[0].value;
                    obj.pass = input[1].value;
                    // 把js对象序列化为JSON字符串
                    var str = JSON.stringify(obj);
                    // 判断七天自登陆是否被选中，如果选中就设置cookie
                    if (check.checked) {
                       // 创建一个新时间对象
                       var time = new Date();
                       // 设置过期时间为当前时间加上七天
                       time.setDate(time.getDate() + 7);
                       cookieUtil.set("init", str, time, '/');
                    } else {
                        // 设置session，使用方法存储数据
                        sessionStorage.setItem("user", str);
                    }
                    var account = data.data.userName;
                    up.style.display = "none";
                    document.getElementsByClassName("username")[0].style.display = "block";
                    var text = document.getElementsByClassName("username")[0];
                    text.innerHTML = account;
                    document.getElementById("log_out").style.display = "block";
                } else {
                    alert("请认真检查用户名和密码");
                    // 收回遮罩层
                    ShowDIV();
                    b.style.display = "block";
                }
            }
        }
    )
}
log.addEventListener("click", function () {
    cookieUtil.unset('init', '/');
    sessionStorage.removeItem("user");
    // 重新加载页面
    location.reload();
});
function ShowDIV() {
    var bgdiv = document.getElementById("bgdiv");
    bgdiv.style.display = "block";
}
function closeDiv() {
    document.getElementById("bgdiv").style.display = "none";
    b.style.display = "none";
}
b.style.display = "none";
// 通过addEventListener来添加onclick事件
up.addEventListener("click", function () {
    // 先判断一下是否是隐藏了
    if (b.style.display == "none") {
        b.style.display = "block";
        b.style.top = "150px";
        ShowDIV();
    }
});
// 焦点切换
function autoFocus() {
    for (let i = 0; i < 2; i++) {
        // 输入框失去焦点时，显示提示文本
        input[i].addEventListener("blur", function () {
            if (i == 0) {
                input[i].placeholder = "用户名";
            } else {
                input[i].placeholder = "******";
            }
        });
        // 输入框获得焦点时，隐藏提示文本
        input[i].addEventListener("focus", function () {
            input[i].placeholder = " ";
        });
    }
}
// 调用聚焦函数
autoFocus();
// 输入账号，密码时的判断
function readyLogIn() {
    var input = document.getElementsByClassName("input");
    if (!input[0].value && !input[1].value) {
        alert("用户名不能为空！密码不能为空！")
        return false;
    }
    if (!input[0].value) {
        alert("用户名不能为空！");
        return false;
    } 
    else if (!input[1].value) {
        alert("密码不能为空！");
        return false;
    }
    else if (input[0].value && input[1].value) {
        var username_patt = /^[(a-zA-Z0-9)|(a-zA-z)]+$/;
        var password_patt = /^\d{6,10}$/;
        if (!username_patt.test(input[0].value) && password_patt.test(input[1].value)) {
            alert("用户名只能由英文字符构成且不能有空格！");
            return false;
        }
        if (!password_patt.test(input[1].value) && username_patt.test(input[0].value)) {
            alert("密码只能由纯数字构成且长度为6~10！");
            return false;
        }
        if (!username_patt.test(input[0].value) && !password_patt.test(input[1].value)) {
            alert("用户名只能由英文字符构成构成且不能有空格！\n密码只能由纯数字构成且长度为6~10！");
            return false;
        } else {
            return 1;
        }
    }
}