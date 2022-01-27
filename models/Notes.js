const mongoose = require("mongoose");

const NotesSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    tag: {
        type: String,
        default: "General"
    },
    status:{
        type: String,
        enum: ['private', 'public'],
        default: "public"
    },
    date:{
        type: Date,
        default: Date.now
    },
    likes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
})
module.exports = mongoose.model('Notes', NotesSchema);