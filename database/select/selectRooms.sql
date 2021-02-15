/*
    Query to find all Rooms with a given name.
    Used by the Reservations page when completing a booking.
    Used by the Cats insert.

    : used to indicated user provided value
*/

SELECT * 
FROM Rooms
WHERE name = :name;