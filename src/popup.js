var getSelectedTab = (tab) => {
  var tabId = tab.id;
  var sendMessage = (messageObj) => chrome.tabs.sendMessage(tabId, messageObj);
  document.getElementById('show-all-btn').addEventListener('click', () => sendMessage({ action: 'ShowAll', data: {} }));
};
chrome.tabs.getSelected(null, getSelectedTab);