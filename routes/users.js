let express             = require("express"),
    User                = require("../models/user.js"),
    bcrypt              = require("bcryptjs"),
    passport            = require("passport");

let router  = express.Router();

router.get("/register", function(req, res){
    res.render("partials/popup", {popupContent : "../users/register.ejs"});
});

router.post("/register", function (req, res) {

    let result = { error : false };

    User.findOne({ username: req.body.user.username }).then(existingUser => {

        if (existingUser) {
            result.error = true;
            result.errorMessage = "Username " + existingUser.username + " already exists. Choose a different one";
            res.send(JSON.stringify(result));
        }
        else {
            // hash password
            req.body.user.password = bcrypt.hashSync(req.body.user.password, 10);

            User.create(req.body.user).then(user => {
                req.logIn(user, function (err) {
                    if (!err) {
                        req.flash("successMessage", `Hello ${user.username}! Welcome to Yelp Camp.` );
                        res.send(JSON.stringify(result));
                    }
                    else {
                        console.log(err);
                        result.error = true;
                        result.errorMessage = "Error creating user. Try again later.";
                    }
                });

            }).catch(err => {
                console.log(err);
                result.error = true;
                result.errorMessage = "Error creating user. Try again later.";
                res.send(JSON.stringify(result));
            })
        }
    });
});

router.get("/login", function(req, res){
    res.render("partials/popup", {popupContent : "../users/login.ejs"});
});

router.post('/login', function (req, res, next) {

    let result = { error : false };

    passport.authenticate('local', function (err, user, info) {

        if (err) {
            console.log("error occured autheticating: " + err);
            result.error = true;
            result.errorMessage = "Error occured logging in. Try again later.";
            res.send(JSON.stringify(result));
        }
        if (!user) {
            result.error = true;
            result.errorMessage = info.message;
            res.send(JSON.stringify(result));
        }
        else {
            req.logIn(user, function (err) {
                if (err) {
                    console.log("error occured autheticating: " + err);
                    result.error = true;
                    result.errorMessage = "Error occured logging in. Try again later.";
                    res.send(JSON.stringify(result));
                }
                else{
                    req.flash("successMessage", `Hello ${user.username}! Welcome Back to Yelp Camp.` );
                    res.send(JSON.stringify(result));
                }
            });
        }        
    })(req, res, next);
});

router.get('/logout', function(req, res){
    req.logOut();
    res.redirect("/campgrounds");
});

module.exports = router;