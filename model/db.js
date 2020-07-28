const mongoose=require('mongoose')
//创建dirSchema和picSchema
var dirSchema=new mongoose.Schema({
  name:String
})
var picSchema = new mongoose.Schema({
  name:String,
  dir:String
})
//创建对应的model
var Dir=mongoose.model('dir',dirSchema)
var Pic=mongoose.model('pic',picSchema)
//连接数据库
const url="mongodb://localhost:27017/web"
const opt={useNewUrlParser:true,useUnifiedTopology:true}
mongoose.connect(url,opt)






module.exports={
  Dir:Dir,
  Pic:Pic
}