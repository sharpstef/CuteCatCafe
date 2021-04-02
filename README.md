# Cute Cat Cafe

## Backend

### handlers/
Contains modules specific to each entity or entity pair.
- beverage.js: Select, Insert, Update, and Delete queries for Beverages and BeverageIngredients
- cat.js: Select, Insert, Update, and Delete queries for Cats
- customer.js: Select, Insert queries for Customers. Contains helper functions for one-way hash on passwords. Select queries for Orders/OrderItems and Reservations for a single customer. 
- order.js: Insert queries for Orders and OrderItems.
- reservation.js: Select query for available Rooms, Insert query for Reservations. 
- room.js: Select, Insert, Update, and Delete queries for Rooms. 

### app.js
Main handler for site functionality. Contains all get and post routes. 

### config.js
Contains connection information to database.

### connect.js
Helper function for making a mysql pool connection to a database. 

### constants.js
Holds the default menu and other variables used across multiple site pages.

### util.js
Contains helper functions to be resused by multiple backend functions. Contains the helper for updating
the menu for authenticated users. 

## Frontend
### public/
- css: Custom css and vendor css for imported modules.
- fonts: Fontawesome for icons used on site
- images: Images licensed from Shutterstock for the site banner
- js: Primary handlers for each page on the site
    - main.js: Common functions for all pages such as easing and menu
    - account.js: Get requests or Customer, Reservations, and Orders for a single customer.
    - beverages.js: Get and Post requests for managing Beverages in Admin/Beverages.
    - cats.js: Get and Post requests for managing Cats in Admin/Cats.
    - checkout.js: Grabs session stored cart and makes Post request to populate Orders and OrderItems.
    - ingredients.js: Get and Post requests for managing Ingredients in Admin/Ingredients.
    - menu.js: Get request for populating a menu and session storage for adding items to a cart.
    - reservation.js: Get request for available rooms and then Post to add a Reservation to the database. Support for deleting a Reservation for a Customer. 
    - rooms.js: Get and Post requests for managing Rooms in Admin/Rooms.
    - util.js: Helper functions for populating tables and clearing parts of the page used by all pages.

### views/
- layouts/: main.handlebars - Site styling around <body>
- partials/: footer.handlebars, nav.handlebars - Styling for header and footer for each page.
- 404.handlebars
- account.handlebars - Select customer, Select Orders/OrderItems, Select Reservations, Delete Reservations.
- admin.handlebars - Sub navigation to the four admin pages. Requires authenticated user with isAdmin.
- beverages.handlebars - Select Beverages, Select Ingredients, Insert Beverages/BeverageIngredients, Update Beverages/Beverage Ingredients. Requires authenticated user with isAdmin.
- cats.handlebars - Select available Rooms, Select Cats, Insert Cats/Update Rooms, Delete Cats. Requires authenticated user with isAdmin.
- checkout.handlebars - Insert Orders/OrderItems. Requires authenticated user.
- index.handlebars - Site index with links to each page.
- ingredients.handlebars - Select Ingredients, Update Ingredients, Delete Ingredients. Requires authenticated user with isAdmin.
- login.handlebars - Select existing Customer.
- menu.handlebars - Select Beverages. 
- register.handlebars - Insert Customer.
- reservations.handlebars - Select available Rooms in time period, Insert Reservation. Requires authenticated user. 
- rooms.handlebars - Select available Cats, Select Rooms, Insert Rooms/Update Cats, Delete Rooms. Requires authenticated user with isAdmin.


## Database
Holds copies of sql files for all of the queries used by the database. Not imported by the backend. 