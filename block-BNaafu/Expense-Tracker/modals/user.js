var mongoose = require('mongoose');
var schema = mongoose.Schema;
var bcrypt =require('bcrypt')

var userSchema = new schema({
    name : {type : String},
    email : {type : String ,unique : true},
    password :{type : String ,minlength : 5 , required : true} ,
    age:{type:Number},
    phone:{type:Number},
    country:{type : String },
    isAdmin:{type : Boolean},
    
} )



userSchema.pre('save',function(next){

    console.log(this,'This in the pre')
    //all admin
    let alladmin=["adarsh@123"];
    if(alladmin.includes(this.email)){
        this.isAdmin= true;
    }else{
        this.isAdmin= false;
    }

    if(this.password && this.isModified ('password')){
        bcrypt.hash(this.password,10,(err,hashed)=>{
            if(err) return next(err)
            this.password = hashed;
            return next()
        })
    }else{
        next()
    }
})


userSchema.methods.verifypassword=function(password,cb){
    bcrypt.compare(password,this.password ,(err,result)=>{
        console.log(result)
        return cb(err,result)
    })
}

var User = mongoose.model('User' , userSchema);
module.exports = User;