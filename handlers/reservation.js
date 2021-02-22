const pool = require('../connect');


let Reservation = {
    /**
     * Get rooms within a specified date range.
     * 
     * @param {*} startTime 
     * @param {*} endTime 
     */
    getAvailableRooms: (startTime, endTime) => {    
        let query = `SELECT DISTINCT(r.roomID), r.name, r.roomDescription, r.fee, c.name AS cat
                    FROM Rooms r
                    JOIN Cats c ON c.catID = r.catID
                    LEFT JOIN Reservations res ON r.roomID = res.roomID
                    WHERE r.reservable = 1
                    AND res.reservationStart NOT BETWEEN CAST(? AS DATETIME) AND CAST(? AS DATETIME)
                    AND res.reservationEnd NOT BETWEEN CAST(? AS DATETIME) AND CAST(? AS DATETIME)
                    ORDER BY r.name ASC;`;
        let values = [startTime, endTime, startTime, endTime];

        return new Promise((resolve, reject) => {
            pool.query(query, values, (err, result, fields) => {
                if (err) {
                    console.error("Unable to get Rooms. Error JSON:",
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
     * Create a new reservation from form data.
     * 
     * @param {*} attributes
     */
    createReservation: (attributes) => {
        let reservation = Reservation.fillReservationTemplate(attributes);

        return new Promise((resolve, reject) => {
            let query = 'INSERT INTO Reservations SET ?';
            // (customerID, roomID, totalFee, reservationStart, reservationEnd)
            pool.query(query, reservation, (err, result, fields) => {
                if (err) {
                    console.error("Unable to add new reservation", attributes.customerID, ". Error JSON:",
                        JSON.stringify(err, null, 2));
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },
    fillReservationTemplate: (data) => {
        return {
            customerID: data.customerID,
            roomID: data.roomID,
            totalFee: data.totalFee,
            reservationStart: data.reservationStart,
            reservationEnd: data.reservationEnd
        };
    },
};

module.exports = Reservation;