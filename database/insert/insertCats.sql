/*
    Query to add a new row to the Cats table
    : used to indicate user or system provided value
    All cats start with a NULL for roomID
*/

INSERT INTO Cats (name, breed, age, dateAdmitted, adopted)
VALUES
(:name, :breed, :age, :date, 0);