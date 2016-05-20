function ExtensionIcon(){}

ExtensionIcon.set = function(icon){
  console.log('SET ICON');
  var object = new Object();
  object.path = chrome.extension.getURL(icon);
  chrome.browserAction.setIcon(object);
}

ExtensionIcon.updateNumber = function(){
  var list = RilList.getItemsArray();
  var size = list.length;
  var txt = new Object();
  if(localStorage['removeUncountLabel'] == 'true')
    txt.text = '';
  else
    txt.text=size.toString();
  chrome.browserAction.setBadgeText(txt);
}

ExtensionIcon.loaded = function(){
    ExtensionIcon.set('images/bookmark.png');
}

ExtensionIcon.loading = function(){
  ExtensionIcon.set('images/loader_table.gif');
}
