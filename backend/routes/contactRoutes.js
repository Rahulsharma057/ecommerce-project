const express = require("express");

const router = express.Router();

const {
createContact,
getAllContacts,
deleteContact

}=require("../controllers/contactController");



// Website Contact Form

router.post(
"/",
createContact
);


// Admin

router.get(
"/admin",
getAllContacts
);


router.delete(
"/admin/:id",
deleteContact
);


module.exports = router;