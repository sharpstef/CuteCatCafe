/*
    Query to update cat data when a new room is 
    added and there is a cat specified in the form.
    Used by the Room form.
*/

UPDATE Cats 
SET roomID = (
    SELECT roomID 
    FROM Rooms 
    WHERE name = :room) 
WHERE catID = :catID;