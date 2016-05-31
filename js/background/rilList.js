function RilList(){

}

RilList._sortOld = function(a, b){
  if(a.time_updated > b.time_updated)
    return 1;
  else if (a.time_updated < b.time_updated)
    return -1;
  return 0;
}

RilList._sortNew = function(a, b){
  if(a.time_updated > b.time_updated)
    return -1;
  else if (a.time_updated < b.time_updated)
    return 1;
  return 0;
}

RilList.getItemsArray = function(filter){
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

  const order = localStorage['iwillril_order_by']

  if(order === "new")
    return items.sort(RilList._sortNew);
  else
    return items.sort(RilList._sortOld);
};

RilList.getItemId = function(url){
  var list = RilList.getItemsArray();
  for(var i = 0; i < list.length; i++){
    var obj = list[i];
    if(obj.resolved_url == url || obj.given_url == url)
      return parseInt(obj.item_id);
  }
  return null;
}

export default RilList;
