/* 
    Query to update data in the Beverages table
    : used to indicate user or system provided value
*/

UPDATE Beverages
SET name = :name, description = :description, type = :type, price = :price
WHERE beverageID = :condition;