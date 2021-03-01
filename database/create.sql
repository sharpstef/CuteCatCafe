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