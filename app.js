/************************************************************************************************* 
  
  Includes and Dependencies
  
*************************************************************************************************/
// Main depencies
const parser = require('body-parser');
const express = require('express');
const hb = require('express-handlebars');
const passport = require('passport');
var Strategy = require('passport-local').Strategy;
const session = require('express-session');

// Local imports
const Customer = require('./customer');
const util = require('./util');

/************************************************************************************************* 
  
  Configure the Server
  
*************************************************************************************************/
// Initialize the express server
const app = express();
const port = 3000;

app.use(session({
  secret: 'secret squirel secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
      maxAge: 1000 * 30
  }
}));

// Set app to use the Handlebars engine
app.set('view engine', 'handlebars');
app.engine('handlebars', hb({
  layoutsDir: __dirname + '/views/layouts',
  partialsDir: __dirname + '/views/partials'
}));
app.set('view options', {
  layout: 'main'
});

// Pull all style files from the public directory
app.use(express.static('public'));

// Configure body parser to handle request body params
app.use(parser.json());
app.use(parser.urlencoded({
  extended: true
}));

/*

// Configure user local authentication with Passport
passport.use(new Strategy({passReqToCallback: true }, function(req, email, password, done) {
  User.findByEmail(email, function(err, user) {
    if (err) {
      req.session.error = "Authentication error. Please try again.";
      return done(err, false);
    }
    if (!user) { 
      req.session.error = "Invalid email or password.";
      return done(null, false) 
    }
              
    const isValid = User.validPassword(password, user.hash, user.salt);
    
    if (isValid) {
        return done(null, user);
    } else {
        return done(null, false);
    }
  });
}
));

passport.serializeUser((user, cb) => {
  cb(null, {id: user.userID});
});

passport.deserializeUser((attributes, cb) => {
  User.findByID(attributes, (err, user) => {
    if (err) {
      return cb(err);
    }
    cb(null, user);
  });
});

app.use(passport.initialize());
app.use(passport.session());
*/

/************************************************************************************************* 
  
  Routes
  
*************************************************************************************************/
// Hold the flash errors to pass back to the login and register pages
app.use(function(req, res, next) {
  res.locals.error = req.session.error || '';
  res.locals.message = req.session.message || '';

  delete req.session.error;
  delete req.session.message;
  next();
});

// Index Page
app.get('/', (req, res) => {
  let context = {};
  res.render('index', util.updateMenu('/', context, req.user));
});

app.get('/account', (req, res) => {
  res.render('account', util.updateMenu('/', {}));
});

app.get('/beverages', (req, res) => {
  res.render('beverages', util.updateMenu('/', {}));
});

app.get('/cats', (req, res) => {
  res.render('cats', util.updateMenu('/', {}));
});

app.get('/checkout', (req, res) => {
  let context = {}
  res.render('checkout', util.updateMenu('/', {}));
});

app.get('/ingredients', (req, res) => {
  res.render('ingredients', util.updateMenu('/', {}));
});

app.get('/menu', (req, res) => {
  let context = {}
  res.render('menu', util.updateMenu('/menu', context));
});

app.get('/rooms', (req, res) => {
  res.render('rooms', util.updateMenu('/', {}));
});

app.get('/rooms', (req, res) => {
  res.render('rooms', util.updateMenu('/', {}));
});

app.get('/reservations', (req, res) => {
  let context = {}
  res.render('reservations', util.updateMenu('/reservations', context));
});

// Auth pages
app.get('/login', (req, res) => {
  let context = {}
  res.render('login', util.updateMenu('/login', context, req.user));
});

app.post('/login',
  passport.authenticate('local', {
    failureRedirect: '/login'
  }),
  (req, res) => {
    let context = {};
    context.success = "Login success!"
    res.render('index', util.updateMenu('/', context, req.user));
});

app.get('/register', (req, res) => {
  let context = {}
  res.render('register', util.updateMenu('/login', context));
});

app.post('/register', (req,res) => {
  User.createUser(req.body.username, req.body.password, (err, user) => {
    let context = {};
    console.log("Created user: ",user);
    if(user && user != null) {
      context.success = "Account created. Please log in."
    } else if(err === 2) {
      context.error = "Account already exists."
    } else {
      context.error = "Account creation failed."
    }
    res.render('register', util.updateMenu('/login', context, false));
  });
});

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

app.get('/admin', (req, res) => {
  res.render('admin', util.updateMenu('/', {}));
});

// 404 page render
app.use((req, res) => {
  res.status(404);
  let context = {};
  res.render('404', util.updateMenu('/', context, req.user));
});

app.listen(port, () => console.log(`App listening to port ${port}`));