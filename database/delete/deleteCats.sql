/* 
    Query to delete existing data from the Cats table
    Delete cascades a NULL to Rooms for catID
    : used to indicate system provided value (id is stored as hidden in page)
*/

DELETE FROM Cats WHERE catID = :condition;
