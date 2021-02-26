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

// Handlers for database entities
const Beverage = require('./handlers/beverage');
const Cat = require('./handlers/cat');
const Customer = require('./handlers/customer');
const Reservation = require('./handlers/reservation');
const Room = require('./handlers/room');
const Order = require('./handlers/order');

// Helpers
const util = require('./util');

/************************************************************************************************* 
  
  Configure the Server
  
*************************************************************************************************/
// Initialize the express server
const app = express();
const port = 34674;

app.use(session({
    secret: 'secret squirrel secret',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60
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
    if (req.user) {
        if(req.user.isAdmin) {
            return next();
        } else {
            res.redirect('/');
        }
    } else {
        res.redirect('/login');
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
        req.session.save( () => {
            res.render('index', util.updateMenu('/', context, req.user));
        });
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

    res.render('register', util.updateMenu('/login', context, req.user));
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

    res.render('account', util.updateMenu('/', context, req.user));
});

/**
 * 
 * Order and Reservation History
 * 
 */
app.get('/getOrders', async (req, res) => {
    await Customer.getOrdersByCustomer(req.user.customerID).then(result => {
        res.status(200).json({
            "data": result
        });
    }).catch(error => {
        console.error("Error getting Orders: ", error);
        res.status(500).send({
            message: 'Error getting order history.'
        });
    });
});

app.get('/getReservations', async (req, res) => {
    await Customer.getReservationsByCustomer(req.user.customerID).then(result => {
        res.status(200).json({
            "data": result
        });
    }).catch(error => {
        console.error("Error getting Reservations: ", error);
        res.status(500).send({
            message: 'Error getting reservation history.'
        });
    });
});

app.post('/deleteReservation', async (req, res) => {
    await Reservation.deleteReservation(req.body.reservationID).then(result => {
        res.status(200).json({
            message: 'Reservation deleted!'
        });
    }).catch(error => {
        console.error("Error deleting Reservation: ", error);
        res.status(500).send({
            message: 'Error removing reservation. Try again later.'
        });
    });
});

/**
 * 
 * Inventory Management: Beverages, Cats, Ingredients, Rooms
 * 
 */
app.get('/admin', isAuthAdmin, (req, res) => {
    res.render('admin', util.updateMenu('/', {}, req.user));
});

app.get('/beverages', isAuthAdmin, async (req, res) => {
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
        res.status(200).json({
            "data": result
        });
    }).catch(error => {
        console.error("Error getting Beverages: ", error);
        res.status(500).send({
            message: 'Error getting beverages.'
        });
    });
});

app.post('/addBeverage', async (req, res) => {
    let beverageID = null;

    await Beverage.addBeverage(req.body).then(result => {
        beverageID = result.insertId;
        res.status(200).json({
            "message": "Beverage added to menu."
        });
    }).catch(error => {
        console.error("Error adding Beverage: ", error);
        let message = "Error adding new beverage. Try again."
        if (error.code === "ER_DUP_ENTRY") {
            message = "Error adding new beverage. Beverage name must be unique."
        }
        return res.status(500).send({
            message: message
        });
    });

    if (req.body.ingredients && beverageID) {
        await Beverage.insertBeverageIngredients(req.body.ingredients, beverageID).then(result => {}).catch(error => {
            console.error("Error adding Beverage Ingredients: ", error);
            return res.status(500).send({
                message: 'Error adding new ingredients to beverage.'
            });
        });
    }
});

app.post('/updateBeverage', async (req, res) => {
    let beverageID = req.body.id;

    // First update the Beverage
    await Beverage.updateBeverage(req.body).then(result => {
    }).catch(error => {
        console.error("Error updating Beverage: ", error);
        let message = "Error updating beverage. Try again."
        if (error.code === "ER_DUP_ENTRY") {
            message = "Error updating beverage. Beverage name must be unique."
        }
        return res.status(500).send({
            message: message
        });
    });

    // Now prepare to update the beverageIngredients. Remove all items and then add the new set.
    if (req.body.ingredients) {
        await Beverage.deleteBeverageIngredients(beverageID).then(result => {}).catch(error => {
            console.error("Error deleting Beverage Ingredients: ", error);
            return res.status(500).send({
                message: 'Error updating ingredients for beverage.'
            });
        });

        await Beverage.insertBeverageIngredients(req.body.ingredients, beverageID).then(result => {
            res.status(200).json({
                "message": "Beverage details updated."
            });
        }).catch(error => {
            console.error("Error adding Beverage Ingredients: ", error);
            return res.status(500).send({
                message: 'Error updating ingredients for beverage'
            });
        });
    }
});

