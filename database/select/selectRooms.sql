/*
    Query to find all Rooms and their associated Cats.
    Used by the Admin/Rooms page. 
    Used by the Reservations page when completing a booking.

    : used to indicated user provided value
*/

SELECT r.roomID, r.name, r.roomDescription, r.reservable, r.fee, c.name AS cat
FROM Rooms r
LEFT JOIN Cats c ON c.roomID = r.roomID
ORDER BY r.name ASC;

/*
    Query to get empty rooms for assigning cats.
*/
SELECT r.roomID, r.name as room
FROM Rooms r
WHERE r.catID IS NULL
ORDER BY r.name ASC;

/*
    Query to get all rooms that are not booked for a given date/time.

    : indicates user provided dateTime
*/

SELECT DISTINCT(r.roomID), r.name, r.roomDescription, r.fee, c.name AS cat
FROM Rooms r
JOIN Cats c ON c.catID = r.catID
WHERE r.reservable = 1
AND r.roomID NOT IN (
    SELECT roomID
    FROM Reservations 
    WHERE reservationStart 
    BETWEEN ?
    AND ?
    AND reservationEnd 
    BETWEEN ?
    AND ?
)
ORDER BY r.name ASC;