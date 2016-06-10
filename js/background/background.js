import Constants from './../constants.js';
import ExtensionIcon from './extensionIcon';
import RilList from './rilList.js';
import Auth from './auth.js';
import Request from './request.js';

function Background(){}

const list = new RilList();
const extensionIcon = new ExtensionIcon(list);

Background._syncAlarm = null;
chrome.alarms.onAlarm.addListener((alarm) => {
  if(alarm.name === Constants.ALARM_SYNC){
    Background.sync();
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  extensionIcon.loading();
  switch (request.type) {
    case Constants.ACTION_ARCHIVE:{
      Request.archieve(Background.updateContent.bind(this, sendResponse), request.payload);
      break;
    }
    case Constants.ACTION_ADD:{
      const url = request.payload.url;
      const title = request.payload.title;
      Request.add(Background.updateContent.bind(this, sendResponse), url, title);
      break;
    }
    case Constants.ACTION_REFRESH:{
      Background.updateContent(sendResponse);
      break;
    }
    case Constants.ACTION_GETLIST:{
      Background.getList(sendResponse);
      break;
    }
    case Constants.ACTION_SORTLIST: {
      localStorage['iwillril_order_by'] = request.payload;
      sendResponse({success: true, payload: list.getItemsArray()});
      break;
    }
    case Constants.ACTION_FILTER:{
      sendResponse({success: true, payload: list.getItemsArray(request.payload)});
      break;
    }
    case 'keyShortCut':{
      Background.keyboardShortcutManager(request);
      break;
    }
  }
  return true;
});
Background.init = function(){
  Background.sync();
  if(!chrome.tabs.onSelectionChanged.hasListeners())
    chrome.tabs.onSelectionChanged.addListener(Background.manageSelectedTab);

  if(!chrome.tabs.onUpdated.hasListeners())
    chrome.tabs.onUpdated.addListener(Background.manageSelectedTab);
};

Background.sync = function(){
  Background.updateContent();
  const interval = localStorage['rilUpdateInterval'];
  let timeout = 1000 * 60 * 60 * 2;
  switch(interval){
    case '0':
      timeout = 1000 * 60 * 30;
      break;
    case '1':
      timeout = 1000 * 60 * 60;
      break;
    case '2':
      timeout = 1000 * 60 * 60 * 2;
      break;
  }

  chrome.alarms.clear(Background._syncAlarm, () => {
    Background._syncAlarm = chrome.alarms.create(Constants.ALARM_SYNC, { when: Date.now() + (timeout) } );
  });
};

Background.getList = function(callback){
  if(Auth.isAuthenticate()){
    if(localStorage['lastResponse']) {
      callback({success: 200, payload: list.getItemsArray()});
      extensionIcon.loaded();
    }
    else {
      Background.updateContent(callback);
    }
  }
  else{
    Auth.authenticate();
  }
}

Background.manageSelectedTab = function(tabid, obj){
  chrome.contextMenus.removeAll();
  const list = this.list.getItemsArray();

  if(localStorage['remove_context_menu_iwillril'] && localStorage['remove_context_menu_iwillril'] == 'true')
    return;
  chrome.tabs.get(tabid, function (tab){
    for(let i = 0; i < list.length; i++){
      const obj = list[i];
      if(tab.url == obj.resolved_url || tab.url == obj.given_url){
        chrome.contextMenus.create({
          id: 'MarkAsReadCM',
          title: "Mark as Read ",
          contexts:["page"]
        });
        chrome.contextMenus.onClicked.addListener(Background.markAsRead);

        return;
      }
    }
    chrome.contextMenus.create({
      id: 'RILCM',
      title: "I'll Read it Later ",
      contexts:["page", "link"]
    });

    chrome.contextMenus.onClicked.addListener(Background.iWillRil);
  });
};

Background.markAsRead = function(info, tab){
  extensionIcon.loading();
  chrome.tabs.getSelected(null, function(tab) {
    const url = tab.url;
    const itemId = list.getItemId(url);
    Request.archieve(Background.updateContent, itemId);
  });
};

Background.iWillRil = function(info, tab){
  extensionIcon.loading();
  let title, url;

  if(info.linkUrl){
    url = info.linkUrl;
    title = info.linkUrl;
  }else{
    url = info.pageUrl || tab.url;
    title = tab.title || info.pageUrl;
  }

  if(url)
    Request.add(Background.updateContent, url, title);
};

Background.updateUncountLabel = function(){
  extensionIcon.updateNumber();
};

Background.updateContent = function(callback){
  Request.get(function(resp){
    if(resp.status == 403 || resp.status == 401){
      localStorage['lastResponse'] = '';
      Auth.authenticate();
    }
    else{
      localStorage['lastResponse'] = resp.response;
    }
    extensionIcon.loaded();
    extensionIcon.updateNumber();
    if(callback)
      callback({success: resp.status === 200, payload: list.getItemsArray()});
  }, 0);
};

Background.keyboardShortcutManager = function(request){
  if(!localStorage['rilBtnShortCut'])
    return;

  const shortCut = localStorage['rilBtnShortCut'];
  const charKey = String.fromCharCode(request.keyCode);

  if(shortCut.toLowerCase() == charKey.toLowerCase())
    chrome.tabs.getSelected(null, function(tab){
      if(list.getItemId(tab.url))
        Background.markAsRead({}, tab);
      else
        Background.iWillRil({}, tab);
    });
};
Background.init();
