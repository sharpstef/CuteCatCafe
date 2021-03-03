const crypto = require('crypto');
const pool = require('../connect');

let customerTemplate = {
    firstName: null,
    lastName: null,
    email: null,
    password: null,
    salt: null,
    member: 0,
    isAdmin: 0
};

let Customer = {
    /**
     * Helper function to compare a provided password
     * to the password results from a hash. 
     * 
     * Reference - https://levelup.gitconnected.com/everything-you-need-to-know-about-the-passport-local-passport-js-strategy-633bbab6195
     * Last Access - July 20, 2020
     * 
     * @param {*} password
     * @param {*} hash
     * @param {*} salt
     */
    validPassword: (password, hash, salt) => {
        let hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
        return hash === hashVerify;
    },

    /**
     * Helper function to generate a hash for a given
     * password.
     * 
     * @param {*} password
     */
    generatePassword: (password) => {
        let salt = crypto.randomBytes(32).toString('hex');
        let genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

        return {
            salt: salt,
            hash: genHash
        };
    },

    /**
     * Get all customers records matching a email.
     * Only one customer should be returned.
     * 
     * @param {*} email
     */
    findByEmail: (email) => {
        let query = 'SELECT * FROM Customers WHERE email=?';
        let values = [email];

        return new Promise((resolve, reject) => {
            //console.info("Querying for record with email: ", email);
            pool.query(query, values, (err, result, fields) => {
                if (err) {
                    console.error("Unable to find user", email, ". Error JSON:",
                        JSON.stringify(err, null, 2));
                    reject(err);
                }
                if (result.length > 0) {
                    resolve(result[0]);
                } else {
                    resolve(null);
                }
            });
        });
    },

    /**
     * Get a customer customer by customerID primary key 
     * 
     * @param {*} attributes
     * @param {*} callback
     */
    findByID: (attributes) => {
        let query = 'SELECT * FROM Customers WHERE customerID=?';
        let values = [attributes.id];

        return new Promise((resolve, reject) => {
            pool.query(query, values, (err, result, fields) => {
                if (err) {
                    console.error("Unable to find user", attributes.customerID, ". Error JSON:",
                        JSON.stringify(err, null, 2));
                    reject(err);
                }
                if (result && result[0]) {
                    resolve(result[0]);
                } else {
                    resolve(null);
                }
            });
        });
    },

    /**
     * Create a new customer given a provided email and 
     * password. Emails must be unique. 
     * 
     * @param {*} attributes
     */
    createCustomer: (attributes) => {
        let email = attributes.email;

        return new Promise(async (resolve, reject) => {
            let customer = await Customer.findByEmail(email).then(result => {
                return result;
            }).catch();

            if (customer) {
                resolve(null);
            } else {
                customer = Customer.newCustomer(attributes);
                let query = 'INSERT INTO Customers (firstName, lastName, email, password, salt, member, isAdmin) VALUES (?, ?, ?, ?, ?, ?, ?)';
                let values = [customer.firstName, customer.lastName, customer.email, customer.password, customer.salt, customer.member, customer.isAdmin];
                pool.query(query, values, (err, result, fields) => {
                    if (err) {
                        console.error("Unable to add new customer", customer.email, ". Error JSON:",
                            JSON.stringify(err, null, 2));
                        reject(err);
                    } else {
                        customer.customerID = result.insertId;
                        resolve(customer);
                    }
                });
            }
        });
    },

    /**
     * Update an existing customer with new details.
     * 
     * @param {*} attributes
     * @param {*} callback 
     */
    saveCustomer: (attributes) => {
        let query = 'UPDATE Customers SET ? WHERE customerID=?';

        let customer = Customer.newCustomer(attributes);
        let values = [user, attributes.customerID];

        return new Promise((resolve, reject) => {
            pool.query(query, values, (err, result, fields) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result[0]);
                }
            });
        });
    },

    /**
     * Helper function to create a new customer object
     * and convert the given password to a hash.
     * 
     * @param {String} email 
     * @param {String} password 
     */
    newCustomer: (attributes) => {
        let customer = customerTemplate;
        const saltHash = Customer.generatePassword(attributes.password);
        customer.salt = saltHash.salt;
        customer.password = saltHash.hash;

        // Fill in the remaining attributes
        customer.firstName = attributes.fname ? attributes.fname : null;
        customer.lastName = attributes.lname ? attributes.lname : null;
        customer.email = attributes.email;
        customer.member = attributes.hasOwnProperty('member') ? 1 : 0;
        customer.isAdmin = attributes.hasOwnProperty('admin') ? 1 : 0;

        //console.info("Preparing to add new customer: ", JSON.stringify(customer));

        return customer;
    },
    
    /**
     * Get all Reservations for a given customerID.
     * 
     * @param {*} id
     */
    getReservationsByCustomer: (id) => {
        let query = `SELECT r.reservationID, Rooms.name, r.totalFee, 
                    r.reservationStart, r.reservationEnd
                    FROM Reservations r 
                    JOIN Rooms ON r.roomID = Rooms.roomID 
                    WHERE r.customerID=?`;
        let values = [id];

        return new Promise((resolve, reject) => {
            pool.query(query, values, (err, result, fields) => {
                if (err) {
                    reject(err);
                }
                if (result && result.length > 0) {
                    resolve(result);
                } else {
                    resolve(null);
                }
            });
        });
    },
    /**
     * Get all Orders for a given customerID with beverage names 
     * and quantity ordered.
     * 
     * @param {*} id
     */
    getOrdersByCustomer: (id) => {
        let query = `SELECT o.orderID, o.purchaseTime, o.totalAmount, 
        o.complete, b.name, oi.quantity, oi.status
        FROM Orders o
        JOIN OrderItems oi ON o.orderID = oi.orderID
        JOIN Beverages b ON oi.beverageID = b.beverageID
        WHERE o.customerID = ?`;
        let values = [id];

        return new Promise((resolve, reject) => {
            pool.query(query, values, (err, result, fields) => {
                if (err) {
                    reject(err);
                }
                if (result && result.length > 0) {
                    // Prepare the data for the template and add the order items
                    let orders = [];
                    let currentOrder = result[0].orderID;
                    let order = Customer.fillOrderTemplate(result[0]);

                    for (let i = 0; i < result.length; i++) {
                        if(result[i].orderID != currentOrder) {
                            orders.push(order);
                            order = Customer.fillOrderTemplate(result[i]);
                        } 
                        order.items.push(Customer.fillItemTemplate(result[i]));
                        currentOrder = result[i].orderID;
                    }
    
                    if(order.hasOwnProperty("orderID")) {
                        orders.push(order);
                    }
                    resolve(orders);
                } else {
                    resolve(null);
                }
            });
        });
    },
    fillOrderTemplate: (data) => {
        return {
            orderID: data.orderID,
            time: data.purchaseTime,
            total: data.totalAmount,
            complete: data.complete,
            items: []
        };
    },
    fillItemTemplate: (data) => {
        return {
            name: data.name,
            amount: data.quantity,
            status: data.status
        };
    }
};

module.exports = Customer;