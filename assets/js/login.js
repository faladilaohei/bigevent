$(function () {
    //点击“去注册”
    $('#link_reg').on('click', () => {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    //点击"去登陆"
    $('#link_login').on('click', () => {
        $('.reg-box').hide()
        $('.login-box').show()
    })

    //从layUI中获取form对象
    var form = layui.form
    //导入layer方法
    var layer = layui.layer
    //通过form.verify方法写自定义校验规则
    form.verify({
        //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位,且不能出现空格'
        ],
        //函数的方式写自定义校验规则
        repwd: function (value) {
            //通过形参拿到的是确认密码框的值
            //拿到密码框的值
            var pwd = $('.reg-box [name=password]').val()
            //比较两次的值是否相等
            if (value !== pwd) return '两次密码不一致'
        }

    })

    //监听注册表单的提交事件
    $('#form-reg').on('submit', function (e) {
        //阻止默认提交行为
        e.preventDefault()
        var data = {
            username: $('#form-reg [name=username]').val(), password: $('#form-reg [name=password]').val()
        }
        //发起post请求
        $.post('/api/reguser', data, function (res) {
            if (res.status !== 0) return layer.msg(res.message);
            layer.msg('注册成功！');
            $('#link_login').click()
        })
    })

    //监听登录表单的提交行为
    $('#form-login').submit(function (e) {
        e.preventDefault()
        $.ajax({
            type: 'post',
            url: '/api/login',
            // serialize()获取表单数据
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) return layer.msg('登录失败');
                layer.msg('登录成功!')
                // console.log(res.token)
                //将登录成功的token保存到本地存储里
                localStorage.setItem('token', res.token)
                //跳转到后台主页
                location.href = '/index.html'
            }
        })
    })
})