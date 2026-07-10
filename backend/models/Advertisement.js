const mongoose = require("mongoose");


const advertisementSchema = new mongoose.Schema(
{
    title:{
        type:String,
        required:true
    },

    subtitle:{
        type:String,
        default:""
    },


    image:{
        type:String,
        required:true
    },


    discount:{
        type:String,
        default:""
    },
   description:{
        type:String,
        default:""
    },

    buttonText:{
        type:String,
        default:"Shop Now"
    },


    buttonLink:{
        type:String,
        default:"/products"
    },


    status:{
        type:Boolean,
        default:true
    },


},
{
    timestamps:true
});


module.exports =
mongoose.model(
"Advertisement",
advertisementSchema
);