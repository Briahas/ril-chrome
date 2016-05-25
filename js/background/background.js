import Constants from './../constants.js';
import ExtensionIcon from './extensionIcon';
import RilList from './rilList.js';
import Auth from './auth.js';
import Request from './request.js';

function Background(){}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  ExtensionIcon.loading();
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
    case Constants.ACTION_SORTLIST:{
      localStorage['iwillril_order_by'] = request.payload;
      sendResponse({success: true, payload: RilList.getItemsArray()});
      break;
    }
    case Constants.ACTION_FILTER:{
      sendResponse({success: true, payload: RilList.getItemsArray(request.payload)});
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

  if(!chrome.extension.onRequest.hasListeners())
    chrome.extension.onRequest.addListener(Background.onExtensionRequest);
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

  window.setTimeout(Background.sync, timeout);
}

Background.getList = function(callback){
  if(Auth.isAuthenticate()){
    if(localStorage['lastResponse']) {
      callback({success: 200, payload: RilList.getItemsArray()});
      ExtensionIcon.loaded();
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
  if(localStorage['remove_context_menu_iwillril'] && localStorage['remove_context_menu_iwillril'] == 'true')
    return;
  chrome.tabs.get(tabid, function (tab){
    const list = RilList.getItemsArray();

    for(let i = 0; i < list.length; i++){
      const obj = list[i];
      if(tab.url == obj.resolved_url || tab.url == obj.given_url){
        chrome.contextMenus.create({"title": "Mark as Read ", "onclick": Background.markAsRead,"contexts":["page"]});
        return;
      }
    }
    chrome.contextMenus.create({"title": "I'll Read it Later ", "onclick": Background.iWillRil,"contexts":["page", "link"]});
  });
};

Background.markAsRead = function(info, tab){
  ExtensionIcon.loading();
  chrome.tabs.getSelected(null, function(tab) {
    const url = tab.url;
    const itemId = RilList.getItemId(url);
    Request.archieve(Background.updateContent, itemId);
  });
};

Background.iWillRil = function(info, tab){
  ExtensionIcon.loading();
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
  ExtensionIcon.updateNumber();
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
    ExtensionIcon.loaded();
    ExtensionIcon.updateNumber();
    if(callback)
      callback({success: resp.status === 200, payload: RilList.getItemsArray()});
  }, 0);
};

Background.onExtensionRequest = function(request, sender, sendResponse){
  switch(request.name){
    case 'keyShortCut':
      Background.keyboardShortcutManager(request);
  }
};

Background.keyboardShortcutManager = function(request){
  if(!localStorage['rilBtnShortCut'])
    return;

  const shortCut = localStorage['rilBtnShortCut'];
  const charKey = String.fromCharCode(request.keyCode);

  if(shortCut.toLowerCase() == charKey.toLowerCase())
    chrome.tabs.getSelected(null, function(tab){
      if(RilList.getItemId(tab.url))
        Background.markAsRead({}, tab);
      else
        Background.iWillRil({}, tab);
    });
};
Background.init();
