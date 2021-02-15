/* 
    Query to delete existing data from the Orders table
    Delete cascades to OrderItems
    : used to indicate system provided value (id is stored as hidden in page)
*/

DELETE FROM Orders WHERE orderId = :condition;