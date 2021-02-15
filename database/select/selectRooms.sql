/*
    Query to find all Rooms and their associated Cats.
    Used by the Admin/Rooms page. 
    Used by the Reservations page when completing a booking.

    : used to indicated user provided value
*/

SELECT r.roomID, r.name, r.roomDescription, r.reservable, r.fee, c.name AS cat
FROM Rooms c
JOIN Cats c ON c.roomID = r.roomID
ORDER BY r.name ASC;