app.post('/deleteBeverage', async (req, res) => {
    await Beverage.deleteBeverage(req.body.beverageID).then(result => {
        res.status(200).json({
            message: 'Beverage removed successfully!'
        });
    }).catch(error => {
        console.error("Error deleting Beverage: ", error);
        res.status(500).send({
            message: 'Error removing beverage. Try again later.'
        });
    });
});

app.get('/cats', isAuthAdmin, (req, res) => {
    let context = {};
    res.render('cats', util.updateMenu('/', context, req.user));
});

app.get('/getCats', async (req, res) => {
    await Cat.getCats().then(result => {
        res.status(200).json({
            "data": result
        });
    }).catch(error => {
        console.error("Error getting Cats: ", error);
        res.status(500).send({
            message: 'Error getting empty rooms.'
        });
    });
});

app.get('/getAvailableCats', async (req, res) => {
    await Cat.getAvailableCats().then(result => {
        res.status(200).json({
            "cats": result
        });
    }).catch(error => {
        console.error("Error getting Cats: ", error);
        res.status(500).send({
            message: 'Error getting empty rooms.'
        });
    });
});

app.post('/addCat', async (req, res) => {
    await Cat.addCat(req.body).then(result => {
        res.status(200).json({
            "message": "Cat added to records."
        });
    }).catch(error => {
        console.error("Error adding Cat: ", error);
        res.status(500).send({
            message: 'Error adding new cat. Try again.'
        });
    });
});

app.post('/deleteCat', async (req, res) => {
    await Cat.deleteCat(req.body.catID).then(result => {
        res.status(200).json({
            message: 'Cat removed from registry!'
        });
    }).catch(error => {
        console.error("Error deleting Cat: ", error);
        res.status(500).send({
            message: 'Error removing cat. Try again later.'
        });
    });
});

app.get('/ingredients', isAuthAdmin, async (req, res) => {
    let context = {};
    res.render('ingredients', util.updateMenu('/', context, req.user));
});

app.get('/getIngredients', async (req, res) => {
    await Beverage.getIngredients().then(result => {
        res.status(200).json({
            "data": result
        });
    }).catch(error => {
        console.error("Error getting Ingredients: ", error);
        res.status(500).send({
            message: 'Error getting ingredients.'
        });
    });
});

app.post('/addIngredient', async (req, res) => {
    await Beverage.addIngredient(req.body).then(result => {
        res.status(200).json({
            "message": "Ingredient added to list."
        });
    }).catch(error => {
        console.error("Error adding Ingredient: ", error);
        let message = "Error adding new ingredient. Try again."
        if (error.code === "ER_DUP_ENTRY") {
            message = "Error adding new ingredient. Ingredient name must be unique."
        }
        res.status(500).send({
            message: message
        });
    });
});

app.post('/updateIngredient', async (req, res) => {
    await Beverage.updateIngredient(req.body).then(result => {
        res.status(200).json({
            "message": "Ingredient information updated."
        });
    }).catch(error => {
        console.error("Error updating Ingredient: ", error);
        let message = "Error updating ingredient. Try again."
        if (error.code === "ER_DUP_ENTRY") {
            message = "Error updating ingredient. Ingredient name must be unique."
        }
        res.status(500).send({
            message: message
        });
    });
});

app.post('/deleteIngredient', async (req, res) => {
    await Beverage.deleteIngredient(req.body.ingredientID).then(result => {
        res.status(200).json({
            message: 'Ingredient removed successfully!'
        });
    }).catch(error => {
        console.error("Error deleting Ingredient: ", error);
        res.status(500).send({
            message: 'Error removing ingredient. Try again later.'
        });
    });
});

app.get('/rooms', isAuthAdmin, async (req, res) => {
    let context = {};
    res.render('rooms', util.updateMenu('/', context, req.user));
});

app.get('/getRooms', async (req, res) => {
    await Room.getRooms().then(result => {
        res.status(200).json({
            "data": result
        });
    }).catch(error => {
        console.error("Error getting Rooms: ", error);
        res.status(500).send({
            message: 'Error getting rooms.'
        });
    });
});

app.get('/getEmptyRooms', async (req, res) => {
    await Room.getEmptyRooms().then(result => {
        res.status(200).json({
            "rooms": result
        });
    }).catch(error => {
        console.error("Error getting Rooms: ", error);
        res.status(500).send({
            message: 'Error getting empty rooms.'
        });
    });
});

app.post('/addRoom', async (req, res) => {
    await Room.addRoom(req.body).then(result => {
        res.status(200).json({
            "message": "Room added to records."
        });
    }).catch(error => {
        console.error("Error adding Room: ", error);
        let message = "Error adding new room. Try again."
        if (error.code === "ER_DUP_ENTRY") {
            message = "Error adding room. Room name must be unique."
        }
        return res.status(500).send({
            message: message
        });
    });
});

