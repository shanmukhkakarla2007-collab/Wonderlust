const review=require("../models/review");
const listing=require("../models/listing.js");



module.exports.newreview=async(req,res)=>{
    
    let addreview=req.body.review;

    let oldlisting=await listing.findById(req.params.id);
    let newreview=new review(addreview);
    newreview.author=req.user._id;
    oldlisting.reviews.push(newreview);
    await newreview.save();
    await oldlisting.save();
    req.flash("success","Review was created");
    res.redirect(`/listings/${req.params.id}`);
};

module.exports.deletereview=async(req,res)=>{
    let {id,reviewid}=req.params;
    let deletedreview=  await review.findByIdAndDelete(reviewid);
    await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
    req.flash("success","Review was deleted");
    res.redirect(`/listings/${id}`);
};