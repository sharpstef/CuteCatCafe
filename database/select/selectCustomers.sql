/*
    Query to find a customer in Customers given a 
    provided email. Used for the login page.
    : used to indicated user provided value
*/

SELECT * 
FROM Customers
WHERE email = :email;