window.addEventListener("load", init);

function save_options(){
  localStorage['rilBtnShortCut'] = document.getElementById('rilBtnShortCut').value;
  localStorage["mark_auto_iwillril"] = document.getElementById("mark_auto_iwillril").checked ? "true" : "false";
  localStorage["remove_context_menu_iwillril"] = document.getElementById("remove_context_menu_iwillril").checked ? "true" : "false";
  localStorage['rilUpdateInterval'] = document.getElementById('rilUpdateInterval').value;
  localStorage['removeUncountLabel'] = document.getElementById('removeUncountLabel').checked ? "true" : "false";
  localStorage['deleteItensOption'] = document.getElementById('deleteItensOption').checked ? "true" : "false";

  if(localStorage['ril_updateloopfunc']){
    clearInterval(localStorage['ril_updateloopfunc']);
    localStorage['ril_updateloopfunc'] = '';
    // chrome.extension.getBackgroundPage().update_loop();
  }

  chrome.runtime.getBackgroundPage().Background.updateUncountLabel();//TODO change this
}

function init(){
  document.querySelector("#rilBtnShortCut").addEventListener('keyup', save_options);
  document.querySelector("input").addEventListener('change', save_options);
  document.querySelector("select").addEventListener('change', save_options);

  if(localStorage['rilBtnShortCut'])
    document.querySelector('#rilBtnShortCut').value = localStorage['rilBtnShortCut'];

  if(localStorage['rilUpdateInterval'])
    document.querySelector('#rilUpdateInterval').value = localStorage['rilUpdateInterval'];
  else
    document.querySelector('#rilUpdateInterval').value = 2;

  if(localStorage["mark_auto_iwillril"])
    document.getElementById("mark_auto_iwillril").checked = localStorage["mark_auto_iwillril"] === "true";

  if(localStorage["remove_context_menu_iwillril"])
    document.getElementById("remove_context_menu_iwillril").checked = localStorage["remove_context_menu_iwillril"] === "true";

  if(localStorage['removeUncountLabel'])
    document.getElementById('removeUncountLabel').checked = localStorage["removeUncountLabel"] === "true";

  if(localStorage['deleteItensOption'])
    document.getElementById('deleteItensOption').checked = localStorage["deleteItensOption"] === "true";

}
