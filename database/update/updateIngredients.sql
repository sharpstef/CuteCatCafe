/*
    Query to update data in the Ingredients table
    : used to indicate user or system provided value
*/

UPDATE Ingredients
SET name = :name
WHERE ingredientID = :condition;