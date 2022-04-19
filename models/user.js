const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const storeSchema = new Schema({
    firstName:{
        type: String, 
        required: true,
    },
    lastName:{
        type: String, 
        required: true,
    },
    email:{
        type: String, 
        unique: true,
        required: true,
    },
    password:{
        type:String,
        required: true,
    },
    rol:{
        type:String,
        enum:['admin', 'user'],
        default: 'user',
    },
    status: {
        type: Boolean,
        default: true
    },
    date: { 
        type: Date, default: Date.now 
    },
});

const User = mongoose.model('User', storeSchema);

module.exports = {User}