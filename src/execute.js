var storage_data = { 'filter_title': '' };
var text_dict = {
};

var helper;

// popup message
const onMessage = (message) => {
  switch (message.action) {
    case 'ShowAll':
      showAll();
      break;
    default:
      break;
  }
};

chrome.runtime.onMessage.addListener(onMessage);
chrome.runtime.sendMessage({ "message": "activate_icon" });

// action function
const showAll = () => {
  helper.doShowAll();
};


// Dom event
window.onload = function () {
  window.setTimeout((() => {
    init();
  }), 1000);
};

// local function 
function init() {

  g_helper.init();

  if (location.host.indexOf('myacg')!==-1){
    helper = myacg_helper;
    helper.init();
  }
}