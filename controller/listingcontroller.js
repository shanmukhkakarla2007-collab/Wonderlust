
const listing=require("../models/listing");



module.exports.alllistings=async (req,res)=>{
    const listings=await listing.find({});
    res.render("./listings/index.ejs",{listings});
};

module.exports.filterlistings=async (req,res)=>{
    let filtername=req.params.filtername;
    const listings=await listing.find({category:filtername});
    res.render("./listings/index.ejs",{listings});
};

module.exports.rendernew=(req,res)=>{
    res.render("./listings/new.ejs");
};

module.exports.createnew=async(req,res)=>{
    console.log(req.file);
    const url=req.file.path;
    const filename=req.file.filename;
    let addlisting=req.body.listing;
    const newlisting= new listing(addlisting);
    newlisting.owner=req.user._id;
    newlisting.image={filename,url};
    await newlisting.save();
    console.log(newlisting);
    req.flash("success","Listing was created");
    res.redirect("/listings");
};

module.exports.showlisting=async(req,res)=>{
   let {id}=req.params;
   let showlisting=await listing.findById(id).populate({"path":"reviews",populate:{"path":"author"}}).populate("owner");
   if(!showlisting){
      req.flash("error","listing was not found");
      res.redirect("/listings");
   }
   else{
      res.render("./listings/show.ejs",{listing:showlisting});
   }
}

module.exports.renderedit=async(req,res)=>{
    let {id}=req.params;
    let searchlisting=await listing.findById(id);
    if(!searchlisting){
        req.flash("error","Listing was not found");
        return res.redirect("/listings");
    }
    let originalurl=searchlisting.image.url;
    originalurl=originalurl.replace("/upload","/upload/w_250");
    res.render("./listings/edit.ejs",{listing:searchlisting,originalurl});
};

module.exports.update=async(req,res)=>{
    let newlisting=req.body.listing;
    let {id}=req.params;
    let uplisting=await listing.findByIdAndUpdate(id,{...newlisting},{runValidators:true,returnDocument: 'after'});
    if(typeof req.file !== "undefined"){
        const url=req.file.path;
        const filename=req.file.filename;
        uplisting.image={filename,url};
        await uplisting.save();
    }
    req.flash("success","Listing was updated");
    res.redirect(`/listings/${id}`);
};

module.exports.delete=async(req,res)=>{
    let {id}=req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success","Listing was deleted");
    res.redirect("/listings");
};

module.exports.searchlistings=async(req,res)=>{
    const {q}=req.query;
    const listings=await listing.find({
        $or:[
            {title: { $regex: q, $options: "i" }},
            {location: { $regex: q, $options: "i" }},
            {country: { $regex: q, $options: "i" }},
            {category: { $regex: q, $options: "i" }}
        ]
    });

    res.render("./listings/index.ejs",{listings});
}