const express=require("express");
const router=express.Router({mergeParams:true});

const listing=require("../models/listing.js");
const review=require("../models/review.js");
const ExpressError=require("../utils/ExpressError.js");
const wrapAsync=require("../utils/wrapAsync.js");
const {reviewSchema}=require("../schema.js");
const {validatereview,isloggedin,isauthor}=require("../middleware.js");
const reviewcontroller=require("../controller/reviewcontroller.js");



//creating a new review from data
router.post("/",isloggedin,validatereview,wrapAsync(reviewcontroller.newreview));
//deleting the old review
router.delete("/:reviewid",isloggedin,isauthor,wrapAsync(reviewcontroller.deletereview));

module.exports=router;