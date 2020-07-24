//用于直接操作相册和图片的模块
const fs=require('fs')
//专门用于删除非空文件夹的模块
const rf=require('rimraf')
const sd=require('silly-datetime')
const path=require('path')
/**
 * @method 读取某个文件夹的内容
 * @param {String} dirName 被读取的文件夹名称或路径
 * @param {Function} callback 回调函数
 */

exports.getDirs=function(dirName,callback){
  fs.readdir(dirName,function(err,files){
    callback(err,files);
    /* if(err){
      callback(err,null);
      return ;
    }
    callback(null,files); 
    如果这么写的话 没办法同时传递err信息 和files信息 所以可以同时传递回去 
    具体的操作由其他页面完成
    */
  })

}
/**
 * @method 根据传递进来的路径创建对应的文件夹
 * @param {String} dirName 文件夹路径
 * @param {Function} callback 回调函数
 */
exports.create=function(dirName,callback){
  fs.mkdir(dirName,function(err){
    callback(err)
  })
}
/**
 * @method 根据传递进来的路径删除对应的文件夹
 * @param {String} dirName  被删除的文件夹名称
 * @param {Function} callback  回调函数
 */
exports.delete=function(dirName,callback){
  rf(dirName,function(err){
    callback(err)
  })
}
/**
 * @method 根据传进来的文件夹名称和文件对象 修改其保存路径及文件名称
 * @param {String} dirName  保存的路径
 * @param {File} pic  被操作的文件对象
 * @param {Funtion} callback 回调函数
 */
exports.rename=function(dirName,pic,callback){
  //获取文件的旧路径
  var oldPath=pic.path;
  //获取文件的旧名称
  var name=pic.name;
  //获取文件的后缀名
  //字符串根据最后一个点的位置截取
  // var ext=name.substring(name.lastIndexOf('.'));
  //还可以根据.来拆分成数组 然后获取数组的最后一个元素 然后拼接上.即可
  /* var arr=name.split('.')
  var ext= '.'+arr[arr.length-1] */
  var ext=path.extname(name);//.xxx  引入node的path模块
  //设置新的文件名  上传时间+随机数+后缀名
  // var n = new Date().getTime();
  var str = sd.format(new Date,"YYYYMMDDHHmmss")+Math.floor(Math.random()*1000)+ext;//20200723185546xxx.jpg
  //修改路径  newpath中的./uploads的./可以去掉
  var newPath='./uploads/'+dirName+'/'+str;
  fs.rename(oldPath,newPath,function(err){
    callback(err);
  })

}