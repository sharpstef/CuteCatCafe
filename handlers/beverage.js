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
     * Get all Beverages
     * 
     */
    getBeverages: () => {
        let query = `SELECT b.beverageID, b.name, b.description,
                    b.type, b.price, i.name AS ingredient
                    FROM Beverages b
                    JOIN BeverageIngredients bi ON b.beverageID = bi.beverageID
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
                    let beverage = Admin.fillBeverageTemplate(result[0]);
    
                    for (let i = 0; i < result.length; i++) {
                        if(result[i].beverageID != currentBeverage) {
                            beverage.ingredients.join();
                            beverages.push(beverage);
                            beverage = Admin.fillBeverageTemplate(result[i]);
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