  window.addEventListener("load", init);

  function init(){
    var popup = new Popup();
    popup.init();
  }

  function Popup(){
    this.table = new Table();
    this.header = new Header(this.table);
    var that = this;
    this.header.on('addItem', function(data){

      Request.add(that.refreshList.bind(that), data.url, data.title);
    });
    this.header.on('refreshList', function(data){
      that.showLoadScreen();
      that.refreshList();
    });
    this.header.on('sort', function(data){
      localStorage['iwillril_order_by'] = data;
      that.buildPage();
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
    if(!localStorage["lastResponse"])
      this.refreshList();
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

  Popup.prototype.refreshList = function(){
    var that = this;
    ExtensionIcon.loading();
    function getCallback(resp){
      ExtensionIcon.loaded();
      if(resp.status == 403 || resp.status == 401){
          localStorage['lastResponse'] = '';
          Auth.authenticate();
      }
      else{
        localStorage['lastResponse'] = resp.response;
        that.updatePage();
      }
    }
    Request.get(getCallback, 0);
  }

  Popup.prototype.updatePage = function(){
    this.hideLoadScreen();
    ExtensionIcon.updateNumber();
    this.header.refresh();
    this.table.render();
  }
