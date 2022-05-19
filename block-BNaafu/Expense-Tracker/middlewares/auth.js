var User = require('../modals/user')

var Income = require('../modals/income')

var Expense = require('../modals/expense')

var gettotal = require('../routes/dashboard')

module.exports={
    loggedInUser:(req,res,next)=>{
        if(req.session && req.session.userID){
            next()
        }else{
            res.redirect('/users/login')
        }


    },
    userInfo:(req,res,next)=>{
        if(req.user){
            let user = req.user;
            res.locals.user = user;
            return next()
        }
        if(!req.user){
            var userId = req.session && req.session.userID;
           
                User.findById(userId,'name email isAdmin',(err,user)=>{
                    if(err) return next(err);
                    req.user = user;
                    res.locals.user = user;
                    next();
                })
            }else{
                req.user = null;
                res.locals.user = null;
                next();
            }
        
       
    },
    isAdmin : (req ,res ,next ) => {
        var isAdmin = req.user.isAdmin;
        console.log(isAdmin);
        if(isAdmin === true){
            next()
        } else {
            res.redirect('/dashboard')
        }
    }
    ,
    isUser :(req ,res ,next) => {
        var isAdmin = req.user.isAdmin;
        if(isAdmin === false) {
            next()
        } else {
          res.redirect('/dashboard')
        }
    },
    allfilter:function(req,res,next){
        Income.find({userID:req.user.id}, (err,income)=>{
            var totalincome  = income.reduce((acc,cv)=>{
                acc =acc+cv.amount;
                return acc; 
            },0)
        
        
        Expense.find({userID:req.user.id}, (err,expense)=>{
            var totalexpense  = expense.reduce((acc,cv)=>{
                acc =acc+cv.amount;
                return acc; 
            },0)
    
        var balance = totalincome-totalexpense
        res.locals.bal=balance
        })
        next()
    })

    }

}