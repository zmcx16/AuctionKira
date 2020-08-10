var storage_data = { 'filter_title': '' };
var text_dict = {
};

var ui_loading = false;

// popup message
const onMessage = (message) => {
  switch (message.action) {
    default:
      break;
  }
};

chrome.runtime.onMessage.addListener(onMessage);
chrome.runtime.sendMessage({ "message": "activate_icon" });

// Dom event
window.onload = function () {
  window.setTimeout((() => {
    init();
  }), 1000);
};

// local function 
function init() {

}

function initWithDom() {

}
