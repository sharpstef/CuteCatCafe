
CREATE TABLE Orders (
orderID int AUTO_INCREMENT NOT NULL,
purchaseTime datetime NOT NULL,
totalAmount decimal(5,2) NOT NULL,
complete boolean,
customerID int NOT NULL,
PRIMARY KEY (orderID),
FOREIGN KEY (customerID) REFERENCES Customers(customerID),
UNIQUE(orderID)
);

-- Records names of ingredients that may appear in beverages for easy search.
CREATE TABLE Ingredients (
ingredientID int AUTO_INCREMENT NOT NULL,
name varchar(50),
PRIMARY KEY (ingredientID),
UNIQUE(ingredientID)
);

-- Records the details of each beverage that the cafe offers.
CREATE TABLE Beverages (
beverageID int AUTO_INCREMENT NOT NULL,
name varchar(50) NOT NULL,
description text(500),
type varchar(7),
price decimal (3,2) NOT NULL,
CHECK (type='hot' OR type='cold' OR type='blended'),
PRIMARY KEY (beverageID),
UNIQUE(beverageID)
);

CREATE TABLE BeverageIngredients (
beverageID int,
ingredientID int, 
PRIMARY KEY (beverageID, ingredientID),
FOREIGN KEY (beverageID) REFERENCES Beverages(beverageID),
FOREIGN KEY (ingredientID) REFERENCES Ingredients(ingredientID)
);

CREATE TABLE OrderItems (
orderID int,
beverageID int,
quantity int(2) NOT NULL,
status varchar(15),
CHECK (status='ordered' OR status='prepared' OR status='delivered'),
PRIMARY KEY (beverageID, orderID),
FOREIGN KEY (beverageID) REFERENCES Beverages(beverageID),
FOREIGN KEY (orderID) REFERENCES Orders(orderID),
);

-- ##### EDIT THE SUBQUERY FOR customerID #####
-- INSERT INTO Orders (purchaseTime, totalAmount, complete, customerID)
-- VALUES ('2021-02-12 03:34:32', 6.99, 1, (SELECT customerID FROM Customer WHERE ...));

INSERT INTO Ingredients (name)
VALUES 
('Whipped Cream'),
('Brewed Espresso'),
('Milk'),
('Brewed Coffee'),
('Black Tea'),
('Mocha Sauce'),
('White Chocolate Mocha Sauce'),
('Chai Tea Concentrate'),
('Ice'),
('Liquid Cane Sugar'),
('Classic Syrup'),
('Coffee Frappe Syrup'),
('Coffee'),
('Caramel Syrup'),
('Caramel Sauce'),
('Creme Frappe Syrup'),
('Cinnamon');

