$.ajaxPrefilter(function (options) {
    //每次调用$.ajax $.post和$.get之前，都会自动调用这个函数
    //这个函数可以拿到我们给ajax的配置对象,包括URL type success等

    //可以手动将根路径拼接上,简化代码
    options.url = 'http://www.liulongbin.top:3007' + options.url
    console.log(options.url);
})