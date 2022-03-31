var form = layui.form
var layer = layui.layer


form.verify({
    pwd: [
        /^[\S]{6,12}$/
        , '密码必须6到12位,且不能出现空格'
    ],
    samePwd: function (value) {
        if (value === $('[name=oldPwd]').val())
            return '不能和原密码相同'

    },
    rePwd: function (value) {
        if (value !== $('[name=newPwd]').val())
            return '两次密码不一致'
    }
})

$('.layui-form').submit(function (e) {
    e.preventDefault()
    $.post('/my/updatepwd', $(this).serialize(),
        function (res) {
            if (res.status !== 0) { return layer.msg('更改密码失败！') }
            layer.msg('密码更改成功')
            //[0]就是将jQuery元素转换为DOM元素，reset就是重置清空表单
            $('.layui-form')[0].reset()
        }
    )
})