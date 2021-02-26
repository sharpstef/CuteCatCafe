let bevArray = JSON.parse(sessionStorage.getItem("bevArray"));

if(bevArray) {
    console.info("Items in storage");
    createTable(bevArray);
}

/** Removes a beverage from the checkout table
 * @param {*} beverage
 */
function removeBev (beverage) {
    for( var i = 0; i < bevArray.length; i++){ 
        if ( bevArray[i].beverageID === beverage.beverageID) { 
            bevArray.splice(i, 1); 
        }
    }
    createTable(bevArray);
}


/**
 * @param {Object} data
 */
function submitOrder(data) {
    let totalPrice = 0;
    let quantity = 0;

    for (var i = 0; i < bevArray.length; i++){
        quantity = data.resultData[i].quantity
        quantity = document.getElementById(i.toString()).value
        totalPrice = totalPrice + quantity * data.resultData[i].price;
    }
    let orderData = {
        totalAmount: totalPrice
    };
    
    bevArray = [];
    createTable(bevArray);
    //clearMessage();

    const xhr = new XMLHttpRequest();
    // Handle success from API
    xhr.addEventListener("load", event => {
        let response = JSON.parse(event.target.responseText);
        if (response.message) {
            updateMessage(event.target.status, response.message);
        }

        removeTable();
    });

    // Handle error from API
    xhr.addEventListener("error", event => {
        console.log(event);
    });

    // Send POST request to server
    xhr.open("POST", "/checkout", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(orderData));
};

