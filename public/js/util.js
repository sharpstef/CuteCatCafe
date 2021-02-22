/**
 * Helper function to populate the Handlebars template on the client
 * with resulot data
 * 
 * @param {Object} data 
 */
function createTable(data) {
    let template = document.getElementById("data-template").innerHTML;
    let hdbTemplate = Handlebars.compile(template);
    let newTable = hdbTemplate({
        resultData: data
    });

    let container = document.getElementById("dataList");
    container.innerHTML = newTable;
    document.getElementById("dataList").scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function removeTable() {
    let template = document.getElementById("dataList");
    template.innerHTML = "";
}

/**
 * Helper functions to populate the event message section
 * @param {String} message 
 */
function updateMessage(status, message) {
    let messageClass = status < 400 ? 'class="success"' : 'class="error"';
    document.getElementById("message").innerHTML = `<h2 ${messageClass}>${message}</h2>`;
}

function clearMessage() {
    document.getElementById("message").innerHTML = "";
}