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
    },
    /**
     * Get all rooms that do not have a cat assigned.
     * Used to assign a room to an adoptable cat.
     */
    getEmptyRooms: () => {
        let query = `SELECT roomID, name AS room
                    FROM Rooms r
                    WHERE catID IS NULL
                    ORDER BY name ASC`;

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
    },
    /**
     * Delete a room given the provided roomID.
     * 
     * @param {*} room
     */
    deleteRoom: (room) => {
        return new Promise((resolve, reject) => {
            let query = 'DELETE FROM Rooms WHERE roomID = ?';
            pool.query(query, room, (err, result, fields) => {
                if (err) {
                    console.error("Unable to remove room ", room, ". Error JSON:",
                        JSON.stringify(err, null, 2));
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },
    /**
     * Insert a new Room into the database with or without a cat.
     * 
     * @param {*} attributes
     */
    addRoom: (attributes) => {
        attributes.cat = attributes.cat ? attributes.cat : null;
        let room = Room.fillRoomTemplate(attributes);

        return new Promise((resolve, reject) => {
            let query = 'INSERT INTO Rooms SET ?';
            pool.query(query, room, (err, result, fields) => {
                if (err) {
                    console.error("Unable to add new room", attributes.name, ". Error JSON:",
                        JSON.stringify(err, null, 2));
                    reject(err);
                } else {
                    if(attributes.cat) {
                        let query = `UPDATE Cats SET roomID = (SELECT roomID from Rooms WHERE name = ?) WHERE catID = ?`;
                        let values = [attributes.name, attributes.cat];

                        pool.query(query, values, (err, result, fields) => {
                            if (err) {
                                console.error("Unable to update cat. Error JSON:",
                                    JSON.stringify(err, null, 2));
                                reject(err);
                            }
                            if (result && result.length > 0) {
                                resolve(result);
                            } else {
                                resolve(null);
                            }
                        });
                    } else {
                        resolve(result);
                    }
                }
            });
        });
    },
    fillRoomTemplate: (data) => {
        data.reservable = data.cat ? 1 : 0;
        return {
            name: data.name,
            roomDescription: data.description,
            reservable: data.reservable,
            fee: data.fee,
            catID: data.cat
        };
    },
};

module.exports = Room;