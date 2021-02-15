-- Query to delete existing data from the Orders table
-- : used to indicated user or system provided value

DELETE FROM Orders WHERE orderId = :condition