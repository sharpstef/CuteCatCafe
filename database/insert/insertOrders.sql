/*
    Queries to add a new row to the Orders and OrderItems tables
    : used to indicate user or system provided value
*/

INSERT INTO Orders (purchaseTime, totalAmount, complete, customerID)
VALUES 
(:purchaseTime, :totalAmount, :complete, :customerID);

INSERT INTO OrderItems (orderID, beverageID, quantity, status)
VALUES
(:orderID, (SELECT beverageID FROM Beverages WHERE name=:beverage), :quantity, :status);