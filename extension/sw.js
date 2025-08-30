chrome.runtime.onInstalled.addListener(()=>{
  chrome.storage.sync.set({ecoPoints:0, ecoLog:[]});
});
