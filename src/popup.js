var storage_data = { 'filter-title': '', 'filter-seller': '', 'filter-ads': true, 'show-all': false, 'auto-run': false };

var getSelectedTab = (tab) => {

  loadStorage();

  var tabId = tab.id;
  var sendMessage = (messageObj) => chrome.tabs.sendMessage(tabId, messageObj);

  $('#filter-ads').change(() => {
    saveStorage(loadStorage);
  });

  $('#show-all').change(() => {
    saveStorage(loadStorage);
  });

  $('#auto-run').change(() => {
    saveStorage(loadStorage);
  });

  $('#adv-search-btn').click(() => {
    saveStorage(loadStorage);
    sendMessage(getCmdArgs());
  });

};
chrome.tabs.getSelected(null, getSelectedTab);

function getCmdArgs(){

  var cmd_args = {
    action: 'AdvSearch',
    data: storage_data
  }

  return cmd_args;
}

function saveStorage(callback) {

  storage_data['filter-title'] = $('#filter-title-input').val();
  storage_data['filter-seller'] = $('#filter-seller-input').val();
  storage_data['filter-ads'] = $('#filter-ads').is(":checked");
  storage_data['show-all'] = $('#show-all').is(":checked");
  storage_data['auto-run'] = $('#auto-run').is(":checked");

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
      if (!('show-all' in storage_data)) {
        storage_data['show-all'] = true;
      }
      if (!('auto-run' in storage_data)) {
        storage_data['auto-run'] = true;
      }
    }


    $('#filter-title-input').val(storage_data['filter-title'])
    $('#filter-seller-input').val(storage_data['filter-seller'])
    if (storage_data['filter-ads']){
      $('#filter-ads').prop('checked', true);
    }else{
      $('#filter-ads').prop('checked', false);
    }
    if (storage_data['show-all']) {
      $('#show-all').prop('checked', true);
    } else {
      $('#show-all').prop('checked', false);
    }
    if (storage_data['auto-run']) {
      $('#auto-run').prop('checked', true);
    } else {
      $('#auto-run').prop('checked', false);
    }

    console.log(storage_data);
    console.log("init completed.");
  });
}
