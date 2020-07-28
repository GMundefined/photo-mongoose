//创建图片相关的路由
const express=require('express');
const {SUCCESS , FAILED}=require('../status.js')
const router =express.Router();
const fs=require('fs')
const {Pic,Dir}=require('../model/db.js')
const fd=require('formidable')

//处理 /pic/show 请求 展示某个相册的内容
router.get('/show',function(req,res){
  //获取请求参数 得到被点击的相册名称
  var dir=req.query.dirName.trim();
  /* var reg=new RegExp("/"+dir+"/")  这里可以不设置dir 但是在保持name的时候需要设置路径
  Pic.find({name:{$regex:reg}},function(err,res){}) */
  Pic.find({dir:dir},function(err,pics){
    console.log(err)
    res.render('show',{pics:pics,dir:dir})
  })
})
//处理get方式传递过来的 /pic/upload 请求 跳转至上传页面
router.get('/upload',function(req,res){
  //在上传图片时  需要知道将图片传到哪个相册中
  //获取uploads下所有的相册名
  Dir.find({},function(err,dirs){
    console.log(err)
    res.render('upload',{dirs:dirs})
  })
})

//处理post 方式的/pic/upload请求 上传图片
router.post('/upload',function(req,res){
  //处理图片的上传
  //创建对象
  // var form=fd();
  var form=new fd.IncomingForm();
  //设置上传临时保持路径
  form.uploadDir='./temp';
  form.parse(req,function(err,fields,files){//解析数据
    if(err){
      console.log(err)
      res.render('error',{errMsg:'上传图片失败'})
      return ;
    }
    //获取表单中的数据
    //文本域数据:选择的文件夹名称
    var dirName=fields.dirName;
    //获取图片对象
    var pic=files.pic;
    //获取图片名称 
    var name=pic.name;
    //旧路径
    var oldPath=pic.path
    //新路径 ./uploads/dir/xxx.jpg
    var newPath= './uploads/'+dirName+'/'+name;
    fs.rename(oldPath,newPath,function(err){
      console.log(err)
      //保持进数据库
      var o=new Pic({
        name:name,
        dir:dirName
      })
      o.save(function(err,product){
        console.log(err)
        console.log(product)
        res.redirect('/pic/show?dirName='+dirName);
      })
    })
    
  })

})












//暴露路由
module.exports=router;