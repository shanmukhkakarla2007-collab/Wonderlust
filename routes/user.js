const express=require("express");
const router=express.Router();
const user=require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {isurl}=require("../middleware");
const usercontroller=require("../controller/usercontroller.js");



router
    .route("/signin")
    .get(usercontroller.rendersignin)
    .post(wrapAsync(usercontroller.signin));

router
    .route("/login")
    .get(usercontroller.renderlogin)
    .post(isurl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),wrapAsync(usercontroller.login));


router.get("/logout",usercontroller.logout);


module.exports=router;


