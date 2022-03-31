$(function () {
    getUserInfo()
})


var layer = layui.layer

//退出
$('#btngoout').on('click', function () {
    layer.confirm('确定要退出吗?', { icon: 3, title: '提示' },
        function (index) {
            //1.清空本地存储token
            localStorage.removeItem('token')
            //2.跳转到登录界面
            location.href = '../../login.html'
            //关闭询问框
            layer.close(index);
        });
})

// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        type: 'GET',
        url: '/my/userinfo',
        beforeSend: false,
        // headers 就是请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem("token") || ""
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            // 调用 renderAvatar 渲染用户的头像
            renderAvatar(res.data)
        },
    })
}


function renderAvatar(user) {
    //1.昵称优先级比用户名高
    var name = user.nickname || user.username
    //2.获取欢迎名称元素，渲染名字
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    //3.判断是否用户上传了头像
    if (user.user_pic !== null) {
        //渲染头像图片
        $('.text-avatar').hide()
        $('.layui-nav-img').attr('src', user.user_pic).show()
    } else {
        //渲染文本头像
        $('.layui-nav-img').hide()
        $('.text-avatar').html(name[0].toUpperCase()).show()
    }
}