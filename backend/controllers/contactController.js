const Contact = require("../models/Contact");


// Save Contact Form

exports.createContact = async(req,res)=>{

    try{

        const data = await Contact.create(req.body);


        res.status(201).json({
            success:true,
            message:"Message Sent",
            data
        });


    }
    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};




// Admin View

exports.getAllContacts = async(req,res)=>{

    try{

        const contacts = await Contact
        .find()
        .sort({
            createdAt:-1
        });


        res.json({
            success:true,
            data:contacts
        });


    }
    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};




// Delete

exports.deleteContact = async(req,res)=>{

    try{

        await Contact.findByIdAndDelete(req.params.id);


        res.json({
            success:true,
            message:"Deleted"
        });


    }
    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};