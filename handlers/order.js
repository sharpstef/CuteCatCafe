const pool = require('../connect');

let Order = {
    /**
     * Create a new reservation from form data.
     * 
     * @param {*} attributes
     */
    createOrder: (attributes) => {
        let order = Order.fillOrderTemplate(attributes);

        return new Promise((resolve, reject) => {
            let query = 'INSERT INTO Orders SET ?';
            // (customerID, roomID, totalFee, reservationStart, reservationEnd)
            pool.query(query, order, (err, result, fields) => {
                if (err) {
                    console.error("Unable to add new order", attributes.customerID, ". Error JSON:",
                        JSON.stringify(err, null, 2));
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },

    /**
     * Add records for each ingredient in a beverage. 
     * Add records for each    item    in an order.
     * 
     * @param {*} itemsData//ingredients 
     * @param {*} orderID //beverage 
     */
    insertOrderItems: (itemsData, orderID) => {
        let itemSet = [];
        let status = "ordered";
        for(let i=0; i < itemsData.length; i++) {
            let item = [];
            item.push(parseInt(orderID));
            item.push(parseInt(itemsData[i].beverageID));
            item.push(parseInt(itemsData[i].quantity));
            item.push(status);
            itemSet.push(item);
        }

        return new Promise((resolve, reject) => {
            let query = 'INSERT INTO OrderItems (orderID, beverageID, quantity, status) VALUES ?';

            pool.query(query, [itemSet], (err, result, fields) => {
                if (err) {
                    console.error("Unable to add order item. Error JSON:",
                        JSON.stringify(err, null, 2));
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },
    /**
     * Helper to format insert data for a new order
     * 
     */
    fillOrderTemplate: (data) => {
        return {
            purchaseTime: data.purchaseTime,    // date-time
            totalAmount: data.totalAmount,      // total cost of all drinks ordered
            complete: 0,                        // Boolean
            customerID: data.customerID         // FK customerID
        };
    },
};

module.exports = Order;
