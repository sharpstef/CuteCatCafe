/*
    Queries to add a new row to the Reservations table
    : used to indicate user or system provided value
*/

INSERT INTO Reservations (customerID, roomID, totalFee, reservationStart, reservationEnd)
VALUES
(:customerID, :roomID, :totalFee, :reservationStart, :reservationEnd);