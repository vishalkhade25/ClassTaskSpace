import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    recipient : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    type : {
        type: String,
        enum : ["new_assignment", "marks_assigned", "submission_received", "deadline_passed"],
        required : true
    },
    message : {
        type : String,
        required : true
    },
    relatedAssignment : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Assignment"
    },
    isRead : {
        type : Boolean,
        default : false
    }
},{
    timestamps : true
});

const notificationModel = mongoose.model("Notification", notificationSchema);

export default notificationModel;