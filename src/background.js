import RilList from './rilList'
import Auth from './auth'
import Api from './api'
import events from './events'
import {
  getSettings,
  fetchItemsFromCache,
  fetchItems
} from './app/repo'
function Background() { }

Background.init = function () {
  Background.sync();
  if (!chrome.tabs.onSelectionChanged.hasListeners())
    chrome.tabs.onSelectionChanged.addListener(Background.manageSelectedTab);

  if (!chrome.tabs.onUpdated.hasListeners())
    chrome.tabs.onUpdated.addListener(Background.manageSelectedTab);

  if (!chrome.extension.onRequest.hasListeners())
    chrome.extension.onRequest.addListener(Background.onExtensionRequest);


  chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
      if (request.msg === events.ADD) {
        const payload = request.payload
        Background.addItemInPocket(payload.url, payload.title).then(sendResponse)
        return true
      }
      if (request.msg === events.REFRESH_ITEMS) {
        const payload = request.payload
        Background.refreshItems().then(sendResponse)
        return true
      }
      if (request.msg === events.ARCHIVE) {
        const payload = request.payload
        Background.archiveItem(payload.itemId).then(sendResponse)
        return true
      }
    }
  );
}

Background.sync = function () {
  //Background.updateContent();
  var interval = localStorage['rilUpdateInterval'];

  let timeout = 1000 * 60 * 30;
  switch (interval) {
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

Background.manageSelectedTab = async function (tabid, obj) {
  chrome.contextMenus.removeAll();
  const settings = await getSettings();
  console.log(settings)
  if (settings.removeContextMenu) {
    return;
  }

  chrome.tabs.get(tabid, async function (tab) {
    const list = await fetchItemsFromCache() || [];

    for (var i = 0; i < list.length; i++) {
      var obj = list[i];
      if (tab.url == obj.resolved_url || tab.url == obj.given_url) {
        chrome.contextMenus.create({
          title: "Mark as Read ",
          onclick: Background.markAsRead,
          contexts: ["page"]
        });
        return;
      }
    }
    chrome.contextMenus.create({
      title: "I'll Read it Later",
      onclick:  async (info, tab) => {
        var title, url;
        if (info.linkUrl) {
          url = info.linkUrl;
          title = info.linkUrl;
        } else {
          url = info.pageUrl || tab.url;
          title = tab.title || info.pageUrl;
        }

        await Background.addItemInPocket(url, title);
        await fetchItems();
      },
      contexts: ["page", "link"]
    });
  });
}

Background.markAsRead = function (info, tab) {
  //ExtensionIcon.loading();
  chrome.tabs.getSelected(null, function (tab) {
    var url = tab.url;
    var itemId = RilList.getItemId(url);
    Request.archieve(Background.updateContent, itemId);
  });
}



// NEW
Background.addItemInPocket = async function (url, title) {
  try {
    const response = await Api.addItem(url, title);
    return {
      success: true,
      payload: response.item
    }
  } catch {
    return {
      success: false
    }
  }
}

Background.refreshItems = async function (url, title) {
  try {
    const response = await Api.getList()
    return {
      success: true,
      payload: response.list
    }
  } catch {
    return {
      success: false
    }

  }
}
Background.archiveItem = async function (itemId) {
  try {
    const response = await Api.archieve(itemId);
    return {
      success: true,
      payload: {}
    }
  } catch {
    return {
      success: false
    }
  }
}

Background.iWillRil = function (info, tab) {
  // ExtensionIcon.loading();
  var title, url;

  if (info.linkUrl) {
    url = info.linkUrl;
    title = info.linkUrl;
  } else {
    url = info.pageUrl || tab.url;
    title = tab.title || info.pageUrl;
  }

  if (url)
    Request.add(Background.updateContent, url, title);
}

Background.updateUncountLabel = function () {
  // ExtensionIcon.setUncountLabel(RilList.getItemsArray().length);
}

Background.updateContent = function () {
  // ExtensionIcon.loaded();
  Request.get(function (resp) {
    if (resp.status == 403 || resp.status == 401)
      localStorage['ITEMS'] = '';
    else {
      localStorage['ITEMS'] = resp.response.list;
      // ExtensionIcon.setUncountLabel(RilList.getItemsArray().length);
    }
  }, 0);
}

Background.onExtensionRequest = function (request, sender, sendResponse) {
  switch (request.name) {
    case 'keyShortCut':
      Background.keyboardShortcutManager(request);
  }
}

Background.keyboardShortcutManager = function (request) {
  if (!localStorage['rilBtnShortCut'])
    return;

  var shortCut = localStorage['rilBtnShortCut'];
  var charKey = String.fromCharCode(request.keyCode);

  if (shortCut.toLowerCase() == charKey.toLowerCase())
    chrome.tabs.getSelected(null, function (tab) {
      if (RilList.getItemId(tab.url))
        Background.markAsRead({}, tab)
      else
        Background.iWillRil({}, tab);
    })
}
Background.init();

export default Background
