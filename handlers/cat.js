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
    }
};

module.exports = Cat;