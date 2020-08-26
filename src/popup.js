var storage_data = { 'filter-title': '', 'filter-seller': '', 'filter-ads': true, 'preload-page': 0, 'auto-run': false };

var getSelectedTab = (tab) => {

  loadStorage();

  var tabId = tab.id;
  var sendMessage = (messageObj) => chrome.tabs.sendMessage(tabId, messageObj);

  $('#filter-ads').change(() => {
    loadDomInStorMemory();
    saveStorage(null);
  });

  $('#auto-run').change(() => {
    loadDomInStorMemory();
    saveStorage(null);
  });

  $('#adv-search-btn').click(() => {
    loadDomInStorMemory();
    saveStorage(null);
    sendMessage(getCmdArgs());
  });

  $('#import-setting-btn').click(() => {
    $('#import-setting-input').click();
  });

  $('#import-setting-input').change((evt) => {
    //console.log(evt.target.files); // get file object
    handleImport(evt.target.files);
  });

  $('#export-setting-btn').click(() => {
    handleExport();
  });
};
chrome.tabs.getSelected(null, getSelectedTab);

function getCmdArgs(){

  var cmd_args = {
    action: 'AdvSearch',
    data: storage_data
  };

  return cmd_args;
}

function loadDomInStorMemory(){
  storage_data['filter-title'] = $('#filter-title-input').val();
  storage_data['filter-seller'] = $('#filter-seller-input').val();
  storage_data['filter-ads'] = $('#filter-ads').is(":checked");
  storage_data['preload-page'] = parseInt($('#preload-page-input').val());
  storage_data['auto-run'] = $('#auto-run').is(":checked");
}

function setStorInDom(){
  $('#filter-title-input').val(storage_data['filter-title']);
  $('#filter-seller-input').val(storage_data['filter-seller']);

  if (storage_data['filter-ads']) {
    $('#filter-ads').prop('checked', true);
  } else {
    $('#filter-ads').prop('checked', false);
  }

  $('#preload-page-input').val(storage_data['preload-page']);

  if (storage_data['auto-run']) {
    $('#auto-run').prop('checked', true);
  } else {
    $('#auto-run').prop('checked', false);
  }
}

function saveStorage(callback) {

  chrome.storage.local.set({ "data": storage_data }, function () {
    if (callback){
      callback();
    }
    console.log("save completed");
  });
}

function loadStorage() {
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

    setStorInDom();

    console.log(storage_data);
    console.log("init completed.");
  });
}

function handleImport(files) {

  console.log('handleImport');

  Object.entries(files).forEach(([key, value]) => {
    var reader = new FileReader();
    reader.onload = (function (theFile) {
      return function (e) {
        storage_data = JSON.parse(e.target.result);
        setStorInDom();
        saveStorage(null);
      };
    })(value);

    reader.readAsBinaryString(value);
  });
}

function handleExport() {

  loadDomInStorMemory();

  var aTag = document.createElement('a');
  var blob = new Blob([JSON.stringify(storage_data)]);
  aTag.download = 'AuctionKira_setting.json';
  aTag.href = URL.createObjectURL(blob);
  aTag.click();
  URL.revokeObjectURL(blob);
}