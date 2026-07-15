if(process.env.NODE_ENV!=="production"){
    require('dotenv').config();
}



//express 
const express=require("express");
const app=express();

// used for connectoion
const mongoose=require("mongoose"); 
const dburl=process.env.ATLASDB_URL

//getting models from models folder
const listing=require("./models/listing.js");
const review=require("./models/review.js");
const user=require("./models/user.js");


const path=require("path");

//used to convert post request into put or delete requests
const methodOverride = require('method-override');
const ejsmate=require('ejs-mate');
const ExpressError=require("./utils/ExpressError.js");
const wrapAsync=require("./utils/wrapAsync.js");
const {listingSchema,reviewSchema}=require("./schema.js");

//routes
const listingrouter=require("./routes/listing.js"); 
const reviewrouter=require("./routes/review.js");   
const userrouter=require("./routes/user.js");     

const session=require("express-session");
const {MongoStore} = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");





app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.engine("ejs",ejsmate);
app.use(express.static(path.join(__dirname,"/public")));



// connection of our server with mongoDB
main()
    .then((res)=>{
        console.log("connection is successfully created");
    })
    .catch((err)=>{
       console.log(err);
    })
async function main(){
    await mongoose.connect(dburl);
}


const store= MongoStore.create({
    mongoUrl: process.env.ATLASDB_URL,
    crypto: {
       secret: process.env.SECRET
    },
    touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("ERROR in MONGO SESSION STORE", err);
});
//session middleware
const sessionoptions={
   secret: process.env.SECRET,
   store:store,
   resave: false,
   saveUninitialized: true,
   cookie: {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
}
app.use(session(sessionoptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());




app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currentuser=req.user;
    next();
})





// directing the incoming request to their respective route
app.use("/",userrouter);
app.use("/listings",listingrouter);
app.use("/listings/:id/reviews",reviewrouter);
// error generation for invalid request
app.use((req,res,next)=>{
    next(new ExpressError(404,"page not found"));
});


// error handling middleware
app.use((err,req,res,next)=>{
   let {status=500,message="something went wrong"}=err;
   console.error(err);
   res.status(status).render("error.ejs",{err});
});

app.listen(3000,()=>{
    console.log("app is listining at port 3000");
})
