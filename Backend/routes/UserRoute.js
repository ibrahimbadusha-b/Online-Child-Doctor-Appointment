const express=require('express');
const { storeUser, getusers, singleUser, cancelAppointment } = require('../controllers/userController');

const router=express.Router();

router.route("/storeUserData").post(storeUser);
router.route("/getUsersData").get(getusers)
router.route("/singleUserData/:email").get(singleUser)
router.route("/cancelAppointment/:id").delete(cancelAppointment)
module.exports=router;