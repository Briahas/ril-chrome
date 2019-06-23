function ExtensionIcon(list){
  this.list = list;
}

ExtensionIcon.prototype.set = function(icon){
  const object = new Object();
  object.path = chrome.extension.getURL(icon);
  chrome.browserAction.setIcon(object);
};

ExtensionIcon.prototype.updateNumber = function(){
  const size = this.list.getItemsArray().length;
  const txt = new Object();
  if(localStorage['removeUncountLabel'] == 'true')
    txt.text = '';
  else
    txt.text=size.toString();
  chrome.browserAction.setBadgeText(txt);
};

ExtensionIcon.prototype.loaded = function(){
  this.set('images/bookmark.png');
};

ExtensionIcon.prototype.loading = function(){
  this.set('images/loader_table.gif');
};

export default ExtensionIcon;