INSERT INTO Beverages (name, description, type, price)
VALUES 
('Americano',	'Espresso shots topped with hot water create a light layer of crema culminating in this wonderfully rich cup with depth and nuance.',	'hot',	3.50),
('Cappuccino',	'Dark, rich espresso lies in wait under a smoothed and stretched layer of thick milk foam. An alchemy of barista artistry and craft.',	'hot',	4.00	),
('Latte',	'Our dark, rich espresso balanced with steamed milk and a light layer of foam. A perfect milk-forward warm-up.',	'hot',	4.00	),
('Coffee',	'This full-bodied dark roast coffee with bold, robust flavors showcases our roasting and blending artistry—an essential blend of balanced and lingering flavors.',	'hot',	2.75	),
('Hot Tea',	'Each sip of this beloved morning black tea unfolds to reveal the complexity of the high-grown full leaves. An elegant, time-honored classic that brings a royal nod to every cup.',	'hot',	2.50	),
('Mocha',	'Our rich, full-bodied espresso combined with bittersweet mocha sauce and steamed milk, then topped with sweetened whipped cream. The classic coffee drink that always sweetly satisfies.',	'hot',	4.50	),
('White Mocha',	'Our signature espresso meets white chocolate sauce and steamed milk, and then is finished off with sweetened whipped cream to create this supreme white chocolate delight.',	'hot',	4.50	),
('Chai Latte',	'Black tea infused with cinnamon, clove and other warming spices is combined with steamed milk and topped with foam for the perfect balance of sweet and spicy. An iconic chai cup.',	'hot',	4.00	),
('Hot Chocolate',	'Steamed milk and mocha sauce topped with sweetened whipped cream and a chocolate-flavored drizzle. A timeless classic made to sweeten your spirits..',	'hot',	4.00	),
('Iced Tea',	'Premium black tea is sweetened just right and shaken with ice. It''s the ideal iced tea—a rich and flavorful black tea journey awaits you.',	'cold',	2.75	),
('Iced Mocha',	'Our rich, full-bodied espresso combined with bittersweet mocha sauce, milk and ice, then topped with sweetened whipped cream. The classic iced coffee drink that always sweetly satisfies.',	'cold',	4.50	),
('Iced Chai',	'Black tea infused with cinnamon, clove, and other warming spices are combined with milk and ice for the perfect balance of sweet and spicy.',	'cold',	4.50	),
('Iced Latte',	'Our dark, rich espresso combined with milk and served over ice. A perfect milk-forward cooldown.',	'cold',	4.50	),
('Iced Coffee',	'Freshly brewed Iced Coffee Blend served chilled and sweetened over ice. An absolutely, seriously, refreshingly lift to any day.',	'cold',	3.00	),
('Coffee Frappe',	'Coffee meets milk and ice in a blender for a rumble-and-tumble togetherness to create one of our most-beloved original frappe blended beverages.',	'blended',	5.75	),
('Mocha Frappe',	'Mocha sauce, roast coffee, milk and ice all come together for a mocha flavor that''ll leave you wanting more. To change things up, try it affogato-style with a hot espresso shot poured right over the top.',	'blended',	6.25	),
('Caramel Frappe',	'Caramel syrup meets coffee, milk and ice for a rendezvous in the blender, while whipped cream and buttery caramel sauce layer the love on top. To change things up, try it affogato-style with a hot espresso shot poured right over the top.',	'blended',	6.25	),
('Chai Frappe',	'A creamy blend of spicy chai, milk and ice, finished with sweetened whipped cream and a sprinkle of cinnamon. Specially made to spice up your afternoon treat.',	'blended',	6.25	),
('White Mocha Frappe',	'White chocolate roast coffee, milk and ice get together for what might be the best thing that happens to you all day. Oh, and there''s whipped cream on top.',	'blended',	6.25	);

