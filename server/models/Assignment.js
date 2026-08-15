import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
    },
    description : {
        type : String,
    },
    pdfUrl : {
        type : String,
        required : true
    },
    class : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Class',
        required : true
    },
    deadline : {
        type : Date,
        required : true
    },
    teacher : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    }
},{
    timestamps : true
});

const assignmentModel = mongoose.model('Assignment',assignmentSchema);

export default assignmentModel;