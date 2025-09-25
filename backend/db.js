const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/paytm')

// create a schema for users 
const userSchema = new mongoose.schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        minLength:3,
        maxLength:30
    },
    password:{
        type:String,
        required:true,
        trim:true,
        maxLength:30
    },
    firstName:{
        type:String,
        required:true,
        trim:true,
        maxLength:50
    },
    lastName:{
        type:String,
        required:true,
        trim:true,
        maxLength:50
    }
});

// schema for account
const accountSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    balance:{
        type:Number,
        required:true
    }
});

// create a model from the schema 
const User = mongoose.model('User',userSchema);


// account model for the schema
const Account = mongoose.model('Account',accountSchema);


// module exporting
module.exports={
    User,Account
};