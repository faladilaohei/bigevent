
var layer = layui.layer
var form = layui.form

//获取文章分类的列表
initArtCate()
function initArtCate() {
    $.get('/my/article/cates', function (res) {
        // console.log(res);
        var htmlStr = template('tpi-table', res)
        $('tbody').html(htmlStr)
    })
}
var indexAdd = null
//为添加类别按钮绑定事件
$('#btnAddCate').on('click', function () {
    indexAdd = layer.open({
        type: 1,
        area: ['500px', '250px'],
        title: '添加文章分类',
        content: $('#tpl-addlist').html()
    });
})
//通过代理的方式为表单绑定submit事件,因为表单是动态生成的
$('body').on('submit', '#form_add', function (e) {
    e.preventDefault()
    $.post('/my/article/addcates', $('#form_add').serialize(), function (res) {
        if (res.status !== 0) return layer.msg('新增文章分类失败！')
        initArtCate()
        layer.msg('添加成功')
        layer.close(indexAdd);
    })
})

var indexEdit = null
//通过代理的方式，为表单的编辑按钮绑定事件
$('tbody').on('click', '.btnEdit', function (e) {
    //1.点击显示弹出层
    indexEdit = layer.open({
        type: 1,
        area: ['500px', '250px'],
        title: '编辑文章分类',
        content: $('#tpl-edit').html()
    });
    //2.在html中，给编辑按钮加了自定义属性，获取id值
    var id = $(this).attr('data-id')
    var url = '/my/article/cates/' + id
    //3.发起get请求
    $.get(url, function (res) {
        //4.用layui里的form方法获取表单所有的数据,并渲染出
        form.val('form_edit', res.data)
    })
})

//通过代理的方式，为修改分类的表单绑定submit事件
$('body').on('submit', '#form_edit', function (e) {
    e.preventDefault();
    $.post('/my/article/updatecate', $(this).serialize(), function (res) {
        if (res.status !== 0) return layer.msg('更新失败!')
        layer.msg('更新成功！')
        layer.close(indexEdit)
        initArtCate()
    })
})


//通过代理，删除对应一行的数据
$('tbody').on('click', '#btn-del', function () {

    // 2.获得当前所在行的索引号,通过加自定义属性值
    var id = $(this).attr('data-id')
    // console.log(id);
    //1.点击之后弹出询问框
    layer.confirm('确认删除吗?', { icon: 3, title: '提示' },
        function (index) {
        //3.发起get请求
        $.get('/my/article/deletecate/' + id, function (res) {
            if (res.status !== 0) return layer.msg('删除失败!')
            layer.msg('删除成功！')
            initArtCate()
            layer.close(index);
        });
    })
})