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
     * @param {*} callback
     */
    findByEmail: (email, callback) => {
        let query = 'SELECT * FROM Customers WHERE email=?';
        let values = [email];

        console.info("Querying for record with email: ", email);

        pool.query(query, values, (err, result, fields) => {
            if (err) {
                console.error("Unable to find user", email, ". Error JSON:",
                    JSON.stringify(err, null, 2));
                return callback(err, null);
            }
            if (result.length > 0) {
                return callback(null, result[0]);
            } else {
                return callback(2, null);
            }
        });
    },

    /**
     * Get a customer customer by customerID primary key 
     * 
     * @param {*} attributes
     * @param {*} callback
     */
    findByID: (attributes, callback) => {
        let query = 'SELECT * FROM Customers WHERE customerID=?';
        let values = [attributes.id];

        pool.query(query, values, (err, result, fields) => {
            if (err) {
                console.error("Unable to find user", attributes.customerID, ". Error JSON:",
                    JSON.stringify(err, null, 2));
                return (err, null);
            }
            if (result[0]) {
                return callback(null, result[0]);
            } else {
                return callback(2, null);
            }
        });
    },

    /**
     * Create a new customer given a provided email and 
     * password. Emails must be unique. 
     * 
     * @param {*} email 
     * @param {*} password
     * @param {*} callback 
     */
    createCustomer: (attributes, callback) => {
        let email = attributes.email;
        Customer.findByEmail(email, (err, data) => {
            // Email is a duplicate, reject the create
            if (data) {
                return callback(2, null);
            }

            let customer = Customer.newCustomer(attributes);
            let query = 'INSERT INTO Customers SET ?';
            pool.query(query, customer, (err, result, fields) => {
                if (err) {
                    console.error("Unable to add new customer", customer.email, ". Error JSON:",
                        JSON.stringify(err, null, 2));
                    return callback(err, null);
                } else {
                    customer.customerID = result.insertId;
                    return callback(null, customer);
                }
            });

        });
    },

    /**
     * Update an existing customer with new details.
     * 
     * @param {*} attributes
     * @param {*} callback 
     */
    saveCustomer: (attributes, callback) => {
        let query = 'UPDATE Customers SET ? WHERE customerID=?';

        let customer = Customer.newCustomer(attributes);
        let values = [user, attributes.customerID];

        pool.query(query, values, (err, result, fields) => {
            if (err) {
                console.error("Unable to update user", user.email, ". Error JSON:",
                    JSON.stringify(err, null, 2));
                return callback(err, null);
            } else {
                return callback(null, result[0]);
            }
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

        console.info("Preparing to add new customer: ", JSON.stringify(customer));

        return customer;
    }
};

module.exports = Customer;