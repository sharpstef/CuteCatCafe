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

/**
 * Helper to throttle the dropdown query load for dynamic content.
 * 
 * Referenced from: https://codeburst.io/throttling-and-debouncing-in-javascript-646d076d0a44
 * Last access: 2/22/2020
 * 
 * @param {*} delay 
 * @param {*} fn 
 */
function throttled(delay, fn) {
    let lastCall = 0;
    return function (...args) {
      const now = (new Date).getTime();
      if (now - lastCall < delay) {
        return;
      }
      lastCall = now;
      return fn(...args);
    }
}