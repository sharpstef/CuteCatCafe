/************************************************************************
 * Account Data Handlers
 ************************************************************************/
getOrders();
getReservations();

/**
 * Helper to get order data from database.
 */
function getOrders() {
    const xhr = new XMLHttpRequest();
    // Handle success from API
    xhr.addEventListener("load", event => {
        let response = JSON.parse(event.target.responseText);
        createOrderTable(response.data);
    });

    // Handle error from API
    xhr.addEventListener("error", event => {
        console.log(event);
    });

    // Send GET request to server
    xhr.open("GET", "/getOrders", true);
    xhr.send();
}

/**
 * Helper to get reservation data from database.
 */
function getReservations() {
    const xhr = new XMLHttpRequest();
    // Handle success from API
    xhr.addEventListener("load", event => {
        let response = JSON.parse(event.target.responseText);
        createResTable(response.data);
    });

    // Handle error from API
    xhr.addEventListener("error", event => {
        console.log(event);
    });

    // Send GET request to server
    xhr.open("GET", "/getReservations", true);
    xhr.send();
}

/**
 * Helper function to make a delete request to the database and then 
 * remove the row from the view upon successful deletion. 
 * 
 * @param {Object} item 
 */
function deleteReservation(item) {
    const xhr = new XMLHttpRequest();
    // Handle success from API
    xhr.addEventListener("load", event => {
        let response = JSON.parse(event.target.responseText);
        if (response.message) {
            updateMessage(event.target.status, response.message);
        }
        document.getElementById("message").scrollIntoView({ behavior: 'smooth', block: 'center' });

        if (event.target.status == 200) {
            getReservations();
        }
    });

    // Handle error from API
    xhr.addEventListener("error", event => {
        console.log(event);
    });

    // Send POST request to server
    xhr.open("POST", "/deleteReservation", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(item));
};

/**
 * Helper function to populate the Handlebars template on the client
 * with order data
 * 
 * @param {Object} data 
 */
function createOrderTable(data) {
    let template = document.getElementById("order-template").innerHTML;
    let hdbTemplate = Handlebars.compile(template);
    let newTable = hdbTemplate({
        orderData: data
    });

    let container = document.getElementById("orderHistory");
    container.innerHTML = newTable;
}

/**
 * Helper function to populate the Handlebars template on the client
 * with order data
 * 
 * @param {Object} data 
 */
function createResTable(data) {
    let template = document.getElementById("res-template").innerHTML;
    let hdbTemplate = Handlebars.compile(template);
    let newTable = hdbTemplate({
        resData: data
    });

    let container = document.getElementById("resHistory");
    container.innerHTML = newTable;
}