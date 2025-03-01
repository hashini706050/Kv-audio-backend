import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
        unique : true
    },
    name : {
        type : String,
        required : true
    },
    rating : {
        type : Number,
        required : true
    },
    comment : {
        type : String,
        required : true
    },
    profilePicture : {
        type : String,
        required : true,
        default : "https://www.shutterstock.com/shutterstock/photos/1677509740/display_1500/stock-vector-default-avatar-profile-icon-social-media-user-vector-1677509740.jpg"
    },
    date : {
        type : Date,
        required : true,
        default : Date.now()
    },
    isApproved : {
        type : Boolean,
        required : true,  
        default : false
    }

    })

const Review = mongoose.model("reviews",reviewSchema);

export default Review;