const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    },
    gender:{
        type: String,
        enum: ['M','F','NA']
    },
    dob:{
        type: String
    },
    profileImg:{
        type: String,
        default: 'uploads/user.png'
    },
    bio:{
        type: String
    },
    // education:{
    //     type: String
    // },
    // workStatus:{
    //     type: String
    // },
    city: {
        type: String
    }
})
module.exports = mongoose.model('User',UserSchema);