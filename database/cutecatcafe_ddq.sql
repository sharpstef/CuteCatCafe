--  Records login and customer details for each customer that creates an account with the cafe. 
CREATE TABLE Customers (
    customerID int AUTO_INCREMENT NOT NULL,
    firstName varchar(50),
    lastName varchar(50),
    email varchar(255) NOT NULL UNIQUE,
    password varchar(520) NOT NULL,
    salt varchar(255) NOT NULL,
    member boolean DEFAULT 0,
    isAdmin boolean DEFAULT 0,
    PRIMARY KEY (customerID)
);

-- Records the details of each cat that is lended to the cafe for adoption. 
CREATE TABLE Cats (
    catID int AUTO_INCREMENT NOT NULL,
    name varchar(50) NOT NULL,
    breed varchar(50) NOT NULL,
    age int,
    dateAdmitted date NOT NULL,
    adopted boolean NOT NULL DEFAULT 0,
    roomID int,
    PRIMARY KEY (catID)    
);

-- Records the details for each room in the facility. 
CREATE TABLE Rooms (
    roomID int AUTO_INCREMENT NOT NULL,
    name varchar(50) NOT NULL UNIQUE,
    roomDescription text(500),
    reservable boolean DEFAULT 0,
    fee decimal(4,2) NOT NULL,
    catID int,
    PRIMARY KEY (roomID),
    FOREIGN KEY (catID) REFERENCES Cats(catID)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);

-- Add FK for Cats now that Rooms exists.
ALTER TABLE Cats
ADD FOREIGN KEY (roomID) REFERENCES Rooms(roomID)
ON DELETE SET NULL
ON UPDATE CASCADE;


-- Records the details of each beverage that the cafe offers.
CREATE TABLE Beverages (
    beverageID int AUTO_INCREMENT NOT NULL,
    name varchar(50) NOT NULL UNIQUE,
    description text(500),
    type varchar(7),
    price decimal (3,2) NOT NULL,
    CHECK (type='hot' OR type='cold' OR type='blended'),
    PRIMARY KEY (beverageID)
);

-- Records names of ingredients that may appear in beverages for easy search.
CREATE TABLE Ingredients (
    ingredientID int AUTO_INCREMENT NOT NULL,
    name varchar(50) NOT NULL UNIQUE,
    PRIMARY KEY (ingredientID)
);

