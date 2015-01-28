function ItemRepository(){

};

ItemRepository.getItems = function(callback){
  if(ItemRepository.getLastResponse())
    return callback(false, RilList.getItemsArray());


  Request.get(function(resp){
    if(resp.status === 403 || resp.status === 401){
      return callback({code: -2, message: 'Erro de Autenticação'}, null);
    }else{
      ItemRepository.updateLastResponse(resp.response);
      return callback(false, RilList.getItemsArray());
    }
  }, 0);
};

ItemRepository.updateLastResponse = function(data){
  localStorage['lastResponse'] = data;
};

ItemRepository.getLastResponse = function(data){
  return localStorage['lastResponse'];
};

ItemRepository.saveItem = function(){

};
