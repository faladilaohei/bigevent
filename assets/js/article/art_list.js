
// 定义一个查询的参数对象，将来请求数据的时候，
// 需要将请求参数对象提交到服务器
var q = {
    pagenum: 1, // 页码值，默认请求第一页的数据
    pagesize: 5, // 每页显示几条数据，默认每页显示2条
    cate_id: '', // 文章分类的 Id
    state: '' // 文章的发布状态
}

var layer = layui.layer
var form = layui.form
var laypage = layui.laypage
initTable()
initCase()
// 获取文章列表数据的方法
function initTable() {
    $.ajax({
        method: 'GET',
        url: '/my/article/list',
        data: q,
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg('获取文章列表失败！')
            }
            // 使用模板引擎渲染页面的数据
            var htmlStr = template('tpl-table', res)
            console.log(res);
            $('tbody').html(htmlStr)
            renderPage(res.total)
        }

    })
}

//初始化文章分类的方法,就是筛选栏的第一个下拉菜单
function initCase() {
    $.get('/my/article/cates', function (res) {
        if (res.status !== 0) return layer.msg('获取分类数据失败！')
        var htmlStr = template('tpl-cate', res)
        $('[name=cate_id]').html(htmlStr)
        //因为选项是动态生成的，layui不能接收到，用render（）重新渲染表单区域
        form.render()
    })
}

//为筛选表单绑定submit事件
$('.layui-form').submit(function (e) {
    e.preventDefault
    //1.获取表单中选项值
    var cate_id = $('[name=cate_id]').val()
    var status = $('[name=status]').val()
    //2.将获取到的值，赋给q，get的参数，作为筛选条件
    q.cate_id = cate_id
    q.state = status
    //3.拿到新的条件，重新渲染页面
    initTable()
})

function renderPage(total) {
    // 1.点击页码的时候，会触发jump回调
    // 2.在initTable里调用了renderPage，而renderPage会调用jump，然后jump会在调用initTable
    // 所以陷入了死循环
    laypage.render({
        elem: 'test1', //注意，这里的 test1 是 ID，不用加 # 号
        count: total, //数据总数，从服务端得到
        limit: q.pagesize,
        curr: q.pagenum,
        layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
        limits: [2, 3, 5, 10],
        //分页发生切换的时候,jump触发回调
        jump: function (obj, first) {
            //obj是自带的参数，curr获得页码值
            //把最新的页码值赋给q这个查询参数对象中
            q.pagenum = obj.curr
            //把最新的条目数赋给q
            q.pagesize = obj.limit
            //直接在这调用会造成死循环
            //first是用来判断哪种调用方式
            //true为第二种
            if (!first) {
                initTable()
            }
        }
    })
}

//删除按钮的绑定事件
$('tbody').on('click', '.btn-del', function () {
    // 获取删除按钮的个数
    var len = $('.btn-del').length
    var id = $(this).attr('data-id')
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
        $.get('/my/article/delete/' + id, function (res) {
            if (res.status !== 0) return layer.msg('删除失败！')
            layer.msg('删除成功！')
            //在数据删除之后，要判断页码上是否还有数据
            if (len === 1) {
                // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                // 页码值最小必须是 1
                q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
            }
            initTable()
            layer.close(index)
        })
    })
})