app.post('/deleteRoom', async (req, res) => {
    await Room.deleteRoom(req.body.roomID).then(result => {
        res.status(200).json({
            message: 'Room removed successfully!'
        });
    }).catch(error => {
        console.error("Error deleting Room: ", error);
        res.status(500).send({
            message: 'Error removing room. Try again later.'
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
    res.render('menu', util.updateMenu('/menu', context, req.user));
});

app.get('/checkout', isAuthenticated, (req, res) => {
    let context = {}
    res.render('checkout', util.updateMenu('/checkout', context, req.user));
});

app.post('/checkout', async (req, res) => {
    let purchaseTime = new Date();  // Current time (when order was placed)
    purchaseTime = `${purchaseTime.getFullYear()}-${('0' + (purchaseTime.getMonth()+1)).slice(-2)}-${('0' + purchaseTime.getDate()).slice(-2)} ${('0' + purchaseTime.getHours()).slice(-2)}:${('0' + purchaseTime.getSeconds()).slice(-2)}:00`;

    let attributes = req.body; 
    
    if(req.user) {
        let orderID = null;
        attributes.customerID = req.user.customerID; 
        attributes.purchaseTime = purchaseTime;


        await Order.createOrder(attributes).then(result => {
            orderID = result.insertId;
            res.status(200).json({
                "message": "Order Submitted!"
            });
        }).catch(error => {
            console.error("Error creating order: ", error);
            res.status(500).send({
                message: 'Error creating order. Try again.'
            });
        });
        if (attributes.itemsData && orderID) {
            await Order.insertOrderItems(attributes.itemsData, orderID).then(result => {}).catch(error => {
                console.error("Error adding order items: ", error);
                return res.status(500).send({
                    message: 'Error adding order items.'
                });
            });
        }

    } else {
        res.status(500).send({
            message: 'Error creating order. Try again.'
        });
    }
});

/*app.post('/checkoutItem', async (req, res) => {
    let purchaseTime = new Date();  // Current time (when order was placed)
    purchaseTime = `${purchaseTime.getFullYear()}-${('0' + (purchaseTime.getMonth()+1)).slice(-2)}-${('0' + purchaseTime.getDate()).slice(-2)} ${('0' + purchaseTime.getHours()).slice(-2)}:${('0' + purchaseTime.getSeconds()).slice(-2)}:00`;

    let attributes = req.body; 
    
    if(req.user) {
        attributes.customerID = req.user.customerID; 
        attributes.purchaseTime = purchaseTime;


        await Order.createOrder(attributes).then(result => {
            res.status(200).json({
                "message": "Order Submitted!"
            });
        }).catch(error => {
            console.error("Error creating order: ", error);
            res.status(500).send({
                message: 'Error creating order. Try again.'
            });
        });
    } else {
        res.status(500).send({
            message: 'Error creating order. Try again.'
        });
    }
});*/


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
    if ((endTime.getHours() < 8 || endTime.getHours() > 20 || (endTime.getHours() == 20 && endTime.getSeconds() > 1)) ||
        (sTest.getHours() < 8 || sTest.getHours() > 20 || (sTest.getHours() == 20 && sTest.getSeconds() > 1))) {
        res.status(200).send({
            message: 'No available rooms. Please try again.'
        });
    }

    endTime = `${endTime.getFullYear()}-${('0' + (endTime.getMonth()+1)).slice(-2)}-${('0' + endTime.getDate()).slice(-2)} ${('0' + endTime.getHours()).slice(-2)}:${('0' + endTime.getSeconds()).slice(-2)}:00`;
    console.info(`${startTime} ${endTime}`);
    await Reservation.getAvailableRooms(startTime, endTime).then(result => {
        if (result) {
            result.forEach(item => {
                item["reservationStart"] = startTime;
                item["reservationEnd"] = endTime;
                item["totalFee"] = item.fee * (parseInt(req.body.duration) / 30);
            });
        }
        res.status(200).json({
            "data": result,
            "search": req.body
        });
    }).catch(error => {
        console.error("Error getting Rooms: ", error);
        res.status(500).send({
            message: 'Error getting available rooms. Try again.'
        });
    });
});

app.post('/newReservation', async (req, res) => {
    let attributes = req.body;
    
    if(req.user) {
        attributes.customerID = req.user.customerID;

        await Reservation.createReservation(attributes).then(result => {
            res.status(200).json({
                "message": "Room booked!"
            });
        }).catch(error => {
            console.error("Error creating Reservation: ", error);
            res.status(500).send({
                message: 'Error creating reservation. Try again.'
            });
        });
    } else {
        res.status(500).send({
            message: 'Error creating reservation. Try again.'
        });
    }
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