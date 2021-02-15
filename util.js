const constants = require('./constants');

module.exports = {
  /**
    * Picks a random string from an array of strings
    *
    * @param {Array} messages
  */
  randomMessage(messages) {
    return messages[Math.floor(Math.random() * messages.length)];
  },

  /**
   * Convert millisecond to minutes and seconds for display. 
   * @param {Integer} input 
   */
  convertTime(input) {
    var minutes = Math.floor(input / 60000);
    var seconds = ((input % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  },

  /**
   * Updates the menu to change the styling to reflect the current
   * active page and the login/logout based on user authentication
   * status. 
   * 
   * @param {String} active 
   * @param {Object} context 
   * @param {Object} login_status 
   */
  updateMenu(active, context, login_status = {}) {
    let menuItems = constants.MENU;
    context = context || {};

    menuItems.forEach(function(item, index){
      if (item.REF === active) {
        item.CLASS = 'current_page';
      } else {
        item.CLASS = 'none';
      }

      if(item.NAME === "Login" || item.NAME === "Logout") {
        if(login_status && login_status.customerID) {
          item.NAME = "Logout";
          item.REF = "/logout";
        } else {
          item.NAME = "Login";
          item.REF = "/login";
        }
      } 
    });

    context.menu_data = menuItems;

    return context;
  }
};