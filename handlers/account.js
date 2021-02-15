const pool = require('../connect');


let Account = {
    /**
     * Get all Reservations for a given customerID.
     * 
     * @param {*} id
     */
    getReservationsByCustomer: (id) => {
        let query = `SELECT r.reservationID, Rooms.name, r.totalFee, 
                    r.reservationTime, r.reservationDuration
                    FROM Reservations r 
                    JOIN Rooms ON r.roomID = Rooms.roomID 
                    WHERE r.customerID=?`;
        let values = [id];

        console.info("Querying for reservations for customer: ", id);

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

        console.info("Querying for orders for customer: ", id);

        return new Promise((resolve, reject) => {
            pool.query(query, values, (err, result, fields) => {
                if (err) {
                    reject(err);
                }
                if (result && result.length > 0) {
                    // Prepare the data for the template and add the order items
                    let orders = [];
                    let currentOrder = result[0].orderID;
                    let order = Account.fillOrderTemplate(result[0]);

                    for (let i = 0; i < result.length; i++) {
                        if(result[i].orderID != currentOrder) {
                            orders.push(order);
                            order = Account.fillOrderTemplate(result[i]);
                        } 
                        order.items.push(Account.fillItemTemplate(result[i]));
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

module.exports = Account;