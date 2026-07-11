
const user=require("../models/user");

module.exports.rendersignin=(req,res)=>{
    res.render("./users/signin.ejs");
}

module.exports.signin=async (req,res)=>{

    try {
        let {username,email,password}=req.body;
        let newuser= new user({
            username,
            email
        });
        const registereduser=await user.register(newuser,password);
        req.login(registereduser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","welcome to wonderlust");
            res.redirect("/listings");
        })
    } catch (error) {
        req.flash('error',error.message);
        res.redirect("/signin");
    }
}

module.exports.renderlogin=(req,res)=>{
    res.render("./users/login.ejs");
};

module.exports.login=async(req,res)=>{
    req.flash("success","welcome to wonderlust");
    const url=res.locals.url||"/listings";
    res.redirect(url);
};

module.exports.logout=(req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","logged out successfully");
        res.redirect("/listings");
    })
};