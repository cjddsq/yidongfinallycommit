var cookieUtil = { 
    get: function (name) {
        var cookieName = encodeURIComponent(name) + "=",
            // indexOf方法可以返回指定的字符串在字符串中首次出现的位置
            cookieStart = document.cookie.indexOf(cookieName),
            cookieValue = null; 
 
        if (cookieStart > -1) {
            var cookieEnd = document.cookie.indexOf(";", cookieStart);
            if (cookieEnd == -1){
                cookieEnd = document.cookie.length;
            }
            // substring方法用于提取字符串中介于两个指定下标的字符
            cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd));
        } 
 
        return cookieValue;
    }, 
 
    set: function (name, value, expires, path, domain, secure) {
        var cookieText = encodeURIComponent(name) + "=" + encodeURIComponent(value); 
 
        if (expires instanceof Date) {
            cookieText += "; expires=" + expires.toGMTString();
        } 
 
        if (path) {
            cookieText += "; path=" + path;
        }

        if (domain) {
            cookieText += "; domain=" + domain;
        } 
 
        if (secure) {
            cookieText += "; secure";
        } 

        document.cookie = cookieText;
    }, 
    // 设置cookie的过期时间
    unset: function (name, path, domain, secure) {
        this.set(name, "", new Date(0), path, domain, secure);
    } 
};