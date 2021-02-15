/* 
    Query to update the room for a given Cat
    : used to indicate user or system provided value
*/

UPDATE Cats 
SET roomID = (SELECT roomID FROM Rooms WHERE name = :condition)
WHERE name = :name;