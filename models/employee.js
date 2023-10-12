const mongoose = require('mongoose');
const { Schema } = mongoose;

const employeeSchema = new Schema( 
    { 
        firstName : {
            type: String,
            required : true,
        },
        lastName : {
            type : String,
            required : true,
        },
        dob : {
            type : String,
            required : true,
        },
        email : {
            type : String,
            required : true,
        },
        departmentId : {
            type : mongoose.Schema.Types.ObjectId,
            ref: 'Department',
            required : true,
        },
    },
    {
        timestamps : true,
    });
    
    
module.exports = mongoose.model('Employee', employeeSchema);