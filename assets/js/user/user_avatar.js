// 1.1 获取裁剪区域的 DOM 元素
var $image = $('#image')
// 1.2 配置选项
const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
}

// 1.3 创建裁剪区域
$image.cropper(options)


$('#btnfile').on('click', function () {
    $('#file').click()
})

var layer = layui.layer


$('#file').on('change', function (e) {
    //获取用户所选择的文件
    var fileList = e.target.files
    if (fileList.length === 0)
        return layer.msg('请选择照片！')

    //更换裁剪区域图片功能
    //1.拿到用户所选择的的文件
    var file = e.target.files[0]
    //2.将文件转为路径
    var newImgURL = URL.createObjectURL(file)
    //3.重新初始化剪裁区域
    $image
        .cropper('destroy')      // 销毁旧的裁剪区域
        .attr('src', newImgURL)  // 重新设置图片路径
        .cropper(options)        // 重新初始化裁剪区域

})

//为确定按钮绑定点击事件
$('.layui-btn-danger').on('click', function () {
    var dataURL = $image
        .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 100,
            height: 100
        }).toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
    $.post('/my/update/avatar', { avatar: dataURL }, function (res) {
        if (res.status !== 0) return layer.msg('更换头像失败')
        layer.msg('更换头像成功')
    })
    window.parent.getUserInfo()
})