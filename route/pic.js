//创建图片相关的路由
const express=require('express');
const {SUCCESS , FAILED}=require('../status.js')
const router =express.Router();
const file =require('../model/file.js')
const fd=require('formidable')
//处理 /pic/show 请求 展示某个相册的内容
router.get('/show',function(req,res){
  //获取请求参数 得到被点击的相册名称
  var dir=req.query.dirName.trim();
  if(!dir){  
    res.render('error',{errMsg:"获取相册出错"})
    return ;
  }
  //调用file里面的getDirs方法 获取文件夹中的内容
  dirName='uploads/'+dir;
  file.getDirs(dirName,function(err,files){
    if(err){//读取错误
      console.log(err);
      res.render('error',{errMsg:"读取相册内容失败"});
      return ;
    }
    //读取成功
    res.render('show.ejs',{files:files,dirName:dir});
  }) 
})


//处理get方式传递过来的 /pic/upload 请求 跳转至上传页面
router.get('/upload',function(req,res){
  //在上传图片时  需要知道将图片传到哪个相册中
  //获取uploads下所有的相册名
  file.getDirs('./uploads',function(err,dirs){
    if(err){
      console.log(err);
      res.render('error',{errMsg:"获取相册出错"});
      return ;
    }
    //获取到相册 将其传递给上传页面
    res.render('upload',{dirs:dirs});
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
    //调用file.js暴露的rename方法处理图片 修改图片名称 和替换存储路径
    file.rename(dirName,pic,function(err){
      if(err){
        console.log(err)
        res.render('error',{errMsg:'图片上传失败'})
        return ;
      }
      //上传成功 跳转到上传图片的文件夹中 显示图片
      res.redirect('/pic/show?dirName='+dirName);//重定向

    });
  })

})












//暴露路由
module.exports=router;