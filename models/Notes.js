const mongoose = require("mongoose");

const NotesSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // author: {
    //     type: String,
    //     required: true
    // },
    // authorImg: {
    //     type: String,
    //     required: true
    // },
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
    }
})
module.exports = mongoose.model('Notes', NotesSchema);