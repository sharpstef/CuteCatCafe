/************************************************************************
 * Reservation Form Data Handlers
 ************************************************************************/
// Set default for the date field in the form to the current day
let today = new Date().toISOString().substr(0, 10);
document.querySelector("#date").value = today;

// Helper for Handlebars needed for client side JSON rendering
Handlebars.registerHelper('json', (context) => {
    return JSON.stringify(context).replace(/"/g, '&quot;');
});

// Configure listeners for the main form 
let searchForm = document.getElementById("search");
let roomList = document.getElementById("dataDetails");

searchForm.addEventListener("submit", getData);
searchForm.addEventListener("formdata", formUpdate);

/**
 * Event listener handler to populate a new FormData instance.
 * @param {Object} e 
 */
function getData(e) {
    e.preventDefault();
    new FormData(searchForm);
}

/**
 * Helper function to send search data to 
 * find items.
 * 
 * @param {Object} e 
 */
function formUpdate(e) {
    let data = {};
    e.formData.forEach((value, key) => {
        data[key] = value
    });

    const xhr = new XMLHttpRequest();
    // Handle success from API
    xhr.addEventListener("load", event => {
        let response = JSON.parse(event.target.responseText);

        if (response.data) {
            createTable(response.data);
            document.getElementById("dataList").scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        if (response.message) {
            updateMessage(event.target.status, response.message);
        }
    });

    // Handle error from API
    xhr.addEventListener("error", event => {
        console.log(event);
    });

    // Send POST request to server
    xhr.open("POST", "/reservations", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(data));
};

/**
 * Helper function to make an insert request for reservations.
 * 
 * @param {Object} data
 */
function bookRoom(data) {
    resetForm();
    clearMessage();
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
    xhr.open("POST", "/newReservation", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(data));
};

/**
 * Helper function to reset values in the form. 
 */
function resetForm() {
    let today = new Date().toISOString().substr(0, 10);
    document.getElementById("date").setAttribute("value", today);
    document.getElementById("time").setAttribute("value", `${today.getHours}:${today.getSeconds}:00`);
    document.getElementById("duration").setAttribute("value", "30");
}