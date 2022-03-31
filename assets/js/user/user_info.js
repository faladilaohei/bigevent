
var form = layui.form
var layer = layui.layer
$(function () {


    //自定义表单验证
    form.verify({
        nickname: function (value) {
            if (value.length > 6) return '用户昵称长度必须是1~6个字符'
        }
    })
})

initUserInfo()

//初始化用户的基本信息
function initUserInfo() {
    $.ajax({
        type: 'GET',
        url: '/my/userinfo',
        beforeSend: false,
        success: function (res) {
            if (res.status !== 0)
                return layer.msg('获取用户信息失败')
            // console.log(res);
            form.val('formUserInfo', res.data)

        }
    })
}


$('.layui-btn-primary').on('click', function (e) {
    //默认行为是全部清空
    e.preventDefault()
    //设定重置行为为初始化的数据
    initUserInfo()
})

//这里要是用箭头函数，this指向就会不对
$('.layui-form').submit(function (e) {
    e.preventDefault()
    $.post('/my/userinfo', $(this).serialize(),
        function (res) {
            if (res.status !== 0) { return layer.msg('更新用户信息失败！') }
            layer.msg('更新成功！')
            //调用父页面中的方法，重新渲染页面的用户头像和名称
            window.parent.getUserInfo()
        }
    )
})
