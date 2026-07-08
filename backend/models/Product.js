const mongoose = require("mongoose");


const productSchema = new mongoose.Schema(
{
  name:{
    type:String,
    required:true,
  },


  price:{
    type:Number,
    required:true,
  },


  originalPrice:{
    type:Number,
    default:0,
  },


  discount:{
    type:Number,
    default:0,
  },


  category:{
    type:String,
    required:true,
  },


  fabric:{
    type:String,
    default:"",
  },


  sizes:[
    {
      type:String
    }
  ],


  colors:[
    {
      type:String
    }
  ],


  stock:{
    type:Number,
    required:true,
    default:0,
  },


  images:[
    {
      type:String
    }
  ],



  description:{
    type:String,
    default:"",
  },



  isNewArrival:{
    type:Boolean,
    default:false,
  },


  isSale:{
    type:Boolean,
    default:false,
  },


  isFeatured:{
    type:Boolean,
    default:false,
  },



  reviews:[
    {
      userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
      },

      name:String,

      rating:Number,

      comment:String,

      createdAt:{
        type:Date,
        default:Date.now,
      }

    }
  ],



  numReviews:{
    type:Number,
    default:0,
  },


  ratings:{
    type:Number,
    default:0,
  }


},
{
 timestamps:true
}
);


module.exports = mongoose.model(
"Product",
productSchema
);