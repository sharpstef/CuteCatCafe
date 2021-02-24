/*
    Query to get all Beverages and their Ingredients.
    Used in the Admin/Beverages and Menu pages.
*/

SELECT DISTINCT(b.beverageID), b.name, b.description, b.type, b.price, i.name AS ingredient
FROM Beverages b
LEFT JOIN BeverageIngredients bi ON b.beverageID = bi.beverageID
JOIN Ingredients i ON bi.ingredientID = i.ingredientID
ORDER BY b.name ASC;

/*
    Query to get all Beverages and their Ingredients that have a given ingredient.
    Used in the Menu page.
*/
SELECT b.beverageID, b.name, b.description, b.type, b.price, i.name AS ingredient
FROM Beverages b
JOIN BeverageIngredients bi ON b.beverageID = bi.beverageID
JOIN Ingredients i ON bi.ingredientID = i.ingredientID
WHERE i.name = :ingredient
ORDER BY b.name ASC;