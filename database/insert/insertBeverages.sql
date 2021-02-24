/*
    Queries to add a new row to the Beverages and BeverageIngredients tables
    : used to indicated user or system provided value
*/

INSERT INTO Beverages (name, description, type, price)
VALUES 
(:name, :description, :type, :price);

INSERT INTO BeverageIngredients (beverageID, ingredientID)
VALUES
(:beverageID, :ingredientID);