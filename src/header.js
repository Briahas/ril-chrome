import ExtensionIcon from './extensionIcon'
import Request from './request'
import EventEmitter from 'eventemitter3'

export const HEADER_ADD_EVENT = 'HEADER_ADD_EVENT';
export const HEADER_REFRESH_EVENT = 'HEADER_REFRESH_EVENT';
export const HEADER_CHANGE_SORT_EVENT = 'HEADER_CHANGE_SORT_EVENT';
export const HEADER_SEARCH_EVENT = 'HEADER_SEARCH_EVENT';

class Header extends EventEmitter {
  constructor() {
    super();
    this._searchTimeout = null
    this._listeners = {}
  }

  initFunctions(){
    const self = this
    document.querySelector("#add_button").addEventListener('click', self.add.bind(this));
    document.querySelector("#option_footer").addEventListener('click', self.openOptions.bind(this));
    document.querySelector("#sync_button").addEventListener('click', self.refreshList.bind(this));
    document.querySelector("#order_select").addEventListener('click', self.orderBy.bind(this));
    document.querySelector("#iwillril_search").addEventListener('keyup', function(ev) {
      clearTimeout(self._searchTimeout)
      self._searchTimeout = setTimeout(() => {
        self.emit(HEADER_SEARCH_EVENT, ev.target.value)
      }, 200)
    });
  }

  openOptions(){
    var optionsUrl = chrome.extension.getURL('html/options.html');
    chrome.tabs.create({url: optionsUrl});
  }

  refreshList(){
    this.emit(HEADER_REFRESH_EVENT)
  }

  add(){
    this.emit(HEADER_ADD_EVENT)
  }

  updateOrderBy(){
    document.querySelector('#order_select').value = localStorage['iwillril_order_by']
  }

  orderBy(){
    var order = document.getElementById("order_select").value;
    this.emit(HEADER_CHANGE_SORT_EVENT, order)
  }

  refresh(){
    this.updateOrderBy();
  }
}

export default Header
