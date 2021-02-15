const util = require('../util');
const pool = require('../connect');


let Account = {
    /**
     * Get all Reservations for a given customerID.
     * 
     * @param {*} id
     * @param {*} callback
     */
    getReservationsByCustomer: (id, callback) => {
        let query = `SELECT r.reservationID, Rooms.name, r.totalFee, 
                    r.reservationTime, r.reservationDuration
                    FROM Reservations r 
                    JOIN Rooms ON r.roomID = Rooms.roomID 
                    WHERE r.customerID=?`;
        let values = [id];

        console.info("Querying for reservations for customer: ", id);

        pool.query(query, values, (err, result, fields) => {
            if (err) {
                console.error("Unable to find reservations. Error JSON:",
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
     * Get all Orders for a given customerID with beverage names 
     * and quantity ordered.
     * 
     * @param {*} id
     * @param {*} callback
     */
    getOrdersByCustomer: (id, callback) => {
        let query = `SELECT o.orderID, o.purchaseTime, o.totalAmount, 
        o.complete, b.name, oi.quantity, oi.status
        FROM Orders o
        JOIN OrderItems oi ON o.orderID = oi.orderID
        JOIN Beverages b ON oi.beverageID = b.beverageID
        WHERE o.customerID = ?`;
        let values = [id];

        console.info("Querying for orders for customer: ", id);

        pool.query(query, values, (err, result, fields) => {
            if (err) {
                console.error("Unable to find orders. Error JSON:",
                    JSON.stringify(err, null, 2));
                return callback(err, null);
            }
            if (result.length > 0) {
                // Prepare the data for the template and add the order items
                let orders = [];
                let currentOrder = 0;
                let order = {};
                for (let i = 0; i < result.length; i++) {
                    if(result.orderID != currentOrder) {
                        if(orders.length == 0 && order.hasOwnProperty("orderID")) {
                            orders.push(order);
                        }
                        order = Account.fillOrderTemplate(result[0]);
                    } else {
                        order.items.push(Account.fillItemTemplate(result[i]));
                    }
                    currentOrder = result.orderID;
                }

                if(order.hasOwnProperty("orderID")) {
                    orders.push(order);
                }
                return callback(null, orders);
            } else {
                return callback(2, null);
            }
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