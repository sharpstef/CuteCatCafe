/*
    Query to get all Orders for a given Customer.
    Returns the list of OrderItems with the details of
    the order. 

    Used for the Order History section of the Account page.

    : indicates the system stored customerID for querying
*/

SELECT o.orderID, o.purchaseTime, o.totalAmount, o.complete, b.name, oi.quantity, oi.status
FROM Orders o
JOIN OrderItems oi ON o.orderID = oi.orderID
JOIN Beverages b ON oi.beverageID = b.beverageID
WHERE o.customerID = :customerID;