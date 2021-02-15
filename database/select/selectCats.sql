/*
    Query to get all Cats and their assigned Rooms.
    Used by the Admin/Cats page. 
*/

SELECT c.catID, c.name, c.breed, c.age, c.dateAdmitted, c.adopted, r.name AS room
FROM Cats c
JOIN Rooms r ON c.roomID = r.roomID
ORDER BY c.name ASC;