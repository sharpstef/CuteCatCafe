/************************************************************************
 * Ingredient Form Data Handlers
 ************************************************************************/
// Load initial room data
getIngredients();

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
 * Helper to get all available ingredients.
 */
function getIngredients() {
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
    xhr.open("GET", "/getIngredients", true);
    xhr.send();
}

/**
 * Helper function to submit new beverage data.
 * 
 * @param {Object} e 
 */
function formUpdate(e) {
    //resetForm();
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
    xhr.open("POST", "/addIngredient", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(data));
};

/**
 * Helper function to reset values in the form. 
*/
function resetForm() {
    document.getElementById("name").setAttribute("value", "");
};
