function Header(){
  this.listeners = {};
}

Header.prototype.on = function(eventName, callback){
  this.listeners[eventName] = this.listeners[eventName] || [];
  this.listeners[eventName].push(callback);
};

Header.prototype.initFunctions = function(){
  document.querySelector("#add_button").addEventListener('click', this.add.bind(this));
  document.querySelector("#option_footer").addEventListener('click', this.openOptions.bind(this));
  document.querySelector("#sync_button").addEventListener('click', this.refreshList.bind(this));
  document.querySelector("#order_select").addEventListener('change', this.orderBy.bind(this));
  document.querySelector("#iwillril_search").addEventListener('change', this.filter.bind(this));
};

Header.prototype.openOptions = function(){
  const optionsUrl = chrome.extension.getURL('html/options.html');
  chrome.tabs.create({url: optionsUrl});
};

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

Header.prototype.filter = function(){
  const order = document.getElementById("iwillril_search").value;
  this.listeners['filter'].forEach(function(callback){
    callback(order);
  });
};

Header.prototype.orderBy = function(){
  const order = document.getElementById("order_select").value;
  this.listeners['sort'].forEach(function(callback){
    callback(order);
  });
};

Header.prototype.refresh = function({order}){
  document.querySelector("#order_select").value = order;
  document.querySelector('#iwillril_search').addEventListener('keyup', (ev) => {
    this.listeners['filter'].forEach( (callback) => callback(ev.target.value) );
  });
};

export default Header;
