app.Item = function(item){
  this.item = item;  
}

app.Item.prototype.getTitle = function() {
  var item = this.item;

  var title = '';
  if(item.resolved_title)
    title = item.resolved_title;
  else if(item.given_title)
    title =  item.given_title;
  else
    title = Table.getItemUrl(item);
  
  return title.replace(/</g, '&lt;').replace(/>/g, '&gt;'); 
};

app.Item.prototype.getUrl = function() {
  var item = this.item;
  if(item.resolved_url)
    return item.resolved_url;
  return item.given_url;
};

app.Item.prototype.getFaviconUrl = function() {
  var item = this.item;
  var url = this.getUrl();
  return "http://g.etfv.co/"+ encodeURIComponent(url);
};

