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
            // (purchaseTime, totalAmount, complete, customerID)
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
