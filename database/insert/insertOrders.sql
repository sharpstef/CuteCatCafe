-- Query to add a new row to the Orders table
-- : used to indicated user or system provided value

INSERT INTO Orders (purchaseTime, totalAmount, complete, customerID)
VALUES 
(:purchaseTime, :totalAmount, :complete, :customerID)