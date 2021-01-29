const crypto = require('crypto');
const util = require('./util');

let customer = {
  /**
   * Helper function to compare a provided password
   * to the password results from a hash. 
   * 
   * Reference - https://levelup.gitconnected.com/everything-you-need-to-know-about-the-passport-local-passport-js-strategy-633bbab6195
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
   * Only one record should be returned.
   * 
   * @param {*} email
   * @param {*} callback
   */
  findByemail: (email, callback) => {

  },

  /**
   * Get a customer record by customerID primary key 
   * 
   * @param {*} attributes
   * @param {*} callback
   */
  findByID: (attributes, callback) => {

  },

  /**
   * Create a new customer given a provided email and 
   * password. Emails must be unique. 
   * 
   * @param {*} email 
   * @param {*} password
   * @param {*} callback 
   */
  createCustomer: (email, password, callback) => {
    customer.findByemail(email, (err, customer) => {

      // Email is a duplicate, reject the create
      if(customer){
        return callback(2, null);
      }
    });
  },

  /**
   * Update an existing customer with new details.
   * 
   * @param {*} customer 
   * @param {*} callback 
   */
  saveCustomer: (customer, callback) => {

  },

  /**
   * Helper function to create a new customer object
   * and convert the given password to a hash.
   * 
   * @param {String} email 
   * @param {String} password 
   */
  newCustomer: (email, password) => {
    let customer = customerTemplate;
    const saltHash = customer.generatePassword(password); 
    customer.salt = saltHash.salt;
    customer.hash = saltHash.hash;

    customer.email = email;
    customer.customerID = '_' + Math.random().toString(36).substr(2, 9);

    return customer;
  }
};

module.exports = customer;
