  window.addEventListener("load", init);

  function init(){
    var popup = new Popup();
    popup.init();
  }

  function Popup(args){
    args = args || {};
    this.eventNotifier = args.eventNotifier || chrome.runtime.sendMessage;
    this.table = new Table();
    this.header = new Header();
    this._addHeaderEvents();
    this._addTableEvents();
  }

  Popup.prototype._addHeaderEvents = function(){
    var that = this;
    this.header.on('addItem', function(data){
      that.showLoadScreen();
      that.eventNotifier({type: 'add', payload: data}, function(response) {
        that.updatePage(response);
      });
    });
    this.header.on('refreshList', function(){
      that.showLoadScreen();
      that.eventNotifier({type: 'refresh'}, function(response) {
        that.updatePage(response);
      });
    });
    this.header.on('sort', function(data){
      that.eventNotifier({type: 'sortList', payload: data}, function(response) {
        that.updatePage(response);
      });
    });
  };

  Popup.prototype._addTableEvents = function(){
    var that = this;
    this.table.on('markAsRead', function(itemId){
      var action = 'archive';
      if(localStorage['deleteItensOption'] === 'true')
        action = 'delete';
      that.eventNotifier({type: action, payload: itemId}, function(response) {
        that.updatePage(response);
      });
    });

    this.table.on('autoMarkAsRead', function(itemId){
      if(localStorage["mark_auto_iwillril"] == "true"){
        var action = 'archive';
        that.eventNotifier({type: action, payload: itemId}, function(response) {
          that.updatePage(response);
        });
      }
    });
  };

  Popup.prototype.init = function(){
    var that = this;
    that.header.initFunctions();
    that.eventNotifier({type: 'getList'}, function(response) {
      that.updatePage(response);
    });
  };

  Popup.prototype.showLoadScreen = function(){
    if(document.getElementById("list_div"))
      document.getElementById("list_div").style.opacity = 0.4;
  };

  Popup.prototype.hideLoadScreen = function(){
    if(document.getElementById("list_div"))
      document.getElementById("list_div").style.opacity = 1;
  };

  Popup.prototype.updatePage = function(response){
    if(response.success){
      this.hideLoadScreen();
      this.header.refresh();
      this.table.render(response.payload);
    }
  };
