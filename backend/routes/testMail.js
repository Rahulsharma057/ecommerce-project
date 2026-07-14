const express = require("express");
const router = express.Router();

const sendOtpEmail = require("../utils/sendOtpEmail");

router.get("/", async (req,res)=>{

  try{

    await sendOtpEmail(
      "YOUR_TEST_EMAIL@gmail.com",
      "123456"
    );

    res.json({
      message:"Mail sent"
    });

  }catch(err){

    console.log("MAIL ERROR:",err);

    res.status(500).json({
      error:err.message
    });

  }

});


module.exports = router;