const Affiliate = require("../models/Affiliate");



// CREATE APPLICATION

exports.createAffiliate = async(req,res)=>{

try{


const affiliate = await Affiliate.create(
req.body
);


res.status(201).json({

success:true,

message:"Affiliate application submitted",

data:affiliate

});


}
catch(error){


res.status(500).json({

success:false,

message:error.message

});


}


};






// ADMIN GET ALL

exports.getAffiliate = async(req,res)=>{

try{


const data = await Affiliate
.find()
.sort({
createdAt:-1
});


res.json({

success:true,

data

});


}
catch(error){


res.status(500).json({

message:error.message

});


}


};






// DELETE

exports.deleteAffiliate = async(req,res)=>{


try{


await Affiliate.findByIdAndDelete(
req.params.id
);



res.json({

success:true,

message:"Deleted successfully"

});


}
catch(error){


res.status(500).json({

message:error.message

});


}


};





// UPDATE STATUS

exports.updateStatus = async(req,res)=>{


try{


const data =
await Affiliate.findByIdAndUpdate(

req.params.id,

{
status:req.body.status
},

{
new:true
}

);



res.json({

success:true,

data

});


}
catch(error){

res.status(500).json({

message:error.message

});

}


};