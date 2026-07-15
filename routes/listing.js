const express=require("express");
const router=express.Router();

const listing=require("../models/listing.js");
const review=require("../models/review.js");
const ExpressError=require("../utils/ExpressError.js");
const wrapAsync=require("../utils/wrapAsync.js");
const {listingSchema}=require("../schema.js");
const {isloggedin,isowner,validatelisting}=require("../middleware");
const  listingcontroller=require("../controller/listingcontroller.js");
const multer = require("multer");
const {storage}=require("../cloudConfig.js");
const upload = multer({storage});


router
    .route("/")
    .get(wrapAsync(listingcontroller.alllistings))
    .post(isloggedin,upload.single("listing[image]"),validatelisting,wrapAsync(listingcontroller.createnew));

router.get("/new",isloggedin,listingcontroller.rendernew);
router.get("/filter/:filtername",listingcontroller.filterlistings);
router.get("/search",listingcontroller.searchlistings);

router
    .route("/:id")
    .get(wrapAsync(listingcontroller.showlisting))
    .put(isloggedin,isowner,upload.single("listing[image]"),validatelisting,wrapAsync(listingcontroller.update))
    .delete(isloggedin,isowner,wrapAsync(listingcontroller.delete));

router.get("/:id/edit",isloggedin,isowner,wrapAsync(listingcontroller.renderedit));


module.exports=router;