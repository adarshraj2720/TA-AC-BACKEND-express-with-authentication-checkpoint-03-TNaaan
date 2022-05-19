var mongoose = require('mongoose');
var schema = mongoose.Schema;

var incomeSchema = new schema({
    source:{type:String},
    amount:Number,
    date:{type:Date},
    userID :[{type:schema.Types.ObjectId,ref:"User"}],

},{
    timestamps:true
})

var Income = mongoose.model('Income',incomeSchema)

module.exports=Income;