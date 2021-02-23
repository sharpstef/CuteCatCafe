const pool = require('../connect');


let Beverage = {
    /**
     * Get all Ingredients
     * 
     */
    getIngredients: () => {
        let query = `SELECT *
                    FROM Ingredients
                    ORDER BY name ASC`;

        return new Promise((resolve, reject) => {
            pool.query(query, (err, result, fields) => {
                if (err) {
                    console.error("Unable to get Ingredients. Error JSON:",
                        JSON.stringify(err, null, 2));
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
     * Insert a new Ingredient into the database.
     * 
     * @param {*} attributes
     */
    addIngredient: (attributes) => {
        return new Promise((resolve, reject) => {
            let query = 'INSERT INTO Ingredients (name) VALUES (?)';
            pool.query(query, attributes.name, (err, result, fields) => {
                if (err) {
                    console.error("Unable to add new ingredient", attributes.name, ". Error JSON:",
                        JSON.stringify(err, null, 2));
                    reject(err);
                }  else {
                    resolve(result);
                }
            });
        });
    },
    /**
     * Get all Beverages
     * 
     */
    getBeverages: () => {
        let query = `SELECT b.beverageID, b.name, b.description,
                    b.type, b.price, i.name AS ingredient
                    FROM Beverages b
                    LEFT JOIN BeverageIngredients bi ON b.beverageID = bi.beverageID
                    JOIN Ingredients i ON bi.ingredientID = i.ingredientID
                    ORDER BY b.name ASC`;

        return new Promise((resolve, reject) => {
            pool.query(query, (err, result, fields) => {
                if (err) {
                    console.error("Unable to get Rooms. Error JSON:",
                        JSON.stringify(err, null, 2));
                    reject(err);
                }
                if (result && result.length > 0) {
                    // Prepare the data for the template and add the ingredients
                    let beverages = [];
                    let currentBeverage = result[0].beverageID;
                    let beverage = Beverage.fillBeverageTemplate(result[0]);
    
                    for (let i = 0; i < result.length; i++) {
                        if(result[i].beverageID != currentBeverage) {
                            beverage.ingredients.join();
                            beverages.push(beverage);
                            beverage = Beverage.fillBeverageTemplate(result[i]);
                        } 
                        beverage.ingredients.push(result[i].ingredient);
                        currentBeverage = result[i].beverageID;
                    }
                    
                    if(beverage.hasOwnProperty("beverageID")) {
                        beverage.ingredients.join();
                        beverages.push(beverage);
                    }

                    resolve(beverages);
                } else {
                    resolve(null);
                }
            });
        });
    },
    /**
     * Insert a new Beverage into the database with or without ingredients.
     * 
     * @param {*} attributes
     */
    addBeverage: (attributes) => {
        let beverage = Beverage.fillBeverageTemplateInsert(attributes);

        return new Promise((resolve, reject) => {
            let query = 'INSERT INTO Beverages SET ?';
            pool.query(query, beverage, (err, result, fields) => {
                if (err) {
                    console.error("Unable to add new beverage", attributes.name, ". Error JSON:",
                        JSON.stringify(err, null, 2));
                    reject(err);
                }  else {
                    resolve(result);
                }
            });
        });
    },
    insertBeverageIngredients: (ingredient, beverage) => {
        return new Promise((resolve, reject) => {
            let query = 'INSERT INTO BeverageIngredients SET ?';
            let values = [ingredient, beverage];

            pool.query(query, values, (err, result, fields) => {
                if (err) {
                    console.error("Unable to add ingredient to beverage. Error JSON:",
                        JSON.stringify(err, null, 2));
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },
    fillBeverageTemplateInsert: (data) => {
        return {
            name: data.name,
            description: data.description,
            type: data.type,
            price: data.price,
        };
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

module.exports = Beverage;