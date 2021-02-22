const pool = require('../connect');


let Room = {
    /**
     * Get all Rooms
     * 
     */
    getRooms: () => {
        let query = `SELECT r.roomID, r.name, r.roomDescription,
                    r.reservable, r.fee, c.name AS cat
                    FROM Rooms r
                    LEFT JOIN Cats c ON c.roomID = r.roomID
                    ORDER BY r.name ASC`;

        return new Promise((resolve, reject) => {
            pool.query(query, (err, result, fields) => {
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
    }
};

module.exports = Room;