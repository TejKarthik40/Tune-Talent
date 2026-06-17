const mongoose = require('mongoose')

let userschema = new mongoose.Schema({
    username :{type : String,required : true},
    email :{type : String,required : true},
    password :{type : String,required : true},
    bio : {type : String},
    profileimage : {type : String},
    phone : {type : Number}
})

module.exports = mongoose.model('User', userschema);