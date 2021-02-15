/* 
    Query to delete existing data from the Beverages table
    Delete cascades to BeverageIngredients
    Delete cascades to OrderItems
    : used to indicate system provided value (id is stored as hidden in page)
*/

DELETE FROM Beverages WHERE beverageId = :condition;

/* 
    Query to remove an Ingredient linked to a Beverage
    : used to indicate user and system provided values
*/
DELETE FROM BeverageIngredients 
WHERE beverageID = :condition 
AND ingredientID IN (SELECT ingredientID FROM Ingredients WHERE name = :condition);