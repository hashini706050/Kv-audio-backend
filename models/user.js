import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true, 
        unique : true
    },
    password :{
        type : String,
        required : true,
    },
    role :{
        type : String,
        required : true,
        default : "customer"
    },
    firstName :{
        type : String,
        required : true
    }, 
    lastName : {
        type :  String,
        required : true
    },
    address : {
        type :String,
        required : true
    },
    phone :{
        type : String,
        required : true
    },
    profilePicture : {
        type : String,
        required : true,
        default : "https://www.shutterstock.com/shutterstock/photos/1677509740/display_1500/stock-vector-default-avatar-profile-icon-social-media-user-vector-1677509740.jpg"
    }

})

const User = mongoose.models.User || mongoose.model("users", userSchema);

export default User;
