/* 
    Query to delete existing data from the Reservations table
    : used to indicate system provided value (id is stored as hidden in page)
*/

DELETE FROM Reservations WHERE reservationID = :condition;