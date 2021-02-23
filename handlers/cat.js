const pool = require('../connect');


let Cat = {
    /**
     * Get all Cats 
     * 
     */
    getCats: () => {
        let query = `SELECT c.catID, c.name, c.breed, c.age, c.dateAdmitted,
                    c.adopted, r.name AS room
                    FROM Cats c
                    LEFT JOIN Rooms r ON c.roomID = r.roomID
                    ORDER BY c.name ASC`;
        
        return new Promise((resolve, reject) => {
            pool.query(query, (err, result, fields) => {
                if (err) {
                    console.error("Unable to get Cats. Error JSON:",
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
     * Get all cats that are adoptable and not assigned to a room.
     * Used to asign a cat to a new or existing empty room. 
     */
    getAvailableCats: () => {
        let query = `SELECT c.catID, c.name AS cat
                    FROM Cats c
                    WHERE c.roomID IS NULL
                    AND c.adopted = 0
                    ORDER BY c.name ASC`;

        return new Promise((resolve, reject) => {
            pool.query(query, (err, result, fields) => {
                if (err) {
                    console.error("Unable to get Cats. Error JSON:",
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
     * Insert a new Cat into the database with or without a room.
     * 
     * @param {*} attributes
     */
    addCat: (attributes) => {
        attributes.room = attributes.room ? attributes.room : null;
        let cat = Cat.fillCatTemplate(attributes);

        return new Promise((resolve, reject) => {
            let query = 'INSERT INTO Cats SET ?';
            pool.query(query, cat, (err, result, fields) => {
                if (err) {
                    console.error("Unable to add new cat", attributes.name, ". Error JSON:",
                        JSON.stringify(err, null, 2));
                    reject(err);
                } else {
                    if(attributes.room) {
                        let query = `UPDATE Rooms
                        SET catID = ?, reservable = 1
                        WHERE roomID = ?`;
                        let values = [result.insertId, attributes.room];

                        pool.query(query, values, (err, result, fields) => {
                            if (err) {
                                console.error("Unable to update room. Error JSON:",
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
    fillCatTemplate: (data) => {
        return {
            name: data.name,
            breed: data.breed,
            age: data.age,
            dateAdmitted: data.date,
            adopted: 0,
            roomID: data.room
        };
    },
};

module.exports = Cat;