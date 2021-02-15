/* 
    Query to update the cat for a given Room and set a room to reservable
    : used to indicate user or system provided value
*/

UPDATE Rooms
SET catID = (SELECT catID FROM Cats WHERE name = :condition), reservable = 1
WHERE name = :name;