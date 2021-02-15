-- Query to update data in the Ingredients table
-- : used to indicated user or system provided value

UPDATE Ingredients
SET name = :name
WHERE IngredientID = :condition