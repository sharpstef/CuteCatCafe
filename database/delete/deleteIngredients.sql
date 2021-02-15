
/* 
    Query to delete existing data from the Ingredients table
    Delete cascades to BeverageIngredients
    : used to indicate system provided value (id is stored as hidden in page)
*/

DELETE FROM Ingredients WHERE ingredientId = :condition;