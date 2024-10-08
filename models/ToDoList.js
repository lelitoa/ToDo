const mongoose = require('mongoose');
const {Schema} = mongoose;

const toDoSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    url: {type: String, required: false},
    isCompleted: {type: Boolean, required: true},
    completedOn: String,
    createdBy: {
        ref: "User",
        type: Schema.ObjectId
    },
    dueDate: { type: Date, required: false }
},
{
    timestamps: true
});

const ToDo = mongoose.model("ToDo", toDoSchema);

module.exports = ToDo;