-- Records the details of each customer’s drink order.
CREATE TABLE Orders (
    orderID int AUTO_INCREMENT NOT NULL,
    purchaseTime datetime NOT NULL,
    totalAmount decimal(5,2) NOT NULL,
    complete boolean,
    customerID int NOT NULL,
    PRIMARY KEY (orderID),
    FOREIGN KEY (customerID) REFERENCES Customers(customerID)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- Records reservation details for a room reserved by a customer.
CREATE TABLE Reservations (
    reservationID int AUTO_INCREMENT NOT NULL,
    customerID int NOT NULL,
    roomID int NOT NULL,
    totalFee decimal(6,2) NOT NULL,
    reservationStart datetime NOT NULL,
    reservationEnd datetime NOT NULL,
    PRIMARY KEY (reservationID),
    FOREIGN KEY (customerID) REFERENCES Customers(customerID)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    FOREIGN KEY (roomID) REFERENCES Rooms(roomID)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- Connects beverages to their list of ingredients.
CREATE TABLE BeverageIngredients (
    beverageID int NOT NULL,
    ingredientID int NOT NULL, 
    PRIMARY KEY (beverageID, ingredientID),
    FOREIGN KEY (beverageID) REFERENCES Beverages(beverageID)
    ON DELETE CASCADE,
    FOREIGN KEY (ingredientID) REFERENCES Ingredients(ingredientID)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

--  Records the preparation status of a beverage in an order.
CREATE TABLE OrderItems (
    orderID int NOT NULL,
    beverageID int NOT NULL,
    quantity int(2) NOT NULL,
    status varchar(15),
    CHECK (status='ordered' OR status='prepared' OR status='delivered'),
    PRIMARY KEY (beverageID, orderID),
    FOREIGN KEY (beverageID) REFERENCES Beverages(beverageID)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    FOREIGN KEY (orderID) REFERENCES Orders(orderID)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);


-- Sample values for Customers
-- They all have password of passw0rd
INSERT INTO Customers (firstName, lastName, email, password, salt, member, isAdmin)
VALUES
('Jana', 'Doogan', 'j.doogan@gmail.com','ff8b3b965f8cc4c092a9dcc58315d209eaaeea76a5f36b5d7304760bb6833c26b2e452b61e1039df169da53602def1169bf89e17b9939f8b3bfd289935084b2d','2c4e8dffeecd9e9ea554b4efbe9fe9a9ed7ad79b95c164a7d64903133dd245bd', 1, 0),
('Yu', 'Han', 'han@gmail.com','ff8b3b965f8cc4c092a9dcc58315d209eaaeea76a5f36b5d7304760bb6833c26b2e452b61e1039df169da53602def1169bf89e17b9939f8b3bfd289935084b2d','2c4e8dffeecd9e9ea554b4efbe9fe9a9ed7ad79b95c164a7d64903133dd245bd', 1, 0),
('Maeve', 'Smith', 'pinkbutterfly@gmail.com','ff8b3b965f8cc4c092a9dcc58315d209eaaeea76a5f36b5d7304760bb6833c26b2e452b61e1039df169da53602def1169bf89e17b9939f8b3bfd289935084b2d','2c4e8dffeecd9e9ea554b4efbe9fe9a9ed7ad79b95c164a7d64903133dd245bd', 1, 0),
('Stefania', 'Sharp', 'sharp@cutecatcafe.com', 'ff8b3b965f8cc4c092a9dcc58315d209eaaeea76a5f36b5d7304760bb6833c26b2e452b61e1039df169da53602def1169bf89e17b9939f8b3bfd289935084b2d', '2c4e8dffeecd9e9ea554b4efbe9fe9a9ed7ad79b95c164a7d64903133dd245bd', 0, 1),
('Naomi', 'Campbell', 'naomi@cutecatcafe.com', 'ff8b3b965f8cc4c092a9dcc58315d209eaaeea76a5f36b5d7304760bb6833c26b2e452b61e1039df169da53602def1169bf89e17b9939f8b3bfd289935084b2d', '2c4e8dffeecd9e9ea554b4efbe9fe9a9ed7ad79b95c164a7d64903133dd245bd', 0, 1);

-- Sample values for Cats
INSERT INTO Cats (name, breed, age, dateAdmitted, adopted)
VALUES
('Mittens', 'Domestic Shorthair', '1', '2021-02-01', 0),
('Spot', 'Persian', '3', '2021-02-11', 0),
('Boris', 'Maine Coon', '1', '2021-01-15', 0),
('Mojo Jojo', 'Sphynx', '2', '2021-01-14', 1),
('Talon', 'Domestic Shorthair', '2', '2021-01-14', 0),
('Pouncer', 'Domestic Shorthair', '1', '2021-02-10', 0),
('Mercury', 'Scottish Fold', '1', '2021-01-12', 0);

-- Sample values for Rooms
INSERT INTO Rooms (name, roomDescription, reservable, fee)
VALUES
('Green Room', 'A sunny room with warm shades of brown and green. This room is filled with plants and optimally placed beds for plenty of sunbathing by your furry friend. The room features a long natural wood desk to comfortably fit two laptops and all of your word or study belongings.', 0, 15.00),
('Blue Room', 'An undersea theme with nautical accents and fish tank embedded along one way. The lights in this room are fully customizable for a bright study space or a muted spot to relax. The room features coral themed cat towers and plenty of cat toys for when you need a break.', 0, 15.00),
('Yellow Room', 'One of our smaller rooms, but plenty of space for a solo studier. All four walls are painted in a warm yellow with plenty of sun through the floor to ceiling windows along one way. The top part of the room is lined with ledges and lined stairs for your fur friend to pounce around or a take a nap.', 0, 10.00),
('White Room', 'If bright colors are not your thing then this is the room for you. The only color in this room is from the hardwood floors and the muted grey accent furniture. The large desk sits next to our classic floor to ceiling windows. There is also a lounge chair for relaxed studying or a quick nap.', 0, 15.00);

-- Pair Cats with Rooms and Update reservable
UPDATE Cats 
SET roomID = (SELECT roomID FROM Rooms WHERE name = 'Yellow Room')
WHERE name = 'Pouncer';
UPDATE Rooms
SET catID = (SELECT catID FROM Cats WHERE name = 'Pouncer'), reservable = 1
WHERE name = 'Yellow Room';

UPDATE Cats 
SET roomID = (SELECT roomID FROM Rooms WHERE name = 'White Room')
WHERE name = 'Talon';
UPDATE Rooms
SET catID = (SELECT catID FROM Cats WHERE name = 'Talon'), reservable = 1
WHERE name = 'White Room';

UPDATE Cats 
SET roomID = (SELECT roomID FROM Rooms WHERE name = 'Green Room')
WHERE name = 'Boris';
UPDATE Rooms
SET catID = (SELECT catID FROM Cats WHERE name = 'Boris'), reservable = 1
WHERE name = 'Green Room';

-- Link Rooms to Customers for Reservations
INSERT INTO Reservations (customerID, roomID, totalFee, reservationStart, reservationEnd)
VALUES
((SELECT customerID FROM Customers WHERE firstName='Maeve' AND lastName='Smith'), (SELECT roomID FROM Rooms WHERE name='Yellow Room'), 20.00, '2021-02-15 12:00:00', '2021-02-15 14:00:00'),
((SELECT customerID FROM Customers WHERE firstName='Yu' AND lastName='Han'), (SELECT roomID FROM Rooms WHERE name='Yellow Room'), 10.00, '2021-02-15 15:00:00', '2021-02-15 13:00:00'),
((SELECT customerID FROM Customers WHERE firstName='Yu' AND lastName='Han'), (SELECT roomID FROM Rooms WHERE name='White Room'), 45.00, '2021-02-12 15:00:00', '2021-02-12 15:00:00'),
((SELECT customerID FROM Customers WHERE firstName='Jana' AND lastName='Doogan'), (SELECT roomID FROM Rooms WHERE name='Green Room'), 15.00, '2021-02-15 08:00:00', '2021-02-15 09:00:00'),
((SELECT customerID FROM Customers WHERE firstName='Maeve' AND lastName='Smith'), (SELECT roomID FROM Rooms WHERE name='Yellow Room'), 10.00, '2021-02-17 12:00:00', '2021-02-17 13:00:00'),
((SELECT customerID FROM Customers WHERE firstName='Yu' AND lastName='Han'), (SELECT roomID FROM Rooms WHERE name='White Room'), 45.00, '2021-02-17 15:00:00', '2021-02-17 18:00:00');

-- Sample values for Ingredients
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

-- Sample values for Beverages  
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

-- Link Ingredients for sample values in Beverages
INSERT INTO BeverageIngredients (beverageID, ingredientID)
VALUES
((SELECT beverageID FROM Beverages WHERE name='Americano'), (SELECT ingredientID FROM Ingredients WHERE name='Brewed Espresso')),
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


-- Link Beverages to Customers for Orders
-- Link Beverages to Orders for OrderItems
INSERT INTO Orders (purchaseTime, totalAmount, complete, customerID)
VALUES ('2021-02-12 15:34:32', 5.75, 1, (SELECT customerID FROM Customers WHERE firstName='Yu' AND lastName='Han'));
INSERT INTO OrderItems (orderID, beverageID, quantity, status)
VALUES
((SELECT LAST_INSERT_ID()), (SELECT beverageID FROM Beverages WHERE name='Coffee Frappe'),1,'delivered');

INSERT INTO Orders (purchaseTime, totalAmount, complete, customerID)
VALUES ('2021-02-12 17:18:30', 3.50, 1, (SELECT customerID FROM Customers WHERE firstName='Yu' AND lastName='Han'));
INSERT INTO OrderItems (orderID, beverageID, quantity, status)
VALUES
((SELECT LAST_INSERT_ID()), (SELECT beverageID FROM Beverages WHERE name='Americano'),1,'delivered');

INSERT INTO Orders (purchaseTime, totalAmount, complete, customerID)
VALUES ('2021-02-15 15:34:32', 5.50, 0, (SELECT customerID FROM Customers WHERE firstName='Jana' AND lastName='Doogan'));
INSERT INTO OrderItems (orderID, beverageID, quantity, status)
VALUES
((SELECT LAST_INSERT_ID()), (SELECT beverageID FROM Beverages WHERE name='Iced Tea'),1,'ordered'),
((SELECT LAST_INSERT_ID()), (SELECT beverageID FROM Beverages WHERE name='Coffee'),1,'ordered');

