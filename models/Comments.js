const mongoose = require("mongoose");

const CommentsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Notes',
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
})
module.exports = mongoose.model('Comments', CommentsSchema);