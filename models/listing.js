const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const review=require("./review");
const user=require("./user");
const { required } = require("joi");

const listingschema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        filename:String,
        url:String
    },
    price:{
        type:Number,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    reviews:[{
       type: Schema.Types.ObjectId,
       ref:"review"
    }],
    owner:{
       type: Schema.Types.ObjectId,
       ref:"user"
    },
    category:{
        type:String,
        required:true,
        enum:["Mountains","Castles","Amazing pools","Iconic cities","Trending","Rooms","Camping","Farms","Arcitic","Domes","Boats"]
    }
})

//mongoose middleware for deleting the reviews of a listing
listingschema.post('findOneAndDelete',async (deletedlisting)=>{
    if(deletedlisting){
        await review.deleteMany({_id:{$in:deletedlisting.reviews}});
    }
})


let listing=mongoose.model("listing", listingschema);
module.exports = listing;