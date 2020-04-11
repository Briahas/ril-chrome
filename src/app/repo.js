import {
  ADD,
  REFRESH_ITEMS,
  ARCHIVE
} from './../events'

import Api from './../api'

export function fetchItemsFromCache() {
  if (localStorage['ITEMS']) {
    try {
      const items = JSON.parse(localStorage['ITEMS'])
      return Promise.resolve(items)
    } catch {
      localStorage['ITEMS'] = null
      return Promise.resolve(null)
    }
  }
  return Promise.resolve(null)
}

export function fetchItems(params = {}) {
  const {
    searchWord
  } = params

  return new Promise(async (resolve, reject) => {
    try {
      const response = await Api.getList()
      const items = []
      for (var key in response.list) {
        items.push(response.list[key]);
      }
      localStorage['ITEMS'] = JSON.stringify(items);
      resolve(items)
    } catch {
      resolve(null)
    }
  })

}

export function archiveItem(itemId) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await Api.archieve(itemId);
      resolve({})
    } catch {
      resolve(null)
    }
  })
}

export function addItem(url, title) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await Api.addItem(url, title);
      resolve(response.item)
    } catch {
      reject()
    }
  })
}

export function getSettings() {
  const orderBy = localStorage['iwillril_order_by'] || 'new';
  const removeContextMenu = localStorage['remove_context_menu_iwillril'] && localStorage['remove_context_menu_iwillril'] == 'true';

  return Promise.resolve({
    orderBy,
    removeContextMenu
  })
}

export function updateSettings(key, value) {

  if(key == 'orderBy') {
    localStorage['iwillril_order_by'] = value;
  }

  return Promise.resolve(true)

}

