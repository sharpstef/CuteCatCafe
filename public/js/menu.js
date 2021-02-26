// Load initial beverage data
getBeverages();

let bevArray = [];

/**
* Delete a beverage given the provided beverageID.
* 
* @param {*} beverage
*/
function addToCart(beverage) {
    beverage["quantity"] = 1;
    bevArray.push(beverage);
    sessionStorage.setItem("bevArray", JSON.stringify(bevArray));
}

/**
 * Helper to get all available beverages.
 */
function getBeverages() {
    const xhr = new XMLHttpRequest();
    // Handle success from API
    xhr.addEventListener("load", event => {
        let response = JSON.parse(event.target.responseText);
        if (response.data) {
            createTable(response.data);
        }

        if (response.message) {
            updateMessage(event.target.status, response.message);
        }
    });

    // Handle error from API
    xhr.addEventListener("error", event => {
        console.log(event);
    });

    // Send GET request to server
    xhr.open("GET", "/getBeverages", true);
    xhr.send();
};
