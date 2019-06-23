function RilList(){

}

RilList.prototype._sortOld = function(a, b){
  const timeAddedA = parseInt(a.time_added);
  const timeAddedB = parseInt(b.time_added);
  if(timeAddedA > timeAddedB)
    return 1;
  else if (timeAddedA < timeAddedB)
    return -1;
  return 0;
};

RilList.prototype._sortNew = function(a, b){
  const timeAddedA = parseInt(a.time_added);
  const timeAddedB = parseInt(b.time_added);
  if(timeAddedA > timeAddedB)
    return -1;
  else if (timeAddedA < timeAddedB)
    return 1;
  return 0;
};

RilList.prototype.getItemsArray = function(filter){
  const lastResponse = localStorage['lastResponse'];
  if(!lastResponse)
    return [];

  const obj = JSON.parse(lastResponse);
  let items = [];
  for(const key in obj.list){
    items.push(obj.list[key]);
  }

  if(filter){
    items = items.filter((i) => {
      const ignoreCaseTitle = i.resolved_title.toLowerCase();
      return (ignoreCaseTitle.includes(filter.toLowerCase()));
    });
  }

  const order = localStorage['iwillril_order_by'];
  
  if(order === "new"){
    return items.sort(this._sortNew);
  }

  return items.sort(this._sortOld);
};

RilList.prototype.getItemId = function(url){
  const list = this.getItemsArray();
  for(let i = 0; i < list.length; i++){
    const obj = list[i];
    if(obj.resolved_url == url || obj.given_url == url)
      return parseInt(obj.item_id);
  }
  return null;
};

export default RilList;
