$.ajaxPrefilter(function (options) {
    //每次调用$.ajax $.post和$.get之前，都会自动调用这个函数
    //这个函数可以拿到我们给ajax的配置对象,包括URL type success等

    //可以手动将根路径拼接上,简化代码
    options.url = 'http://www.liulongbin.top:3007' + options.url
    console.log(options.url);

    //统一为有权限的接口，设置请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem("token") || ""
        }
    }

    // 不论成功还是失败，最终都会调用 complete 回调函数
    // 全局统一挂载 complete 回调函数
    options.complete = function (res) {
        // console.log('执行了 complete 回调：')
        // console.log(res)
        // 在 complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 1. 强制清空 token
            localStorage.removeItem('token')
            // 2. 强制跳转到登录页面
            location.href = '/login.html'
        }
    }
})