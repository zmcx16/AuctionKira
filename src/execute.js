var storage_data = { 'filter-title': '', 'filter-seller': '', 'filter-ads': true, 'preload-page': 0, 'auto-run': false };
var helper;

// popup message
const onMessage = (message) => {
  switch (message.action) {
    case 'AdvSearch':
      helper.doAdvSearch(message.data);
      break;
    default:
      break;
  }
};

chrome.runtime.onMessage.addListener(onMessage);
chrome.runtime.sendMessage({ "message": "activate_icon" });

function loadStorage(callback) {
  chrome.storage.local.get("data", function (stor_data) {
    if (Object.keys(stor_data).length > 0) {
      storage_data = { ...stor_data["data"] };
      if (!('filter-title' in storage_data)) {
        storage_data['filter-title'] = '';
      }
      if (!('filter-seller' in storage_data)) {
        storage_data['filter-seller'] = '';
      }
      if (!('filter-ads' in storage_data)) {
        storage_data['filter-ads'] = true;
      }
      if (!('preload-page' in storage_data)) {
        storage_data['preload-page'] = 0;
      }
      if (!('auto-run' in storage_data)) {
        storage_data['auto-run'] = true;
      }
    }

    callback();
  });
}

// Dom event
window.onload = function () {
  window.setTimeout((() => {
    loadStorage(init);
  }), 300);
};

// local function 
function init() {
  
  console.log('do init()');
  g_helper.init();

  if (location.host.indexOf('myacg')!==-1){
    helper = myacg_helper;
  } else if (location.host.indexOf('ruten') !== -1) {
    helper = ruten_helper;
  }
  helper.init();

  if (storage_data['auto-run']){
    helper.doAdvSearch(storage_data);
  }
}