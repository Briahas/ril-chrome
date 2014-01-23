function Item(itemApi){
  if (! (this instanceof arguments.callee)) {
    return new arguments.callee(arguments);
  }

  var self = this;
  self.itemApi = itemApi;

  self.getTitle = function() {
   var item = self.itemApi;

    var title = '';
    if(item.resolved_title)
      title = item.resolved_title;
    else if(item.given_title)
      title =  item.given_title;
    else
      title = Table.getItemUrl(item);
    
    return title.replace(/</g, '&lt;').replace(/>/g, '&gt;'); 
  };

  self.getUrl = function() {
    var item = self.itemApi;
    if(item.resolved_url)
      return item.resolved_url;
    return item.given_url;
  };

  self.getFavicon = function() {
    var url = self.getUrl();
    return "http://g.etfv.co/"+ encodeURIComponent(url);
  };

  self.getTimeAdded = function(){
    return itemApi.time_added;
  }
}


