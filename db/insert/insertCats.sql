-- Query to add a new row to the Cats table
-- : used to indicated user or system provided value

INSERT INTO Cats (name, breed, age, dateAdmitted, adopted)
VALUES
(:name, :breed, :age, :date, 0);