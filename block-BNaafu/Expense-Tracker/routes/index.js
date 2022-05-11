var express = require('express');
var router = express.Router();

var passport = require('passport')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/success',(req,res,next)=>{
  res.render('success');
})

router.get('/failure',(req,res,next)=>{
  res.render('failure')
})


router.get('/auth/github', passport.authenticate('github'))


router.get('/auth/github/callback',passport.authenticate('github',
{failureRedirect:'/failure'}),(req,res)=>{
  //,session:false ==> use after the /failure
  res.redirect('/dashboard')
}
)

//google
router.get('/auth/google', passport.authenticate('google',{
  scope:["profile","email "]
})
)


router.get('/auth/google/callback',passport.authenticate('google',
{failureRedirect:'/failure'}),(req,res)=>{
  //,session:false ==> use after the /failure
  res.redirect('/dashboard')
}
)


module.exports = router;
