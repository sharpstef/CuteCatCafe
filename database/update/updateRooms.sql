/*
    Query to update room data when a new cat is 
    added and there is a room specified in the form.
    Used by the Cat form.
*/

UPDATE Rooms
SET catID = :cat, reservable = 1
WHERE roomID = :roomID;