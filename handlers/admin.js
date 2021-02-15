const util = require('../util');
const pool = require('../connect');


let Admin = {
    /**
     * Get all Cats 
     * 
     * @param {*} callback
     */
    getCats: (callback) => {
        let query = `SELECT c.catID, c.name, c.breed, c.age, c.dateAdmitted,
                    c.adopted, r.name
                    FROM Cats c
                    JOIN Rooms r ON c.roomID = r.roomID
                    ORDER BY c.name ASC`;

        pool.query(query, (err, result, fields) => {
            if (err) {
                console.error("Unable to get Cats. Error JSON:",
                    JSON.stringify(err, null, 2));
                return callback(err, null);
            }
            if (result.length > 0) {
                return callback(null, result);
            } else {
                return callback(2, null);
            }
        });
    },
    /**
     * Get all Rooms
     * 
     * @param {*} callback
     */
    getRooms: (callback) => {
        let query = `SELECT r.roomID, r.name, r.roomDescription,
                    r.reservable, r.fee, c.name
                    FROM Rooms c
                    JOIN Cats c ON c.roomID = r.roomID
                    ORDER BY r.name ASC`;

        pool.query(query, (err, result, fields) => {
            if (err) {
                console.error("Unable to get Rooms. Error JSON:",
                    JSON.stringify(err, null, 2));
                return callback(err, null);
            }
            if (result.length > 0) {
                return callback(null, result);
            } else {
                return callback(2, null);
            }
        });
    },
    /**
     * Get all Ingredients
     * 
     * @param {*} callback
     */
    getIngredients: (callback) => {
        let query = `SELECT *
                    FROM Ingredients
                    ORDER BY name ASC`;

        pool.query(query, (err, result, fields) => {
            if (err) {
                console.error("Unable to get Ingredients. Error JSON:",
                    JSON.stringify(err, null, 2));
                return callback(err, null);
            }
            if (result.length > 0) {
                return callback(null, result);
            } else {
                return callback(2, null);
            }
        });
    },
    /**
     * Get all Beverages
     * 
     * @param {*} callback
     */
    getBeverages: (callback) => {
        let query = `SELECT b.beverageID, b.name, b.description,
                    b.type, b.price, i.name AS ingredient
                    FROM Beverages b
                    JOIN BeverageIngredients bi ON b.beverageID = bi.beverageID
                    JOIN Ingredients i ON bi.ingredientID = i.ingredientID
                    ORDER BY b.name ASC`;

        pool.query(query, (err, result, fields) => {
            if (err) {
                console.error("Unable to get Rooms. Error JSON:",
                    JSON.stringify(err, null, 2));
                return callback(err, null);
            }
            if (result.length > 0) {
                // Prepare the data for the template and add the ingredients
                let beverages = [];
                let currentBeverage = 0;
                let beverage = {};
                for (let i = 0; i < result.length; i++) {
                    if(result.orderID != currentOrder) {
                        if(orders.length == 0 && beverage.hasOwnProperty("orderID")) {
                            orders.push(beverage);
                        }
                        beverage = Account.fillBeverageTemplate(result[0]);
                    } else {
                        beverage.ingredients.push(result[i].ingredient);
                    }
                    currentBeverage = result.orderID;
                }
                return callback(null, result);
            } else {
                return callback(2, null);
            }
        });
    },
    fillBeverageTemplate: (data) => {
        return {
            beverageID: data.beverageID,
            name: data.name,
            description: data.description,
            type: data.type,
            price: data.price,
            ingredients: []
        };
    }
};

module.exports = Admin;