const express = require('express');
const app = express();
//const bodyParser = require('body-parser');
const session = require('express-session');
const mustacheExpress = require('mustache-express');
//const fs = require('fs');


app.engine("mustache", mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

//app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.urlencoded({extended: false}));

//app.use(express.static('path_to_static_files'));


app.use(session({secret: 'keyboard cat'
                ,resave: false
                ,saveUninitialized:false}))


app.use(function(req,res,next) {
  req.TPL = {};

  req.TPL.displaylogin = !req.session.username
  req.TPL.displaylogout = req.session.username

  next();
});



app.use("/home",
        function(req,res,next) { req.TPL.homenav = true; next(); });
//app.use("/articles",
//        function(req,res,next) { req.TPL.articlesnav = true; next(); });
app.use("/members",
        function(req,res,next) { req.TPL.membersnav = true; next(); });
app.use("/login",
        function(req,res,next) { req.TPL.loginnav = true; next(); });
app.use("/history",
        function(req,res,next) { req.TPL.historynav = true; next(); });
app.use("/signup",
        function(req,res,next) { req.TPL.loginnav = true; next(); });
app.use("/bookings",
        function(req,res,next) { req.TPL.bookingsnav = true; next(); });

app.use("/bookings", function(req,res,next) {

  if (req.session.username) next();
  else res.redirect("/home");

});

app.post('/login', async (req, res) => {
        const { username, password } = req.body;
        const user = await UserModel.findOne({ where: { username, password } });
        if (user) {
            req.session.user = user; 
        } else {
            res.render('login', { error: 'Invalid username and/or password!' });
        }
    });


app.use("/home", require("./controllers/home"));
app.use("/bookings", require("./controllers/bookings"));
app.use("/login", require("./controllers/login"));
app.use("/signup", require("./controllers/signup"))
const historyRouter = require('./controllers/history');
app.use('/history', historyRouter);

app.get("/", function(req, res) {
  res.redirect("/home");
});

app.use((req, res, next) => {
        res.header('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        next();
});


// Catch-all router case
app.get(/^(.+)$/, function(req,res) {
  res.sendFile(__dirname + req.params[0]);
});

// Start the server
var server = app.listen(8081, function() {console.log("Server listening...");})
