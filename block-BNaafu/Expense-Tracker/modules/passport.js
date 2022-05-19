
var passport = require('passport');

var GoogleStrategy = require('passport-google-oauth20').Strategy;

var GitHubStrategy = require('passport-github').Strategy;

// var GoogleStrategy = require('passport-google').Strategy;
var User = require('../modals/user')

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret:process.env.CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },(accessToken, refreshToken ,profile, done)=>{
      console.log(profile);
      var profileData ={
          name :profile._json.name,
        //   username : profile._json.name,
          email :profile._json.email,
          password:profile._json.given_name,
        //   photo : profile._json.picture
        isAdmin:false,
      }
      console.log(profileData)
User.findOne({email: profile._json.email},(err,user)=>{
    if(err) return done(err);
    if(!user){
        User.create(profileData,(err,addeduser)=>{
            console.log(addeduser,"adduser")
            if(err) return done(err)
            return done(null,addeduser)
        })
    }else{
        done(null,user)
    }

})

  }))



  //github

 

  
  
  passport.use(new GitHubStrategy({
      clientID: process.env.CLIENTID,
      clientSecret:process.env.CLIENTSECRET,
      callbackURL: "/auth/github/callback"
    },(accessToken, refreshToken ,profile, done)=>{
        console.log(profile);
        var profileData ={
            name :profile.displayName,
            // username : profile.username,
            email :profile._json.blog,
            password:profile._json.blog,
            // photo : profile._json.avatar_url
            isAdmin:false
        }
  User.findOne({email: profile._json.blog},(err,user)=>{
      if(err) return done(err);
      if(!user){
          User.create(profileData,(err,addeduser)=>{
              if(err) return done(err)
              return done(null,addeduser)
          })
      }
      else{
        done(null,user)
      }

  })
    }))



  passport.serializeUser((user,done)=>{
      done(null, user.id);
  })


  passport.deserializeUser(function(id,done){
      User.findById(id,"name email isAdmin",function(err,user){
          done(err,user)
      })
  });

 