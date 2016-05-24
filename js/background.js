
function Background(){}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  ExtensionIcon.loading();
  switch (request.type) {
    case Constants.ACTION_ARCHIVE:
      Request.archieve(Background.updateContent.bind(this, sendResponse), request.payload);
      break;
    case 'add':
      var url = request.payload.url;
      var title = request.payload.title;
      Request.add(Background.updateContent.bind(this, sendResponse), url, title);
      break;
    case 'refresh':
      Background.updateContent(sendResponse);
      break;
    case 'getList':
      Background.getList(sendResponse);
      break;
    case 'sortList':
      localStorage['iwillril_order_by'] = request.payload;
      sendResponse({success: true, payload: RilList.getItemsArray()});
      break;
    default:

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
  var interval = localStorage['rilUpdateInterval'];

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
    default:
      timeout = 1000 * 60 * 60 * 2;
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
    var list = RilList.getItemsArray();

    for(var i = 0; i < list.length; i++){
      var obj = list[i];
      if(tab.url == obj.resolved_url || tab.url == obj.given_url){
        chrome.contextMenus.create({"title": "Mark as Read ", "onclick": Background.markAsRead,"contexts":["page"]});
        return;
      }
    }
    chrome.contextMenus.create({"title": "I'll Read it Later ", "onclick": Background.iWillRil,"contexts":["page", "link"]});
  });
}

Background.markAsRead = function(info, tab){
  ExtensionIcon.loading();
  chrome.tabs.getSelected(null, function(tab) {
    var url = tab.url;
    var itemId = RilList.getItemId(url);
    Request.archieve(Background.updateContent, itemId);
  });
}

Background.iWillRil = function(info, tab){
  ExtensionIcon.loading();
  var title, url;

  if(info.linkUrl){
    url = info.linkUrl;
    title = info.linkUrl;
  }else{
    url = info.pageUrl || tab.url;
    title = tab.title || info.pageUrl;
  }

  if(url)
    Request.add(Background.updateContent, url, title);
}

Background.updateUncountLabel = function(){
  ExtensionIcon.updateNumber();
}

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
}

Background.onExtensionRequest = function(request, sender, sendResponse){
  switch(request.name){
    case 'keyShortCut':
      Background.keyboardShortcutManager(request);
  }
}

Background.keyboardShortcutManager = function(request){
  if(!localStorage['rilBtnShortCut'])
    return;

  var shortCut = localStorage['rilBtnShortCut'];
  var charKey = String.fromCharCode(request.keyCode);

  if(shortCut.toLowerCase() == charKey.toLowerCase())
    chrome.tabs.getSelected(null, function(tab){
      if(RilList.getItemId(tab.url))
        Background.markAsRead({}, tab)
      else
        Background.iWillRil({}, tab);
    })
}
Background.init();
