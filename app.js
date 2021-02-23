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
const moment = require('moment');

// Handlers for database entities
const Beverage = require('./handlers/beverage');
const Cat = require('./handlers/cat');
const Customer = require('./handlers/customer');
const Reservation = require('./handlers/reservation');
const Room = require('./handlers/room');

// Helpers
const util = require('./util');

/************************************************************************************************* 
  
  Configure the Server
  
*************************************************************************************************/
// Initialize the express server
const app = express();
const port = 34400;

app.use(session({
    secret: 'secret squirrel secret',
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

// Configure user local authentication with Passport
passport.use(new Strategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {

  await Customer.findByEmail(email).then(user => {
    if (user) {
        const isValid = Customer.validPassword(password, user.password, user.salt);
        if (isValid) {
          return done(null, user);
        } else {
            return done(null, false);
        }
    } else if (!user) {
        req.session.error = "Invalid email or password.";
        return done(null, false)
    }
  }).catch(error => {
      console.error("Error on login: ", error);
      req.session.error = "Authentication error. Please try again.";
      return done(err, false);
  });
}));

passport.serializeUser((user, cb) => {
    cb(null, {
        id: user.customerID
    });
});

passport.deserializeUser(async (attributes, cb) => {
    await Customer.findByID(attributes).then(user => {
        return cb(null, user);
    }).catch(err => {
      return cb(err);
    });
});

app.use(passport.initialize());
app.use(passport.session());

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

let isAuthenticated = (req, res, next) => {
    if (req.user)
        return next();
    else
        res.redirect('/login');

};

let isAuthAdmin = (req, res, next) => {
    if (isAuthenticated) {
        if (req.user.isAdmin) {
            return next();
        } else {
            res.redirect('/');
        }
    }
};

// Index Page
app.get('/', (req, res) => {
    let context = {};
    res.render('index', util.updateMenu('/', context, req.user));
});

/**
 * 
 * User Authentication and Account Information
 * 
 */
app.get('/login', (req, res) => {
    let context = {}
    if (req.user) {
        res.redirect('/account');
    } else {
        res.render('login', util.updateMenu('/login', context, req.user));
    }
});

app.post('/login',
    passport.authenticate('local', {
        failureRedirect: '/login'
    }),
    (req, res) => {
        let context = {};
        res.render('index', util.updateMenu('/', context, req.user));
    });

app.get('/register', (req, res) => {
    let context = {}
    if (req.user) {
        res.render('index', util.updateMenu('/', context, req.user));
    } else {
        res.render('register', util.updateMenu('/login', context, req.user));
    }
});

app.post('/register', async (req, res) => {
    let context = {}
    await Customer.createCustomer(req.body).then(user => {
        if (user && user != null) {
            context.success = "Account created. Please log in."
        } else if (user == null) {
            context.error = "Account already exists."
        }
    }).catch(error => {
        console.error("Error creating account: ", error);
        context.error = "Account creation failed."
    });

    res.render('register', util.updateMenu('/login', context, false));
});

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

app.get('/account', isAuthenticated, async (req, res) => {
    let context = {};
    context.data = {};

    context.data.userData = {
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        member: req.user.member,
        admin: req.user.isAdmin
    };

    await Customer.getOrdersByCustomer(req.user.customerID).then(result => {
        context.data.orderData = result;
    }).catch(error => {
        console.error("Error getting Orders: ", error);
    });

    await Customer.getReservationsByCustomer(req.user.customerID).then(result => {
        context.data.resData = result;
    }).catch(error => {
        console.error("Error getting Reservations: ", error);
    });

    res.render('account', util.updateMenu('/', context, null));
});

/**
 * 
 * Inventory Management: Beverages, Cats, Ingredients, Rooms
 * 
 */
app.get('/admin', (req, res) => {
    res.render('admin', util.updateMenu('/', {}));
});

app.get('/beverages', async (req, res) => {
  let context = {};
  await Beverage.getIngredients().then(result => {
    context.ingredientData = result;
  }).catch(error => {
      console.error("Error getting Ingredients: ", error);
  });
  res.render('beverages', util.updateMenu('/', context, req.user));
});

app.get('/getBeverages', async (req, res) => {
    await Beverage.getBeverages().then(result => {
        res.status(200).json({"data": result});
    }).catch(error => {
        console.error("Error getting Beverages: ", error);
        res.status(500).send({
            message: 'Error getting beverages.'
        });
    });
});

app.post('/addBeverage', async(req,res) => {
    let beverageID = null;

    await Beverage.addBeverage(req.body).then(result => {
        beverageID = result.insertId;
    }).catch(error => {
        console.error("Error adding Beverage: ", error);
        res.status(500).send({
            message: 'Error adding new beverage. Try again.'
        });
    });  

    console.info(JSON.stringify(req.body));
    if(req.body.ingredients) {
        for(let i=0; i< req.body.ingredients.length; i++) {
            await Beverage.insertBeverageIngredients(ingredient[i], beverage).then(result => {
            }).catch(error => {
                console.error("Error adding Beverage Ingredient: ", error);
                res.status(500).send({
                    message: 'Error adding new ingredients to beverage. Update the beverage.'
                });
            }); 
        };
    } 

    await Beverage.getBeverages().then(result => {
        res.status(200).json({"data": result, "message": "Beverage added to menu."});
    }).catch(error => {
        console.error("Error getting Beverages: ", error);
        res.status(500).send({
            message: 'Error getting updated list of beverages.'
        });
    });
});

app.get('/cats', (req, res) => {
  let context = {};
  res.render('cats', util.updateMenu('/', context, req.user));
});

app.get('/getCats', async(req,res) => {
    await Cat.getCats().then(result => {
        res.status(200).json({"data": result});
    }).catch(error => {
        console.error("Error getting Cats: ", error);
        res.status(500).send({
            message: 'Error getting empty rooms.'
        });
    });
});

app.get('/getAvailableCats', async(req,res) => {
    await Cat.getAvailableCats().then(result => {
        res.status(200).json({"cats": result});
    }).catch(error => {
        console.error("Error getting Cats: ", error);
        res.status(500).send({
            message: 'Error getting empty rooms.'
        });
    });
});

app.post('/addCat', async(req,res) => {
    await Cat.addCat(req.body).then(result => {
    }).catch(error => {
        console.error("Error adding Cat: ", error);
        res.status(500).send({
            message: 'Error adding new cat. Try again.'
        });
    });  

    await Cat.getCats().then(result => {
        res.status(200).json({"data": result, "message": "Cat added to records."});
    }).catch(error => {
        console.error("Error getting Cats: ", error);
        res.status(500).send({
            message: 'Error getting cats.'
        });
    });
});

app.get('/ingredients', async (req, res) => {
  let context = {};
  res.render('ingredients', util.updateMenu('/', context, req.user));
});

app.get('/getIngredients', async (req, res) => {
    await Beverage.getIngredients().then(result => {
        res.status(200).json({"data": result});
    }).catch(error => {
        console.error("Error getting Ingredients: ", error);
        res.status(500).send({
            message: 'Error getting ingredients.'
        });
    });
});

app.post('/addIngredient', async(req,res) => {
    await Beverage.addIngredient(req.body).then(result => {
    }).catch(error => {
        console.error("Error adding Ingredient: ", error);
        res.status(500).send({
            message: 'Error adding new ingredient. Try again.'
        });
    });  

    await Beverage.getIngredients().then(result => {
        res.status(200).json({"data": result, "message": "Ingredient added to list."});
    }).catch(error => {
        console.error("Error getting Ingredients: ", error);
        res.status(500).send({
            message: 'Error getting ingredients.'
        });
    });
});

app.get('/rooms', async (req, res) => {
    let context = {};
    res.render('rooms', util.updateMenu('/', context, req.user));
});

app.get('/getRooms', async(req,res) => {
    await Room.getRooms().then(result => {
        res.status(200).json({"data": result});
    }).catch(error => {
        console.error("Error getting Rooms: ", error);
        res.status(500).send({
            message: 'Error getting rooms.'
        });
    });
});

app.get('/getEmptyRooms', async (req, res) => {
    await Room.getEmptyRooms().then(result => {
      res.status(200).json({"rooms": result});
    }).catch(error => {
        console.error("Error getting Rooms: ", error);
        res.status(500).send({
            message: 'Error getting empty rooms.'
        });
    });
});

app.post('/addRoom', async(req,res) => {
    await Room.addRoom(req.body).then(result => {
    }).catch(error => {
        console.error("Error adding Room: ", error);
        let message = "Error adding new room. Try again."
        if(error.code === "ER_DUP_ENTRY") {
            message = "Error adding room. Room name must be unique."
        }
        res.status(500).send({
            message: message
        });
    });  

    await Room.getRooms().then(result => {
        res.status(200).json({"data": result, "message": "Room added to records."});
    }).catch(error => {
        console.error("Error getting Rooms: ", error);
        res.status(500).send({
            message: 'Error getting rooms.'
        });
    });
});

/**
 * 
 * Menu and Checkout
 * 
 */
app.get('/menu', (req, res) => {
    let context = {}
    res.render('menu', util.updateMenu('/menu', context));
});

app.get('/checkout', (req, res) => {
    let context = {}
    res.render('checkout', util.updateMenu('/', {}, req.user));
});

/**
 * 
 * Reservation Booking
 * 
 */
app.get('/reservations', isAuthenticated, (req, res) => {
    let context = {}
    res.render('reservations', util.updateMenu('/reservations', context, req.user));
});

app.post('/reservations', async (req, res) => {
    let startTime = `${req.body.date} ${req.body.time}`;
    let endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + parseInt(req.body.duration));   

    // Check if time falls out of range and fail
    let sTest = new Date(startTime);
    if((endTime.getHours() < 8 || endTime.getHours() > 20 || (endTime.getHours() == 20 && endTime.getSeconds() > 1)) || 
    (sTest.getHours() < 8 || sTest.getHours() > 20 || (sTest.getHours() == 20 && sTest.getSeconds() > 1))) {
        res.status(200).send({
            message: 'No available rooms. Please try again.'
        });
    }

    endTime = `${endTime.getFullYear()}-${('0' + endTime.getMonth()+1).slice(-2)}-${('0' + endTime.getDate()).slice(-2)} ${('0' + endTime.getHours()).slice(-2)}:${('0' + endTime.getSeconds()).slice(-2)}:00`;
    console.info(`${startTime} ${endTime}`);
    await Reservation.getAvailableRooms(startTime, endTime).then(result => {
        if(result) {
            result.forEach(item => {
                item["reservationStart"] = startTime;
                item["reservationEnd"] = endTime;
                item["totalFee"] = item.fee * (parseInt(req.body.duration)/30);
            });
        }
        res.status(200).json({"data": result, "search": req.body});
    }).catch(error => {
        console.error("Error getting Rooms: ", error);
        res.status(500).send({
            message: 'Error getting available rooms. Try again.'
        });
    });    
});

app.post('/newReservation', async (req, res) => {
    let attributes = req.body;
    attributes.customerID = req.user.customerID;

    await Reservation.createReservation(attributes).then(result => {
        res.status(200).json({"message": "Room booked!"});
    }).catch(error => {
        console.error("Error creating Reservation: ", error);
        res.status(500).send({
            message: 'Error creating reservation. Try again.'
        });
    });  
});

/**
 * 
 * Util Pages
 * 
 */
app.use((req, res) => {
    res.status(404);
    let context = {};
    res.render('404', util.updateMenu('/', context, req.user));
});

app.listen(port, () => console.log(`App listening to port ${port}`));