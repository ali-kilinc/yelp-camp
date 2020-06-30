let express             = require("express"),
    db                  = require("./db.js"),
    config              = require("./config.js"),
    bodyParser          = require("body-parser"),
    session             = require("express-session"),
    passport            = require("passport"),
    LocalStrategy       = require('passport-local').Strategy,
    campgroundRoutes    = require("./routes/campgrounds.js"),
    userRouters         = require("./routes/users.js"),
    User                = require("./models/user.js"),
    bcrypt              = require("bcryptjs"),
    flash               = require('connect-flash'),
    methodOverride      = require('method-override');

let app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

// serve public dir
app.use(express.static(__dirname + '/public'));

// attach body-parser
app.use(bodyParser.urlencoded({extended : true}));

// configure session
app.use(session({saveUninitialized : false, resave: false, secret: "A kangaroo is really just a rabbit on steroids."}));

// setup flash messages
app.use(flash());

// connect to database
db.connect();

// configure passport 
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({
    usernameField: 'user[username]',
    passwordField: 'user[password]'
}, function (username, password, done) {

    User.findOne({ username : username }, function (err, user) {
        if (err) { 
            console.log("cannot authenticat error:" + err);
            return done(err); 
        }
        if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
        }
        if(!bcrypt.compareSync(password, user.password)) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
    });
}
));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

app.use(methodOverride("_method"));

app.use(function(req, res, next)
{
    res.locals.currentUser = req.user;
    res.locals.successMessage = req.flash("successMessage");
    res.locals.errorMessage = req.flash("errorMessage");
    next();
});

// add routers
app.use("/campgrounds", campgroundRoutes);
app.use("/users", userRouters);

app.get("/", function(req, res){
    res.render("index");
});

app.get("/about", function(req, res){
    res.render("about");
});

app.get('*', function(req, res){
    res.render('notfound');
});

app.listen(config.app.port, function(){
    console.log(`server started on ${config.app.port} port...`);
});

function isLoggedIn(req, res, next)
{
    if(req.user)
    {
        next();
    }
    else{
        res.send("You need to login to do that");
    }
}