const listing = require("./models/listing");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema}=require("./schema.js");
const {reviewSchema}=require("./schema.js");
const review = require("./models/review.js");

module.exports.isloggedin=(req,res,next)=>{
    if(!req.isAuthenticated()){
        if(req.method === "GET"){
            req.session.url = req.originalUrl;
        }
        req.flash("error","you must loggedin");
        return res.redirect("/login");
    }
    next();
};

module.exports.isurl=(req,res,next)=>{

    if(req.session.url){
        res.locals.url=req.session.url;
    }
    next();
}

module.exports.isowner=async(req,res,next)=>{
    const {id}=req.params;
    const searchedlisting= await listing.findById(id);
    if(!searchedlisting.owner.equals(res.locals.currentuser._id)){
       req.flash("error","you are not the owner");
       return res.redirect(`/listings/${id}`)
    }
    next();
}

module.exports. validatelisting=(req,res,next)=>{
    const {error}=listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }
    else{
        next();
    }
}

module.exports.validatereview=(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }
    else{
        next();
    }
}

module.exports.isauthor=async(req,res,next)=>{

    const {id,reviewid}=req.params;
    const searchedreview=await review.findById(reviewid);
    if(!searchedreview.author.equals(res.locals.currentuser._id)){
        req.flash("error","you are not the author");
        return res.redirect(`/listings/${id}`);
    }
    next();

}