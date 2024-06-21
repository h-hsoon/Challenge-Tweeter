const mongoose = require('mongoose');


const userSchama = new mongoose.Schema({
    firstName :{
        type: String,
        required: false,
        
    },
    lastName :{
        type: String,
        required: false,
        
    },
    email:{
        type: String,
        required: true,
    },
    password : {
        type: String,
        required: true,
    },
    tweet: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tweet'
    }]

});

module.exports = mongoose.model("user", userSchama);