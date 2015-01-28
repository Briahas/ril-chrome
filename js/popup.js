window.addEventListener("load", init);

function init(){
  Header.initFunctions();
  if(Auth.isAuthenticate()){
    window.setTimeout(function(){buildPage();}, 1);
  }
  else{
    Auth.authenticate();
  }
}


function buildPage(){
  ItemRepository.getItems(function(error, items){
    if(error){
      if(error.code === -2)//Autenticação
        Auth.authenticate();
    }else{
      renderExtension(items);
    }
  });

}

function showLoadScreen(){
  if(document.getElementById("list_div"))
    document.getElementById("list_div").style.opacity = 0.4;
}

function hideLoadScreen(){
  if(document.getElementById("list_div"))
    document.getElementById("list_div").style.opacity = 1;
}

function refreshList(){
  Request.get(getCallback, 0);
}

function getCallback(resp){
  if(resp.status == 403 || resp.status == 401){
      localStorage['lastResponse'] = '';
      Auth.authenticate();
  }
  else{
    localStorage['lastResponse'] = resp.response;
    renderExtension(RilList.getItemsArray());
  }
}

function renderExtension(items){
  if($("#table_list"))
  {
    hideLoadScreen();
    ExtensionIcon.loaded();
    Table.render(items);
    Header.refresh();
  }
  ExtensionIcon.setUncountLabel(items.length);
}
