//创建相册相关的路由
const express=require('express')
const router =express.Router();
const fs=require('fs')
const rf=require('rimraf')
// fs-txra 可以合并fs和rimraf
const {Dir}=require('../model/db.js')
const {SUCCESS , FAILED}=require('../status.js')
//处理dir请求 显示服务器上所有的相册
router.get('/',function(req,res){
  //从数据库获取当前服务器上有哪些文件夹
  // null不可以省略 find() 第一个参数是查找的条件 第二个参数是查找的范围 第三个才是排序
  Dir.find({},null,{sort:{name:1}},function(err,dirs){
    if(err){
      console.log(err)
      res.render('error',{errMsg:"获取文件夹失败"})
      return ;
    }
    //dirs是一个对象数组
    res.render('index',{dirs:dirs})
  })
});

//处理get方式的 /dir/mkdir请求 跳转到新建相册页面
router.get('/mkdir',function(req,res){
  //跳转到创建页面
  //该页面不需要渲染数据 所以不需要传递数据过去
  res.render('create');
})
//处理post方式的 /dir/mkdir请求 创建相册 ajax请求
router.post('/mkdir',function(req,res){
  //获取请求参数dirName app.js已经设置过解析方式
  var dirName=req.body.dirName;
  //检查dirName的合法性
  if(!dirName){
    res.send({status:FAILED,msg:"相册名不合法"})
    return ;
  }
  //fs模块创建文件夹 保持进数据库
  fs.mkdir('./uploads/'+dirName,function(err){
    if(err){
      console.log(err)
      res.send({status:FAILED,msg:"创建失败"})
      return ;
    }
    //创建成功 保持到数据库    
    /*此时存在保持数据库失败的情况 保持失败则需要删除文件夹 但是删除文件夹也会存在失败的情况 就会陷入死循环 */
    var o =new Dir({name:dirName})
    o.save(function(err,d){
      res.send({status:SUCCESS,msg:"创建成功"})
    })
  })
})
//处理get方式的 /dir/check请求 ajax请求 获取传递过来的参数 并检查文件夹名称是否存在
router.get('/check',function(req,res){
  //获取参数
  var dirName =req.query.dirName;
  if(!dirName){//如果传递过来的是空字符串  返回状态1 
    res.send({status:FAILED,msg:"文件夹名称不能为空"})
    return ;
  }
  //判断dirName是否已存在
  Dir.find({name:dirName},function(err,dirs){
    if(err){
      console.log(err)
      res.send({status:FAILED,msg:"网络波动"})
      return ;
    }
    //判断dirs
    if(dirs.length>0){//找到了数据
      res.send({status:FAILED,msg:"文件夹已存在"})
    }else{
      res.send({status:SUCCESS,msg:"文件夹名称可以使用"})
    }
  })
  
})

//处理/dir/delete请求 删除相册
router.get('/delete',function(req,res){
  //获取参数
  var dirName =req.query.dirName.trim();
  if(!dirName){//参数不合法
    res.send({status:FAILED,msg:'参数不合法'})
    return ;
  }
  rf('./uploads/'+dirName,function(err){
    if(err){
      res.send({status:FAILED,msg:"删除失败"})
      return ;
    }
    //删除文件成功 删除数据库中的记录
    Dir.deleteOne({name:dirName},function(err,raw){
      res.send({status:SUCCESS,msg:"删除成功"})
    })
  })
})


//暴露路由
module.exports=router;