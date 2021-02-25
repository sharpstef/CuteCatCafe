let bevArray = JSON.parse(sessionStorage.getItem("bevArray"));

if(bevArray) {
    console.info("Items in storage");
    createTable(bevArray);
}

/**
 * @param {*} beverage
 */
function removeBev (beverage) {
    for( var i = 0; i < bevArray.length; i++){ 
    
        if ( bevArray[i] === beverage) { 
    
            arr.splice(i, 1); 
        }
    }

    createTable(bevArray);
}