INSERT INTO BeverageIngredients (beverageID, ingredientID)
VALUES
((SELECT beverageID FROM Beverages WHERE name='Americano'), (SELECT ingredientID FROM Ingredients WHERE name='Brewed Espresso'))
((SELECT beverageID FROM Beverages WHERE name='Cappuccino'), (SELECT ingredientID FROM Ingredients WHERE name='Milk')),
((SELECT beverageID FROM Beverages WHERE name='Cappuccino'), (SELECT ingredientID FROM Ingredients WHERE name='Brewed Espresso')),
((SELECT beverageID FROM Beverages WHERE name='Latte'), (SELECT ingredientID FROM Ingredients WHERE name='Milk')),
((SELECT beverageID FROM Beverages WHERE name='Latte'), (SELECT ingredientID FROM Ingredients WHERE name='Brewed Espresso')),
((SELECT beverageID FROM Beverages WHERE name='Coffee'), (SELECT ingredientID FROM Ingredients WHERE name='Brewed Coffee')),
((SELECT beverageID FROM Beverages WHERE name='Hot Tea'), (SELECT ingredientID FROM Ingredients WHERE name='Black Tea')),
((SELECT beverageID FROM Beverages WHERE name='Mocha'), (SELECT ingredientID FROM Ingredients WHERE name='Milk')),
((SELECT beverageID FROM Beverages WHERE name='Mocha'), (SELECT ingredientID FROM Ingredients WHERE name='Brewed Espresso')),
((SELECT beverageID FROM Beverages WHERE name='Mocha'), (SELECT ingredientID FROM Ingredients WHERE name='Mocha Sauce')),
((SELECT beverageID FROM Beverages WHERE name='Mocha'), (SELECT ingredientID FROM Ingredients WHERE name='Whipped Cream')),
((SELECT beverageID FROM Beverages WHERE name='White Mocha'), (SELECT ingredientID FROM Ingredients WHERE name='Milk')),
((SELECT beverageID FROM Beverages WHERE name='White Mocha'), (SELECT ingredientID FROM Ingredients WHERE name='White Chocolate Mocha Sauce')),
((SELECT beverageID FROM Beverages WHERE name='White Mocha'), (SELECT ingredientID FROM Ingredients WHERE name='Brewed Espresso')),
((SELECT beverageID FROM Beverages WHERE name='White Mocha'), (SELECT ingredientID FROM Ingredients WHERE name='Whipped Cream')),
((SELECT beverageID FROM Beverages WHERE name='Chai Latte'), (SELECT ingredientID FROM Ingredients WHERE name='Milk')),
((SELECT beverageID FROM Beverages WHERE name='Chai Latte'), (SELECT ingredientID FROM Ingredients WHERE name='Chai Tea Concentrate')),
((SELECT beverageID FROM Beverages WHERE name='Hot Chocolate'), (SELECT ingredientID FROM Ingredients WHERE name='Milk')),
((SELECT beverageID FROM Beverages WHERE name='Hot Chocolate'), (SELECT ingredientID FROM Ingredients WHERE name='Mocha Sauce')),
((SELECT beverageID FROM Beverages WHERE name='Hot Chocolate'), (SELECT ingredientID FROM Ingredients WHERE name='Whipped Cream')),
((SELECT beverageID FROM Beverages WHERE name='Iced Tea'), (SELECT ingredientID FROM Ingredients WHERE name='Black Tea')),
((SELECT beverageID FROM Beverages WHERE name='Iced Tea'), (SELECT ingredientID FROM Ingredients WHERE name='Ice')), 
((SELECT beverageID FROM Beverages WHERE name='Iced Tea'), (SELECT ingredientID FROM Ingredients WHERE name='Liquid Cane Sugar')),
((SELECT beverageID FROM Beverages WHERE name='Iced Mocha'), (SELECT ingredientID FROM Ingredients WHERE name='Ice')),
((SELECT beverageID FROM Beverages WHERE name='Iced Mocha'), (SELECT ingredientID FROM Ingredients WHERE name='Milk')),
((SELECT beverageID FROM Beverages WHERE name='Iced Mocha'), (SELECT ingredientID FROM Ingredients WHERE name='Mocha Sauce')),
((SELECT beverageID FROM Beverages WHERE name='Iced Mocha'), (SELECT ingredientID FROM Ingredients WHERE name='Brewed Espresso')),
((SELECT beverageID FROM Beverages WHERE name='Iced Mocha'), (SELECT ingredientID FROM Ingredients WHERE name='Whipped Cream')),
((SELECT beverageID FROM Beverages WHERE name='Iced Chai'), (SELECT ingredientID FROM Ingredients WHERE name='Milk')),
((SELECT beverageID FROM Beverages WHERE name='Iced Chai'), (SELECT ingredientID FROM Ingredients WHERE name='Ice')),
((SELECT beverageID FROM Beverages WHERE name='Iced Chai'), (SELECT ingredientID FROM Ingredients WHERE name='Chai Tea Concentrate')),
((SELECT beverageID FROM Beverages WHERE name='Iced Latte'), (SELECT ingredientID FROM Ingredients WHERE name='Milk')),
((SELECT beverageID FROM Beverages WHERE name='Iced Latte'), (SELECT ingredientID FROM Ingredients WHERE name='Ice')),
((SELECT beverageID FROM Beverages WHERE name='Iced Latte'), (SELECT ingredientID FROM Ingredients WHERE name='Brewed Espresso')),
((SELECT beverageID FROM Beverages WHERE name='Iced Coffee'), (SELECT ingredientID FROM Ingredients WHERE name='Ice')),
((SELECT beverageID FROM Beverages WHERE name='Iced Coffee'), (SELECT ingredientID FROM Ingredients WHERE name='Brewed Coffee')),
((SELECT beverageID FROM Beverages WHERE name='Iced Coffee'), (SELECT ingredientID FROM Ingredients WHERE name='Classic Syrup')),
((SELECT beverageID FROM Beverages WHERE name='Coffee Frappe'), (SELECT ingredientID FROM Ingredients WHERE name='Ice')),
((SELECT beverageID FROM Beverages WHERE name='Coffee Frappe'), (SELECT ingredientID FROM Ingredients WHERE name='Milk')),
((SELECT beverageID FROM Beverages WHERE name='Coffee Frappe'), (SELECT ingredientID FROM Ingredients WHERE name='Coffee Frappe Syrup')),
((SELECT beverageID FROM Beverages WHERE name='Coffee Frappe'), (SELECT ingredientID FROM Ingredients WHERE name='Coffee')),
((SELECT beverageID FROM Beverages WHERE name='Mocha Frappe'), (SELECT ingredientID FROM Ingredients WHERE name='Ice')),
((SELECT beverageID FROM Beverages WHERE name='Mocha Frappe'), (SELECT ingredientID FROM Ingredients WHERE name='Milk')),
((SELECT beverageID FROM Beverages WHERE name='Mocha Frappe'), (SELECT ingredientID FROM Ingredients WHERE name='Coffee Frappe Syrup')),
((SELECT beverageID FROM Beverages WHERE name='Mocha Frappe'), (SELECT ingredientID FROM Ingredients WHERE name='Whipped Cream')),
((SELECT beverageID FROM Beverages WHERE name='Mocha Frappe'), (SELECT ingredientID FROM Ingredients WHERE name='Coffee')),
((SELECT beverageID FROM Beverages WHERE name='Mocha Frappe'), (SELECT ingredientID FROM Ingredients WHERE name='Mocha Sauce')),
((SELECT beverageID FROM Beverages WHERE name='Caramel Frappe'), (SELECT ingredientID FROM Ingredients WHERE name='Ice')),
((SELECT beverageID FROM Beverages WHERE name='Caramel Frappe'), (SELECT ingredientID FROM Ingredients WHERE name='Milk')),
((SELECT beverageID FROM Beverages WHERE name='Caramel Frappe'), (SELECT ingredientID FROM Ingredients WHERE name='Coffee Frappe Syrup')),
((SELECT beverageID FROM Beverages WHERE name='Caramel Frappe'), (SELECT ingredientID FROM Ingredients WHERE name='Whipped Cream')),
((SELECT beverageID FROM Beverages WHERE name='Caramel Frappe'), (SELECT ingredientID FROM Ingredients WHERE name='Coffee')),
((SELECT beverageID FROM Beverages WHERE name='Caramel Frappe'), (SELECT ingredientID FROM Ingredients WHERE name='Caramel Syrup')),
((SELECT beverageID FROM Beverages WHERE name='Caramel Frappe'), (SELECT ingredientID FROM Ingredients WHERE name='Caramel Sauce')),
((SELECT beverageID FROM Beverages WHERE name='Chai Frappe'), (SELECT ingredientID FROM Ingredients WHERE name='Ice')),
((SELECT beverageID FROM Beverages WHERE name='Chai Frappe'), (SELECT ingredientID FROM Ingredients WHERE name='Milk')),
((SELECT beverageID FROM Beverages WHERE name='Chai Frappe'), (SELECT ingredientID FROM Ingredients WHERE name='Creme Frappe Syrup')),
((SELECT beverageID FROM Beverages WHERE name='Chai Frappe'), (SELECT ingredientID FROM Ingredients WHERE name='Chai Tea Concentrate')),
((SELECT beverageID FROM Beverages WHERE name='Chai Frappe'), (SELECT ingredientID FROM Ingredients WHERE name='Whipped Cream')),
((SELECT beverageID FROM Beverages WHERE name='Chai Frappe'), (SELECT ingredientID FROM Ingredients WHERE name='Cinnamon')),
((SELECT beverageID FROM Beverages WHERE name='White Mocha Frappe'), (SELECT ingredientID FROM Ingredients WHERE name='Ice')),
((SELECT beverageID FROM Beverages WHERE name='White Mocha Frappe'), (SELECT ingredientID FROM Ingredients WHERE name='Milk')),
((SELECT beverageID FROM Beverages WHERE name='White Mocha Frappe'), (SELECT ingredientID FROM Ingredients WHERE name='Coffee Frappe Syrup')),
((SELECT beverageID FROM Beverages WHERE name='White Mocha Frappe'), (SELECT ingredientID FROM Ingredients WHERE name='Whipped Cream')),
((SELECT beverageID FROM Beverages WHERE name='White Mocha Frappe'), (SELECT ingredientID FROM Ingredients WHERE name='Coffee')),
((SELECT beverageID FROM Beverages WHERE name='White Mocha Frappe'), (SELECT ingredientID FROM Ingredients WHERE name='White Chocolate Mocha Sauce'));











