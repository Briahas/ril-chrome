export default class GetPocketItems {
  constructor(params = {}) {
    this.term = params['term']
    this.orderBy = params['orderBy']
  }

  async call() {
    const lastResponse = localStorage['lastResponse'];
    if(!lastResponse)
      return [];

    const obj = JSON.parse(lastResponse);
    const items = [];
    for(let key in obj.list){
      const item = obj.list[key];
      if (!term){
        items.push(item);
        continue
      }
      let itemTitle = item.resolved_title;
      itemTitle = itemTitle || item.given_title;

      if(itemTitle.toLowerCase().includes(term.toLowerCase())){
        items.push(item)
      }
    }

    if(this.orderBy === "new"){
      return Promise.resolve(
        items.sort(this._sortNew)
      )
    }
    else {
      return Promise.resolve(
        items.sort(this._sortOld)
      )
    }
  }

  _sortOld(a, b){
    if(a.time_updated > b.time_updated)
      return 1;
    else if (a.time_updated < b.time_updated)
      return -1;
    return 0;
  }

  _sortNew(a, b){
    if(a.time_updated > b.time_updated)
      return -1;
    else if (a.time_updated < b.time_updated)
      return 1;
    return 0;
  }
}
