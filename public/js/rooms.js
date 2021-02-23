/************************************************************************
 * Rooms Form Data Handlers
 ************************************************************************/
// Load initial room data
getRooms();

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
 * Helper to get room data from database.
 */
function getRooms() {
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
    xhr.open("GET", "/getRooms", true);
    xhr.send();
}

/**
 * Helper to load the dropdown with available cats
 * only when the dropdown is selected. 
 */
let dropdown = document.getElementById("cat");
const dropdownHandler = throttled(200, getCats);
dropdown.addEventListener("focus", dropdownHandler);

function getCats() {
    const xhr = new XMLHttpRequest();
    // Handle success from API
    xhr.addEventListener("load", event => {
        let response = JSON.parse(event.target.responseText);
        if (response.cats) {
            populateDropdown(response.cats);
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
    xhr.open("GET", "/getAvailableCats", true);
    xhr.send();
};

/**
 * Helper function to populate the cats dropdown with dynamically loaded data. 
 * @param {*} data 
 */
function populateDropdown(data) {
    dropdown.innerHTML = '<option value="" disable selected>Select Room</option>';
    data.forEach(item => {
        dropdown.innerHTML = `${dropdown.innerHTML} <option value="${item.catID}">${item.cat}</option>`;
    });
};

/**
 * Helper function to clear the dropdown if there is no cat data.
 */
function emptyDropdown() {
    dropdown.innerHTML = '<option value="" disable selected>No available cats</option>';
}

/**
 * Helper function to reset dropdown to empty when resetting the form.
 */
function resetDropdown() {
    dropdown.innerHTML = '<option value="" disable selected>Select Cat</option>';
}

/**
 * Helper function to submit new room data.
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
    xhr.open("POST", "/addRoom", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(data));
};

/**
 * Helper function to reset values in the form. 
 */
function resetForm() {
    document.getElementById("name").setAttribute("value", "");
    document.getElementById("description").setAttribute("value", "");
    document.getElementById("fee").setAttribute("value", 0);
    resetDropdown();
};