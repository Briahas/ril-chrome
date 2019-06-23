window.addEventListener("load", init);
import Table from './table.js';
import Header from './header.js';
function init(){
  const popup = new Popup();
  popup.init();
}

class Popup{
  constructor(args) {
    args = args || {};
    this.eventNotifier = args.eventNotifier || chrome.runtime.sendMessage;
    this.table = new Table();
    this.header = new Header();
    this._addHeaderEvents();
    this._addTableEvents();
    this._filtering = null;
  }

  init() {
    this.header.initFunctions();
    this.updatePage({success: true, payload: {list: []}});
    setTimeout(() => {
      this.eventNotifier({type: 'getList'}, (response) => {
        this.updatePage(response);
      });
    }, 0);
  }

  showLoadScreen(){
    if(document.getElementById("list_div"))
      document.getElementById("list_div").style.opacity = 0.4;
  }

  hideLoadScreen(){
    if(document.getElementById("list_div"))
      document.getElementById("list_div").style.opacity = 1;
  }

  updatePage(response){
    if(response.success){
      this.hideLoadScreen();
      this.header.refresh(response.payload);
      this.table.render(response.payload);
    }
  }

  _addHeaderEvents() {
    this.header.on('addItem', (data) => {
      this.showLoadScreen();
      this.eventNotifier({type: 'add', payload: data}, (response) => {
        this.updatePage(response);
      });
    });
    this.header.on('refreshList', () => {
      this.showLoadScreen();
      this.eventNotifier({type: 'refresh'}, (response) => {
        this.updatePage(response);
      });
    });
    this.header.on('sort', (data) => {
      this.eventNotifier({type: 'sortList', payload: data}, (response) => {
        this.updatePage(response);
      });
    });
    this.header.on('filter', (data) => {
      const filter = () => {
        this.eventNotifier({type: 'filter', payload: data}, (response) => {
          this.updatePage(response);
        });
      }
      clearTimeout(this._filtering);
      this._filtering = setTimeout(filter, 100);
    });
  }

  _addTableEvents() {
    this.table.on('markAsRead', (itemId) => {
      const action = 'archive';
      this.eventNotifier({type: action, payload: itemId}, (response) => {
        this.updatePage(response);
      });
    });

    this.table.on('deleteItem', (itemId) => {
      const action = 'delete';
      this.eventNotifier({type: action, payload: itemId}, (response) => {
        this.updatePage(response);
      });
    });

    this.table.on('autoMarkAsRead', (itemId) => {
      const action = 'archive';
      this.eventNotifier({type: action, payload: itemId}, (response) => {
        this.updatePage(response);
      });
    });
  }
}
