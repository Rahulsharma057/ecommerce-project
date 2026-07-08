const LuxuryStory = require("../models/LuxuryStory");
const cloudinary = require("../config/cloudinary");
exports.getLuxuryStory = async (req, res) => {
  try {
    let story = await LuxuryStory.findOne();

    if (!story) {
      story = await LuxuryStory.create({
        image: "",
        tagline: "OUR STORY",
        title: "Wear Luxury. Live Elegance.",
        description:
          "Veloura creates premium fashion inspired by modern elegance.",

        established: "EST. 2026",

        floatingTitle: "Crafted with Precision",

        floatingDescription:
          "Every collection is designed to balance elegance, comfort and timeless luxury.",

        statOne: {
          number: "50K+",
          title: "Happy Customers",
        },

        statTwo: {
          number: "120+",
          title: "Premium Collections",
        },

        statThree: {
          number: "98%",
          title: "Customer Satisfaction",
        },

        buttonText: "Discover Collection",

        buttonLink: "/products",
      });
    }

    res.json({
      success: true,
      data: story,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.updateLuxuryStory = async (req,res)=>{
try{

let story = await LuxuryStory.findOne();


let imageUrl = story?.image || "";


// agar new image upload hui
if(req.file){

const result =
await cloudinary.uploader.upload(
`data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
{
folder:"veloura/luxury-story"
}
);


imageUrl = result.secure_url;

}



const updateData = {

...req.body,

image:imageUrl

};



if(!story){

story = await LuxuryStory.create(updateData);

}
else{


story =
await LuxuryStory.findByIdAndUpdate(
story._id,
updateData,
{
new:true
}
);


}



res.json({

success:true,

message:"Luxury Story Updated",

data:story

});


}
catch(err){

res.status(500).json({

success:false,

message:err.message

});

}

};


exports.upload = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload_stream(
      {
        folder: "veloura",
      },
      (error, result) => {
        if (error) {
          return res.status(500).json({
            success: false,
            message: error.message,
          });
        }

        res.json({
          success: true,
          url: result.secure_url,
        });
      }
    );

    result.end(req.file.buffer);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.deleteLuxuryStory = async(req,res)=>{

try{

const story = await LuxuryStory.findOne();


if(!story){

return res.status(404).json({
success:false,
message:"Luxury Story not found"
});

}


await LuxuryStory.findByIdAndDelete(story._id);


res.json({
success:true,
message:"Luxury Story deleted successfully"
});


}
catch(err){

res.status(500).json({
success:false,
message:err.message
});

}

};
exports.toggleLuxuryStoryStatus = async(req,res)=>{

try{

const story = await LuxuryStory.findOne();


if(!story){

return res.status(404).json({
success:false,
message:"Luxury Story not found"
});

}


story.status = !story.status;


await story.save();



res.json({

success:true,

message:"Status Updated",

data:story

});


}
catch(err){

res.status(500).json({

success:false,

message:err.message

});

}


};