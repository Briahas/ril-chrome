  window.addEventListener("load", init);

  function init(){
    var popup = new Popup();
    popup.init();
  }

  function Popup(){
    this.table = new Table();
    this.header = new Header(this.table);
    this._addHeaderEvents();
    this._addTableEvents();
  }

  Popup.prototype._addHeaderEvents = function(){
    var that = this;
    this.header.on('addItem', function(data){
      that.showLoadScreen();
      chrome.runtime.sendMessage({type: 'add', payload: data}, function(response) {
        that.refreshList(response);
      });
    });
    this.header.on('refreshList', function(){
      that.showLoadScreen();
      chrome.runtime.sendMessage({type: 'refresh'}, function(response) {
        that.refreshList(response);
      });
    });
    this.header.on('sort', function(data){
      localStorage['iwillril_order_by'] = data;
      that.buildPage();
    });
  }

  Popup.prototype._addTableEvents = function(){
    var that = this;
    this.table.on('markAsRead', function(itemId){
      var action = 'archive';
      if(localStorage['deleteItensOption'] === 'true')
        action = 'delete';
      chrome.runtime.sendMessage({type: action, payload: itemId}, function(response) {
        that.refreshList(response);
      });
    });

    this.table.on('autoMarkAsRead', function(itemId){
      if(localStorage["mark_auto_iwillril"] == "true"){
        var action = 'archive';
        chrome.runtime.sendMessage({type: action, payload: itemId}, function(response) {
          that.refreshList(response);
        });
      }
    });
  }

  Popup.prototype.init = function(){
    var that = this;
    that.header.initFunctions();
    if(Auth.isAuthenticate()){
      window.setTimeout(function(){that.buildPage();}, 1);
    }
    else{
      Auth.authenticate();
    }
  }

  Popup.prototype.buildPage = function(){
    var that = this;
    if(!localStorage["lastResponse"]){
      chrome.runtime.sendMessage({type: 'refresh'}, function(response) {
        that.showLoadScreen();
        that.refreshList(response);
      });
    }
    else
      this.updatePage();
  }

  Popup.prototype.showLoadScreen = function(){
    if(document.getElementById("list_div"))
      document.getElementById("list_div").style.opacity = 0.4;
  }

  Popup.prototype.hideLoadScreen = function(){
    if(document.getElementById("list_div"))
      document.getElementById("list_div").style.opacity = 1;
  }

  Popup.prototype.refreshList = function(response){
    var that = this;
    if(response.success){
      that.updatePage();
    }else{
      Auth.authenticate();
    }
  }

  Popup.prototype.updatePage = function(){
    this.hideLoadScreen();
    this.header.refresh();
    this.table.render(RilList.getItemsArray());
  }
