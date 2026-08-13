import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true
    },
    password : {
        type : String,
        required : true
    },
    role : {
        type : String,
        enum : ['teacher', 'student'],
        required : true
    }
},{
    timestamps : true
});

const userModel = mongoose.model('User', userSchema);

export default userModel;