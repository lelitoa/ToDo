const mongoose = require('mongoose');
const {Schema} = mongoose;

const toDoSchema = new Schema({
    title: {type: String, required: true},
    descripton: {type: String, required: true},
    isCompleted: {type: String, required: true},
    completedOn: String,
    createdBy: {
        ref: "User",
        type: Schema.ObjectId
    }
},
{
    timestamps: true
});

const ToDo = mongoose.model("ToDo", toDoSchema);

module.exports = ToDo;