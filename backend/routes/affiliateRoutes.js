const express=require("express");

const router=express.Router();


const {

createAffiliate,
getAffiliate,
deleteAffiliate,
updateStatus

}=require("../controllers/affiliateController");



// public form

router.post(
"/",
createAffiliate
);



// admin

router.get(
"/admin",
getAffiliate
);



router.delete(
"/admin/:id",
deleteAffiliate
);



router.put(
"/admin/:id",
updateStatus
);



module.exports=router;