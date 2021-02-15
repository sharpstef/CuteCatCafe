/*
    Query to find all Rooms and their associated Cats.
    Used by the Admin/Rooms page. 
    Used by the Reservations page when completing a booking.

    : used to indicated user provided value
*/

SELECT r.roomID, r.name, r.roomDescription, r.reservable, r.fee, c.name AS cat
FROM Rooms r
JOIN Cats c ON c.roomID = r.roomID
ORDER BY r.name ASC;

/*
    Query to get all rooms that are not booked for a given date/time.

    : indicates user provided dateTime
*/

SELECT r.roomID, r.name, r.roomDescription, r.reservable, r.fee
FROM Rooms r
JOIN Reservations res ON r.roomID = res.roomID
WHERE r.reservable = 1
AND res.reservationStart NOT BETWEEN :startTime AND :endTime
AND res.reservationEnd NOT BETWEEN :startTime AND :endTime
ORDER BY r.name ASC;