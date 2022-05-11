var mongoose = require('mongoose');
var schema = mongoose.Schema;

var expenseSchema = new schema({
    category:{type: String},
    amount:Number,
    date:{type:Date},
    userID :[{type:schema.Types.ObjectId,ref:"User"}],

},{
    timestamps:true
})

var Expense = mongoose.model('Expense',expenseSchema)

module.exports=Expense;