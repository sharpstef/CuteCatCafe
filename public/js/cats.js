/************************************************************************
 * Cats Form Data Handlers
 ************************************************************************/
// Set default for the date field in the form to the current day
let today = new Date().toISOString().substr(0, 10);
document.querySelector("#date").value = today;

// Load initial cat data
getCats();

// Configure listeners for the main form 
let addForm = document.getElementById("add");
let roomList = document.getElementById("dataDetails");

addForm.addEventListener("submit", getData);
addForm.addEventListener("formdata", formUpdate);

/**
 * Event listener handler to populate a new FormData instance.
 * @param {Object} e 
 */
function getData(e) {
    e.preventDefault();
    new FormData(addForm);
}

/**
 * Helper to get cat data from database.
 */
function getCats() {
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
    xhr.open("GET", "/getCats", true);
    xhr.send();
}

/**
 * Helper to load the dropdown with available rooms
 * only when the dropdown is selected. 
 */
let dropdown = document.getElementById("room");
const dropdownHandler = throttled(200, getRooms);
dropdown.addEventListener("focus", dropdownHandler);

function getRooms() {
    const xhr = new XMLHttpRequest();
    // Handle success from API
    xhr.addEventListener("load", event => {
        let response = JSON.parse(event.target.responseText);
        if (response.rooms) {
            populateDropdown(response.rooms);
        } else {
            emptyDropdown();
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
    xhr.open("GET", "/getEmptyRooms", true);
    xhr.send();
};

/**
 * Helper function to populate the rooms dropdown with dynamically loaded data. 
 * @param {*} data 
 */
function populateDropdown(data) {
    dropdown.innerHTML = '<option value="" disable selected>Select Room</option>';
    data.forEach(item => {
        dropdown.innerHTML = `${dropdown.innerHTML} <option value="${item.roomID}">${item.room}</option>`;
    });
};

/**
 * Helper function to clear the dropdown if there is no room data.
 */
function emptyDropdown() {
    dropdown.innerHTML = '<option value="" disable selected>No available rooms</option>';
}

/**
 * Helper function to reset dropdown to empty when resetting the form.
 */
function resetDropdown() {
    dropdown.innerHTML = '<option value="" disable selected>Select Room</option>';
}

/**
 * Helper function to submit new cat data.
 * 
 * @param {Object} e 
 */
function formUpdate(e) {
    resetForm();
    clearMessage();

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
            document.getElementById("message").scrollIntoView({ behavior: 'smooth', block: 'center' });
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
    xhr.open("POST", "/addCat", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(data));
};

/**
 * Helper function to reset values in the form. 
 */
function resetForm() {
    document.getElementById("date").setAttribute("value", today);
    document.getElementById("name").setAttribute("value", "");
    document.getElementById("breed").setAttribute("value", "");
    document.getElementById("age").setAttribute("value", 0);
    resetDropdown();
};