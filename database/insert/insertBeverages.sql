-- Query to add a new row to the Beverages table
-- : used to indicated user or system provided value

INSERT INTO Beverages (name, description, type, price)
VALUES 
(:name, :description, :type, :price)