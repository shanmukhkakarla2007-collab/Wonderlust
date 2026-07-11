
const { required } = require('joi');

const mongoose=require('mongoose');
const {Schema}=mongoose;
const user=require('./user');

const reviewSchema=new Schema({
    comment:String,
    rating:{
        type:Number,
        min:1,
        max:5,
    },
    created_At:{
        type:Date,
        default:Date.now()
    },
    author:{
        type: Schema.Types.ObjectId,
        ref:"user"
    }
});

const review=mongoose.model('review',reviewSchema);

module.exports=review;