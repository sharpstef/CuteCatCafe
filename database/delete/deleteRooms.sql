/* 
    Query to delete existing data from the Rooms table
    Delete cascades a NULL to Cats for roomID
    : used to indicate system provided value (id is stored as hidden in page)
*/

DELETE FROM Rooms WHERE roomID = :condition;
