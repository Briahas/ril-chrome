function Header(){
  this.listeners = {};
}

Header.prototype.on = function(eventName, callback){
  this.listeners[eventName] = this.listeners[eventName] || [];
  this.listeners[eventName].push(callback);
};

Header.prototype.initFunctions = function(){
  $("#add_button").click(this.add.bind(this));
  $("#option_footer").click(this.openOptions.bind(this));
  $("#sync_button").click(this.refreshList.bind(this));
  $("#order_select").change(this.orderBy.bind(this));
}

Header.prototype.openOptions = function(){
  const optionsUrl = chrome.extension.getURL('html/options.html');
  chrome.tabs.create({url: optionsUrl});
}

Header.prototype.refreshList = function(){
  this.listeners['refreshList'].forEach(function(callback){
    callback();
  });
};

Header.prototype.add = function(){
  const that = this;
  chrome.tabs.getSelected(null, function(tab) {
    that.listeners['addItem'].forEach(function(callback){
      callback(tab);
    });
  });
};

Header.prototype.orderBy = function(){
  const order = document.getElementById("order_select").value;
  this.listeners['sort'].forEach(function(callback){
    callback(order);
  });
}

Header.prototype.refresh = function(){
  $("#order_select").val(localStorage['iwillril_order_by'])
  $('input#iwillril_search').quicksearch('table#iwillril_table tbody tr');
}

export default Header;
