/*
    Query to get all reservations for a given Customer.
    Returns all reservations with the room name from Rooms.

    Used for the Reservation History section of the Account page.

    : indicates the system stored customerID for querying
*/

SELECT r.reservationID, Rooms.name, r.totalFee, r.reservationStart, r.reservationEnd
FROM Reservations r 
JOIN Rooms ON r.roomID = Rooms.roomID 
WHERE r.customerID = :customerID;