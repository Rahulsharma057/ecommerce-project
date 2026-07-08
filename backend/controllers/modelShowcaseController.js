const ModelShowcase = require("../models/ModelShowcase");
const cloudinary = require("../config/cloudinary");


// ==============================
// Get Visible Models Frontend
// ==============================

exports.getModels = async(req,res)=>{

try{


const data =
await ModelShowcase.find({
visible:true
})
.sort({
order:1
});



res.status(200).json({

success:true,
data

});



}catch(error){

res.status(500).json({

success:false,
message:error.message

});

}

};





// ==============================
// Get All Models Admin
// ==============================

exports.getAdminModels = async(req,res)=>{

try{


const data =
await ModelShowcase.find()
.sort({
order:1
});



res.status(200).json({

success:true,
data

});



}catch(error){

res.status(500).json({

success:false,
message:error.message

});

}

};






// ==============================
// Create Model
// ==============================

exports.createModel = async(req,res)=>{


try{


let image="";



if(req.file){


const base64 =
`data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;



const uploadResponse =
await cloudinary.uploader.upload(
base64,
{
folder:"model-showcase"
}
);



image =
uploadResponse.secure_url;


}





const model =
await ModelShowcase.create({

image,

title:req.body.title,

subtitle:req.body.subtitle,

description:req.body.description,

buttonText:req.body.buttonText,

buttonLink:req.body.buttonLink,


order:
Number(req.body.order)||1,


visible:
req.body.visible==="true" ||
req.body.visible===true


});





res.status(201).json({

success:true,

message:"Model Added Successfully",

data:model

});




}catch(error){


console.log(error);


res.status(500).json({

success:false,
message:error.message

});


}

};







// ==============================
// Update Model
// ==============================


exports.updateModel = async(req,res)=>{


try{


const model =
await ModelShowcase.findById(
req.params.id
);



if(!model){


return res.status(404).json({

success:false,
message:"Model Not Found"

});


}





// New Image

if(req.file){


const base64 =
`data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;



const uploadResponse =
await cloudinary.uploader.upload(
base64,
{
folder:"model-showcase"
}
);



model.image =
uploadResponse.secure_url;


}






model.title =
req.body.title ?? model.title;


model.subtitle =
req.body.subtitle ?? model.subtitle;



model.description =
req.body.description ?? model.description;



model.buttonText =
req.body.buttonText ?? model.buttonText;



model.buttonLink =
req.body.buttonLink ?? model.buttonLink;




if(req.body.order!==undefined){

model.order =
Number(req.body.order);

}





if(req.body.visible!==undefined){


model.visible =
req.body.visible==="true" ||
req.body.visible===true;


}




await model.save();




res.json({

success:true,

message:"Model Updated Successfully",

data:model

});





}catch(error){


res.status(500).json({

success:false,
message:error.message

});


}


};







// ==============================
// Delete Model
// ==============================


exports.deleteModel = async(req,res)=>{


try{


const model =
await ModelShowcase.findByIdAndDelete(
req.params.id
);



if(!model){


return res.status(404).json({

success:false,

message:"Model Not Found"

});


}



res.status(200).json({

success:true,

message:"Deleted Successfully"

});



}catch(error){


res.status(500).json({

success:false,

message:error.message

});


}


};







// ==============================
// Toggle Visibility
// ==============================


exports.toggleVisibility = async(req,res)=>{


try{


const model =
await ModelShowcase.findById(
req.params.id
);



if(!model){

return res.status(404).json({

success:false,
message:"Model Not Found"

});

}



model.visible =
!model.visible;



await model.save();



res.json({

success:true,

message:"Visibility Updated",

data:model

});



}catch(error){


res.status(500).json({

success:false,
message:error.message

});


}

};