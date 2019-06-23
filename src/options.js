window.addEventListener("load", init);

const BTN_SHORTCUT = 'rilBtnShortCut';
const AUTO_IWILLRIL = 'mark_auto_iwillril';
const REMOVE_CONTEXT_MENU = 'remove_context_menu_iwillril';
const UPDATE_INTERVAL = 'rilUpdateInterval';
const REMOVE_UNCOUNT_LABEL = 'removeUncountLabel';
const DELETE_ITENS = 'deleteItensOption';

function saveOptions(){
  localStorage[BTN_SHORTCUT] = document.getElementById(BTN_SHORTCUT).value;
  localStorage[AUTO_IWILLRIL] = document.getElementById(AUTO_IWILLRIL).checked;
  localStorage[REMOVE_CONTEXT_MENU] = document.getElementById(REMOVE_CONTEXT_MENU).checked;
  localStorage[UPDATE_INTERVAL] = document.getElementById(UPDATE_INTERVAL).value;
  localStorage[REMOVE_UNCOUNT_LABEL] = document.getElementById(REMOVE_UNCOUNT_LABEL).checked;
  localStorage[DELETE_ITENS] = document.getElementById(DELETE_ITENS).checked;

  if(localStorage['ril_updateloopfunc']){

    clearInterval(localStorage['ril_updateloopfunc']);
    localStorage['ril_updateloopfunc'] = '';
    // chrome.extension.getBackgroundPage().update_loop();
  }

  chrome.runtime.getBackgroundPage().Background.updateUncountLabel();//TODO change this
}

function init(){
  document.querySelector(`#${BTN_SHORTCUT}`).addEventListener('keyup', saveOptions);
  document.querySelectorAll("input").forEach(function() { this.addEventListener('change', saveOptions); });
  document.querySelectorAll("select").forEach(function() { this.addEventListener('change', saveOptions); });
  document.getElementById(BTN_SHORTCUT).value = localStorage[BTN_SHORTCUT] || null;
  document.getElementById(UPDATE_INTERVAL).value = localStorage[UPDATE_INTERVAL] || 2;
  document.getElementById(AUTO_IWILLRIL).checked = localStorage[AUTO_IWILLRIL] === "true";
  document.getElementById(REMOVE_CONTEXT_MENU).checked = localStorage[REMOVE_CONTEXT_MENU] === "true";
  document.getElementById(REMOVE_UNCOUNT_LABEL).checked = localStorage[REMOVE_UNCOUNT_LABEL] === "true";
  document.getElementById(DELETE_ITENS).checked = localStorage[DELETE_ITENS] === "true";
}
