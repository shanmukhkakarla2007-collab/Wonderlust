
const mongoose=require("mongoose");
const schema=mongoose.Schema;
const passportlocalmongoose=require("passport-local-mongoose").default;



const userschema=schema({
    email:{
        type:String,
        required:true
    }
})

// adds  fields like username,salt,hash to the schema and also functions like register(),authenticate(),serializeUser(),deserializeUser()
userschema.plugin(passportlocalmongoose);

module.exports=mongoose.model("user",userschema);