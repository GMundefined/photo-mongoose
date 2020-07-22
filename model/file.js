//用于直接操作相册和图片的模块
const fs=require('fs')
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