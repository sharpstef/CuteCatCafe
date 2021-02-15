/*
    Query to add a new row to the Rooms table
    : used to indicate user or system provided value
    All rooms start with a NULL for catID
*/

INSERT INTO Rooms (name, roomDescription, reservable, fee)
VALUES
(:name, :description, 0, :fee);