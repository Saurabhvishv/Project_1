const mongoose = require("mongoose");


var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};



const authorSchema = new mongoose.Schema({
     fname: { 
        type: String,
        required: 'first name is required'
    },
     lname: {
        type: String,
        required: 'last name is required'
     },
      title: {   
        required: true,
         type: String, enum: [ 'Mr' , 'Mrs', 'Miss'] 
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            unique: true,
            required: 'Email address is required',
            validate: [validateEmail, 'Please fill a valid email address'],
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
        },
        password: {
            type: String,
            required: 'passward is required'
        } 
    },  { timestamps: true})


module.exports = mongoose.model('myauthor', authorSchema)



