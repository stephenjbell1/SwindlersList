//load bcrypt + dependancies
var bCrypt = require('bcrypt-nodejs');
var passport = require("passport");
var db = require("../models");
var User = User;
var LocalStrategy = require('passport-local').Strategy;
var express = require("express");
var app = express();
 
 
module.exports = function(passport, user) {
 
 
    // var User = user;
 
    // var LocalStrategy = require('passport-local').Strategy;
 
 
    passport.use('local-login', new LocalStrategy(
 
        {
 
            usernameField: 'username',
 
            passwordField: 'password',
 
            passReqToCallback: true // allows us to pass back the entire request to the callback
 
        },
 
 
 
        function(req, username, password, done) {
 
            var generateHash = function(password) {
 
                return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
 
            };
 
 
 
            db.User.findOne({
                where: {
                    username: username
                }
            }).then(function(user) {
                
                    app.post('/login',
        passport.authenticate('local', {
            successRedirect: '/index',
            failureRedirect: '/login',
            failureFlash: true
        })
    );

                if (user)
 
                {
 
                    return done(null, false, {
                        message: 'That username is already taken'
                    });
 
                } else
 
                {
 
                    var userPassword = generateHash(password);
 
                    var data =
 
                        {
                            username: username,
 
                            password: userPassword,
 
                            // firstname: req.body.firstname,
 
                            // lastname: req.body.lastname
 
                        };
 
                    db.User.create(data).then(function(newUser, created) {
 
                        if (!newUser) {
 
                            return done(null, false);
 
                        }
 
                        if (newUser) {
 
                            return done(null, newUser);
 
                        }
 
                    });
 
                }
 
            });
 
        }
 
    ));
// } 

//serialize
passport.serializeUser(function(user, done) {
 
    done(null, user.id);
 
});

// deserialize user 
passport.deserializeUser(function(id, done) {
 
    db.User.findById(id).then(function(user) {
 
        if (user) {
 
            done(null, user.get());
 
        } else {
 
            done(user.errors, null);
 
        }
 
    });
 
});

} 

//LOCAL SIGNIN
// passport.use('local-login', new LocalStrategy(
 
//     {
 
//         // by default, local strategy uses username and password, we will override with username
 
//         usernameField: 'username',
 
//         passwordField: 'password',
 
//         passReqToCallback: true // allows us to pass back the entire request to the callback
 
//     },
 
 
//     function(req, username, password, done) {
 
//         var User = user;
 
//         var isValidPassword = function(userpass, password) {
 
//             return bCrypt.compareSync(password, userpass);
 
//         }
 
//         db.User.findOne({
//             where: {
//                 username: username
//             }
//         }).then(function(user) {
 
//             if (!user) {
 
//                 return done(null, false, {
//                     message: 'username does not exist'
//                 });
 
//             }
 
//             if (!isValidPassword(user.password, password)) {
 
//                 return done(null, false, {
//                     message: 'Incorrect password.'
//                 });
 
//             }
 
 
//             var userinfo = user.get();
//             return done(null, userinfo);
 
 
//         }).catch(function(err) {
 
//             console.log("Error:", err);
 
//             return done(null, false, {
//                 message: 'Something went wrong with your Signin'
//             });
 
//         });
 
 
//     }
 
// ));
