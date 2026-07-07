const mongoose = require("mongoose");


const affiliateSchema = new mongoose.Schema(
{

name:{
type:String,
required:true
},


email:{
type:String,
required:true
},


phone:{
type:String,
required:true
},


instagram:{
type:String,
default:""
},


followers:{
type:String,
default:""
},


message:{
type:String,
default:""
},


status:{
type:String,
enum:[
"New",
"Approved",
"Rejected"
],
default:"New"
}


},
{
timestamps:true
}
);


module.exports = mongoose.model(
"Affiliate",
affiliateSchema
);